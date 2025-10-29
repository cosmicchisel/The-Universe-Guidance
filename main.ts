import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './src/app.component';
import { provideZonelessChangeDetection } from '@angular/core';
import { GeminiService } from './src/services/gemini.service';
import { VoiceAssistantService } from './src/services/voice-assistant.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    GeminiService,
    VoiceAssistantService,
  ],
}).catch((err) => console.error(err));
