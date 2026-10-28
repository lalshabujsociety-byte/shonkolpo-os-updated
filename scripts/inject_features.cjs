const fs = require('fs');

console.log('Injecting enhanced features into public/app.js...');
const appJsPath = 'public/app.js';
let src = fs.readFileSync(appJsPath, 'utf8');


// Define CARD_THEMES, getAutoTier, and helper utilities
const CARD_THEMES_CODE = `
/* ---------- Credit Card Themes & Gamification Engine ---------- */
const CARD_THEMES = {
  emerald: {
    id: 'emerald',
    name: 'এমারেল্ড',
    enName: 'Emerald Scholar',
    tag: 'Tier 1 — স্কলার',
    desc: 'সবুজ রত্নখচিত অনুপ্রেরণা',
    gradient: 'from-[#052e1f] via-[#094833] to-[#041a13]',
    border: 'border-emerald-500/40',
    glow: 'shadow-emerald-950/60',
    chip: 'from-amber-200 to-amber-400',
    text: 'text-emerald-100',
    accentText: 'text-emerald-300',
    accentBg: 'bg-emerald-500/20',
    accentBorder: 'border-emerald-400/30',
    chipContacts: '#f59e0b',
    isReward: false
  },
  mint: {
    id: 'mint',
    name: 'মিন্ট',
    enName: 'Fresh Mint',
    tag: 'ফ্রেশ ও ফোকাসড',
    desc: 'শান্ত ও সতেজ পড়াশোনার মেজাজ',
    gradient: 'from-[#063f35] via-[#0b5447] to-[#042520]',
    border: 'border-teal-400/40',
    glow: 'shadow-teal-950/60',
    chip: 'from-amber-200 to-amber-400',
    text: 'text-teal-100',
    accentText: 'text-teal-300',
    accentBg: 'bg-teal-500/20',
    accentBorder: 'border-teal-400/30',
    chipContacts: '#f59e0b',
    isReward: false
  },
  obsidian: {
    id: 'obsidian',
    name: 'অবসিডিয়ান',
    enName: 'Obsidian Black',
    tag: 'ডার্ক স্টিল্থ',
    desc: 'গভীর রাতের নিবিষ্ট সাধনা',
    gradient: 'from-[#090d16] via-[#111827] to-[#020617]',
    border: 'border-slate-700/60',
    glow: 'shadow-black/70',
    chip: 'from-amber-100 to-yellow-500',
    text: 'text-slate-100',
    accentText: 'text-slate-300',
    accentBg: 'bg-slate-700/30',
    accentBorder: 'border-slate-600/40',
    chipContacts: '#fbbf24',
    isReward: false
  },
  royal: {
    id: 'royal',
    name: 'রয়্যাল ব্লু',
    enName: 'Royal Blue',
    tag: 'রাজকীয় স্কাই',
    desc: 'আত্মবিশ্বাসী ও দৃঢ় সংকল্প',
    gradient: 'from-[#0b1f4c] via-[#152e6d] to-[#06102a]',
    border: 'border-blue-500/40',
    glow: 'shadow-blue-950/60',
    chip: 'from-amber-200 to-amber-400',
    text: 'text-blue-100',
    accentText: 'text-blue-300',
    accentBg: 'bg-blue-500/20',
    accentBorder: 'border-blue-400/30',
    chipContacts: '#f59e0b',
    isReward: false
  },
  burgundy: {
    id: 'burgundy',
    name: 'বার্গান্ডি',
    enName: 'Velvet Burgundy',
    tag: 'রক্তিম প্যাশন',
    desc: 'অধ্যবসায় ও অদম্য ইচ্ছাশক্তি',
    gradient: 'from-[#3b0b18] via-[#521323] to-[#20050d]',
    border: 'border-rose-600/40',
    glow: 'shadow-rose-950/60',
    chip: 'from-amber-200 to-amber-400',
    text: 'text-rose-100',
    accentText: 'text-rose-300',
    accentBg: 'bg-rose-500/20',
    accentBorder: 'border-rose-400/30',
    chipContacts: '#f59e0b',
    isReward: false
  },
  ocean: {
    id: 'ocean',
    name: 'ডিপ ওশান',
    enName: 'Deep Ocean / Sapphire',
    tag: 'Tier 2 — স্যাফায়ার (Level 6+ / 7-Day Streak)',
    desc: 'গভীর জ্ঞান ও নিরন্তর প্রবাহ',
    gradient: 'from-[#082f49] via-[#0c4a6e] to-[#041a29]',
    border: 'border-cyan-500/40',
    glow: 'shadow-cyan-950/60',
    chip: 'from-amber-200 to-amber-400',
    text: 'text-cyan-100',
    accentText: 'text-cyan-300',
    accentBg: 'bg-cyan-500/20',
    accentBorder: 'border-cyan-400/30',
    chipContacts: '#f59e0b',
    isReward: false
  },
  amethyst: {
    id: 'amethyst',
    name: 'অ্যামেথিস্ট',
    enName: 'Amethyst Purple',
    tag: 'মিস্টিক ভায়োলেট',
    desc: 'মেধা ও সৃজনশীলতার আভা',
    gradient: 'from-[#2e1065] via-[#431407] to-[#170535]',
    border: 'border-purple-500/40',
    glow: 'shadow-purple-950/60',
    chip: 'from-amber-200 to-amber-400',
    text: 'text-purple-100',
    accentText: 'text-purple-300',
    accentBg: 'bg-purple-500/20',
    accentBorder: 'border-purple-400/30',
    chipContacts: '#f59e0b',
    isReward: false
  },
  platinum: {
    id: 'platinum',
    name: 'প্ল্যাটিনাম',
    enName: 'Platinum Achiever',
    tag: 'Tier 3 — এলিট (Level 16+ বা ১৫ দিনের স্ট্রাইক)',
    desc: 'উচ্চমানের একাগ্রতা ও সাফল্য',
    gradient: 'from-[#1e293b] via-[#334155] to-[#0f172a]',
    border: 'border-slate-300/60',
    glow: 'shadow-slate-900/60',
    chip: 'from-slate-100 via-slate-200 to-slate-400',
    text: 'text-slate-100',
    accentText: 'text-slate-200',
    accentBg: 'bg-slate-400/20',
    accentBorder: 'border-slate-300/40',
    chipContacts: '#94a3b8',
    isReward: true,
    lockedInCustom: true,
    minLevel: 16,
    minStreak: 15
  },
  gold: {
    id: 'gold',
    name: 'ব্রোঞ্জ গোল্ড',
    enName: 'Bronze Gold Legend',
    tag: 'Tier 4 — গোল্ড লিজেন্ড (টানা ৩০ দিনের স্ট্রাইক)',
    desc: 'শীর্ষ ডেডিকেটেড শিক্ষার্থীদের সর্বোচ্চ সম্মাননা',
    gradient: 'from-[#45270c] via-[#633a12] to-[#241303]',
    border: 'border-amber-400/80',
    glow: 'shadow-amber-950/80',
    chip: 'from-amber-200 via-yellow-100 to-amber-400',
    text: 'text-amber-100',
    accentText: 'text-amber-300',
    accentBg: 'bg-amber-400/25',
    accentBorder: 'border-amber-400/50',
    chipContacts: '#b45309',
    isReward: true,
    lockedInCustom: true,
    minStreak: 30,
    minLevel: 1
  }
};

function getAutoTier(profile) {
  const streak = profile.streak || 0;
  const level = profile.level || 1;
  if (streak >= 30) {
    return {
      tierKey: 'gold',
      tierName: 'ব্রোঞ্জ গোল্ড লিজেন্ড',
      enTier: 'Bronze Gold Legend',
      badge: '🏆 GOLD LEGEND',
      color: 'gold',
      isGold: true,
      streakSavers: 2
    };
  }
  if (level >= 16 || streak >= 15) {
    return {
      tierKey: 'platinum',
      tierName: 'প্ল্যাটিনাম এলিট',
      enTier: 'Platinum Achiever',
      badge: '💎 PLATINUM ELITE',
      color: 'platinum',
      isGold: false
    };
  }
  if (level >= 6 || streak >= 7) {
    return {
      tierKey: 'ocean',
      tierName: 'স্যাফায়ার স্কলার',
      enTier: 'Sapphire Scholar',
      badge: '🔷 SAPPHIRE SCHOLAR',
      color: 'ocean',
      isGold: false
    };
  }
  return {
    tierKey: 'emerald',
    tierName: 'এমারেল্ড স্কলার',
    enTier: 'Emerald Scholar',
    badge: '🌿 EMERALD SCHOLAR',
    color: 'emerald',
    isGold: false
  };
}

function getActiveCardTheme(profile) {
  const mode = profile.cardMode || 'auto';
  if (mode === 'auto') {
    const tier = getAutoTier(profile);
    return { ...CARD_THEMES[tier.color], isAuto: true, tierInfo: tier };
  }
  // In custom mode, bronze gold and platinum are strictly locked
  let color = profile.cardColor || 'emerald';
  if (color === 'gold' || color === 'platinum') {
    color = 'emerald';
  }
  const theme = CARD_THEMES[color] || CARD_THEMES.emerald;
  return { ...theme, isAuto: false, tierInfo: null };
}

function getTestedQuestionIds(state) {
  const set = new Set();
  (state.attempts || []).forEach(a => {
    if (a.pool) {
      a.pool.forEach(q => { if (q && q.id) set.add(q.id); });
    }
    if (a.answers) {
      Object.keys(a.answers).forEach(id => set.add(id));
    }
  });
  return set;
}

function getMistakenQuestionIds(state) {
  const set = new Set();
  (state.mistakeVault || []).forEach(mv => {
    if (mv && mv.mcq && mv.mcq.id) set.add(mv.mcq.id);
  });
  return set;
}
`;

if (!src.includes('const CARD_THEMES = {')) {
  // Insert before /* ---------- Storage ---------- */
  src = src.replace('/* ---------- Storage ---------- */', CARD_THEMES_CODE + '\n/* ---------- Storage ---------- */');
  console.log('Inserted CARD_THEMES and helper functions.');
}

fs.writeFileSync(appJsPath, src, 'utf8');
console.log('Saved CARD_THEMES update.');
