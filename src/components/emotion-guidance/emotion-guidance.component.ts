import { ChangeDetectionStrategy, Component, computed, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { GeminiService, EmotionalGuidance } from '../../services/gemini.service';
import { EmotionCard, SwitchWordCategory } from '../../app.component';

declare var html2canvas: any;

@Component({
  selector: 'app-emotion-guidance',
  templateUrl: './emotion-guidance.component.html',
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
