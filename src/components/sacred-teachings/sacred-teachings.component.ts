import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GeminiService } from '../../services/gemini.service';
import { Video, VideoCategory } from '../../app.component';

@Component({
  selector: 'app-sacred-teachings',
  template: `
<div class="animate-fadeIn">
  <button (click)="handleGoBack()" class="mb-4 text-slate-300">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
  </button>
  
  @if (!selectedCategory()) {
    <!-- Category List View -->
    <div>
      <h1 class="font-serif text-3xl font-bold mb-2">Sacred Teachings</h1>
      <p class="text-slate-400 mb-8">Curated video wisdom for your spiritual journey.</p>
      <div class="space-y-4">
        @for (category of categories(); track category.name; let i = $index) {
          <div (click)="selectCategory(category)" 
               class="bg-slate-800/50 border border-slate-700 rounded-xl p-5 flex items-center gap-5 cursor-pointer hover:bg-slate-800 hover:border-amber-400/50 transition-all duration-300 animate-slideIn"
               [style.animation-delay]="i * 100 + 'ms'">
            <div class="text-amber-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div>
              <h2 class="font-serif text-lg text-amber-200">{{ category.name }}</h2>
              <p class="text-sm text-slate-400">{{ category.description }}</p>
            </div>
          </div>
        }
      </div>
    </div>
  } @else if (selectedCategory(); as category) {
    @if (!selectedVideo()) {
      <!-- Video List View -->
      <div>
        <h1 class="font-serif text-3xl font-bold mb-1">{{ category.name }}</h1>
        <p class="text-slate-400 mb-8">{{ category.description }}</p>
        <div class="space-y-4">
          @for (video of category.videos; track video.youtubeId; let i = $index) {
            <div (click)="selectVideo(video)" class="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-800 transition-colors animate-slideIn" [style.animation-delay]="i * 100 + 'ms'">
              <img [src]="'https://i3.ytimg.com/vi/' + video.youtubeId + '/hqdefault.jpg'" [alt]="video.title" class="w-28 h-20 object-cover rounded-md" />
              <div>
                <h3 class="font-semibold text-amber-200/90">{{ video.title }}</h3>
                <p class="text-sm text-slate-400">{{ video.speaker }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    } @else {
      <!-- Video Player View -->
      @if (selectedVideo(); as video) {
        <div>
          <div class="aspect-video w-full rounded-xl overflow-hidden mb-4 border border-slate-700 bg-black">
            <iframe width="100%" height="100%" [src]="videoUrl()" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
          <h1 class="font-serif text-2xl font-bold mb-1">{{ video.title }}</h1>
          <p class="text-slate-400 mb-6">by {{ video.speaker }}</p>

          <div class="mt-2">
            @if (!takeaways() && !isLoadingTakeaways() && !takeawaysError()) {
              <button (click)="fetchTakeaways()" class="w-full px-6 py-3 bg-amber-400/20 text-amber-200 rounded-full border border-amber-400/50">
                <span>Reveal Key Takeaways</span>
              </button>
            }
          </div>

          @if (isLoadingTakeaways()) {
            <div class="flex items-center justify-center gap-3 p-4 text-slate-400">
              <svg class="animate-spin h-5 w-5 text-amber-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>Distilling ancient wisdom...</span>
            </div>
          }

          @if (takeaways(); as points) {
            <div class="mt-6 bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-400/30 rounded-xl p-5 animate-fadeIn">
              <h3 class="font-serif font-bold text-lg text-amber-200 mb-3">Key Takeaways</h3>
              <ul class="space-y-2 list-disc list-inside text-slate-300">
                @for (point of points; track point) {
                  <li>{{ point }}</li>
                }
              </ul>
            </div>
          }
          
          @if (takeawaysError()) {
             <div class="mt-6 p-4 bg-red-900/50 border border-red-700 rounded-lg animate-fadeIn text-center">
              <p class="text-red-300">{{ takeawaysError() }}</p>
            </div>
          }
        </div>
      }
    }
  }
</div>
`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SacredTeachingsComponent {
  goBack = input.required<() => void>();
  categories = input.required<VideoCategory[]>();

  private geminiService = inject(GeminiService);
  // FIX: Added explicit type to 'sanitizer' property to resolve an issue where its type was being inferred as 'unknown'.
  private sanitizer: DomSanitizer = inject(DomSanitizer);

  selectedCategory = signal<VideoCategory | null>(null);
  selectedVideo = signal<Video | null>(null);

  takeaways = signal<string[] | null>(null);
  isLoadingTakeaways = signal(false);
  takeawaysError = signal<string | null>(null);

  // Computed property for the YouTube embed URL
  videoUrl = computed<SafeResourceUrl | string>(() => {
    const videoId = this.selectedVideo()?.youtubeId;
    if (videoId) {
      const url = `https://www.youtube.com/embed/${videoId}`;
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
