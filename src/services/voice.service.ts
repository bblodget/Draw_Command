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
  private attentionWordDetected: boolean = false;
  private readonly ATTENTION_WORD = 'computer';
  private readonly EXECUTE_WORD = 'please';

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
        // Auto-restart if we were listening
        if (this.isListening) {
          this.startListening();
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

        const fullTranscript = finalTranscript || interimTranscript;
        this.currentTranscript = fullTranscript;

        // Check for attention word
        if (fullTranscript.toLowerCase().includes(this.ATTENTION_WORD)) {
          this.attentionWordDetected = true;
        }

        // Check for execution word
        if (this.attentionWordDetected && fullTranscript.toLowerCase().includes(this.EXECUTE_WORD)) {
          // Extract command between attention and execution words
          const command = this.extractCommand(fullTranscript);
          if (command) {
            this.callbacks.onCommand?.(command);
            this.attentionWordDetected = false;
            this.currentTranscript = '';
          }
        }

        // Always report current transcript for display
        this.callbacks.onTranscript?.(fullTranscript, !!finalTranscript);
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        this.callbacks.onError?.(event.error);
      };
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
    this.attentionWordDetected = false;
  }
}