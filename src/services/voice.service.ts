export interface VoiceRecognitionCallbacks {
    onTranscript?: (transcript: string, isFinal: boolean) => void;
    onCommand?: (command: string) => void;
    onError?: (error: string) => void;
    onStart?: () => void;
    onEnd?: () => void;
    onSpeechStart?: () => void;
    onSpeechEnd?: () => void;
}

export class VoiceService {
    private recognition: SpeechRecognition | null = null;
    private synthesis: SpeechSynthesis | null = null;
    private isListening: boolean = false;
    private callbacks: VoiceRecognitionCallbacks = {};
    private currentTranscript: string = '';
    private accumulatedTranscript: string = ''; // NEW: Accumulate across segments
    private attentionWordDetected: boolean = false;
    private readonly ATTENTION_WORD = 'computer';
    private readonly EXECUTE_WORD = 'please';
    private lastExecutedCommand: string = '';
    private lastExecutedAt: number = 0;
    private commandCooldownMs: number = 2000; // 2 second cooldown
    private isProcessingCommand: boolean = false; // Prevent overlapping command processing

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
                // Auto-restart if we were listening (but add a small delay to prevent rapid restarts)
                if (this.isListening) {
                    setTimeout(() => {
                        if (this.isListening) {
                            this.startListening();
                        }
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
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }


                // NEW: Handle transcript accumulation
                if (finalTranscript) {
                    // Process final transcript for accumulation
                    this.processFinalTranscript(finalTranscript);
                }

                // NEW: Build accumulated transcript for display
                const displayTranscript = this.buildDisplayTranscript(finalTranscript, interimTranscript);
                this.currentTranscript = displayTranscript;

                // NEW: Check for command execution only when we have final results
                if (finalTranscript) {
                    this.checkForCommandExecution(displayTranscript);
                }

                // Always report current transcript for display
                this.callbacks.onTranscript?.(displayTranscript, !!finalTranscript);
            };

            this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                this.callbacks.onError?.(event.error);
            };
        }
    }

    // NEW: Build display transcript by accumulating across segments
    private buildDisplayTranscript(finalTranscript: string, interimTranscript: string): string {
        // If we have a final transcript, add it to accumulation
        if (finalTranscript) {
            // Check if this segment contains "computer" - if so, reset accumulation
            if (finalTranscript.toLowerCase().includes(this.ATTENTION_WORD)) {
                this.accumulatedTranscript = finalTranscript;
            } else {
                // Add to existing accumulation
                this.accumulatedTranscript = this.accumulatedTranscript
                    ? this.accumulatedTranscript + ' ' + finalTranscript
                    : finalTranscript;
                // Fix extra spaces by normalizing whitespace
                this.accumulatedTranscript = this.accumulatedTranscript.replace(/\s+/g, ' ').trim();
            }
        }

        // For display, show accumulated transcript + any interim results
        if (interimTranscript && !finalTranscript) {
            // Only show interim if we don't have final results
            return this.accumulatedTranscript
                ? this.accumulatedTranscript + ' ' + interimTranscript
                : interimTranscript;
        }

        return this.accumulatedTranscript;
    }

    // NEW: Check for command execution using the display transcript
    private checkForCommandExecution(displayTranscript: string): void {
        // Prevent overlapping command processing
        if (this.isProcessingCommand) {
            return;
        }

        // Check if we have attention word and execute word in the display transcript
        if (this.attentionWordDetected && displayTranscript.toLowerCase().includes(this.EXECUTE_WORD)) {
            this.isProcessingCommand = true;

            // Extract command from display transcript
            const command = this.extractCommand(displayTranscript);
            const now = Date.now();

            // Prevent duplicate command execution (within cooldown period)
            if (command && (command !== this.lastExecutedCommand || now - this.lastExecutedAt > this.commandCooldownMs)) {
                console.log('Executing command:', command);
                this.callbacks.onCommand?.(command);
                this.lastExecutedCommand = command;
                this.lastExecutedAt = now;
            } else if (command === this.lastExecutedCommand) {
                console.log('Duplicate command ignored:', command);
            }

            // Reset state after processing
            this.attentionWordDetected = false;
            this.currentTranscript = '';
            this.accumulatedTranscript = '';
            this.isProcessingCommand = false;
        }
    }

    private initializeSpeechSynthesis(): void {
        if ('speechSynthesis' in window) {
            this.synthesis = window.speechSynthesis;
        }
    }

    private processFinalTranscript(transcript: string): void {
        // Check for attention word
        if (transcript.toLowerCase().includes(this.ATTENTION_WORD)) {
            this.attentionWordDetected = true;
        }

        // Note: Command execution is now handled in checkForCommandExecution()
        // which is called after the transcript is updated
    }

    private extractCommand(transcript: string): string {
        const lowerTranscript = transcript.toLowerCase();
        const attentionIndex = lowerTranscript.indexOf(this.ATTENTION_WORD);
        const executeIndex = lowerTranscript.indexOf(this.EXECUTE_WORD);

        if (attentionIndex !== -1 && executeIndex !== -1 && executeIndex > attentionIndex) {
            const commandStart = attentionIndex + this.ATTENTION_WORD.length;
            const commandEnd = executeIndex;
            return transcript.substring(commandStart, commandEnd).trim();
        }

        return '';
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
            utterance.onend = () => resolve();
            utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

            this.synthesis.speak(utterance);
        });
    }

    clearTranscript(): void {
        this.currentTranscript = '';
        this.accumulatedTranscript = ''; // NEW: Clear accumulated transcript
        this.attentionWordDetected = false;
    }
}