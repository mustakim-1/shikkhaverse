import { Language } from '../types';

export const translations = {
  [Language.ENGLISH]: {
    common: {
      dashboard: "Dashboard",
      classroom: "Classroom",
      aiMentor: "AI Mentor",
      exams: "Exams",
      community: "Community",
      skills: "Skills",
      profile: "Profile",
      subscription: "Subscription",
      knowledgeHub: "Knowledge Hub",
      parentDashboard: "Parent Dashboard",
      wellness: "Wellness",
      gamification: "Gamification",
      logout: "Logout",
      search: "Search...",
      notifications: "Notifications",
      points: "Points",
      level: "Level",
      welcome: "Welcome back",
      loading: "Loading..."
    },
    dashboard: {
      welcomeTitle: "Welcome back",
      dueAssignments: "assignments due today",
      liveClass: "live class starting soon",
      attendanceAlert: "Attendance Alert",
      viewReport: "View Report",
      personalizeFeed: "Personalize Feed",
      filterCurriculum: "Filter content by curriculum",
      allSystems: "All Systems",
      banglaMedium: "Bangla Medium",
      englishVersion: "English Version",
      englishMedium: "English Medium",
      madrasah: "Madrasah",
      allLevels: "All Levels",
      hsc: "HSC",
      ssc: "SSC",
      jsc: "JSC",
      oLevel: "O Level",
      aLevel: "A Level",
      class10: "Class 10",
      alim: "Alim",
      schedule: "Class Schedule",
      live: "LIVE",
      noClasses: "No classes found for this filter."
    }
  },
  [Language.BANGLA]: {
    common: {
      dashboard: "ড্যাশবোর্ড",
      classroom: "ক্লাসরুম",
      aiMentor: "এআই মেন্টর",
      exams: "পরীক্ষা",
      community: "কমিউনিটি",
      skills: "স্কিলস",
      profile: "প্রোফাইল",
      subscription: "সাবস্ক্রিপশন",
      knowledgeHub: "নলেজ হাব",
      parentDashboard: "প্যারেন্ট ড্যাশবোর্ড",
      wellness: "ওয়েলনেস",
      gamification: "গ্যামিফিকেশন",
      logout: "লগ আউট",
      search: "অনুসন্ধান...",
      notifications: "নোটিফিকেশন",
      points: "পয়েন্ট",
      level: "লেভেল",
      welcome: "স্বাগতম",
      loading: "লোড হচ্ছে..."
    },
    dashboard: {
      welcomeTitle: "স্বাগতম",
      dueAssignments: "টি অ্যাসাইনমেন্ট আজ জমা দিতে হবে",
      liveClass: "টি লাইভ ক্লাস শীঘ্রই শুরু হবে",
      attendanceAlert: "উপস্থিতি সতর্কতা",
      viewReport: "রিপোর্ট দেখুন",
      personalizeFeed: "ফিড ব্যক্তিগতকরণ",
      filterCurriculum: "কারিকুলাম অনুযায়ী ফিল্টার করুন",
      allSystems: "সব সিস্টেম",
      banglaMedium: "বাংলা মাধ্যম",
      englishVersion: "ইংরেজি ভার্সন",
      englishMedium: "ইংরেজি মাধ্যম",
      madrasah: "মাদ্রাসা",
      allLevels: "সব লেভেল",
      hsc: "এইচএসসি",
      ssc: "এসএসসি",
      jsc: "জেএসসি",
      oLevel: "ও লেভেল",
      aLevel: "এ লেভেল",
      class10: "দশম শ্রেণী",
      alim: "আলিম",
      schedule: "ক্লাস শিডিউল",
      live: "লাইভ",
      noClasses: "এই ফিল্টারের জন্য কোনো ক্লাস পাওয়া যায়নি।"
    }
  }
};

class TranslationService {
  private currentLanguage: Language = Language.ENGLISH;
  private listeners: ((lang: Language) => void)[] = [];

  setLanguage(lang: Language) {
    this.currentLanguage = lang;
    this.listeners.forEach(listener => listener(lang));
  }

  getLanguage(): Language {
    return this.currentLanguage;
  }

  subscribe(listener: (lang: Language) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  t(key: string): string {
    const keys = key.split('.');
    let result: any = translations[this.currentLanguage];
    
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        return key;
      }
    }
    
    return typeof result === 'string' ? result : key;
  }
}

export const translationService = new TranslationService();
