const fs = require('fs');

const appPath = 'public/app.js';
let content = fs.readFileSync(appPath, 'utf8');

// Load demo-data.json
const demoData = JSON.parse(fs.readFileSync('public/demo-data.json', 'utf8'));

// 1. Replace DEFAULT_STATE profile and remove card theme constants up to getTestedQuestionIds
const cardThemeStart = content.indexOf('/* ---------- Credit Card Themes & Gamification Engine ---------- */');
const testedQStart = content.indexOf('function getTestedQuestionIds(state) {');

if (cardThemeStart !== -1 && testedQStart !== -1) {
  const replacement = `/* ---------- Embedded Demo Data for 1-Click Offline Testing ---------- */
const EMBEDDED_DEMO_DATA = ${JSON.stringify(demoData)};

`;
  content = content.slice(0, cardThemeStart) + replacement + content.slice(testedQStart);
  console.log('Replaced CARD_THEMES section successfully');
} else {
  console.warn('Could not locate CARD_THEMES section bounds', cardThemeStart, testedQStart);
}

// 2. Clean DEFAULT_STATE profile
const oldDefProfile = `  profile: {
    name: '',
    xp: 0,
    level: 1,
    streak: 0,
    shield: false,
    lastActive: '',
    cardMode: 'auto', // 'auto' (automatic reward) | 'custom'
    cardColor: 'emerald', // emerald, mint, obsidian, royal, burgundy, amethyst, ocean, gold, platinum
    streakSavers: 2, // 2 streak savers per month
    streakSaversUsed: 0,
    lastGoldMonth: '',
    previousTier: 'emerald',
    demotedAlert: false,
  },
  levelUpModal: null, // { title, tierName, color, rewardMsg, level }`;

const newDefProfile = `  profile: {
    name: '',
    target: '',
    institution: '',
    batch: '',
    xp: 0,
    level: 1,
    streak: 0,
    shield: false,
    lastActive: ''
  },`;

if (content.includes(oldDefProfile)) {
  content = content.replace(oldDefProfile, newDefProfile);
  console.log('Replaced DEFAULT_STATE profile');
}

// 3. Clean reducer actions
const oldReducerCases = `    case 'SET_CARD_PREF': {
      return {
        ...state,
        profile: {
          ...state.profile,
          ...(action.patch || {})
        }
      };
    }
    case 'USE_STREAK_SAVER': {
      if ((state.profile.streakSavers || 0) <= 0) return state;
      return {
        ...state,
        profile: {
          ...state.profile,
          streakSavers: Math.max(0, (state.profile.streakSavers || 2) - 1),
          streakSaversUsed: (state.profile.streakSaversUsed || 0) + 1,
          streak: (state.profile.streak || 0) + 1,
          lastActive: todayISO()
        }
      };
    }
    case 'TRIGGER_LEVELUP_MODAL': {
      return { ...state, levelUpModal: action.modal };
    }
    case 'CLEAR_LEVELUP_MODAL': {
      return { ...state, levelUpModal: null };
    }
    case 'DISMISS_DEMOTED_ALERT': {
      return {
        ...state,
        profile: {
          ...state.profile,
          demotedAlert: false
        }
      };
    }`;

if (content.includes(oldReducerCases)) {
  content = content.replace(oldReducerCases, '');
  console.log('Removed obsolete reducer cases');
}

// 4. Remove CreditCard, CardThemeModal, LevelUpCelebrationModal definitions
const ccStart = content.indexOf('/* ---------- Premium Credit Card & Gamification Modal ---------- */');
const dashStart = content.indexOf('function Dashboard({');

if (ccStart !== -1 && dashStart !== -1) {
  content = content.slice(0, ccStart) + content.slice(dashStart);
  console.log('Removed CreditCard, CardThemeModal, LevelUpCelebrationModal definitions');
}

// 5. Update Dashboard component with sleek Student Profile card & quick actions
const dashOldStart = content.indexOf('function Dashboard({');
const dashOldEnd = content.indexOf('function SubjectsView({');

