const fs = require('fs');

console.log('Building ultra-premium, minimalist UI in public/app.js...');
const appJsPath = 'public/app.js';
let src = fs.readFileSync(appJsPath, 'utf8');

// 1. UPDATE CARD_THEMES WITHOUT EMOJIS OR NOISY TEXT
const oldThemesStart = src.indexOf('/* ---------- Credit Card Themes & Gamification Engine ---------- */');
const oldThemesEnd = src.indexOf('function getTestedQuestionIds(state) {');

if (oldThemesStart !== -1 && oldThemesEnd !== -1) {
  const newThemesCode = `/* ---------- Credit Card Themes & Gamification Engine ---------- */
const CARD_THEMES = {
  emerald: {
    id: 'emerald',
    name: 'এমারেল্ড',
    enName: 'Emerald Scholar',
    tag: 'Tier 1 — স্কলার',
    gradient: 'from-[#042419] via-[#073d2a] to-[#02140e]',
    border: 'border-emerald-500/30',
    glow: 'shadow-emerald-950/40',
    chip: 'from-amber-200 to-amber-400',
    text: 'text-emerald-100',
    accentText: 'text-emerald-300',
    accentBg: 'bg-emerald-500/15',
    accentBorder: 'border-emerald-400/20',
    isReward: false
  },
  mint: {
    id: 'mint',
    name: 'মিন্ট',
    enName: 'Fresh Mint',
    tag: 'ফ্রেশ ও ফোকাসড',
    gradient: 'from-[#04332b] via-[#08473c] to-[#021d18]',
    border: 'border-teal-400/30',
    glow: 'shadow-teal-950/40',
    chip: 'from-amber-200 to-amber-400',
    text: 'text-teal-100',
    accentText: 'text-teal-300',
    accentBg: 'bg-teal-500/15',
    accentBorder: 'border-teal-400/20',
    isReward: false
  },
  obsidian: {
    id: 'obsidian',
    name: 'অবসিডিয়ান',
    enName: 'Obsidian Black',
    tag: 'ডার্ক স্টিল্থ',
    gradient: 'from-[#090d16] via-[#111827] to-[#020617]',
    border: 'border-slate-700/50',
    glow: 'shadow-black/60',
    chip: 'from-amber-100 to-yellow-500',
    text: 'text-slate-100',
    accentText: 'text-slate-300',
    accentBg: 'bg-slate-700/20',
    accentBorder: 'border-slate-600/30',
    isReward: false
  },
  royal: {
    id: 'royal',
    name: 'রয়্যাল ব্লু',
    enName: 'Royal Blue',
    tag: 'রয়্যাল ব্লু',
    gradient: 'from-[#08183a] via-[#102454] to-[#040c1f]',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-950/50',
    chip: 'from-amber-200 to-amber-400',
    text: 'text-blue-100',
    accentText: 'text-blue-300',
    accentBg: 'bg-blue-500/15',
    accentBorder: 'border-blue-400/20',
    isReward: false
  },
  burgundy: {
    id: 'burgundy',
    name: 'বার্গান্ডি',
    enName: 'Velvet Burgundy',
    tag: 'বার্গান্ডি রেড',
    gradient: 'from-[#330814] via-[#470f1e] to-[#1c030a]',
    border: 'border-rose-600/30',
    glow: 'shadow-rose-950/50',
    chip: 'from-amber-200 to-amber-400',
    text: 'text-rose-100',
    accentText: 'text-rose-300',
    accentBg: 'bg-rose-500/15',
    accentBorder: 'border-rose-400/20',
    isReward: false
  },
  gold: {
    id: 'gold',
    name: 'ব্রোঞ্জ গোল্ড',
    enName: 'Bronze Gold Legend',
    tag: 'Tier 4 — গোল্ড লিজেন্ড (৩০ দিন স্ট্রাইক)',
    gradient: 'from-[#3b2009] via-[#54300e] to-[#1e1003]',
    border: 'border-amber-400/60',
    glow: 'shadow-amber-950/60',
    chip: 'from-amber-200 via-yellow-100 to-amber-400',
    text: 'text-amber-100',
    accentText: 'text-amber-300',
    accentBg: 'bg-amber-400/20',
    accentBorder: 'border-amber-400/40',
    isReward: true,
    lockedInCustom: true,
    minStreak: 30,
    minLevel: 1
  },
  amethyst: {
    id: 'amethyst',
    name: 'অ্যামেথিস্ট',
    enName: 'Amethyst Purple',
    tag: 'অ্যামেথিস্ট',
    gradient: 'from-[#240c4f] via-[#351470] to-[#120529]',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-950/50',
    chip: 'from-amber-200 to-amber-400',
    text: 'text-purple-100',
    accentText: 'text-purple-300',
    accentBg: 'bg-purple-500/15',
    accentBorder: 'border-purple-400/20',
    isReward: false
  },
  ocean: {
    id: 'ocean',
    name: 'ডিপ ওশান',
    enName: 'Deep Ocean',
    tag: 'Tier 2 — স্যাফায়ার (Level 6+ / 7 দিন)',
    gradient: 'from-[#052338] via-[#093757] to-[#02131f]',
    border: 'border-cyan-500/30',
    glow: 'shadow-cyan-950/50',
    chip: 'from-amber-200 to-amber-400',
    text: 'text-cyan-100',
    accentText: 'text-cyan-300',
    accentBg: 'bg-cyan-500/15',
    accentBorder: 'border-cyan-400/20',
    isReward: false
  },
  platinum: {
    id: 'platinum',
    name: 'প্ল্যাটিনাম',
    enName: 'Platinum Achiever',
    tag: 'Tier 3 — এলিট (Level 16+ / ১৫ দিন)',
    gradient: 'from-[#172033] via-[#24324a] to-[#0b101c]',
    border: 'border-slate-300/40',
    glow: 'shadow-slate-900/50',
    chip: 'from-slate-100 via-slate-200 to-slate-400',
    text: 'text-slate-100',
    accentText: 'text-slate-200',
    accentBg: 'bg-slate-400/15',
    accentBorder: 'border-slate-300/30',
    isReward: true,
    lockedInCustom: true,
    minLevel: 16,
    minStreak: 15
  }
};

function getAutoTier(profile) {
  const streak = profile.streak || 0;
  const level = profile.level || 1;
  if (streak >= 30) {
    return {
      tierKey: 'gold',
      tierName: 'ব্রোঞ্জ গোল্ড',
      enTier: 'Bronze Gold Legend',
      badge: 'GOLD LEGEND',
      color: 'gold',
      isGold: true,
      streakSavers: 2
    };
  }
  if (level >= 16 || streak >= 15) {
    return {
      tierKey: 'platinum',
      tierName: 'প্ল্যাটিনাম',
      enTier: 'Platinum Achiever',
      badge: 'PLATINUM ELITE',
      color: 'platinum',
      isGold: false
    };
  }
  if (level >= 6 || streak >= 7) {
    return {
      tierKey: 'ocean',
      tierName: 'ডিপ ওশান',
      enTier: 'Sapphire Scholar',
      badge: 'SAPPHIRE',
      color: 'ocean',
      isGold: false
    };
  }
  return {
    tierKey: 'emerald',
    tierName: 'এমারেল্ড',
    enTier: 'Emerald Scholar',
    badge: 'EMERALD',
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
  let color = profile.cardColor || 'emerald';
  if (color === 'gold' || color === 'platinum') {
    color = 'emerald';
  }
  const theme = CARD_THEMES[color] || CARD_THEMES.emerald;
  return { ...theme, isAuto: false, tierInfo: null };
}

`;
  src = src.slice(0, oldThemesStart) + newThemesCode + src.slice(oldThemesEnd);
  console.log('1. Cleaned CARD_THEMES & getAutoTier (no emojis).');
}


