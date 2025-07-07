export interface VoiceResponse {
    text: string;
    priority: 'high' | 'normal' | 'low';
    interruptible: boolean;
}

export class ResponseService {
    private synthesis: SpeechSynthesis;
    private responseQueue: VoiceResponse[] = [];
    private isSpeaking: boolean = false;
    private currentUtterance: SpeechSynthesisUtterance | null = null;

    // Color mapping for hex to name conversion
    private readonly hexToColorName: Record<string, string> = {
        '#FF0000': 'red',
        '#0000FF': 'blue',
        '#00FF00': 'green',
        '#FFFF00': 'yellow',
        '#800080': 'purple',
        '#FFA500': 'orange',
        '#000000': 'black',
        '#FFFFFF': 'white',
        '#FFC0CB': 'pink',
        '#A52A2A': 'brown',
        '#808080': 'gray'
    };

    // Response templates for different actions
    private templates = {
        // Success responses
        drawSuccess: {
            square: ['Square drawn successfully', 'I drew a square for you', 'Square created'],
            circle: ['Circle drawn successfully', 'I drew a circle for you', 'Circle created'],
            triangle: ['Triangle drawn successfully', 'I drew a triangle for you', 'Triangle created']
        },
        colorSuccess: {
            generic: 'Color changed to {color}',
            specific: '{shape} is now {color}'
        },
        moveSuccess: {
            generic: 'Shape moved {direction}',
            specific: '{shape} moved {direction}'
        },
        deleteSuccess: {
            generic: 'Shape deleted',
            specific: '{shape} deleted'
        },
        clearSuccess: 'Canvas cleared',

        // Error responses
        errors: {
            unrecognized: [
                "I didn't understand that command",
                "Could you please try again?",
                "I'm not sure what you'd like me to do"
            ],
            noShape: "I couldn't find that shape",
            noCommand: "Please tell me what you'd like me to do",
            microphoneError: "I'm having trouble with the microphone",
            generalError: "Something went wrong. Please try again"
        },

        // Help responses
        help: {
            shapes: "You can ask me to draw squares, circles, and triangles",
            colors: "I can draw in red, blue, green, yellow, purple, orange, black, white, pink, brown, and gray",
            commands: "Try saying: Computer, draw a red square please",
            general: "I can draw shapes, change colors, move shapes, and clear the canvas"
        }
    };

    constructor() {
        if (!('speechSynthesis' in window)) {
            console.warn('Speech synthesis not supported in this browser');
            // Create a mock synthesis object that does nothing
            this.synthesis = {
                speak: () => { },
                cancel: () => { },
                pause: () => { },
                resume: () => { },
                getVoices: () => [],
                pending: false,
                speaking: false,
                paused: false
            } as unknown as SpeechSynthesis;
        } else {
            this.synthesis = window.speechSynthesis;
        }

        // Load voices when they become available
        if (this.synthesis.getVoices) {
            this.synthesis.getVoices(); // Initial load
            if ('onvoiceschanged' in this.synthesis) {
                this.synthesis.onvoiceschanged = () => {
                    this.synthesis.getVoices(); // Reload when voices change
                };
            }
        }
    }

    // Main method to speak a response
    speak(text: string, priority: 'high' | 'normal' | 'low' = 'normal', interruptible: boolean = true): void {
        const response: VoiceResponse = { text, priority, interruptible };

        if (priority === 'high' && this.isSpeaking && this.currentUtterance && interruptible) {
            // Interrupt current speech for high priority
            this.synthesis.cancel();
            this.responseQueue = [response, ...this.responseQueue];
        } else {
            // Add to queue
            this.responseQueue.push(response);
        }

        // Sort queue by priority
        this.responseQueue.sort((a, b) => {
            const priorityOrder = { high: 0, normal: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

        // Process queue if not already speaking
        if (!this.isSpeaking) {
            this.processQueue();
        }
    }

    // Process the response queue
    private processQueue(): void {
        if (this.responseQueue.length === 0) {
            this.isSpeaking = false;
            return;
        }

        const response = this.responseQueue.shift()!;
        this.isSpeaking = true;

        const utterance = new SpeechSynthesisUtterance(response.text);
        this.currentUtterance = utterance;

        // Configure voice settings
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Select a natural-sounding voice if available
        const voices = this.synthesis.getVoices();
        const preferredVoice = voices.find(voice =>
            voice.lang.startsWith('en') &&
            (voice.name.includes('Google') || voice.name.includes('Microsoft'))
        );
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        // Handle speech events
        utterance.onend = () => {
            this.currentUtterance = null;
            this.processQueue(); // Process next in queue
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            this.currentUtterance = null;
            this.processQueue(); // Continue with next response
        };

        // Speak the utterance
        this.synthesis.speak(utterance);
    }

    // Convert hex color to color name
    getColorNameFromHex(hex: string): string {
        return this.hexToColorName[hex] || hex;
    }

    // Response methods for different command types
    respondToDrawCommand(shape: string, color?: string): void {
        const shapeKey = shape as keyof typeof this.templates.drawSuccess;
        const responses = this.templates.drawSuccess[shapeKey];
        if (responses) {
            const response = this.getRandomResponse(responses);
            const colorName = color ? this.getColorNameFromHex(color) : undefined;
            const fullResponse = colorName ? `${response} in ${colorName}` : response;
            this.speak(fullResponse);
        }
    }

    respondToColorCommand(shape: string, color: string): void {
        const response = this.templates.colorSuccess.specific
            .replace('{shape}', shape)
            .replace('{color}', color);
        this.speak(response);
    }

    respondToMoveCommand(shape: string, direction: string): void {
        const response = this.templates.moveSuccess.specific
            .replace('{shape}', shape)
            .replace('{direction}', direction);
        this.speak(response);
    }

    respondToDeleteCommand(shape: string): void {
        const response = this.templates.deleteSuccess.specific
            .replace('{shape}', shape);
        this.speak(response);
    }

    respondToClearCommand(): void {
        this.speak(this.templates.clearSuccess);
    }

    respondWithError(type: keyof typeof this.templates.errors = 'unrecognized'): void {
        const responses = this.templates.errors[type];
        const response = Array.isArray(responses)
            ? this.getRandomResponse(responses)
            : responses;
        this.speak(response, 'high');
    }

    respondWithHelp(topic: keyof typeof this.templates.help = 'general'): void {
        this.speak(this.templates.help[topic]);
    }

    // Stop all speech
    stop(): void {
        this.synthesis.cancel();
        this.responseQueue = [];
        this.isSpeaking = false;
        this.currentUtterance = null;
    }

    // Utility method to get random response from array
    private getRandomResponse(responses: string[]): string {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Check if synthesis is available
    isAvailable(): boolean {
        return 'speechSynthesis' in window;
    }

    // Check if currently speaking
    getIsSpeaking(): boolean {
        return this.isSpeaking || this.synthesis.speaking;
    }
}