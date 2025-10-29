import { ChangeDetectionStrategy, Component, computed, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { GeminiService, EmotionalGuidance } from '../../services/gemini.service';
import { EmotionCard, SwitchWordCategory } from '../../app.component';

declare var html2canvas: any;

@Component({
  selector: 'app-emotion-guidance',
  template: `
<div class="animate-fadeIn">
  <button (click)="goBack()" class="mb-4 text-slate-300">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
  </button>
  
  @switch (state()) {
    @case ('loading') {
      <div class="flex flex-col items-center justify-center h-[70vh] text-center">
        <div class="relative w-32 h-32 flex items-center justify-center">
          <div class="absolute inset-0 bg-amber-400/20 rounded-full animate-ping"></div>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
        </div>
        <p class="mt-8 text-lg text-slate-300 transition-opacity duration-500 animate-fadeIn">{{ currentLoadingMessage() }}</p>
      </div>
    }
    @case ('result') {
      @if (guidance(); as g) {
        <div class="flex flex-col gap-8">
          <div id="guidance-card" class="bg-gradient-to-br from-[#242142] to-[#131128] border border-slate-700 rounded-2xl p-6 text-center shadow-2xl shadow-black/50">
            <p class="text-sm text-amber-300/80 mb-2">For when you are feeling</p>
            <h1 class="font-serif text-3xl font-bold mb-6 text-amber-200">{{ emotion()?.title }}</h1>
            <p class="text-slate-200 text-lg leading-relaxed font-serif italic">"{{ g.guidance }}"</p>
          </div>

          @if (suggestedCategory(); as category) {
            <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-5 text-center animate-slideIn" style="animation-delay: 100ms;">
              <h3 class="font-serif text-lg text-amber-200 mb-2">Suggested Switch Word Category</h3>
              <p class="text-slate-400 mb-4">To amplify this energy, explore words from the "{{ category.name }}" collection.</p>
              <button (click)="handleGoToSwitchWords()" class="px-5 py-2 bg-amber-400/20 text-amber-200 rounded-full border border-amber-400/50 text-sm">
                Explore Now
              </button>
            </div>
          }
          
          <div class="flex gap-4">
              <button (click)="shareGuidance()" class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-700/60 text-slate-300 font-semibold rounded-full hover:bg-slate-700 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                Share
              </button>
              <button (click)="downloadGuidanceImage()" class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-700/60 text-slate-300 font-semibold rounded-full hover:bg-slate-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download
              </button>
          </div>

        </div>
      }
    }
    @case ('error') {
        <div class="bg-red-900/50 border border-red-700 rounded-xl p-5 text-center">
            <h3 class="font-bold text-lg text-red-200 mb-2">Oh, dear...</h3>
            <p class="text-red-300">{{ error() }}</p>
        </div>
    }
  }
</div>
`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmotionGuidanceComponent implements OnInit, OnDestroy {
  goBack = input.required<() => void>();
  emotion = input.required<EmotionCard | null>();
  switchWordCategories = input.required<SwitchWordCategory[]>();
  navigateToSwitchWords = input.required<(category: SwitchWordCategory) => void>();

  private geminiService = inject(GeminiService);

  state = signal<'loading' | 'result' | 'error'>('loading');
  guidance = signal<EmotionalGuidance | null>(null);
  error = signal<string | null>(null);

  suggestedCategory = computed(() => {
    const theme = this.guidance()?.theme;
    if (!theme) return null;
    return this.switchWordCategories().find(c => c.name === theme) ?? null;
  });

  loadingMessages = ['Connecting with your inner self...', 'Listening to the whispers of the cosmos...', 'Translating celestial wisdom...'];
  currentLoadingMessage = signal(this.loadingMessages[0]);
  private loadingInterval?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.fetchGuidance();
    this.startLoadingAnimation();
  }

  ngOnDestroy(): void {
    if (this.loadingInterval) {
      clearInterval(this.loadingInterval);
    }
  }

  async fetchGuidance(): Promise<void> {
    const currentEmotion = this.emotion();
    if (!currentEmotion) {
      this.error.set('No emotion selected.');
      this.state.set('error');
      return;
    }

    try {
      const result = await this.geminiService.getEmotionalGuidance(currentEmotion.title);
      this.guidance.set(result);
      this.state.set('result');
    } catch (e) {
      console.error(e);
      this.error.set('The cosmos is quiet right now. Please try again later.');
      this.state.set('error');
    } finally {
      if (this.loadingInterval) {
        clearInterval(this.loadingInterval);
      }
    }
  }

  startLoadingAnimation(): void {
    if (this.loadingInterval) clearInterval(this.loadingInterval);
    let index = 0;
    this.currentLoadingMessage.set(this.loadingMessages[index]);
    this.loadingInterval = setInterval(() => {
      index = (index + 1) % this.loadingMessages.length;
      this.currentLoadingMessage.set(this.loadingMessages[index]);
    }, 2500);
  }

  handleGoToSwitchWords(): void {
    const category = this.suggestedCategory();
    if (category) {
      this.navigateToSwitchWords()(category);
    }
  }
  
  async shareGuidance(): Promise<void> {
    const guidanceText = this.guidance()?.guidance;
    if (!guidanceText || !navigator.share) return;
    try {
      await navigator.share({
        title: 'A Moment of Cosmic Guidance',
        text: `Feeling ${this.emotion()?.title}, I received this guidance:\n\n"${guidanceText}"\n\nFrom The Universe Guidance App`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }
  
  downloadGuidanceImage(): void {
    const node = document.getElementById('guidance-card');
    if (node) {
      html2canvas(node, { 
        backgroundColor: '#1e1b3a',
        useCORS: true 
      }).then((canvas: any) => {
        const link = document.createElement('a');
        link.download = `cosmic-guidance-${this.emotion()?.title.toLowerCase()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  }
}