// 2. REBUILD CREDITCARD, CARDTHEMEMODAL & LEVELUP MODAL WITHOUT EMOJIS
const oldCardBlockStart = src.indexOf('function CreditCard({');
const oldCardBlockEnd = src.indexOf('function Dashboard({');

if (oldCardBlockStart !== -1 && oldCardBlockEnd !== -1) {
  const newCardBlock = `function CreditCard({ profile, onOpenCustomizer, onUseStreakSaver }) {
  const theme = getActiveCardTheme(profile);
  const streak = profile.streak || 0;
  const level = profile.level || 1;
  const xp = profile.xp || 0;
  const need = xpForLevel(level);
  const progressPercent = Math.min(100, Math.round((xp / need) * 100));
  const isAuto = (profile.cardMode || 'auto') === 'auto';
  const saversLeft = profile.streakSavers !== undefined ? profile.streakSavers : 2;
  const cardNumber = '•••• •••• •••• ' + (2025 + (level % 5));

  return /*#__PURE__*/React.createElement("div", {
    className: "w-full my-2 transition-all duration-300"
  }, /*#__PURE__*/React.createElement("div", {
    className: \`relative overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-7 bg-gradient-to-br \${theme.gradient} border \${theme.border} \${theme.glow} shadow-xl transition-all duration-300 hover:shadow-2xl\`
  },
    /* Subtle decorative lighting glow */
    /*#__PURE__*/React.createElement("div", {
      className: "absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white/[0.04] blur-2xl pointer-events-none"
    }),
    /*#__PURE__*/React.createElement("div", {
      className: "absolute -left-16 -bottom-16 w-56 h-56 rounded-full bg-black/20 blur-2xl pointer-events-none"
    }),

    /* Top Row: EMV Chip + NFC & Brand/Mode */
    /*#__PURE__*/React.createElement("div", {
      className: "relative flex items-center justify-between mb-6"
    },
      /* Left: Minimalist Metallic Chip & Contactless Waves */
      /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-3"
      },
        /* EMV Chip */
        /*#__PURE__*/React.createElement("div", {
          className: \`w-11 h-8 rounded-md bg-gradient-to-tr \${theme.chip} p-0.5 shadow-sm border border-amber-300/30 flex flex-col justify-between overflow-hidden opacity-90\`
        },
          /*#__PURE__*/React.createElement("div", { className: "w-full h-[1px] bg-amber-950/30" }),
          /*#__PURE__*/React.createElement("div", { className: "w-full h-2 border-y border-amber-950/25 flex justify-between px-0.5" },
            /*#__PURE__*/React.createElement("div", { className: "w-2 h-full border-r border-amber-950/25" }),
            /*#__PURE__*/React.createElement("div", { className: "w-2 h-full border-l border-amber-950/25" })
          ),
          /*#__PURE__*/React.createElement("div", { className: "w-full h-[1px] bg-amber-950/30" })
        ),
        /* Minimal Contactless Indicator */
        /*#__PURE__*/React.createElement("div", {
          className: "text-white/40 text-sm font-mono tracking-tighter select-none rotate-90",
          title: "Contactless Vault"
        }, "(((")
      ),

      /* Right: Brand and Theme Button */
      /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-2"
      },
        /* Brand */
        /*#__PURE__*/React.createElement("span", {
          className: "text-white/80 font-semibold tracking-wider text-xs font-bn"
        }, BRAND),
        /* Customizer Trigger Button */
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: onOpenCustomizer,
          className: "p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition active:scale-95",
          title: "কার্ড থিম পরিবর্তন"
        },
          /*#__PURE__*/React.createElement(Icon, { name: "sliders", size: 14 })
        )
      )
    ),

    /* Middle Row: Card Number and Level Progress */
    /*#__PURE__*/React.createElement("div", {
      className: "relative my-3"
    },
      /* Number */
      /*#__PURE__*/React.createElement("div", {
        className: "font-mono text-white/60 text-xs sm:text-sm tracking-[0.25em] mb-3 select-all"
      }, cardNumber),

      /* Minimal Level & XP Progress */
      /*#__PURE__*/React.createElement("div", {
        className: "space-y-1.5"
      },
        /*#__PURE__*/React.createElement("div", {
          className: "flex items-center justify-between text-[11px] text-white/70"
        },
          /*#__PURE__*/React.createElement("span", { className: "font-medium font-bn" },
            "লেভেল ", level, " · ", isAuto && theme.tierInfo ? theme.tierInfo.badge : theme.enName
          ),
          /*#__PURE__*/React.createElement("span", { className: "font-mono opacity-80" }, xp, " / ", need, " XP")
        ),
        /* Progress Track */
        /*#__PURE__*/React.createElement("div", {
          className: "w-full h-1 rounded-full bg-white/15 overflow-hidden"
        },
          /*#__PURE__*/React.createElement("div", {
            className: "h-full bg-white/80 rounded-full transition-all duration-500",
            style: { width: progressPercent + '%' }
          })
        )
      )
    ),

    /* Bottom Row: Cardholder Name, Streak Counter & Savers */
    /*#__PURE__*/React.createElement("div", {
      className: "relative flex flex-wrap items-end justify-between gap-3 pt-4 border-t border-white/10 mt-4"
    },
      /* Cardholder */
      /*#__PURE__*/React.createElement("div", null,
        /*#__PURE__*/React.createElement("div", {
          className: "text-[9px] uppercase tracking-widest text-white/40 font-medium"
        }, "CARDHOLDER"),
        /*#__PURE__*/React.createElement("div", {
          className: "font-medium text-white tracking-wide text-sm sm:text-base font-bn uppercase truncate max-w-[200px]"
        }, profile.name || 'শিক্ষার্থী (ACHIEVER)')
      ),

      /* Streak & Saver Pills */
      /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-2"
      },
        /* Streak Counter */
        /*#__PURE__*/React.createElement("div", {
          className: "flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-white text-xs font-medium"
        },
          /*#__PURE__*/React.createElement(Icon, { name: "flame", size: 14, className: streak >= 30 ? "text-amber-400" : "text-amber-300" }),
          /*#__PURE__*/React.createElement("span", { className: "font-bold font-mono" }, streak),
          /*#__PURE__*/React.createElement("span", { className: "text-[10px] text-white/60 font-bn" }, "দিন")
        ),

        /* Streak Saver Button */
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: onUseStreakSaver,
          className: \`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition active:scale-95 \${saversLeft > 0 ? 'bg-white/10 hover:bg-white/20 border-white/15 text-white/90' : 'bg-black/20 border-white/5 text-white/40'}\`,
          title: "স্ট্রাইক সেভার স্ট্যাটাস"
        },
          /*#__PURE__*/React.createElement(Icon, { name: "shield-check", size: 13, className: saversLeft > 0 ? "text-emerald-400" : "text-white/40" }),
          /*#__PURE__*/React.createElement("span", { className: "text-[11px]" }, saversLeft, " সেভার")
        )
      )
    )
  ));
}

/* Modal for Customizing Home Card (Matching Screenshot exactly, Zero Emojis) */
function CardThemeModal({ open, onClose, profile, dispatch }) {
  if (!open) return null;
  const currentMode = profile.cardMode || 'auto';
  const currentColor = profile.cardColor || 'emerald';
  const autoTier = getAutoTier(profile);

  function handleSelectMode(m) {
    dispatch({
      type: 'SET_CARD_PREF',
      patch: { cardMode: m }
    });
    toast(m === 'auto' ? 'অটোমেটিক রিওয়ার্ড মোড চালু হয়েছে' : 'কাস্টম কালার মোড চালু হয়েছে', 'success');
  }

  function handleSelectColor(colorKey) {
    if (colorKey === 'gold' || colorKey === 'platinum') {
      toast('ব্রোঞ্জ গোল্ড ও প্ল্যাটিনাম শুধুমাত্র অটোমেটিক রিওয়ার্ড মোডে অর্জিত হলে ব্যবহারযোগ্য।', 'error');
      return;
    }
    dispatch({
      type: 'SET_CARD_PREF',
      patch: { cardColor: colorKey, cardMode: 'custom' }
    });
    toast('কার্ডের রঙ আপডেট হয়েছে', 'success');
  }

  return /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: onClose,
    title: "হোম কার্ডের প্রিমিয়াম রঙ",
    wide: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-5"
  },
    /* Segmented Mode Control */
    /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
    },
      /* Auto Mode */
      /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: () => handleSelectMode('auto'),
        className: \`py-2 px-3 rounded-lg text-xs font-semibold font-bn transition \${currentMode === 'auto' ? 'bg-white dark:bg-slate-900 text-brand-700 dark:text-brand-300 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}\`
      }, "অটোমেটিক রিওয়ার্ড মোড"),
      /* Custom Mode */
      /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: () => handleSelectMode('custom'),
        className: \`py-2 px-3 rounded-lg text-xs font-semibold font-bn transition \${currentMode === 'custom' ? 'bg-white dark:bg-slate-900 text-brand-700 dark:text-brand-300 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}\`
      }, "কাস্টম কালার মোড")
    ),

    /* Minimalist Info Banner */
    /*#__PURE__*/React.createElement("div", {
      className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-bn"
    },
      currentMode === 'auto'
        ? \`বর্তমান স্ট্যাটাস: \${autoTier.tierName} (\${autoTier.badge})। টানা ৩০ দিন সক্রিয় থাকলে ব্রোঞ্জ গোল্ড ও ২ টি মাসিক স্ট্রাইক সেভার আনলক হবে।\`
        : "কাস্টম মোডে আপনার পছন্দমতো রঙ নির্বাচন করুন। ব্রোঞ্জ গোল্ড ও প্ল্যাটিনাম শুধুমাত্র অটো রিওয়ার্ড মোডে আনলক হয়।"
    ),

    /* 3x3 Color Swatches Grid matching Screenshot */
    /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-3 gap-3"
    },
      Object.keys(CARD_THEMES).map(key => {
        const t = CARD_THEMES[key];
        const isSelected = currentMode === 'auto' ? autoTier.color === key : currentColor === key;
        const isLocked = currentMode === 'custom' && t.lockedInCustom;

        return /*#__PURE__*/React.createElement("button", {
          key: key,
          type: "button",
          disabled: isLocked,
          onClick: () => handleSelectColor(key),
          className: \`relative flex flex-col items-center justify-between p-3 rounded-2xl border transition-all \${isSelected ? 'border-slate-900 dark:border-white shadow-sm ring-1 ring-slate-900 dark:ring-white' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'} \${isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}\`
        },
          /* Swatch Pill */
          /*#__PURE__*/React.createElement("div", {
            className: \`w-full h-11 sm:h-12 rounded-xl bg-gradient-to-r \${t.gradient} shadow-sm flex items-center justify-center relative\`
          },
            isSelected && /*#__PURE__*/React.createElement(Icon, {
              name: "check",
              size: 20,
              className: "text-emerald-400 stroke-[2.5]"
            }),
            isLocked && /*#__PURE__*/React.createElement(Icon, {
              name: "lock",
              size: 16,
              className: "text-amber-300"
            })
          ),
          /* Swatch Title */
          /*#__PURE__*/React.createElement("span", {
            className: \`mt-2 text-xs font-semibold font-bn \${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}\`
          }, t.name)
        );
      })
    ),

    /* Footer Button */
    /*#__PURE__*/React.createElement("div", {
      className: "flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800"
    },
      /*#__PURE__*/React.createElement(Btn, {
        onClick: onClose,
        className: "px-6"
      }, "সম্পন্ন")
    )
  ));
}

/* Minimalist Level Up Celebration Modal */
function LevelUpCelebrationModal({ modal, onClose }) {
  if (!modal) return null;

  return /*#__PURE__*/React.createElement(Modal, {
    open: true,
    onClose: onClose,
    title: "মাইলফলক অর্জিত"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center py-4 space-y-3"
  },
    /* Icon */
    /*#__PURE__*/React.createElement("div", {
      className: "w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center"
    },
      /*#__PURE__*/React.createElement(Icon, { name: "award", size: 28 })
    ),
    /* Title */
    /*#__PURE__*/React.createElement("div", null,
      /*#__PURE__*/React.createElement("h3", {
        className: "text-lg font-bold font-bn text-slate-900 dark:text-white"
      }, modal.title || "অভিনন্দন! নতুন লেভেল অর্জিত হয়েছে"),
      /*#__PURE__*/React.createElement("p", {
        className: "text-xs text-slate-500 mt-1 max-w-sm mx-auto"
      }, modal.message || "ধারাবাহিক পড়াশোনার মাধ্যমে আপনার হোম কার্ড উন্নীত হয়েছে।")
    ),
    /* Tier badge */
    modal.tierName && /*#__PURE__*/React.createElement("div", {
      className: "inline-block px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold font-bn text-slate-800 dark:text-slate-200"
    }, modal.tierName),
    /* Action */
    /*#__PURE__*/React.createElement("div", { className: "pt-2" },
      /*#__PURE__*/React.createElement(Btn, {
        onClick: onClose,
        className: "w-full py-2.5 font-bold"
      }, "ধন্যবাদ")
    )
  ));
}
`;
  src = src.slice(0, oldCardBlockStart) + newCardBlock + src.slice(oldCardBlockEnd);
  console.log('2. Rebuilt CreditCard, CardThemeModal, and LevelUpModal (ultra-minimalist, no emojis).');
}