if (dashOldStart !== -1 && dashOldEnd !== -1) {
  const newDashboard = `function Dashboard({
  go,
  setSubjectPath
}) {
  const {
    state,
    dispatch
  } = useVault();
  const p = state.profile;
  const level = p.level || 1;
  const xp = p.xp || 0;
  const need = xpForLevel(level);
  const progressPct = Math.min(100, Math.round((xp / need) * 100));
  const today = todayISO();
  const now = nowHM();
  const todaySchedule = state.schedule.filter(scheduleMatchesToday);
  const openTodos = state.todos.filter(t => !t.done).length;
  const mistakes = state.mistakeVault.length;
  const totalFocus = state.timerSessions.reduce((a, s) => a + (s.minutes || 0), 0);
  const combined = [...DEFAULT_MOTIVATIONS, ...state.quotes];
  const m = combined[state.ui.motivationIdx % combined.length];

  // Currently-due tasks (highlight)
  function isDueNowTime(timeStr) {
    if (!timeStr) return false;
    const [h, mn] = timeStr.split(':').map(Number);
    const [nh, nm] = now.split(':').map(Number);
    const target = h * 60 + mn,
      cur = nh * 60 + nm;
    return cur >= target && cur <= target + 30;
  }
  const [dismissedDue, setDismissedDue] = useState({});
  const dueNow = [...todaySchedule.filter(s => isDueNowTime(s.time)).map(s => ({
    ...s,
    kind: 'schedule'
  })), ...state.todos.filter(t => !t.done && t.due === today && isDueNowTime(t.time)).map(t => ({
    ...t,
    kind: 'todo'
  }))].filter(x => !dismissedDue[x.kind + x.id]);

  return /*#__PURE__*/React.createElement("div", {
    className: "grid gap-5"
  },
    /* Currently-Due Task Banner */
    dueNow.length > 0 && /*#__PURE__*/React.createElement(Card, {
      className: "p-4 border-rose-300 dark:border-rose-800 task-due-glow"
    },
      /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-2 mb-2 text-rose-600 dark:text-rose-300 font-semibold font-bn"
      },
        /*#__PURE__*/React.createElement(Icon, { name: "bell-ring" }),
        " এখনকার তাগিদ / Due Right Now"
      ),
      /*#__PURE__*/React.createElement("div", {
        className: "grid gap-2"
      }, dueNow.map(x => /*#__PURE__*/React.createElement("div", {
        key: x.kind + x.id,
        className: "flex items-center gap-2 p-2 rounded-xl bg-rose-50/60 dark:bg-rose-950/30"
      },
        /*#__PURE__*/React.createElement(Chip, { tone: "rose" }, x.kind === 'schedule' ? 'রুটিন' : 'কাজ'),
        /*#__PURE__*/React.createElement("div", { className: "flex-1 truncate font-medium text-sm font-bn" }, x.title),
        /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500 font-mono" }, x.time),
        /*#__PURE__*/React.createElement(Btn, {
          size: "sm",
          variant: "subtle",
          onClick: () => {
            if (x.kind === 'todo') {
              dispatch({
                type: 'UPDATE_ITEM',
                key: 'todos',
                item: { ...state.todos.find(t => t.id === x.id), done: true }
              });
            }
            setDismissedDue(d => ({ ...d, [x.kind + x.id]: true }));
          }
        },
          /*#__PURE__*/React.createElement(Icon, { name: "check", size: 14 }),
          "Done"
        )
      )))
    ),

    /* 1. STUDENT PROFILE & PROGRESS HERO CARD (CLEAN & MODERN) */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-soft relative overflow-hidden"
    },
      /* Subtle top right background accent */
      /*#__PURE__*/React.createElement("div", {
        className: "absolute -top-16 -right-16 w-48 h-48 rounded-full bg-brand-500/10 blur-3xl pointer-events-none"
      }),
      /*#__PURE__*/React.createElement("div", {
        className: "relative flex flex-col md:flex-row md:items-center justify-between gap-5"
      },
        /* Left: Logo & Student identity */
        /*#__PURE__*/React.createElement("div", {
          className: "flex items-center gap-4"
        },
          /*#__PURE__*/React.createElement(Logo, { size: 54, ring: true }),
          /*#__PURE__*/React.createElement("div", null,
            /*#__PURE__*/React.createElement("div", {
              className: "flex items-center gap-2"
            },
              /*#__PURE__*/React.createElement("span", {
                className: "text-xs font-medium text-brand-600 dark:text-brand-400 font-bn uppercase tracking-wider"
              }, "সংকল্প শিক্ষার্থী"),
              p.target && /*#__PURE__*/React.createElement("span", {
                className: "text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bn truncate max-w-[200px]"
              }, p.target)
            ),
            /*#__PURE__*/React.createElement("h2", {
              className: "text-xl sm:text-2xl font-bold font-bn text-slate-900 dark:text-white leading-tight mt-0.5"
            }, p.name || 'শিক্ষার্থী (Achiever)'),
            p.institution && /*#__PURE__*/React.createElement("div", {
              className: "text-xs text-slate-500 font-bn mt-0.5"
            }, p.institution, p.batch ? " · " + p.batch : "")
          )
        ),

        /* Right: Streak & Level Badges */
        /*#__PURE__*/React.createElement("div", {
          className: "flex items-center gap-2.5 self-start md:self-auto"
        },
          /* Streak Badge */
          /*#__PURE__*/React.createElement("div", {
            className: "flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200"
          },
            /*#__PURE__*/React.createElement(Icon, { name: "flame", size: 18, className: "text-amber-500" }),
            /*#__PURE__*/React.createElement("div", { className: "leading-none" },
              /*#__PURE__*/React.createElement("div", { className: "font-mono font-bold text-base" }, p.streak || 0),
              /*#__PURE__*/React.createElement("div", { className: "text-[10px] text-amber-700 dark:text-amber-300 font-bn" }, "দিনের স্ট্রিক")
            )
          ),
          /* Level Badge */
          /*#__PURE__*/React.createElement("div", {
            className: "flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-900 dark:text-brand-200"
          },
            /*#__PURE__*/React.createElement(Icon, { name: "zap", size: 18, className: "text-brand-500" }),
            /*#__PURE__*/React.createElement("div", { className: "leading-none" },
              /*#__PURE__*/React.createElement("div", { className: "font-mono font-bold text-base" }, "Lv " + level),
              /*#__PURE__*/React.createElement("div", { className: "text-[10px] text-brand-700 dark:text-brand-300 font-bn" }, "অধ্যয়ন স্তর")
            )
          )
        )
      ),

      /* Level XP Progress Bar */
      /*#__PURE__*/React.createElement("div", {
        className: "relative mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1.5"
      },
        /*#__PURE__*/React.createElement("div", {
          className: "flex items-center justify-between text-xs"
        },
          /*#__PURE__*/React.createElement("span", { className: "text-slate-600 dark:text-slate-400 font-bn" },
            "লেভেল ", level, " প্রগ্রেস (পরবর্তী লেভেলে পৌঁছাতে প্রয়োজন ", Math.max(0, need - xp), " XP)"
          ),
          /*#__PURE__*/React.createElement("span", { className: "font-mono text-slate-500 font-medium" },
            xp, " / ", need, " XP (", progressPct, "%)"
          )
        ),
        /*#__PURE__*/React.createElement("div", {
          className: "w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"
        },
          /*#__PURE__*/React.createElement("div", {
            className: "h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full transition-all duration-500",
            style: { width: progressPct + '%' }
          })
        )
      )
    ),

    /* 2. STATS OVERVIEW CARDS (Streak, Focus, Topics) */
    /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 sm:grid-cols-4 gap-3"
    },
      /* Daily Streak */
      /*#__PURE__*/React.createElement(Card, {
        className: "p-4 flex items-center gap-3"
      },
        /*#__PURE__*/React.createElement("div", {
          className: "w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0"
        }, /*#__PURE__*/React.createElement(Icon, { name: "flame", size: 20 })),
        /*#__PURE__*/React.createElement("div", { className: "min-w-0" },
          /*#__PURE__*/React.createElement("div", { className: "font-mono font-bold text-lg text-slate-900 dark:text-white" }, p.streak || 0, " দিন"),
          /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500 font-bn truncate" }, "ধারাবাহিকতা")
        )
      ),
      /* Focus Minutes */
      /*#__PURE__*/React.createElement(Card, {
        className: "p-4 flex items-center gap-3"
      },
        /*#__PURE__*/React.createElement("div", {
          className: "w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center shrink-0"
        }, /*#__PURE__*/React.createElement(Icon, { name: "timer", size: 20 })),
        /*#__PURE__*/React.createElement("div", { className: "min-w-0" },
          /*#__PURE__*/React.createElement("div", { className: "font-mono font-bold text-lg text-slate-900 dark:text-white" }, totalFocus, " মি."),
          /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500 font-bn truncate" }, "ফোকাস অধ্যয়ন")
        )
      ),
      /* Active Subjects */
      /*#__PURE__*/React.createElement(Card, {
        className: "p-4 flex items-center gap-3"
      },
        /*#__PURE__*/React.createElement("div", {
          className: "w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0"
        }, /*#__PURE__*/React.createElement(Icon, { name: "book-open", size: 20 })),
        /*#__PURE__*/React.createElement("div", { className: "min-w-0" },
          /*#__PURE__*/React.createElement("div", { className: "font-mono font-bold text-lg text-slate-900 dark:text-white" }, state.subjects.length),
          /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500 font-bn truncate" }, "বিষয় যুক্ত")
        )
      ),
      /* Pending Tasks */
      /*#__PURE__*/React.createElement(Card, {
        className: "p-4 flex items-center gap-3"
      },
        /*#__PURE__*/React.createElement("div", {
          className: "w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0"
        }, /*#__PURE__*/React.createElement(Icon, { name: "check-circle", size: 20 })),
        /*#__PURE__*/React.createElement("div", { className: "min-w-0" },
          /*#__PURE__*/React.createElement("div", { className: "font-mono font-bold text-lg text-slate-900 dark:text-white" }, openTodos),
          /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500 font-bn truncate" }, "বাকি টাস্ক")
        )
      )
    ),

    /* 3. QUICK STUDY ACTIONS */
    /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 sm:grid-cols-4 gap-3"
    },
      /* Exam */
      /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: () => go('exam'),
        className: "p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left hover:border-brand-500 transition-all shadow-sm hover:shadow-md group"
      },
        /*#__PURE__*/React.createElement("div", {
          className: "w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition"
        }, /*#__PURE__*/React.createElement(Icon, { name: "graduation-cap", size: 20 })),
        /*#__PURE__*/React.createElement("div", { className: "font-bold text-sm text-slate-900 dark:text-white font-bn" }, "MCQ পরীক্ষা"),
        /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500 font-bn mt-0.5" }, "ডিউ ও দুর্বল প্রশ্ন যাচাই")
      ),
      /* Flashcards */
      /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: () => go('cards'),
        className: "p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left hover:border-brand-500 transition-all shadow-sm hover:shadow-md group"
      },
        /*#__PURE__*/React.createElement("div", {
          className: "w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition"
        }, /*#__PURE__*/React.createElement(Icon, { name: "layers", size: 20 })),
        /*#__PURE__*/React.createElement("div", { className: "font-bold text-sm text-slate-900 dark:text-white font-bn" }, "ফ্ল্যাশকার্ড রিভিশন"),
        /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500 font-bn mt-0.5" }, "৩ডি কার্ড ও স্পিচ স্টাডি")
      ),
      /* Timer */
      /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: () => go('timer'),
        className: "p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left hover:border-brand-500 transition-all shadow-sm hover:shadow-md group"
      },
        /*#__PURE__*/React.createElement("div", {
          className: "w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition"
        }, /*#__PURE__*/React.createElement(Icon, { name: "timer", size: 20 })),
        /*#__PURE__*/React.createElement("div", { className: "font-bold text-sm text-slate-900 dark:text-white font-bn" }, "ফোকাস টাইমার"),
        /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500 font-bn mt-0.5" }, "পোমোডোরো ও সাউন্ডস্কেপ")
      ),
      /* Mistake Vault */
      /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: () => go('mistakes'),
        className: "p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left hover:border-rose-500 transition-all shadow-sm hover:shadow-md group"
      },
        /*#__PURE__*/React.createElement("div", {
          className: "w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition"
        }, /*#__PURE__*/React.createElement(Icon, { name: "alert-triangle", size: 20 })),
        /*#__PURE__*/React.createElement("div", { className: "font-bold text-sm text-slate-900 dark:text-white font-bn" }, "ভুল ভান্ডার"),
        /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500 font-bn mt-0.5" }, mistakes + " টি ভুল জমা আছে")
      )
    ),

    /* 4. DAILY MOTIVATION */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-5 relative overflow-hidden"
    },
      /*#__PURE__*/React.createElement("div", {
        className: "flex items-start justify-between gap-3"
      },
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("div", {
            className: "text-[11px] uppercase tracking-wider text-slate-400 font-medium font-bn mb-1"
          }, "আজকের অনুপ্রেরণা"),
          /*#__PURE__*/React.createElement("div", {
            className: "font-bn text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-relaxed"
          }, m.bn),
          m.en && /*#__PURE__*/React.createElement("div", {
            className: "text-xs text-slate-500 mt-1 italic font-sans"
          }, '"', m.en, '"')
        ),
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: () => dispatch({
            type: 'SET_UI',
            patch: { motivationIdx: (state.ui.motivationIdx + 1) % combined.length }
          }),
          className: "p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition shrink-0",
          title: "পরবর্তী উক্তি"
        }, /*#__PURE__*/React.createElement(Icon, { name: "refresh-cw", size: 16 }))
      )
    ),

    /* 5. TODAY'S SCHEDULE & TO-DOS */
    /*#__PURE__*/React.createElement("div", {
      className: "grid md:grid-cols-2 gap-4"
    },
      /* Today's Schedule */
      /*#__PURE__*/React.createElement(Card, {
        className: "p-5 space-y-3"
      },
        /*#__PURE__*/React.createElement("div", {
          className: "flex items-center justify-between"
        },
          /*#__PURE__*/React.createElement("h3", { className: "font-bold font-bn text-base text-slate-900 dark:text-white flex items-center gap-2" },
            /*#__PURE__*/React.createElement(Icon, { name: "calendar-days", size: 18, className: "text-brand-600" }),
            "আজকের সময়সূচি"
          ),
          /*#__PURE__*/React.createElement("button", {
            onClick: () => go('schedule'),
            className: "text-xs text-brand-600 hover:underline font-bn"
          }, "সব দেখুন")
        ),
        todaySchedule.length === 0 ? /*#__PURE__*/React.createElement("div", {
          className: "py-6 text-center text-xs text-slate-400 font-bn"
        }, "আজকের কোনো নির্ধারিত রুটিন নেই।") : /*#__PURE__*/React.createElement("div", {
          className: "space-y-2"
        }, todaySchedule.map(s => /*#__PURE__*/React.createElement("div", {
          key: s.id,
          className: "flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-sm"
        },
          /*#__PURE__*/React.createElement("span", { className: "font-mono text-xs font-semibold px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300" }, s.time),
          /*#__PURE__*/React.createElement("span", { className: "font-bn font-medium flex-1 truncate" }, s.title)
        )))
      ),

      /* Today's To-Dos */
      /*#__PURE__*/React.createElement(Card, {
        className: "p-5 space-y-3"
      },
        /*#__PURE__*/React.createElement("div", {
          className: "flex items-center justify-between"
        },
          /*#__PURE__*/React.createElement("h3", { className: "font-bold font-bn text-base text-slate-900 dark:text-white flex items-center gap-2" },
            /*#__PURE__*/React.createElement(Icon, { name: "check-square", size: 18, className: "text-emerald-600" }),
            "আজকের কাজের তালিকা"
          ),
          /*#__PURE__*/React.createElement("button", {
            onClick: () => go('todos'),
            className: "text-xs text-brand-600 hover:underline font-bn"
          }, "সব দেখুন")
        ),
        state.todos.filter(t => t.due === today || !t.done).length === 0 ? /*#__PURE__*/React.createElement("div", {
          className: "py-6 text-center text-xs text-slate-400 font-bn"
        }, "আজকের সব কাজ সম্পন্ন হয়েছে!") : /*#__PURE__*/React.createElement("div", {
          className: "space-y-2"
        }, state.todos.filter(t => !t.done).slice(0, 4).map(t => /*#__PURE__*/React.createElement("div", {
          key: t.id,
          className: "flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-sm"
        },
          /*#__PURE__*/React.createElement("button", {
            onClick: () => dispatch({
              type: 'UPDATE_ITEM',
              key: 'todos',
              item: { ...t, done: true }
            }),
            className: "w-5 h-5 rounded-md border border-slate-300 dark:border-slate-600 hover:border-brand-500 flex items-center justify-center shrink-0"
          }),
          /*#__PURE__*/React.createElement("span", { className: "font-bn text-slate-700 dark:text-slate-200 flex-1 truncate" }, t.title),
          t.priority === 'high' && /*#__PURE__*/React.createElement(Chip, { tone: "rose" }, "High")
        )))
      )
    )
  );
}

`;
  content = content.slice(0, dashOldStart) + newDashboard + content.slice(dashOldEnd);
  console.log('Replaced Dashboard component with modern student dashboard');
} else {
  console.warn('Could not locate Dashboard bounds', dashOldStart, dashOldEnd);
}

