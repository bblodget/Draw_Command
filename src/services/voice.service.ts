export class VoiceService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis | null = null;

  constructor() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new ((window as typeof window & { webkitSpeechRecognition: typeof SpeechRecognition }).webkitSpeechRecognition)();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new SpeechRecognition();
    }

    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  isSupported(): boolean {
    return this.recognition !== null && this.synthesis !== null;
  }

  async speak(text: string): Promise<void> {
    if (!this.synthesis) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    this.synthesis.speak(utterance);
  }
}