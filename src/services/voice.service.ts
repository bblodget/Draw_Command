export interface VoiceRecognitionCallbacks {
    onTranscript?: (transcript: string, isFinal: boolean) => void;
    onCommand?: (command: string) => void;
    onError?: (error: string) => void;
    onStart?: () => void;
    onEnd?: () => void;
    onSpeechStart?: () => void;
    onSpeechEnd?: () => void;
    onSystemSpeakStart?: () => void;
    onSystemSpeakEnd?: () => void;
}

// State machine for transcript management
const TranscriptState = {
    IDLE: 'IDLE' as const,           // Waiting for "computer"
    CLEAR: 'CLEAR' as const,         // Just heard "computer", clear and initialize
    TRANSCRIPT: 'TRANSCRIPT' as const, // Accumulating command until "please"
    EXECUTION: 'EXECUTION' as const   // Processing command
} as const;

type TranscriptState = typeof TranscriptState[keyof typeof TranscriptState];

export class VoiceService {
    private recognition: SpeechRecognition | null = null;
    private synthesis: SpeechSynthesis | null = null;
    private isListening: boolean = false;
    private callbacks: VoiceRecognitionCallbacks = {};
    private currentTranscript: string = '';
    
    // State machine variables
    private transcriptState: TranscriptState = TranscriptState.IDLE;
    private stateTranscript: string = ''; // The transcript being built in current state
    
    private readonly ATTENTION_WORD = 'computer';
    private readonly EXECUTE_WORD = 'please';
    private lastExecutedCommand: string = '';
    private lastExecutedAt: number = 0;
    private commandCooldownMs: number = 2000; // 2 second cooldown
    private isSystemSpeaking: boolean = false; // Track when system is speaking
    private isMuted: boolean = false; // Track microphone muting state
    private shouldRestart: boolean = false; // Track if we should restart after stopping

    constructor() {
        this.initializeSpeechRecognition();
        this.initializeSpeechSynthesis();
    }

    private initializeSpeechRecognition(): void {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new ((window as typeof window & { webkitSpeechRecognition: typeof SpeechRecognition }).webkitSpeechRecognition)();
        } else if ('SpeechRecognition' in window) {
            this.recognition = new SpeechRecognition();
        }