// 6. Update SettingsView with Clean Profile, Demo Data loader, Backup/Restore, Notifications
const settingsOldStart = content.indexOf('function SettingsView() {');
const settingsOldEnd = content.indexOf('/* ---------- Root ---------- */');

if (settingsOldStart !== -1 && settingsOldEnd !== -1) {
  const newSettings = `function SettingsView() {
  const {
    state,
    dispatch
  } = useVault();
  const p = state.profile;

  function handleLoadDemoData() {
    if (window.confirm('আপনি কি সম্পূর্ণ ডেমো ডাটা (পদার্থবিজ্ঞান, রসায়ন, গণিত, বায়োলজি, MCQ ও ফ্ল্যাশকার্ড) লোড করতে চান?')) {
      dispatch({
        type: 'HYDRATE',
        state: { ...structuredClone(DEFAULT_STATE), ...EMBEDDED_DEMO_DATA }
      });
      toast('ডেমো ডাটা সফলভাবে লোড হয়েছে!', 'success');
    }
  }

  function handleDownloadDemoJSON() {
    const dataStr = JSON.stringify(EMBEDDED_DEMO_DATA, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sonkolpo-os-demo-data.json';
    a.click();
    URL.revokeObjectURL(url);
    toast('ডেমো JSON ফাইল ডাউনলোড হয়েছে', 'success');
  }

  function exportJSON() {
    const fname = \`sonkolpo-os-backup-\${todayISO()}.json\`;
    const jsonStr = JSON.stringify(state, null, 2);
    if (window.NativeBridge && window.NativeBridge.exportFile) {
      window.NativeBridge.exportFile(fname, jsonStr)
        .then(where => toast('ফাইল ম্যানেজারে সেভ হয়েছে: ' + where, 'success'))
        .catch(() => {
          fallbackDownload(fname, jsonStr);
        });
      return;
    }
    fallbackDownload(fname, jsonStr);
  }

  function fallbackDownload(fname, dataStr) {
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fname;
    a.click();
    URL.revokeObjectURL(url);
    toast('ব্যাকআপ ফাইল ডাউনলোড হয়েছে', 'success');
  }

  function importJSON(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const data = JSON.parse(r.result);
        dispatch({
          type: 'HYDRATE',
          state: { ...structuredClone(DEFAULT_STATE), ...data }
        });
        toast('ডাটা সফলভাবে রিস্টোর হয়েছে', 'success');
      } catch (err) {
        toast('ফাইলটি সঠিক ফরম্যাটের নয়', 'error');
      }
    };
    r.readAsText(file);
  }

  function handleResetAll() {
    if (window.confirm('আপনি কি নিশ্চিত যে সমস্ত ডাটা মুছে ফেলে প্রাথমিক অবস্থায় ফেরত যেতে চান?')) {
      dispatch({ type: 'RESET' });
      toast('সমস্ত ডাটা রিসেট করা হয়েছে', 'info');
    }
  }

  const notif = state.ui.notif || { popup: true, beep: true };

  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-5 max-w-2xl mx-auto pb-12"
  },
    /* Page Title */
    /*#__PURE__*/React.createElement("div", { className: "border-b border-slate-200 dark:border-slate-800 pb-3" },
      /*#__PURE__*/React.createElement("h2", { className: "text-xl font-bold font-bn text-slate-900 dark:text-white" }, "সেটিংস ও প্রিফারেন্স"),
      /*#__PURE__*/React.createElement("p", { className: "text-xs text-slate-500 font-bn mt-0.5" }, "প্রোফাইল তথ্য, থিম, ডেমো ডাটা এবং ব্যাকআপ ব্যবস্থাপনা।")
    ),

    /* 1. STUDENT PROFILE CARD */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
    },
      /* Header */
      /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2.5" },
        /*#__PURE__*/React.createElement("div", { className: "w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-sm" },
          /*#__PURE__*/React.createElement(Icon, { name: "user", size: 18 })
        ),
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("h3", { className: "font-bold text-base text-slate-900 dark:text-white font-bn" }, "শিক্ষার্থীর প্রোফাইল"),
          /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500 font-bn" }, "আপনার নাম, পরীক্ষার লক্ষ্য ও শিক্ষাপ্রতিষ্ঠান")
        )
      ),

      /* Fields */
      /*#__PURE__*/React.createElement("div", { className: "grid sm:grid-cols-2 gap-3 pt-1" },
        /* Name */
        /*#__PURE__*/React.createElement("div", { className: "space-y-1.5 sm:col-span-2" },
          /*#__PURE__*/React.createElement("label", { className: "text-xs text-slate-600 dark:text-slate-400 font-medium font-bn" }, "শিক্ষার্থীর নাম"),
          /*#__PURE__*/React.createElement(Input, {
            placeholder: "যেমন: মোঃ ওয়াদুদ হোসেন",
            value: p.name || '',
            onChange: e => dispatch({
              type: 'SET_PROFILE',
              patch: { name: e.target.value }
            })
          })
        ),
        /* Target */
        /*#__PURE__*/React.createElement("div", { className: "space-y-1.5" },
          /*#__PURE__*/React.createElement("label", { className: "text-xs text-slate-600 dark:text-slate-400 font-medium font-bn" }, "টার্গেট পরীক্ষা / লক্ষ্য"),
          /*#__PURE__*/React.createElement(Input, {
            placeholder: "যেমন: বুয়েট ও মেডিকেল ভর্তি ২০২৬",
            value: p.target || '',
            onChange: e => dispatch({
              type: 'SET_PROFILE',
              patch: { target: e.target.value }
            })
          })
        ),
        /* Institution */
        /*#__PURE__*/React.createElement("div", { className: "space-y-1.5" },
          /*#__PURE__*/React.createElement("label", { className: "text-xs text-slate-600 dark:text-slate-400 font-medium font-bn" }, "প্রতিষ্ঠান ও ব্যাচ"),
          /*#__PURE__*/React.createElement(Input, {
            placeholder: "যেমন: নটর ডেম কলেজ (HSC 26)",
            value: p.institution || '',
            onChange: e => dispatch({
              type: 'SET_PROFILE',
              patch: { institution: e.target.value }
            })
          })
        )
      )
    ),

    /* 2. DEMO DATA & INSTANT SETUP CARD */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-5 sm:p-6 rounded-3xl border border-brand-500/30 bg-gradient-to-br from-brand-50/50 to-white dark:from-brand-950/20 dark:to-slate-900 shadow-sm space-y-4"
    },
      /* Header */
      /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2.5" },
        /*#__PURE__*/React.createElement("div", { className: "w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-sm" },
          /*#__PURE__*/React.createElement(Icon, { name: "database", size: 18 })
        ),
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("h3", { className: "font-bold text-base text-slate-900 dark:text-white font-bn" }, "উৎপাদন-মানের ডেমো ডাটা (Demo Dataset)"),
          /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500 font-bn" }, "পদার্থ, রসায়ন, গণিত, বায়োলজি, MCQ ও ফ্ল্যাশকার্ড ডাটা দিয়ে টেস্ট করুন")
        )
      ),

      /* Description */
      /*#__PURE__*/React.createElement("p", { className: "text-xs text-slate-600 dark:text-slate-300 font-bn leading-relaxed" },
        "মোবাইল বা পিসিতে অ্যাপের প্রতিটি ফিচার (ডিউ MCQ ফিল্টার, ৩ডি ফ্ল্যাশকার্ড, অ্যালার্ম ও সময়সূচি) যাচাই করার জন্য সম্পূর্ণ প্রস্তুতকৃত বাস্তবমুখী ডাটা এক ক্লিকে লোড করুন।"
      ),

      /* Actions */
      /*#__PURE__*/React.createElement("div", { className: "flex flex-wrap gap-2.5 pt-1" },
        /* One Click Load */
        /*#__PURE__*/React.createElement(Btn, {
          onClick: handleLoadDemoData,
          className: "px-4 py-2.5 font-bold font-bn"
        },
          /*#__PURE__*/React.createElement(Icon, { name: "sparkles", size: 16 }),
          "ডেমো ডাটা লোড করুন (১-ক্লিক)"
        ),
        /* Download Demo JSON */
        /*#__PURE__*/React.createElement(Btn, {
          variant: "outline",
          onClick: handleDownloadDemoJSON,
          className: "px-4 py-2.5 font-bn"
        },
          /*#__PURE__*/React.createElement(Icon, { name: "download", size: 16 }),
          "ডেমো JSON ডাউনলোড"
        )
      )
    ),

    /* 3. APPEARANCE & LANGUAGE */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
    },
      /* Header */
      /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2.5" },
        /*#__PURE__*/React.createElement("div", { className: "w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-sm" },
          /*#__PURE__*/React.createElement(Icon, { name: "sun-moon", size: 18 })
        ),
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("h3", { className: "font-bold text-base text-slate-900 dark:text-white font-bn" }, "রূপরেখা ও ভাষা"),
          /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500 font-bn" }, "ডার্ক/লাইট মোড এবং ভাষা নির্বাচন")
        )
      ),

      /* Theme buttons */
      /*#__PURE__*/React.createElement("div", { className: "grid grid-cols-2 gap-3" },
        /* Light */
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: () => dispatch({ type: 'SET_UI', patch: { theme: 'light' } }),
          className: \`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 font-semibold text-sm transition font-bn \${state.ui.theme === 'light' ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300' : 'border-slate-200 dark:border-slate-800 text-slate-600'}\`
        },
          /*#__PURE__*/React.createElement(Icon, { name: "sun", size: 18 }),
          /*#__PURE__*/React.createElement("span", null, "লাইট মোড")
        ),
        /* Dark */
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: () => dispatch({ type: 'SET_UI', patch: { theme: 'dark' } }),
          className: \`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 font-semibold text-sm transition font-bn \${state.ui.theme === 'dark' ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300' : 'border-slate-200 dark:border-slate-800 text-slate-600'}\`
        },
          /*#__PURE__*/React.createElement(Icon, { name: "moon", size: 18 }),
          /*#__PURE__*/React.createElement("span", null, "ডার্ক মোড")
        )
      ),

      /* Language selector */
      /*#__PURE__*/React.createElement("div", { className: "grid grid-cols-2 gap-3 pt-1" },
        /* BN */
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: () => dispatch({ type: 'SET_UI', patch: { lang: 'bn' } }),
          className: \`py-2 rounded-xl border text-xs font-bold transition \${state.ui.lang === 'bn' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent' : 'border-slate-200 dark:border-slate-700'}\`
        }, "বাংলা (Bengali)"),
        /* EN */
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: () => dispatch({ type: 'SET_UI', patch: { lang: 'en' } }),
          className: \`py-2 rounded-xl border text-xs font-bold transition \${state.ui.lang === 'en' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent' : 'border-slate-200 dark:border-slate-700'}\`
        }, "English (ইংরেজি)")
      )
    ),

    /* 4. NOTIFICATIONS & ALARMS */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
    },
      /* Header */
      /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2.5" },
        /*#__PURE__*/React.createElement("div", { className: "w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm" },
          /*#__PURE__*/React.createElement(Icon, { name: "bell", size: 18 })
        ),
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("h3", { className: "font-bold text-base text-slate-900 dark:text-white font-bn" }, "অনুস্মারক ও অ্যালার্ম নোটিফিকেশন"),
          /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500 font-bn" }, "রুটিন ও কাজের সঠিক সময়ে বার্তা ও শব্দ")
        )
      ),

      /* Toggles */
      /*#__PURE__*/React.createElement("div", { className: "space-y-3 pt-1 font-bn" },
        /* Popup */
        /*#__PURE__*/React.createElement("label", {
          className: "flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 cursor-pointer"
        },
          /*#__PURE__*/React.createElement("span", { className: "text-sm text-slate-800 dark:text-slate-200" }, "পপআপ নোটিফিকেশন চালু"),
          /*#__PURE__*/React.createElement("input", {
            type: "checkbox",
            checked: notif.popup,
            onChange: e => dispatch({
              type: 'SET_NOTIF',
              patch: { popup: e.target.checked }
            }),
            className: "w-5 h-5 accent-brand-600 rounded"
          })
        ),
        /* Beep sound */
        /*#__PURE__*/React.createElement("label", {
          className: "flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 cursor-pointer"
        },
          /*#__PURE__*/React.createElement("span", { className: "text-sm text-slate-800 dark:text-slate-200" }, "রিমাইন্ডার বীপ সাউন্ড ও অ্যালার্ম ধ্বনি"),
          /*#__PURE__*/React.createElement("input", {
            type: "checkbox",
            checked: notif.beep,
            onChange: e => dispatch({
              type: 'SET_NOTIF',
              patch: { beep: e.target.checked }
            }),
            className: "w-5 h-5 accent-brand-600 rounded"
          })
        )
      ),

      /* Sound Test Button */
      /*#__PURE__*/React.createElement("div", { className: "flex gap-2" },
        /*#__PURE__*/React.createElement(Btn, {
          variant: "outline",
          onClick: () => {
            AudioEngine.reminderChime();
            toast('টেস্ট নোটিফিকেশন বীপ বাজানো হয়েছে', 'info');
          },
          className: "font-bn text-xs"
        },
          /*#__PURE__*/React.createElement(Icon, { name: "volume-2", size: 14 }),
          "শব্দ পরীক্ষা করুন"
        )
      )
    ),

    /* 5. BACKUP & RESTORE (Native File Manager Compatible) */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
    },
      /* Header */
      /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2.5" },
        /*#__PURE__*/React.createElement("div", { className: "w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm" },
          /*#__PURE__*/React.createElement(Icon, { name: "folder-archive", size: 18 })
        ),
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("h3", { className: "font-bold text-base text-slate-900 dark:text-white font-bn" }, "ব্যাকআপ ও রিস্টোর (ফাইল ম্যানেজার)"),
          /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500 font-bn" }, "মোবাইলের ফাইল ম্যানেজারে ব্যাকআপ ফাইল সংরক্ষণ ও রিস্টোর")
        )
      ),

      /* Action buttons */
      /*#__PURE__*/React.createElement("div", { className: "flex flex-wrap gap-3 font-bn" },
        /* Export Backup */
        /*#__PURE__*/React.createElement(Btn, {
          onClick: exportJSON,
          className: "px-4 py-2.5"
        },
          /*#__PURE__*/React.createElement(Icon, { name: "download", size: 16 }),
          "ব্যাকআপ এক্সপোর্ট (.json)"
        ),
        /* Import Backup */
        /*#__PURE__*/React.createElement("label", {
          className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium cursor-pointer transition shadow-sm"
        },
          /*#__PURE__*/React.createElement(Icon, { name: "upload", size: 16 }),
          "ব্যাকআপ ইমপোর্ট করুন",
          /*#__PURE__*/React.createElement("input", {
            type: "file",
            accept: ".json",
            className: "hidden",
            onChange: importJSON
          })
        )
      ),

      /* Danger: Reset All */
      /*#__PURE__*/React.createElement("div", { className: "pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between" },
        /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500 font-bn" },
          "অ্যাপের সমস্ত কন্টেন্ট মুছে প্রাথমিক অবস্থায় রিসেট করুন।"
        ),
        /*#__PURE__*/React.createElement(Btn, {
          variant: "danger",
          onClick: handleResetAll,
          className: "text-xs font-bn"
        },
          /*#__PURE__*/React.createElement(Icon, { name: "trash-2", size: 14 }),
          "সব রিসেট"
        )
      )
    ),

    /* 6. ABOUT & FOOTER INFO */
    /*#__PURE__*/React.createElement("div", {
      className: "p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 text-center space-y-1 font-bn"
    },
      /*#__PURE__*/React.createElement("div", { className: "font-bold text-sm text-slate-800 dark:text-slate-200" }, BRAND, " · সংস্করণ ৪.০ (অফলাইন প্রডাকশন রেডি)"),
      /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500" }, CREDIT)
    )
  );
}
`;

  content = content.slice(0, settingsOldStart) + newSettings + content.slice(settingsOldEnd);
  console.log('Replaced SettingsView successfully');
} else {
  console.warn('Could not locate SettingsView bounds', settingsOldStart, settingsOldEnd);
}

fs.writeFileSync(appPath, content, 'utf8');
console.log('Successfully updated app.js!');