// 3. CLEAN UP EXAMVIEW DROPDOWNS & BADGES (REMOVE EMOJIS)
src = src.replace('value: "all" }, "📚 সব প্রশ্ন (All Questions)"', 'value: "all" }, "সব প্রশ্ন (All Questions)"');
src = src.replace('value: "untested" }, "🆕 এখনো টেস্ট নেওয়া হয়নি (Untested Only)"', 'value: "untested" }, "নতুন প্রশ্ন (Untested Only)"');
src = src.replace('value: "due" }, "🔄 রিভিশন বাকি / ডিউ (Due for Review)"', 'value: "due" }, "রিভিশন বাকি / ডিউ (Due)"');
src = src.replace('value: "mistakes" }, "⚠️ ভুল হওয়া প্রশ্নসমূহ (Mistakes Vault)"', 'value: "mistakes" }, "ভুল হওয়া প্রশ্নসমূহ (Mistakes)"');


// 4. CLEAN UP FLASHCARDSVIEW & STUDYRUNNER (REMOVE EMOJIS, SLEEK LUCIDE ICONS)
src = src.replace('value: "all" }, "সব কার্ড (All Cards)"', 'value: "all" }, "সব কার্ড"');
src = src.replace('value: "untested" }, "🆕 এখনো পড়া হয়নি (Untested Only)"', 'value: "untested" }, "নতুন কার্ড (পড়া হয়নি)"');
src = src.replace('value: "due" }, "🔄 রিভিশন বাকি / ডিউ (Due for Review)"', 'value: "due" }, "রিভিশন বাকি / ডিউ"');
src = src.replace('value: "hard" }, "⚠️ কঠিন চিহ্নিত কার্ড (Hard Cards Only)"', 'value: "hard" }, "কঠিন কার্ডসমূহ"');
src = src.replace('value: "shuffle" }, "🔀 র‍্যান্ডম / এলোমেলো (Shuffled)"', 'value: "shuffle" }, "র‍্যান্ডম (Shuffled)"');
src = src.replace('value: "seq" }, "📋 ক্রমানুসারে (Sequential)"', 'value: "seq" }, "ক্রমানুসারে (Sequential)"');
src = src.replace('/*#__PURE__*/React.createElement("span", null, "🎓 সেলফ-স্টাডি মোড শুরু")', '/*#__PURE__*/React.createElement("span", null, "স্টাডি সেশন")');
src = src.replace('/*#__PURE__*/React.createElement("span", null, "⏱️ ফ্ল্যাশকার্ড এক্সাম মোড")', '/*#__PURE__*/React.createElement("span", null, "ফ্ল্যাশকার্ড এক্সাম")');
src = src.replace('title: "🎯 কাস্টম ফ্ল্যাশকার্ড সেশন ও এক্সাম"', 'title: "ফ্ল্যাশকার্ড সেশন কনফিগারেশন"');
src = src.replace('title: "🎉 ফ্ল্যাশকার্ড সেশন সম্পন্ন!"', 'title: "ফ্ল্যাশকার্ড সেশন সম্পন্ন"');
src = src.replace('/*#__PURE__*/React.createElement("span", null, mode === \'exam\' ? \'⏱️ ফ্ল্যাশকার্ড এক্সাম\' : \'🎓 ফ্ল্যাশকার্ড স্টাডি\')',
  '/*#__PURE__*/React.createElement("span", null, mode === \'exam\' ? \'ফ্ল্যাশকার্ড এক্সাম\' : \'ফ্ল্যাশকার্ড স্টাডি\')');

