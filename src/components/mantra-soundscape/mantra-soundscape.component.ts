import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, signal } from '@angular/core';
import { GeminiService } from '../../services/gemini.service';
import { Mantra, MantraCategory } from '../../app.component';

@Component({
  selector: 'app-mantra-soundscape',
  templateUrl: './mantra-soundscape.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MantraSoundscapeComponent implements OnDestroy {
  goBack = input.required<() => void>();
  mantraCategories = input.required<MantraCategory[]>();

  private geminiService = inject(GeminiService);

  selectedCategory = signal<MantraCategory | null>(null);
  selectedMantra = signal<Mantra | null>(null);
  
  // AI Insight State
  geminiInsight = signal<string | null>(null);
  isLoadingInsight = signal(false);
  insightError = signal<string | null>(null);

  // Audio Player State
  private audioPlayer = new Audio();
  isPlaying = signal(false);
  
  constructor() {
    this.audioPlayer.addEventListener('ended', () => this.isPlaying.set(false));
    this.audioPlayer.addEventListener('pause', () => this.isPlaying.set(false));
    this.audioPlayer.addEventListener('play', () => this.isPlaying.set(true));
  }

  ngOnDestroy(): void {
    this.audioPlayer.pause();
    this.audioPlayer.src = '';
  }

  handleGoBack(): void {
    if (this.selectedMantra()) {
      this.selectMantra(null); // Go from mantra detail to mantra list
    } else if (this.selectedCategory()) {
      this.selectCategory(null); // Go from mantra list to category list
    } else {
      this.goBack(); // Go back to previous page
    }
  }

  selectCategory(category: MantraCategory | null): void {
    this.selectedCategory.set(category);
  }

  selectMantra(mantra: Mantra | null): void {
    // Stop any currently playing audio when selection changes
    if (this.isPlaying()) {
      this.audioPlayer.pause();
    }
    this.isPlaying.set(false);
    this.geminiInsight.set(null);
    this.insightError.set(null);
    
    this.selectedMantra.set(mantra);
    
    if (mantra) {
      this.audioPlayer.src = mantra.audioUrl;
    }
  }

  toggleAudio(): void {
    if (this.isPlaying()) {
      this.audioPlayer.pause();
    } else {
      this.audioPlayer.play().catch(e => console.error("Audio playback error:", e));
    }
  }

  async fetchMantraInsight(): Promise<void> {
    const mantra = this.selectedMantra();
    if (!mantra) return;

    this.isLoadingInsight.set(true);
    this.geminiInsight.set(null);
    this.insightError.set(null);

    try {
      const insight = await this.geminiService.getMantraInsight(mantra.name, mantra.meaning);
      this.geminiInsight.set(insight);
    } catch (e) {
      console.error(e);
      this.insightError.set('A moment of silence... The cosmos is not responding. Please try again.');
    } finally {
      this.isLoadingInsight.set(false);
    }
  }
}