        if (this.recognition) {
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
            this.recognition.maxAlternatives = 1;

            this.recognition.onstart = () => {
                this.isListening = true;
                this.callbacks.onStart?.();
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.callbacks.onEnd?.();
                // Auto-restart if we should (but add a small delay to prevent rapid restarts)
                if (this.shouldRestart) {
                    this.shouldRestart = false;
                    setTimeout(() => {
                        this.startListening();
                    }, 100);
                }
            };

            this.recognition.onspeechstart = () => {
                this.callbacks.onSpeechStart?.();
            };

            this.recognition.onspeechend = () => {
                this.callbacks.onSpeechEnd?.();
            };

            this.recognition.onresult = (event: SpeechRecognitionEvent) => {
                // Ignore transcripts when system is speaking to prevent self-hearing
                if (this.isSystemSpeaking || this.isMuted) {
                    return;
                }

                // Get all text from current speech recognition session
                let allResultsText = '';
                let interimText = '';
                let finalText = '';
                
                // Enhanced logging for debugging
                console.log(`[STATE MACHINE DEBUG] event.results.length: ${event.results.length}, resultIndex: ${event.resultIndex}`);
                
                for (let i = 0; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    allResultsText += transcript + ' ';
                    
                    if (event.results[i].isFinal) {
                        finalText += transcript + ' ';
                    } else {
                        interimText += transcript + ' ';
                    }
                }
                
                allResultsText = allResultsText.trim();
                finalText = finalText.trim();
                interimText = interimText.trim();
                
                console.log(`[STATE MACHINE] Current state: ${this.transcriptState}`);
                console.log(`[STATE MACHINE] All results: "${allResultsText}"`);
                console.log(`[STATE MACHINE] Final: "${finalText}", Interim: "${interimText}"`);
                console.log(`[STATE MACHINE DEBUG] stateTranscript: "${this.stateTranscript}"`);
                
                // State machine logic
                this.processStateTransitions(allResultsText, finalText, interimText);
                
                // Update display transcript
                this.currentTranscript = this.stateTranscript;
                
                // Report transcript for display
                this.callbacks.onTranscript?.(this.currentTranscript, finalText.length > 0);
            };

            this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                this.callbacks.onError?.(event.error);
            };
        }
    }

    // State machine transition logic
    private processStateTransitions(allText: string, finalText: string, _interimText: string): void {
        const allLower = allText.toLowerCase();
        const hasComputer = allLower.includes(this.ATTENTION_WORD);
        const hasPlease = allLower.includes(this.EXECUTE_WORD);
        
        console.log(`[STATE MACHINE] hasComputer: ${hasComputer}, hasPlease: ${hasPlease}`);
        console.log(`[STATE MACHINE] finalText: "${finalText}"`);
        
        switch (this.transcriptState) {
            case TranscriptState.IDLE:
                if (hasComputer) {
                    console.log('[STATE MACHINE] IDLE -> CLEAR (found "computer")');
                    this.transcriptState = TranscriptState.CLEAR;
                    // Don't process further in same call - let next speech event handle CLEAR state
                }
                break;
                
            case TranscriptState.CLEAR:
                // Clear transcript and initialize with text starting from LAST "computer"
                const clearComputerIndex = allLower.lastIndexOf(this.ATTENTION_WORD);
                if (clearComputerIndex !== -1) {
                    // Extract only the portion starting from the LAST "computer" occurrence
                    this.stateTranscript = allText.substring(clearComputerIndex);
                } else {
                    // Fallback if "computer" not found (shouldn't happen)
                    this.stateTranscript = allText;
                }
                
                // Check if we already have a complete command (contains "please")
                if (this.stateTranscript.toLowerCase().includes(this.EXECUTE_WORD)) {
                    console.log(`[STATE MACHINE] CLEAR -> EXECUTION (complete command found): "${this.stateTranscript}"`);
                    this.transcriptState = TranscriptState.EXECUTION;
                    this.executeCommand(this.stateTranscript);
                } else {
                    console.log(`[STATE MACHINE] CLEAR -> TRANSCRIPT, initialized: "${this.stateTranscript}"`);
                    this.transcriptState = TranscriptState.TRANSCRIPT;
                }
                break;
                
            case TranscriptState.TRANSCRIPT:
                // Check if we hear a new "computer" that seems separate
                if (hasComputer && this.isNewComputerCommand(allText)) {
                    console.log('[STATE MACHINE] TRANSCRIPT -> CLEAR (new "computer" detected)');
                    this.transcriptState = TranscriptState.CLEAR;
                    return; // Don't process further, let next event handle CLEAR
                }
                
                // Update transcript with text starting from LAST "computer"
                const transcriptComputerIndex = allLower.lastIndexOf(this.ATTENTION_WORD);
                if (transcriptComputerIndex !== -1) {
                    // Extract only the portion starting from the LAST "computer"
                    this.stateTranscript = allText.substring(transcriptComputerIndex);
                } else {
                    // If no "computer" found, keep existing transcript (shouldn't happen in normal flow)
                    // this.stateTranscript remains unchanged
                }
                console.log(`[STATE MACHINE] TRANSCRIPT updating: "${this.stateTranscript}"`);
                
                // Only execute if we have FINAL text with "please" in the current state transcript
                if (finalText.length > 0 && this.stateTranscript.toLowerCase().includes(this.EXECUTE_WORD)) {
                    console.log('[STATE MACHINE] TRANSCRIPT -> EXECUTION (found "please" in current transcript)');
                    this.transcriptState = TranscriptState.EXECUTION;
                    this.executeCommand(this.stateTranscript);
                }
                break;
                
            case TranscriptState.EXECUTION:
                // Stay in execution until explicitly moved back to IDLE
                // This happens after command execution completes
                console.log('[STATE MACHINE] In EXECUTION state, ignoring input');
                break;
        }
    }
    
    // Check if this seems like a new "computer" command vs continuation of current one
    private isNewComputerCommand(text: string): boolean {
        // More sophisticated heuristic to prevent infinite loops
        const computerCount = (text.toLowerCase().match(/computer/g) || []).length;
        
        // Only treat as new command if:
        // 1. We have multiple "computer" instances AND
        // 2. The last occurrence appears to start a new sentence pattern
        if (computerCount > 1) {
            // Check if the text seems to have completed one command and started another
            const hasMultiplePlease = (text.toLowerCase().match(/please/g) || []).length > 1;
            const endsWithComputerPattern = /computer\s+\w+\s*(please)?$/i.test(text.trim());
            
            if (hasMultiplePlease || endsWithComputerPattern) {
                console.log(`[STATE MACHINE] Multiple commands detected (${computerCount} computers, pattern suggests new command)`);
                return true;
            }
        }
        
        return false;
    }
    
    // Execute the command and transition back to IDLE
    private executeCommand(transcript: string): void {
        console.log(`[STATE MACHINE] Executing command: "${transcript}"`);
        
        // Extract command from transcript
        const command = this.extractCommand(transcript);
        const now = Date.now();
        
        // Prevent duplicate command execution (within cooldown period)
        if (command && (command !== this.lastExecutedCommand || now - this.lastExecutedAt > this.commandCooldownMs)) {
            console.log('[STATE MACHINE] Command execution:', command);
            this.callbacks.onCommand?.(command);
            this.lastExecutedCommand = command;
            this.lastExecutedAt = now;
        } else if (command === this.lastExecutedCommand) {
            console.log('[STATE MACHINE] Duplicate command ignored:', command);
        }
        
        // Transition back to IDLE (keep transcript visible for user reference)
        console.log('[STATE MACHINE] EXECUTION -> IDLE (command processed)');
        this.transcriptState = TranscriptState.IDLE;
        
        // Clear stateTranscript to prevent it from being used in next command
        // But keep currentTranscript for display
        console.log('[STATE MACHINE] Clearing stateTranscript to prevent duplicate execution');
        this.stateTranscript = '';
        
        // Restart speech recognition to clear accumulated results
        // This prevents old commands from appearing in new recognition sessions
        if (this.isListening && this.recognition) {
            console.log('[STATE MACHINE] Restarting speech recognition to clear accumulated results');
            this.shouldRestart = true;
            this.recognition.stop();
            // The onend handler will automatically restart it after 100ms
        }
    }


    private initializeSpeechSynthesis(): void {
        if ('speechSynthesis' in window) {
            this.synthesis = window.speechSynthesis;
        }
    }

    private extractCommand(transcript: string): string {
        const lowerTranscript = transcript.toLowerCase();
        const attentionIndex = lowerTranscript.indexOf(this.ATTENTION_WORD);
        const executeIndex = lowerTranscript.indexOf(this.EXECUTE_WORD);

        console.log(`[STATE MACHINE DEBUG] extractCommand from: "${transcript}"`);
        console.log(`[STATE MACHINE DEBUG] attentionIndex: ${attentionIndex}, executeIndex: ${executeIndex}`);

        if (attentionIndex !== -1 && executeIndex !== -1 && executeIndex > attentionIndex) {
            // Include the full command from "computer" to "please" for the grammar parser
            const commandStart = attentionIndex;
            const commandEnd = executeIndex + this.EXECUTE_WORD.length;
            let command = transcript.substring(commandStart, commandEnd).trim();
            
            console.log(`[STATE MACHINE DEBUG] Extracted command: "${command}"`);
            
            // Preprocess command to normalize speech-to-text symbols
            const normalizedCommand = this.normalizeTranscript(command);
            if (command !== normalizedCommand) {
                console.log('Transcript normalized:', { original: command, normalized: normalizedCommand });
            }
            
            return normalizedCommand;
        }

        console.log(`[STATE MACHINE DEBUG] No valid command found in transcript`);
        return '';
    }

    private normalizeTranscript(transcript: string): string {
        return transcript
            // Convert degree symbol to word
            .replace(/°/g, ' degrees')
            // Convert negative number symbols to words (handles both "-45" and "- 45")
            .replace(/-\s*(\d+)/g, 'negative $1')
            // Convert positive number symbols to plain numbers (handles both "+45" and "+ 45")
            .replace(/\+\s*(\d+)/g, '$1')
            // Remove punctuation that interferes with grammar (commas, periods, etc.)
            .replace(/[,\.!?;:]/g, '')
            // Clean up extra spaces
            .replace(/\s+/g, ' ')
            .trim();
    }

    isSupported(): boolean {
        return this.recognition !== null && this.synthesis !== null;
    }

    isSpeechRecognitionSupported(): boolean {
        return this.recognition !== null;
    }

    isSpeechSynthesisSupported(): boolean {
        return this.synthesis !== null;
    }

    setCallbacks(callbacks: VoiceRecognitionCallbacks): void {
        this.callbacks = callbacks;
    }

    async requestMicrophonePermission(): Promise<boolean> {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Stop the stream immediately as we just wanted to check permission
            stream.getTracks().forEach(track => track.stop());
            return true;
        } catch (error) {
            console.error('Microphone permission denied:', error);
            return false;
        }
    }

    startListening(): void {
        if (!this.recognition) {
            this.callbacks.onError?.('Speech recognition not supported');
            return;
        }

        if (this.isListening) {
            return;
        }

        try {
            this.recognition.start();
        } catch {
            this.callbacks.onError?.('Failed to start speech recognition');
        }
    }

    stopListening(): void {
        if (!this.recognition || !this.isListening) {
            return;
        }

        this.recognition.stop();
    }

    getIsListening(): boolean {
        return this.isListening;
    }

    getIsSystemSpeaking(): boolean {
        return this.isSystemSpeaking;
    }

    getCurrentTranscript(): string {
        return this.currentTranscript;
    }

    async speak(text: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.synthesis) {
                reject(new Error('Speech synthesis not supported'));
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            
            utterance.onstart = () => {
                this.isSystemSpeaking = true;
                this.callbacks.onSystemSpeakStart?.();
            };
            
            utterance.onend = () => {
                this.isSystemSpeaking = false;
                this.callbacks.onSystemSpeakEnd?.();
                resolve();
            };
            
            utterance.onerror = (event) => {
                this.isSystemSpeaking = false;
                this.callbacks.onSystemSpeakEnd?.();
                reject(new Error(`Speech synthesis error: ${event.error}`));
            };

            this.synthesis.speak(utterance);
        });
    }

    clearTranscript(): void {
        console.log('[STATE MACHINE] Manual clear - resetting to IDLE');
        this.currentTranscript = '';
        this.stateTranscript = '';
        this.transcriptState = TranscriptState.IDLE;
    }

    // Get current state for debugging
    getTranscriptState(): string {
        return this.transcriptState;
    }
}