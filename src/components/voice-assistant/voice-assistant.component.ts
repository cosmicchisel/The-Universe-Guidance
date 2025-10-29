import { ChangeDetectionStrategy, Component, input, output, inject, signal } from '@angular/core';
import { VoiceAssistantService, VoiceLanguage, VoiceStatus } from '../../services/voice-assistant.service';

interface Language {
  code: VoiceLanguage;
  name: string;
  native: string;
}

@Component({
  selector: 'app-voice-assistant',
  standalone: true,
  template: `
@if (isOpen()) {
  <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-fadeIn" (click)="handleClose()">
    <div class="absolute inset-0 flex flex-col items-center justify-center p-4" (click)="$event.stopPropagation()">
      
      <!-- Close Button -->
      <button (click)="handleClose()" class="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Language Selector -->
      <div class="flex gap-3 mb-8">
        @for (lang of languages; track lang.code) {
          <button 
            (click)="selectLanguage(lang.code)"
            class="px-4 py-2 text-lg rounded-full border transition-all duration-300"
            [class.bg-amber-400/20]="selectedLanguage() === lang.code"
            [class.border-amber-400/50]="selectedLanguage() === lang.code"
            [class.text-amber-200]="selectedLanguage() === lang.code"
            [class.bg-slate-800/50]="selectedLanguage() !== lang.code"
            [class.border-slate-700]="selectedLanguage() !== lang.code"
            [class.text-slate-400]="selectedLanguage() !== lang.code"
          >
            {{ lang.native }}
          </button>
        }
      </div>

      <!-- Main Orb -->
      <div class="relative flex items-center justify-center w-48 h-48 sm:w-64 sm:h-64">
        @if (voiceService.status() === 'listening') {
          <div class="absolute inset-0 bg-amber-400/20 rounded-full animate-ping"></div>
        }
        <button (click)="handleOrbClick()" class="relative w-full h-full bg-slate-900/50 border-2 border-slate-700 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 sm:w-24 sm:h-24 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 016 0v8.25a3 3 0 01-3 3z" />
          </svg>
        </button>
      </div>
      
      <!-- Status Text -->
      <p class="mt-8 text-xl text-slate-300 h-8 transition-opacity duration-300">
        {{ statusMessages[voiceService.status()] }}
      </p>

      <!-- Results Area -->
      <div class="w-full max-w-2xl mt-6 flex flex-col gap-4 text-center">
        <!-- User Transcript -->
        @if (voiceService.transcript()) {
          <div class="min-h-[3rem] p-3 bg-slate-800/50 rounded-lg animate-fadeIn">
            <p class="text-slate-300 italic">"{{ voiceService.transcript() }}"</p>
          </div>
        }
        
        <!-- AI Response -->
        @if (voiceService.aiResponse()) {
          <div class="p-4 bg-amber-500/10 border border-amber-400/30 rounded-lg animate-fadeIn">
            <p class="text-amber-200">{{ voiceService.aiResponse() }}</p>
          </div>
        }

        <!-- Error Message -->
        @if (voiceService.error()) {
          <div class="p-3 bg-red-900/50 border border-red-700 rounded-lg animate-fadeIn">
            <p class="text-red-300">{{ voiceService.error() }}</p>
          </div>
        }
      </div>

    </div>
  </div>
}
`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoiceAssistantComponent {
  isOpen = input.required<boolean>();
  close = output<void>();

  voiceService = inject(VoiceAssistantService);

  selectedLanguage = signal<VoiceLanguage>('ta-IN');

  languages: Language[] = [
    { code: 'ta-IN', name: 'Tamil', native: 'தமிழ்' },
    { code: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'tcy-IN', name: 'Tulu', native: 'ತುಳು' },
  ];
  
  statusMessages: Record<VoiceStatus, string> = {
    idle: 'Tap the orb to ask a question',
    listening: 'Listening...',
    processing: 'Consulting the cosmos...',
    speaking: 'Speaking...',
    error: 'Something went wrong',
  };

  handleOrbClick(): void {
    if (this.voiceService.status() === 'listening') {
      this.voiceService.stopListening();
    } else {
      this.voiceService.startListening(this.selectedLanguage());
    }
  }

  handleClose(): void {
    this.voiceService.cancel();
    this.close.emit();
  }
  
  selectLanguage(langCode: VoiceLanguage): void {
    this.selectedLanguage.set(langCode);
    if (this.voiceService.status() === 'listening') {
        this.voiceService.stopListening();
        this.voiceService.startListening(langCode);
    }
  }
}