// Clean up StudyRunner rating buttons (replace emojis with clean Lucide icons and sleek subtle styling)
const oldStudyGradingRegex = /\/\* Again \*\/[\s\S]*?\/\* Easy \*\/[\s\S]*?className:\s*\"text-\[10px\] opacity-75 mt-0\.5\"\s*\}, \"৭ দিন\"\)\s*\)/;

const newStudyGrading = `/* Again (1) */
        /*#__PURE__*/React.createElement("button", {
          onClick: () => grade(0),
          className: "flex flex-col items-center justify-center py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-rose-300 transition active:scale-95 font-bn"
        },
          /*#__PURE__*/React.createElement(Icon, { name: "rotate-ccw", size: 16 }),
          /*#__PURE__*/React.createElement("span", { className: "text-xs font-semibold mt-1" }, "আবার"),
          /*#__PURE__*/React.createElement("span", { className: "text-[10px] text-slate-400 opacity-70" }, "১মি.")
        ),
        /* Hard (2) */
        /*#__PURE__*/React.createElement("button", {
          onClick: () => grade(1),
          className: "flex flex-col items-center justify-center py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 transition active:scale-95 font-bn"
        },
          /*#__PURE__*/React.createElement(Icon, { name: "alert-circle", size: 16 }),
          /*#__PURE__*/React.createElement("span", { className: "text-xs font-semibold mt-1" }, "কঠিন"),
          /*#__PURE__*/React.createElement("span", { className: "text-[10px] text-slate-400 opacity-70" }, "১দিন")
        ),
        /* Good (3) */
        /*#__PURE__*/React.createElement("button", {
          onClick: () => grade(2),
          className: "flex flex-col items-center justify-center py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-300 transition active:scale-95 font-bn"
        },
          /*#__PURE__*/React.createElement(Icon, { name: "check", size: 16 }),
          /*#__PURE__*/React.createElement("span", { className: "text-xs font-semibold mt-1" }, "পেরেছি"),
          /*#__PURE__*/React.createElement("span", { className: "text-[10px] text-slate-400 opacity-70" }, "৩দিন")
        ),
        /* Easy (4) */
        /*#__PURE__*/React.createElement("button", {
          onClick: () => grade(3),
          className: "flex flex-col items-center justify-center py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sky-300 transition active:scale-95 font-bn"
        },
          /*#__PURE__*/React.createElement(Icon, { name: "sparkles", size: 16 }),
          /*#__PURE__*/React.createElement("span", { className: "text-xs font-semibold mt-1" }, "সহজ"),
          /*#__PURE__*/React.createElement("span", { className: "text-[10px] text-slate-400 opacity-70" }, "৭দিন")
        )`;

