const fs = require('fs');

console.log('Patching components in public/app.js...');
let src = fs.readFileSync('public/app.js', 'utf8');

// 1. CreditCard and Celebration Modal Component
const CREDIT_CARD_COMPONENT = `
/* ---------- Premium Credit Card & Gamification Modal ---------- */
function CreditCard({ profile, onOpenCustomizer, onUseStreakSaver }) {
  const theme = getActiveCardTheme(profile);
  const streak = profile.streak || 0;
  const level = profile.level || 1;
  const xp = profile.xp || 0;
  const need = xpForLevel(level);
  const progressPercent = Math.min(100, Math.round((xp / need) * 100));
  const isAuto = (profile.cardMode || 'auto') === 'auto';
  const saversLeft = profile.streakSavers !== undefined ? profile.streakSavers : 2;

  // Masked student card number
  const cardNumber = '•••• •••• •••• ' + (2025 + (level % 5));

  return /*#__PURE__*/React.createElement("div", {
    className: "w-full my-1 transition-all duration-300"
  }, /*#__PURE__*/React.createElement("div", {
    className: \`relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-br \${theme.gradient} border-2 \${theme.border} \${theme.glow} shadow-2xl transition-all duration-500 hover:scale-[1.01] group\`
  },
    /* Decorative Holographic Shimmer & Grid overlay */
    /*#__PURE__*/React.createElement("div", {
      className: "absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"
    }),
    /*#__PURE__*/React.createElement("div", {
      className: "absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none"
    }),
    /*#__PURE__*/React.createElement("div", {
      className: "absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none"
    }),

    /* Top Row: Chip, Contactless Icon, and Brand / Tier */
    /*#__PURE__*/React.createElement("div", {
      className: "relative flex items-center justify-between mb-5"
    },
      /* Left: EMV Chip + NFC Symbol */
      /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-3"
      },
        /* Gold/Silver Metallic EMV Chip */
        /*#__PURE__*/React.createElement("div", {
          className: \`w-12 h-9 rounded-lg bg-gradient-to-tr \${theme.chip} p-1 shadow-md border border-amber-300/40 relative flex flex-col justify-between overflow-hidden\`
        },
          /* Chip circuits */
          /*#__PURE__*/React.createElement("div", { className: "w-full h-[1px] bg-amber-900/40" }),
          /*#__PURE__*/React.createElement("div", { className: "w-full h-2.5 border-y border-amber-900/30 flex justify-between px-1" },
            /*#__PURE__*/React.createElement("div", { className: "w-2.5 h-full border-r border-amber-900/30" }),
            /*#__PURE__*/React.createElement("div", { className: "w-2.5 h-full border-l border-amber-900/30" })
          ),
          /*#__PURE__*/React.createElement("div", { className: "w-full h-[1px] bg-amber-900/40" })
        ),
        /* Contactless wave icon */
        /*#__PURE__*/React.createElement("div", {
          className: "text-white/60 text-lg font-mono tracking-tighter select-none rotate-90",
          title: "Contactless Vault Access"
        }, "(((")
      ),

      /* Right: Brand and Mode Chip */
      /*#__PURE__*/React.createElement("div", {
        className: "flex flex-col items-end gap-1.5"
      },
        /*#__PURE__*/React.createElement("div", {
          className: "flex items-center gap-1.5 text-white/90 font-semibold tracking-wide text-sm font-bn"
        },
          /*#__PURE__*/React.createElement(Logo, { size: 20 }),
          /*#__PURE__*/React.createElement("span", null, BRAND)
        ),
        /* Mode Indicator / Switcher button */
        /*#__PURE__*/React.createElement("button", {
          onClick: onOpenCustomizer,
          className: \`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium backdrop-blur-md \${theme.accentBg} \${theme.accentText} border \${theme.accentBorder} transition hover:bg-white/20 active:scale-95\`,
          title: "কার্ডের মোড ও রঙ পরিবর্তন করুন"
        },
          /*#__PURE__*/React.createElement(Icon, { name: isAuto ? "sparkles" : "palette", size: 12 }),
          /*#__PURE__*/React.createElement("span", null, isAuto ? "অটো রিওয়ার্ড মোড" : \`কাস্টম: \${theme.name}\`)
        )
      )
    ),

    /* Middle Row: Card Number and Level Progress */
    /*#__PURE__*/React.createElement("div", {
      className: "relative my-3"
    },
      /* Card Number */
      /*#__PURE__*/React.createElement("div", {
        className: "font-mono text-white/70 text-sm sm:text-base tracking-[0.25em] drop-shadow-sm select-all mb-2"
      }, cardNumber),

      /* Level & XP Mini Gauge */
      /*#__PURE__*/React.createElement("div", {
        className: "space-y-1.5"
      },
        /*#__PURE__*/React.createElement("div", {
          className: "flex items-center justify-between text-xs text-white/80"
        },
          /*#__PURE__*/React.createElement("span", { className: "font-medium" }, "লেভেল ", level, " (", theme.tag, ")"),
          /*#__PURE__*/React.createElement("span", { className: "font-mono" }, xp, " / ", need, " XP (", progressPercent, "%)")
        ),
        /*#__PURE__*/React.createElement("div", {
          className: "w-full h-1.5 rounded-full bg-white/20 overflow-hidden backdrop-blur-sm"
        },
          /*#__PURE__*/React.createElement("div", {
            className: \`h-full rounded-full transition-all duration-700 \${theme.id === 'gold' ? 'bg-gradient-to-r from-amber-300 to-yellow-200' : 'bg-gradient-to-r from-emerald-400 to-teal-200'}\`,
            style: { width: progressPercent + '%' }
          })
        )
      )
    ),

    /* Bottom Row: Cardholder Name, Streak Counter & Streak Savers */
    /*#__PURE__*/React.createElement("div", {
      className: "relative flex flex-wrap items-end justify-between gap-3 pt-3 border-t border-white/10 mt-3"
    },
      /* Left: Cardholder Name & Tier Badge */
      /*#__PURE__*/React.createElement("div", null,
        /*#__PURE__*/React.createElement("div", {
          className: "text-[10px] uppercase tracking-widest text-white/50 font-medium"
        }, "CARDHOLDER / শিক্ষার্থী"),
        /*#__PURE__*/React.createElement("div", {
          className: "font-semibold text-white tracking-wide text-base sm:text-lg font-bn uppercase truncate max-w-[220px]"
        }, profile.name || 'শিক্ষার্থী (ACHIEVER)'),
        /* Badge */
        /*#__PURE__*/React.createElement("div", {
          className: "mt-0.5 inline-block text-[10px] font-bold tracking-wider uppercase text-amber-300"
        }, isAuto && theme.tierInfo ? theme.tierInfo.badge : (theme.enName.toUpperCase()))
      ),

      /* Right: Streak & Streak Saver Pills */
      /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-2"
      },
        /* Streak Badge */
        /*#__PURE__*/React.createElement("div", {
          className: \`flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-md \${streak >= 30 ? 'bg-amber-400/20 border border-amber-300/40 text-amber-200' : 'bg-white/10 border border-white/15 text-white'}\`,
          title: "ধারাবাহিক পড়াশোনার স্ট্রাইক"
        },
          /*#__PURE__*/React.createElement(Icon, { name: "flame", size: 16, className: streak >= 30 ? "text-amber-400 animate-bounce" : "text-amber-300" }),
          /*#__PURE__*/React.createElement("span", { className: "font-bold text-sm" }, streak),
          /*#__PURE__*/React.createElement("span", { className: "text-[11px] text-white/70" }, "দিন")
        ),

        /* Streak Saver Indicator */
        /*#__PURE__*/React.createElement("button", {
          onClick: onUseStreakSaver,
          className: \`flex items-center gap-1 px-2.5 py-1.5 rounded-xl backdrop-blur-md \${saversLeft > 0 ? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 hover:bg-emerald-500/30' : 'bg-slate-800/40 border border-slate-700/40 text-slate-400'} text-xs font-medium transition active:scale-95\`,
          title: saversLeft > 0 ? "স্ট্রাইক সেভার সক্রিয়: কোনোদিন পড়াশোনা মিস হলে এটি স্ট্রাইক রক্ষা করবে।" : "এই মাসের স্ট্রাইক সেভার শেষ।"
        },
          /*#__PURE__*/React.createElement(Icon, { name: "shield-check", size: 14 }),
          /*#__PURE__*/React.createElement("span", null, saversLeft, " সেভার")
        )
      )
    )
  ));
}

/* Modal for Customizing or Viewing Home Card */
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
      toast('ব্রোঞ্জ গোল্ড ও প্ল্যাটিনাম শুধুমাত্র অটোমেটিক রিওয়ার্ড মোডে আনলক হয়!', 'error');
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
    title: "হোম কার্ড প্রিমিয়াম রঙ ও মোড",
    wide: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-5"
  },
    /* Mode Selection Tabs */
    /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700"
    },
      /* Mode 1: Auto Reward System */
      /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: () => handleSelectMode('auto'),
        className: \`p-3 rounded-xl text-left transition flex flex-col gap-1 \${currentMode === 'auto' ? 'bg-white dark:bg-slate-900 shadow-sm border border-brand-500/30 text-brand-700 dark:text-brand-300' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}\`
      },
        /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-1.5 font-bold text-sm" },
          /*#__PURE__*/React.createElement(Icon, { name: "award", size: 16, className: "text-amber-500" }),
          /*#__PURE__*/React.createElement("span", null, "মোড ১: অটোমেটিক রিওয়ার্ড")
        ),
        /*#__PURE__*/React.createElement("div", { className: "text-xs opacity-80 leading-relaxed" },
          "লেভেল ও ৩০ দিনের স্ট্রাইকের সাথে কার্ড স্বয়ংক্রিয়ভাবে আপগ্রেড হবে (গোল্ড ও প্ল্যাটিনাম সহ)।"
        )
      ),

      /* Mode 2: Custom Selection */
      /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: () => handleSelectMode('custom'),
        className: \`p-3 rounded-xl text-left transition flex flex-col gap-1 \${currentMode === 'custom' ? 'bg-white dark:bg-slate-900 shadow-sm border border-brand-500/30 text-brand-700 dark:text-brand-300' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}\`
      },
        /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-1.5 font-bold text-sm" },
          /*#__PURE__*/React.createElement(Icon, { name: "palette", size: 16, className: "text-indigo-500" }),
          /*#__PURE__*/React.createElement("span", null, "মোড ২: কাস্টম কালার")
        ),
        /*#__PURE__*/React.createElement("div", { className: "text-xs opacity-80 leading-relaxed" },
          "পছন্দমতো যেকোনো রঙ বেছে নিন (ব্রোঞ্জ গোল্ড ও প্ল্যাটিনাম ছাড়া)।"
        )
      )
    ),

    /* Auto Mode Status Banner */
    currentMode === 'auto' && /*#__PURE__*/React.createElement("div", {
      className: "p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3"
    },
      /*#__PURE__*/React.createElement(Icon, { name: "sparkles", className: "text-amber-500 mt-0.5 shrink-0", size: 20 }),
      /*#__PURE__*/React.createElement("div", { className: "text-xs leading-relaxed text-slate-700 dark:text-slate-300 space-y-1" },
        /*#__PURE__*/React.createElement("div", { className: "font-semibold text-slate-900 dark:text-white text-sm" },
          "বর্তমান স্ট্যাটাস: ", autoTier.tierName, " (", autoTier.badge, ")"
        ),
        /*#__PURE__*/React.createElement("p", null,
          "টানা ৩০ দিন অ্যাপ ব্যবহার করে পড়াশোনা সম্পন্ন করলে আনলক হবে সম্মানজনক ",
          /*#__PURE__*/React.createElement("strong", { className: "text-amber-600 dark:text-amber-400" }, "ব্রোঞ্জ গোল্ড কার্ড"),
          " এবং সাথে পাবে ২ টি স্ট্রাইক সেভার! পরের মাসে ৩০ দিনের ধারাবাহিকতা ধরে রাখতে না পারলে ডিমোশন হবে।"
        )
      )
    ),

    /* Color Grid Palette matching user mockup */
    /*#__PURE__*/React.createElement("div", null,
      /*#__PURE__*/React.createElement("div", {
        className: "text-sm font-semibold mb-3 text-slate-800 dark:text-slate-200 flex items-center justify-between"
      },
        /*#__PURE__*/React.createElement("span", null, "হোম কার্ডের প্রিমিয়াম রঙ"),
        currentMode === 'auto' && /*#__PURE__*/React.createElement("span", {
          className: "text-xs text-brand-600 dark:text-brand-400 font-normal"
        }, "(অটো মোডে আপনার বর্তমান লেভেল অনুযায়ী রঙ নির্বাচিত)")
      ),

      /* Grid of 9 Cards as shown in mockup */
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
            className: \`relative flex flex-col items-center justify-between p-3 rounded-2xl border-2 transition-all \${isSelected ? 'border-slate-900 dark:border-white shadow-lg scale-[1.02]' : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'} \${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}\`
          },
            /* Card Color Preview Pill */
            /*#__PURE__*/React.createElement("div", {
              className: \`w-full h-11 rounded-xl bg-gradient-to-r \${t.gradient} shadow-inner flex items-center justify-center relative overflow-hidden\`
            },
              isSelected && /*#__PURE__*/React.createElement(Icon, {
                name: "check",
                size: 18,
                className: "text-emerald-400 drop-shadow font-bold"
              }),
              isLocked && /*#__PURE__*/React.createElement(Icon, {
                name: "lock",
                size: 16,
                className: "text-amber-300 drop-shadow"
              })
            ),
            /* Name Label */
            /*#__PURE__*/React.createElement("span", {
              className: \`mt-2 text-xs font-semibold font-bn \${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}\`
            }, t.name),
            /* Locked tag */
            isLocked && /*#__PURE__*/React.createElement("span", {
              className: "text-[9px] text-amber-500 font-medium"
            }, "রিওয়ার্ডে আনলক")
          );
        })
      )
    ),

    /* Close Button */
    /*#__PURE__*/React.createElement("div", {
      className: "flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800"
    },
      /*#__PURE__*/React.createElement(Btn, {
        onClick: onClose
      }, "সম্পন্ন")
    )
  ));
}

/* Celebration Popup for Level Up and 30-Day Gold Streak */
function LevelUpCelebrationModal({ modal, onClose }) {
  if (!modal) return null;

  return /*#__PURE__*/React.createElement(Modal, {
    open: true,
    onClose: onClose,
    title: "🎉 অভিনন্দন! লেভেল আপ ও রিওয়ার্ড অর্জিত!"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center py-4 space-y-4"
  },
    /* Animated Icon */
    /*#__PURE__*/React.createElement("div", {
      className: "w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 flex items-center justify-center shadow-lg shadow-amber-500/30 animate-pop text-3xl"
    }, modal.icon || "🏆"),

    /* Title & Description */
    /*#__PURE__*/React.createElement("div", null,
      /*#__PURE__*/React.createElement("h3", {
        className: "text-xl font-bold font-bn text-slate-900 dark:text-white"
      }, modal.title || "তুমি নতুন মাইলফলক অর্জন করেছো!"),
      /*#__PURE__*/React.createElement("p", {
        className: "text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-sm mx-auto leading-relaxed"
      }, modal.message || "ধারাবাহিক পড়াশোনার জন্য তোমার হোম কার্ড নতুন রুপে সজ্জিত হয়েছে।")
    ),

    /* Card Badge */
    /*#__PURE__*/React.createElement("div", {
      className: "p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/50 inline-block text-left"
    },
      /*#__PURE__*/React.createElement("div", { className: "text-xs font-semibold text-amber-800 dark:text-amber-300" },
        "আনলকড কার্ড: ", modal.tierName || "ব্রোঞ্জ গোল্ড লিজেন্ড"
      ),
      modal.bonus && /*#__PURE__*/React.createElement("div", { className: "text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1" },
        "✨ বোনাস: ", modal.bonus
      )
    ),

    /* Claim button */
    /*#__PURE__*/React.createElement("div", { className: "pt-2" },
      /*#__PURE__*/React.createElement(Btn, {
        onClick: onClose,
        className: "w-full py-2.5 bg-gradient-to-r from-brand-600 to-teal-600 text-white font-bold"
      }, "উৎসব শুরু হোক! 🚀")
    )
  ));
}
`;

// Insert the CreditCard and modal components before function Dashboard
if (!src.includes('function CreditCard(')) {
  src = src.replace('function Dashboard({', CREDIT_CARD_COMPONENT + '\nfunction Dashboard({');
  console.log('Inserted CreditCard component and CardThemeModal.');
}

fs.writeFileSync('public/app.js', src, 'utf8');
console.log('Step 1 complete: CreditCard injected.');
