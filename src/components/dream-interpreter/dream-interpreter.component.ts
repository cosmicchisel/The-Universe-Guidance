import { ChangeDetectionStrategy, Component, OnDestroy, signal, inject, input } from '@angular/core';
import { GeminiService, DreamInterpretation } from '../../services/gemini.service';

@Component({
  selector: 'app-dream-interpreter',
  standalone: true,
  template: `
<div class="animate-fadeIn">
  @switch (state()) {
    @case ('idle') {
      <div>
        <button (click)="handleGoBack()" class="mb-4 text-slate-300"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg></button>
        <h1 class="font-serif text-3xl font-bold mb-1">Dream Interpreter</h1>
        <p class="text-slate-400 mb-8">Describe your dream to uncover its hidden message.</p>

        <div class="flex flex-col items-center gap-4">
          <textarea 
            [value]="dreamDescription()" 
            (input)="updateDreamDescription($event)"
            rows="8" 
            placeholder="Describe your dream in detail... the colors, feelings, people, and places." 
            class="w-full max-w-sm bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300">
          </textarea>

          <button (click)="interpretDream()" [disabled]="dreamDescription().trim().length < 10" class="w-full max-w-sm px-6 py-3 mt-2 bg-amber-400 text-slate-900 font-bold rounded-full shadow-lg shadow-amber-700/30 disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none">
            Interpret My Dream
          </button>
        </div>
      </div>
    }
    @case ('interpreting') {
      <div class="flex flex-col items-center justify-center h-[80vh] text-center">
        <div class="relative w-32 h-32 flex items-center justify-center">
            <div class="absolute inset-0 bg-amber-400/20 rounded-full animate-ping"></div>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/><path d="m15.7 3.4-1.4 1.4"/></svg>
        </div>
        <p class="mt-8 text-lg text-slate-300 transition-opacity duration-500 animate-fadeIn">{{ currentAnalysisMessage() }}</p>
      </div>
    }
    @case ('result') {
      <div>
        <button (click)="handleGoBack()" class="mb-4 text-slate-300"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg></button>
        <h1 class="font-serif text-3xl font-bold mb-6">Your Dream's Message</h1>
        
        @if (interpretationResult(); as result) {
          <div class="space-y-6 text-slate-300 leading-relaxed">
            <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-5 animate-slideIn">
              <h3 class="font-serif font-bold text-xl text-amber-200 mb-2">Main Themes</h3>
              <p>{{ result.mainThemes }}</p>
            </div>
            <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-5 animate-slideIn" style="animation-delay: 100ms;">
              <h3 class="font-serif font-bold text-xl text-amber-200 mb-2">Symbolism Explained</h3>
              <p>{{ result.symbolism }}</p>
            </div>
            <div class="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-400/30 rounded-xl p-5 animate-slideIn" style="animation-delay: 200ms;">
              <h3 class="font-serif font-bold text-xl text-amber-200 mb-2">Cosmic Guidance</h3>
              <p>{{ result.guidance }}</p>
            </div>
          </div>
        } @else if(interpretationError(); as error) {
          <div class="bg-red-900/50 border border-red-700 rounded-xl p-4 text-center">
            <h3 class="font-bold text-lg text-red-200 mb-2">Interpretation Failed</h3>
            <p class="text-red-300">{{ error }}</p>
          </div>
        }
        
        <button (click)="handleGoBack()" class="w-full mt-8 px-6 py-3 bg-amber-400/20 text-amber-200 rounded-full border border-amber-400/50">
            Interpret Another Dream
        </button>
      </div>
    }
  }
</div>
`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DreamInterpreterComponent implements OnDestroy {
  goBack = input.required<() => void>();
  
  private geminiService = inject(GeminiService);

  state = signal<'idle' | 'interpreting' | 'result'>('idle');
  dreamDescription = signal('');
  interpretationResult = signal<DreamInterpretation | null>(null);
  interpretationError = signal<string | null>(null);

  analysisMessages = ['Entering the dream realm...', 'Consulting cosmic symbols...', 'Unraveling the message...', 'Translating subconscious whispers...'];
  currentAnalysisMessage = signal(this.analysisMessages[0]);
  private analysisInterval?: ReturnType<typeof setInterval>;

  ngOnDestroy(): void {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
    }
  }

  async interpretDream() {
    if (this.dreamDescription().trim().length < 10) return;
    
    this.state.set('interpreting');
    this.interpretationError.set(null);
    this.interpretationResult.set(null);
    this.startAnalysisAnimation();

    try {
      const result = await this.geminiService.interpretDream(this.dreamDescription());
      this.interpretationResult.set(result);
      this.state.set('result');
    } catch (e) {
      console.error(e);
      this.interpretationError.set('The realm of dreams is misty right now. We couldn\'t catch the meaning. Please try again later.');
      this.interpretationResult.set(null);
      this.state.set('result');
    } finally {
      this.stopAnalysisAnimation();
    }
  }

  startAnalysisAnimation() {
    this.stopAnalysisAnimation();
    let index = 0;
    this.currentAnalysisMessage.set(this.analysisMessages[index]);
    this.analysisInterval = setInterval(() => {
      index = (index + 1) % this.analysisMessages.length;
      this.currentAnalysisMessage.set(this.analysisMessages[index]);
    }, 2500);
  }

  stopAnalysisAnimation() {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
    }
  }

  handleGoBack() {
    if (this.state() !== 'idle') {
      this.state.set('idle');
      this.interpretationResult.set(null);
      this.interpretationError.set(null);
      this.dreamDescription.set('');
      this.stopAnalysisAnimation();
    } else {
      this.goBack();
    }
  }

  updateDreamDescription(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.dreamDescription.set(target.value);
  }
}