if (oldStudyGradingRegex.test(src)) {
  src = src.replace(oldStudyGradingRegex, newStudyGrading);
  console.log('4. Cleaned StudyRunner rating buttons (Lucide icons, no emojis).');
}


// 5. CLEAN UP TIMERVIEW (REMOVE EMOJIS, MINIMALIST PRESETS & SOUNDS)
src = src.replace('}, "🍅 পোমোডোরো")', '}, "পোমোডোরো")');
src = src.replace('}, "⏱️ স্টপওয়াচ")', '}, "স্টপওয়াচ")');
src = src.replace('mode === \'work\' ? \'🎯 পড়াশোনা চলছে (DEEP FOCUS)\' :', 'mode === \'work\' ? \'পড়াশোনা চলছে\' :');
src = src.replace('mode === \'break\' ? \'☕ বিরতি সময় (RECHARGE)\' :', 'mode === \'break\' ? \'বিরতি সময়\' :');
src = src.replace('mode === \'running\' ? \'⏱️ স্টপওয়াচ কাউন্টিং\' :', 'mode === \'running\' ? \'স্টপওয়াচ চলছে\' :');
src = src.replace('{ m: 25, label: "🍅 ২৫ মি. পোমোডোরো" }', '{ m: 25, label: "২৫ মি." }');
src = src.replace('{ m: 45, label: "⚡ ৪৫ মি. ডিপ ফোকাস" }', '{ m: 45, label: "৪৫ মি." }');
src = src.replace('{ m: 60, label: "🎯 ৬০ মি. ম্যারাথন" }', '{ m: 60, label: "৬০ মি." }');
src = src.replace('{ m: 5, label: "☕ ৫ মি. ব্রেক" }', '{ m: 5, label: "৫ মি. ব্রেক" }');
src = src.replace('{ m: 15, label: "🌴 ১৫ মি. লং ব্রেক" }', '{ m: 15, label: "১৫ মি. ব্রেক" }');

