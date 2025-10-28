import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GeminiService } from '../../services/gemini.service';
import { Video, VideoCategory } from '../../app.component';

@Component({
  selector: 'app-sacred-teachings',
  templateUrl: './sacred-teachings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SacredTeachingsComponent {
  goBack = input.required<() => void>();
  categories = input.required<VideoCategory[]>();

  private geminiService = inject(GeminiService);
  private sanitizer = inject(DomSanitizer);

  selectedCategory = signal<VideoCategory | null>(null);
  selectedVideo = signal<Video | null>(null);

  takeaways = signal<string[] | null>(null);
  isLoadingTakeaways = signal(false);
  takeawaysError = signal<string | null>(null);

  // Computed property for the YouTube embed URL
  videoUrl = computed(() => {
    const videoId = this.selectedVideo()?.youtubeId;
    if (videoId) {
      const url = `https://www.youtube.com/embed/${videoId}`;
      // Sanitize the URL to prevent XSS attacks
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return '';
  });

  handleGoBack(): void {
    if (this.selectedVideo()) {
      this.selectVideo(null); // Go from video player to video list
    } else if (this.selectedCategory()) {
      this.selectCategory(null); // Go from video list to category list
    } else {
      this.goBack(); // Go back to 'More' page
    }
  }

  selectCategory(category: VideoCategory | null): void {
    this.selectedCategory.set(category);
  }

  selectVideo(video: Video | null): void {
    this.selectedVideo.set(video);
    // Reset takeaways state when a new video is selected
    this.takeaways.set(null);
    this.takeawaysError.set(null);
    this.isLoadingTakeaways.set(false);
  }

  async fetchTakeaways(): Promise<void> {
    const video = this.selectedVideo();
    if (!video) return;

    this.isLoadingTakeaways.set(true);
    this.takeaways.set(null);
    this.takeawaysError.set(null);

    try {
      const result = await this.geminiService.getVideoTakeaways(video.title);
      this.takeaways.set(result);
    } catch (e) {
      console.error(e);
      this.takeawaysError.set('The cosmos is silent on this topic for now. Please try again later.');
    } finally {
      this.isLoadingTakeaways.set(false);
    }
  }
}
