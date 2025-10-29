import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { PalmReadingComponent } from './components/palm-reading/palm-reading.component';
import { KundaliComponent } from './components/kundali/kundali.component';
import { VoiceAssistantComponent } from './components/voice-assistant/voice-assistant.component';
import { EmotionGuidanceComponent } from './components/emotion-guidance/emotion-guidance.component';
import { MantraSoundscapeComponent } from './components/mantra-soundscape/mantra-soundscape.component';
import { SacredTeachingsComponent } from './components/sacred-teachings/sacred-teachings.component';
import { DreamInterpreterComponent } from './components/dream-interpreter/dream-interpreter.component';

export type Page = 'home' | 'dailyHoroscope' | 'calendar' | 'emotions' | 'more' | 'switchWords' | 'palmReading' | 'kundali' | 'emotionGuidance' | 'mantraSoundscape' | 'sacredTeachings' | 'dreamInterpreter';
export type HoroscopeTab = 'love' | 'career' | 'health';

export interface ZodiacSign {
  name: string;
  icon: string;
}
export interface EmotionCard {
  title: string;
  emoji: string;
}
export interface NavItem {
  id: Exclude<Page, 'dailyHoroscope' | 'palmReading' | 'kundali' | 'emotionGuidance' | 'mantraSoundscape' | 'sacredTeachings' | 'dreamInterpreter'>;
  label: string;
}
export interface SwitchWord {
  word: string;
  purpose: string;
}
export interface SwitchWordCategory {
  name: string;
  description: string;
  words: SwitchWord[];
}
export interface Mantra {
  name: string;
  sanskrit: string;
  meaning: string;
  audioUrl: string;
}
export interface MantraCategory {
  name: string;
  description: string;
  mantras: Mantra[];
}
export interface Video {
  title: string;
  speaker: string;
  youtubeId: string;
}
export interface VideoCategory {
  name: string;
  description: string;
  videos: Video[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
<div class="min-h-screen bg-gradient-to-b from-[#131128] to-[#242142] text-slate-200 overflow-x-hidden">
  <app-voice-assistant [isOpen]="isVoiceAssistantOpen()" (close)="isVoiceAssistantOpen.set(false)"></app-voice-assistant>

  <main class="relative z-10 p-6 pb-28">
    @switch (page()) {
      @case ('home') {
        <div class="flex flex-col h-full gap-6 animate-fadeIn">
          <header class="flex justify-between items-center">
            <button class="text-slate-300"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636" /></svg></button>
            <h1 class="font-serif text-2xl font-bold text-amber-100/90">Cosmic Insights</h1>
            <button (click)="isVoiceAssistantOpen.set(true)" class="text-slate-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 016 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </button>
          </header>
          
          <div (click)="navigateTo('dailyHoroscope')" class="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-left flex items-center justify-between cursor-pointer animate-slideIn">
            <div>
              <h2 class="font-serif text-lg text-amber-200">Your Daily Horoscope</h2>
              <p class="text-sm text-slate-400">{{horoscopeDateSubheader()}}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-amber-300"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div (click)="navigateTo('palmReading')" class="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800 transition-colors animate-scaleUp" style="animation-delay: 100ms;">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21.5c-4.23.9-7.82.0-10-2C-.17 17.5.3 14.2.83 11.5S2 6.5 4 4.5s4-2 6-2 4 .5 6 2.5c2.5 2.5 3.5 5.5 3.5 7.5.55 2.76 1.48 5.48 1.5 6.5a10.8 10.8 0 0 1-3.5 4.5c-2.75 1.5-6 1-8.5 0Z"/><path d="M4 14.5c-1.5 1-2 2-2 3.5"/><path d="M12 12.5a2.5 2.5 0 0 0-5 0v5.5"/><path d="M22 14.5c-1.5 1-2 2-2 3.5"/><path d="M14.5 18.5a2.5 2.5 0 0 0 0-5"/><path d="M8 12.5a2.5 2.5 0 0 0-5 0v5.5"/></svg>
              <h3 class="font-serif text-lg mt-3 text-amber-200">Palm Reading</h3>
              <p class="text-xs text-slate-400 mt-1">Unlock secrets in your hand.</p>
            </div>
            <div (click)="navigateTo('kundali')" class="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800 transition-colors animate-scaleUp" style="animation-delay: 200ms;">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/><path d="M12 12 8 22"/><path d="m12 12 10-4"/><path d="M12 12 2 8"/></svg>
              <h3 class="font-serif text-lg mt-3 text-amber-200">Kundali Chart</h3>
              <p class="text-xs text-slate-400 mt-1">Vedic birth chart analysis.</p>
            </div>
             <div (click)="navigateTo('dreamInterpreter')" class="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800 transition-colors animate-scaleUp" style="animation-delay: 300ms;">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/><path d="m15.7 3.4-1.4 1.4"/></svg>
              <h3 class="font-serif text-lg mt-3 text-amber-200">Dream Interpreter</h3>
              <p class="text-xs text-slate-400 mt-1">Find meaning in your dreams.</p>
            </div>
             <div (click)="navigateTo('mantraSoundscape')" class="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800 transition-colors animate-scaleUp" style="animation-delay: 400ms;">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.86 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85v2.72c0 .27.16.59.67.5A10 10 0 0 0 22 12c0-5.523-4.477-10-10-10z"/></svg>
              <h3 class="font-serif text-lg mt-3 text-amber-200">Mantra Soundscape</h3>
              <p class="text-xs text-slate-400 mt-1">Chant & meditate.</p>
            </div>
          </div>

        </div>
      }
      @case ('dailyHoroscope') {
        <div class="animate-fadeIn">
          <button (click)="goBack()" class="mb-4 text-slate-300"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg></button>
          <h1 class="font-serif text-3xl font-bold mb-1">Daily Horoscope</h1>
          <p class="text-slate-400 mb-6">{{horoscopeDateHeader()}}</p>
          <div class="flex justify-between bg-slate-800/60 rounded-full p-1 mb-6">
            <button (click)="horoscopeTab.set('love')" class="w-full py-2 rounded-full text-sm font-semibold transition-colors" [class.bg-amber-400/20]="horoscopeTab() === 'love'" [class.text-amber-200]="horoscopeTab() === 'love'">Love</button>
            <button (click)="horoscopeTab.set('career')" class="w-full py-2 rounded-full text-sm font-semibold transition-colors" [class.bg-amber-400/20]="horoscopeTab() === 'career'" [class.text-amber-200]="horoscopeTab() === 'career'">Career</button>
            <button (click)="horoscopeTab.set('health')" class="w-full py-2 rounded-full text-sm font-semibold transition-colors" [class.bg-amber-400/20]="horoscopeTab() === 'health'" [class.text-amber-200]="horoscopeTab() === 'health'">Health</button>
          </div>
          <div class="space-y-4 text-slate-300 leading-relaxed">
            <p>Today's cosmic energies are highlighting your romantic sector. If you're single, a chance encounter could lead to something meaningful. For those in a relationship, it's a perfect day to deepen your connection. Open communication will be key to unlocking new levels of intimacy and understanding.</p>
            <p>Be patient and trust in the universe's timing.</p>
          </div>
        </div>
      }
      @case ('calendar') {
        <div class="animate-fadeIn">
          <button (click)="goBack()" class="mb-4 text-slate-300"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg></button>
          <div class="flex justify-between items-center mb-6">
            <h1 class="font-serif text-3xl font-bold">{{monthName()}} {{currentDate().getFullYear()}}</h1>
            <div class="flex gap-2">
              <button (click)="prevMonth()" class="p-2 bg-slate-800/60 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg></button>
              <button (click)="nextMonth()" class="p-2 bg-slate-800/60 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg></button>
            </div>
          </div>
          <div class="grid grid-cols-7 gap-2 text-center text-sm text-slate-400 mb-3">
            @for(day of weekdays; track day) { <div>{{day}}</div> }
          </div>
          <div class="grid grid-cols-7 gap-2 text-center">
            @for(day of calendarDays(); track $index) {
              <div class="w-10 h-10 flex items-center justify-center rounded-full" [class.bg-amber-400/20]="day === currentDate().getDate()" [class.text-amber-200]="day === currentDate().getDate()">
                {{day}}
              </div>
            }
          </div>
        </div>
      }
      @case ('switchWords') {
        <div class="animate-fadeIn">
          @if (!selectedSwitchWordCategory()) {
            <div>
              <h1 class="font-serif text-3xl font-bold mb-1">Switch Words</h1>
              <p class="text-slate-400 mb-8">Tap a category to discover words for manifestation.</p>
              <div class="space-y-4">
                @for (category of switchWordsCategories; track category.name; let i = $index) {
                  <div (click)="selectedSwitchWordCategory.set(category)" class="bg-slate-800/50 border border-slate-700 rounded-xl p-5 text-left flex items-center justify-between cursor-pointer animate-slideIn" [style.animation-delay]="i * 100 + 'ms'">
                    <div>
                      <h2 class="font-serif text-lg text-amber-200">{{ category.name }}</h2>
                      <p class="text-sm text-slate-400">{{ category.description }}</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-amber-300"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                  </div>
                }
              </div>
            </div>
          } @else {
            <div>
              <button (click)="resetSwitchWordCategory()" class="mb-4 text-slate-300"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg></button>
              <h1 class="font-serif text-3xl font-bold mb-1">{{ selectedSwitchWordCategory()?.name }}</h1>
              <p class="text-slate-400 mb-8">{{ selectedSwitchWordCategory()?.description }}</p>
              <div class="space-y-3">
                @for (word of selectedSwitchWordCategory()?.words; track word.word) {
                  <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <h3 class="font-bold text-lg text-amber-200 uppercase tracking-widest">{{ word.word }}</h3>
                    <p class="text-slate-300">{{ word.purpose }}</p>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
      @case ('emotions') {
        <div class="animate-fadeIn">
          <button (click)="goBack()" class="mb-4 text-slate-300"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg></button>
          <h1 class="font-serif text-3xl font-bold mb-2">How are you feeling today?</h1>
          <p class="text-slate-400 mb-8">Select an emotion to receive cosmic guidance.</p>
          <div class="grid grid-cols-2 gap-4">
            @for (card of emotionCards; track card.title; let i = $index) {
              <div (click)="showEmotionGuidance(card)" 
                   class="bg-slate-800/50 border border-slate-700 rounded-xl p-4 aspect-square flex flex-col justify-center items-center text-center cursor-pointer hover:bg-slate-800 hover:border-amber-400/50 transition-all duration-300 animate-scaleUp"
                   [style.animation-delay]="i * 75 + 'ms'">
                <div class="text-5xl mb-3">{{card.emoji}}</div>
                <h3 class="font-serif text-lg text-amber-200">{{card.title}}</h3>
              </div>
            }
          </div>
        </div>
      }
      @case ('emotionGuidance') {
        <app-emotion-guidance 
            [goBack]="goBackFn" 
            [emotion]="selectedEmotion()"
            [switchWordCategories]="switchWordsCategories"
            [navigateToSwitchWords]="navigateToSwitchWordsFromGuidanceFn"
            />
      }
      @case ('more') {
        <div class="animate-fadeIn">
           <button (click)="goBack()" class="mb-4 text-slate-300"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg></button>
          <h1 class="font-serif text-3xl font-bold mb-6">More Options</h1>
          <div class="flex flex-col">
            @for(link of moreLinks; track link) {
              <button (click)="navigateToMoreLink(link)" class="flex justify-between items-center w-full text-left py-4 border-b border-slate-700 text-slate-300">
                <span>{{link}}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-slate-500"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
              </button>
            }
          </div>
        </div>
      }
      @case ('mantraSoundscape') {
        <app-mantra-soundscape
            [goBack]="goBackFn"
            [mantraCategories]="mantraCategories"
            />
      }
      @case ('sacredTeachings') {
        <app-sacred-teachings
            [goBack]="goBackFn"
            [categories]="sacredTeachingsCategories"
            />
      }
      @case ('palmReading') {
        <app-palm-reading [goBack]="goBackFn" />
      }
      @case ('kundali') {
        <app-kundali [goBack]="goBackFn" />
      }
      @case ('dreamInterpreter') {
        <app-dream-interpreter [goBack]="goBackFn" />
      }
    }
  </main>

  <footer class="fixed bottom-0 left-0 right-0 z-20 bg-slate-900/50 backdrop-blur-md border-t border-slate-800">
    <nav class="flex justify-around items-center p-2">
      @for(item of navItems; track item.id) {
        <button (click)="navigateTo(item.id)" class="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors" [class.text-amber-300]="page() === item.id" [class.text-slate-400]="page() !== item.id">
          @switch (item.id) {
            @case ('home') {
              <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            }
            @case ('calendar') {
              <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            }
            @case ('switchWords') {
              <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m15.5 8-4 4 4 4"/><path d="m8.5 8 4 4-4 4"/></svg>
            }
            @case ('emotions') {
              <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            }
            @case ('more') {
              <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            }
          }
          <span class="text-xs">{{item.label}}</span>
        </button>
      }
    </nav>
  </footer>
</div>
`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PalmReadingComponent, KundaliComponent, VoiceAssistantComponent, EmotionGuidanceComponent, MantraSoundscapeComponent, SacredTeachingsComponent, DreamInterpreterComponent],
})
export class AppComponent {
  page = signal<Page>('home');
  history = signal<Page[]>(['home']);
  horoscopeTab = signal<HoroscopeTab>('love');
  isVoiceAssistantOpen = signal(false);

  selectedSwitchWordCategory = signal<SwitchWordCategory | null>(null);
  selectedEmotion = signal<EmotionCard | null>(null);

  currentDate = signal(new Date());
  calendarDays = computed(() => {
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days: (string|number)[] = Array.from({ length: firstDayOfMonth }, () => '');
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  });
  monthName = computed(() => this.currentDate().toLocaleString('default', { month: 'long' }));
  weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  dayOfMonthWithSuffix = computed(() => {
    const day = this.currentDate().getDate();
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
      case 1:  return `${day}st`;
      case 2:  return `${day}nd`;
      case 3:  return `${day}rd`;
      default: return `${day}th`;
    }
  });

  horoscopeDateHeader = computed(() => {
    const date = this.currentDate();
    const dayName = date.toLocaleString('default', { weekday: 'long' });
    const monthName = date.toLocaleString('default', { month: 'long' });
    return `${dayName}, ${monthName} ${this.dayOfMonthWithSuffix()}`;
  });

  horoscopeDateSubheader = computed(() => {
      const date = this.currentDate();
      const dayName = date.toLocaleString('default', { weekday: 'long' });
      const monthName = date.toLocaleString('default', { month: 'long' });
      const day = date.getDate();
      return `${dayName}, ${monthName} ${day}`;
  });

  zodiacSigns: ZodiacSign[] = [
      { name: 'Aries', icon: '♈' }, { name: 'Taurus', icon: '♉' },
      { name: 'Gemini', icon: '♊' }, { name: 'Cancer', icon: '♋' },
      { name: 'Leo', icon: '♌' }, { name: 'Virgo', icon: '♍' },
      { name: 'Libra', icon: '♎' }, { name: 'Scorpio', icon: '♏' },
      { name: 'Sagittarius', icon: '♐' }, { name: 'Capricorn', icon: '♑' },
      { name: 'Aquarius', icon: '♒' }, { name: 'Pisces', icon: '♓' }
  ];

  emotionCards: EmotionCard[] = [
    { title: 'Anxious', emoji: '😥' },
    { title: 'Grateful', emoji: '🙏' },
    { title: 'Lost', emoji: '🧭' },
    { title: 'Hopeful', emoji: '✨' },
    { title: 'Angry', emoji: '😠' },
    { title: 'Joyful', emoji: '😄' },
    { title: 'Sad', emoji: '😢' },
    { title: 'Confused', emoji: '🤔' },
  ];
  
  moreLinks = ['Youtube Videos', 'Share with Friends', 'Rate App', 'Privacy Policy'];

  navItems: NavItem[] = [
    { id: 'home', label: 'Home' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'switchWords', label: 'Switch Words' },
    { id: 'emotions', label: 'Emotions'},
    { id: 'more', label: 'More' }
  ];
  
  switchWordsCategories: SwitchWordCategory[] = [
    {
      name: 'Money & Abundance',
      description: 'Chant these words to attract wealth and prosperity into your life.',
      words: [
        { word: 'COUNT', purpose: 'To attract money.' },
        { word: 'FIND', purpose: 'To increase wealth.' },
        { word: 'DIVINE', purpose: 'For unexpected miracles.' },
        { word: 'GIGGLE', purpose: 'To enjoy the process.' }
      ]
    },
    {
      name: 'Health & Healing',
      description: 'Use these powerful words to promote physical and mental well-being.',
      words: [
        { word: 'BE', purpose: 'For good health.' },
        { word: 'ADJUST', purpose: 'To handle discomfort.' },
        { word: 'CHANGE', purpose: 'To relieve pain.' },
        { word: 'CLEAR', purpose: 'To reduce allergies.' }
      ]
    },
    {
      name: 'Love & Relationships',
      description: 'Attract and enhance loving connections in your life.',
      words: [
        { word: 'TOGETHER', purpose: 'To build relationships.' },
        { word: 'LOVE', purpose: 'To generate and attract love.' },
        { word: 'CONNECT', purpose: 'To strengthen bonds.' },
        { word: 'PRAISE', purpose: 'To feel beautiful.' }
      ]
    },
    {
      name: 'Success & Career',
      description: 'Chant these words to achieve your goals and advance in your career.',
      words: [
        { word: 'REACH', purpose: 'To find what you are looking for.' },
        { word: 'JUDGE', purpose: 'To get a promotion.' },
        { word: 'VICTORY', purpose: 'For success in any endeavor.' },
        { word: 'ON', purpose: 'To create new ideas.' }
      ]
    },
    {
        name: 'Peace & Protection',
        description: 'Find inner calm and shield yourself from negativity.',
        words: [
          { word: 'CANCEL', purpose: 'To eliminate negativity.' },
          { word: 'GUARD', purpose: 'For protection from harm.' },
          { word: 'CRYSTAL', purpose: 'For clarity of mind.' },
          { word: 'UP', purpose: 'To boost confidence.' }
        ]
    }
  ];

  mantraCategories: MantraCategory[] = [
    {
      name: 'Peace & Calm',
      description: 'Mantras to soothe the mind and cultivate inner tranquility.',
      mantras: [
        { name: 'Om Shanti Om', sanskrit: 'ॐ शान्तिः ॐ', meaning: 'The universal sound, peace, the universal sound.', audioUrl: 'https://cdn.chosic.com/wp-content/uploads/2021/7/OM-Mantra-Chant-For-Meditation.mp3' }
      ]
    }
  ];

  sacredTeachingsCategories: VideoCategory[] = [
      {
        name: 'Discourses by Gurus',
        description: 'Listen to the timeless wisdom of spiritual masters.',
        videos: [
          { title: 'The Nature of Reality', speaker: 'Sadhguru', youtubeId: 'SQfx1O5i34A' },
          { title: 'Finding Your Purpose', speaker: 'Gaur Gopal Das', youtubeId: '169s_bEuTIQ' },
        ]
      }
  ];

  // --- Methods ---

  navigateTo(page: Page) {
    if (page === this.page()) return;
    this.history.update(h => [...h, page]);
    this.page.set(page);
    window.scrollTo(0, 0);
  }

  goBack() {
    this.history.update(h => {
      if (h.length > 1) {
        h.pop();
        this.page.set(h[h.length - 1]);
      }
      return [...h];
    });
  }

  prevMonth() {
    this.currentDate.update(d => {
      const newDate = new Date(d);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  }

  nextMonth() {
    this.currentDate.update(d => {
      const newDate = new Date(d);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  }

  resetSwitchWordCategory() {
    this.selectedSwitchWordCategory.set(null);
  }

  showEmotionGuidance(card: EmotionCard) {
    this.selectedEmotion.set(card);
    this.navigateTo('emotionGuidance');
  }

  navigateToSwitchWordsFromGuidance(category: SwitchWordCategory) {
    this.selectedSwitchWordCategory.set(category);
    this.navigateTo('switchWords');
  }

  navigateToMoreLink(link: string) {
    if (link === 'Youtube Videos') {
      this.navigateTo('sacredTeachings');
    }
    // Other links can be handled here
  }
  
  // Pre-bound functions for child component inputs
  goBackFn = this.goBack.bind(this);
  navigateToSwitchWordsFromGuidanceFn = this.navigateToSwitchWordsFromGuidance.bind(this);
}