src = src.replace('{ id: \'off\', label: \'🔇 বন্ধ\' }', '{ id: \'off\', label: \'বন্ধ\', icon: \'volume-x\' }');
src = src.replace('{ id: \'white\', label: \'🌫️ হোয়াইট নয়েজ\' }', '{ id: \'white\', label: \'হোয়াইট নয়েজ\', icon: \'wind\' }');
src = src.replace('{ id: \'brown\', label: \'☕ ব্রাউন নয়েজ\' }', '{ id: \'brown\', label: \'ব্রাউন নয়েজ\', icon: \'coffee\' }');
src = src.replace('{ id: \'focus\', label: \'⚡ আলফা ওয়েভস\' }', '{ id: \'focus\', label: \'আলফা ওয়েভস\', icon: \'zap\' }');
src = src.replace('{ id: \'relax\', label: \'🌊 কাম ওয়েভস\' }', '{ id: \'relax\', label: \'কাম ওয়েভস\', icon: \'waves\' }');


// 6. CLEAN UP SETTINGSVIEW TYPOGRAPHY (NO EMOJIS, CLEAN APPLE/LINEAR STYLE)
src = src.replace('<span>মোড ১: অটো রিওয়ার্ড সিস্টেম</span>', '<span>মোড ১: অটো রিওয়ার্ড</span>');
src = src.replace('<span>মোড ২: কাস্টম কালার মোড</span>', '<span>মোড ২: কাস্টম কালার</span>');
src = src.replace('<span>🏆 গোল্ড লিজেন্ড ও ডিমোশন সিস্টেমের নিয়ম:</span>', '<span>গোল্ড লিজেন্ড ও ডিমোশন নিয়ম:</span>');
src = src.replace('ℹ️ কাস্টম মোডে ব্রোঞ্জ গোল্ড ও প্ল্যাটিনাম লক করা থাকে', 'কাস্টম মোডে ব্রোঞ্জ গোল্ড ও প্ল্যাটিনাম লক করা থাকে');


fs.writeFileSync(appJsPath, src, 'utf8');
console.log('Successfully completed rebuild_premium_ui.');
