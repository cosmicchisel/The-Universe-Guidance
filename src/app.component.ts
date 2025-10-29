import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { PalmReadingComponent } from './components/palm-reading/palm-reading.component';
import { KundaliComponent } from './components/kundali/kundali.component';
import { VoiceAssistantComponent } from './components/voice-assistant/voice-assistant.component';
import { EmotionGuidanceComponent } from './components/emotion-guidance/emotion-guidance.component';
import { MantraSoundscapeComponent } from './components/mantra-soundscape/mantra-soundscape.component';
import { SacredTeachingsComponent } from './components/sacred-teachings/sacred-teachings.component';

export type Page = 'home' | 'dailyHoroscope' | 'calendar' | 'emotions' | 'more' | 'switchWords' | 'palmReading' | 'kundali' | 'emotionGuidance' | 'mantraSoundscape' | 'sacredTeachings';
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
  id: Exclude<Page, 'dailyHoroscope' | 'palmReading' | 'kundali' | 'emotionGuidance' | 'mantraSoundscape' | 'sacredTeachings'>;
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
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PalmReadingComponent, KundaliComponent, VoiceAssistantComponent, EmotionGuidanceComponent, MantraSoundscapeComponent, SacredTeachingsComponent],
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
  
  moreLinks = ['Mantras', 'Youtube Videos', 'Share with Friends', 'Rate App', 'Privacy Policy'];

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
        { name: 'Om Shanti Om', sanskrit: 'ॐ शान्तिः ॐ', meaning: 'The universal sound, peace, the universal sound.', audioUrl: 'https://cdn.chosic.com/wp-content/uploads/2021/07/OM-Mantra-Chant-For-Meditation.mp3' }
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
    if (link === 'Mantras') {
      this.navigateTo('mantraSoundscape');
    } else if (link === 'Youtube Videos') {
      this.navigateTo('sacredTeachings');
    }
    // Other links can be handled here
  }
  
  // Pre-bound functions for child component inputs
  goBackFn = this.goBack.bind(this);
  navigateToSwitchWordsFromGuidanceFn = this.navigateToSwitchWordsFromGuidance.bind(this);
}
