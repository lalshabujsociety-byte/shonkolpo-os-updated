const fs = require('fs');

const appPath = 'public/app.js';
let content = fs.readFileSync(appPath, 'utf8');

// 1. Clean Dashboard
const dashStart = content.indexOf('function Dashboard({');
const statStart = content.indexOf('function Stat({');

if (dashStart !== -1 && statStart !== -1) {
  const cleanDashboard = `function Dashboard({
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

  // Focus area: mistakes by subject/topic
  const focusArea = useMemo(() => {
    const map = {};
    state.mistakeVault.forEach(mv => {
      const sid = mv.mcq.subjectId || '';
      const tid = mv.mcq.topicId || '';
      const k = sid + '|' + tid;
      map[k] = map[k] || {
        subjectId: sid,
        topicId: tid,
        count: 0,
        items: []
      };
      map[k].count++;
      map[k].items.push(mv);
    });
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [state.mistakeVault]);
  const [focusOpen, setFocusOpen] = useState(null);

  return /*#__PURE__*/React.createElement("div", {
    className: "grid gap-4"
  },
    dueNow.length > 0 && /*#__PURE__*/React.createElement(Card, {
      className: "p-4 border-rose-300 dark:border-rose-800 task-due-glow"
    },
      /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-2 mb-2 text-rose-600 dark:text-rose-300 font-semibold text-sm font-bn"
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

    /* Minimalist Profile Hero Card */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-5 relative overflow-hidden"
    },
      /*#__PURE__*/React.createElement("div", {
        className: "relative flex flex-wrap items-center gap-5"
      },
        /*#__PURE__*/React.createElement(Logo, { size: 52 }),
        /*#__PURE__*/React.createElement("div", {
          className: "flex-1 min-w-[180px]"
        },
          /*#__PURE__*/React.createElement("div", {
            className: "text-xs text-slate-400 font-medium font-bn"
          }, "স্বাগতম / Welcome back"),
          /*#__PURE__*/React.createElement("div", {
            className: "text-xl font-semibold font-bn text-slate-900 dark:text-white mt-0.5"
          }, p.name || 'শিক্ষার্থী (Achiever)'),
          /*#__PURE__*/React.createElement("div", {
            className: "mt-2 flex items-center gap-3"
          },
            /*#__PURE__*/React.createElement("div", {
              className: "text-xs text-slate-500 font-bn"
            }, "Level ", level),
            /*#__PURE__*/React.createElement("div", {
              className: "flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden max-w-xs"
            },
              /*#__PURE__*/React.createElement("div", {
                className: "h-full bg-brand-500 rounded-full transition-all duration-300",
                style: { width: Math.min(100, Math.round((xp / need) * 100)) + '%' }
              })
            ),
            /*#__PURE__*/React.createElement("div", {
              className: "text-xs text-slate-400 font-mono"
            }, xp, " / ", need, " XP")
          )
        ),
        /* Clean Stat Chips */
        /*#__PURE__*/React.createElement("div", {
          className: "flex gap-2.5"
        },
          /*#__PURE__*/React.createElement(Stat, {
            icon: "flame",
            label: "Streak",
            value: (p.streak || 0) + 'd'
          }),
          /*#__PURE__*/React.createElement(Stat, {
            icon: "zap",
            label: "Level",
            value: 'Lv ' + level
          }),
          /*#__PURE__*/React.createElement(Stat, {
            icon: "timer",
            label: "Focus",
            value: totalFocus + 'm'
          })
        )
      ),

      /* Daily Motivation Box */
      /*#__PURE__*/React.createElement("div", {
        className: "relative mt-4 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800"
      },
        /*#__PURE__*/React.createElement("div", {
          className: "text-[10px] uppercase tracking-widest text-slate-400 mb-0.5 font-bn font-medium"
        }, "অনুপ্রেরণা"),
        /*#__PURE__*/React.createElement("div", {
          className: "font-bn text-sm sm:text-base text-slate-800 dark:text-slate-200 font-medium leading-snug"
        }, m.bn),
        m.en && /*#__PURE__*/React.createElement("div", {
          className: "text-xs text-slate-400 mt-0.5 italic font-sans"
        }, '"', m.en, '"'),
        /*#__PURE__*/React.createElement("button", {
          className: "absolute right-2 top-2 p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 text-slate-400 hover:text-slate-600 transition",
          onClick: () => dispatch({
            type: 'SET_UI',
            patch: { motivationIdx: state.ui.motivationIdx + 1 }
          }),
          title: "পরবর্তী উক্তি"
        }, /*#__PURE__*/React.createElement(Icon, { name: "refresh-cw", size: 14 }))
      )
    ),

    /* 3 Clean QuickCards Grid */
    /*#__PURE__*/React.createElement("div", {
      className: "grid md:grid-cols-3 gap-4"
    },
      /* Today's Schedule */
      /*#__PURE__*/React.createElement(QuickCard, {
        title: "আজকের সময়সূচি",
        icon: "calendar-days",
        empty: todaySchedule.length === 0,
        onGo: () => go('schedule'),
        count: todaySchedule.length
      }, todaySchedule.slice(0, 4).map(s => {
        const due = isDueNowTime(s.time);
        return /*#__PURE__*/React.createElement("div", {
          key: s.id,
          className: "flex items-center justify-between py-1 text-sm " + (due ? 'text-rose-600 font-semibold' : '')
        },
          /*#__PURE__*/React.createElement("span", { className: "font-bn truncate flex-1 pr-2" }, s.title),
          /*#__PURE__*/React.createElement("span", { className: "text-xs text-slate-500 font-mono" }, s.time || '—')
        );
      })),

      /* Open To-Dos */
      /*#__PURE__*/React.createElement(QuickCard, {
        title: "কাজের তালিকা",
        icon: "check-square",
        empty: openTodos === 0,
        onGo: () => go('todos'),
        count: openTodos
      }, state.todos.filter(t => !t.done).slice(0, 4).map(t => /*#__PURE__*/React.createElement("div", {
        key: t.id,
        className: "py-1 text-sm truncate font-bn text-slate-700 dark:text-slate-300"
      }, "• ", t.title))),

      /* Mistake Vault */
      /*#__PURE__*/React.createElement(QuickCard, {
        title: "ভুল ভান্ডার",
        icon: "alert-triangle",
        empty: mistakes === 0,
        onGo: () => go('mistakes'),
        count: mistakes
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-sm text-slate-500 font-bn py-1"
      }, mistakes, " টি প্রশ্ন রিভিশনের অপেক্ষায়।"))
    ),

    /* Focus Area — Mistakes Tracker */
    focusArea.length > 0 && /*#__PURE__*/React.createElement(Card, {
      className: "p-4"
    },
      /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-2 mb-2 font-bn"
      },
        /*#__PURE__*/React.createElement(Icon, { name: "target", size: 16 }),
        /*#__PURE__*/React.createElement("div", { className: "font-medium text-sm text-slate-800 dark:text-slate-200" }, "দুর্বল বিষয় ও অধ্যায় ট্র্যাকার"),
        /*#__PURE__*/React.createElement("span", { className: "ml-auto text-xs text-slate-400 font-sans" }, "Sorted by errors")
      ),
      /*#__PURE__*/React.createElement("div", {
        className: "grid md:grid-cols-2 gap-2"
      }, focusArea.slice(0, 4).map((f, i) => /*#__PURE__*/React.createElement("button", {
        key: i,
        onClick: () => setFocusOpen(f),
        className: "text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-300 hover:bg-rose-50/30 dark:hover:bg-rose-950/20 transition flex items-center gap-3"
      },
        /*#__PURE__*/React.createElement("div", {
          className: "w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300 flex items-center justify-center text-xs font-bold font-mono"
        }, f.count),
        /*#__PURE__*/React.createElement("div", { className: "flex-1 min-w-0" },
          /*#__PURE__*/React.createElement("div", { className: "text-xs font-semibold truncate font-bn text-slate-800 dark:text-slate-200" }, subjectName(state, f.subjectId) || 'Unassigned'),
          /*#__PURE__*/React.createElement("div", { className: "text-[11px] text-slate-400 truncate font-bn" }, f.topicId ? topicName(state, f.subjectId, f.topicId) : '—')
        ),
        /*#__PURE__*/React.createElement(Icon, { name: "chevron-right", size: 14, className: "text-slate-400" })
      )))
    ),

    /* Modal for Mistakes list */
    /*#__PURE__*/React.createElement(Modal, {
      open: !!focusOpen,
      onClose: () => setFocusOpen(null),
      title: focusOpen ? \`ভুল প্রশ্ন — \${subjectName(state, focusOpen.subjectId) || 'Unassigned'} / \${topicName(state, focusOpen.subjectId, focusOpen.topicId) || '—'}\` : '',
      wide: true
    },
      /*#__PURE__*/React.createElement("div", {
        className: "grid gap-2 max-h-[60vh] overflow-auto scrollbar-thin"
      }, focusOpen?.items.map(m => /*#__PURE__*/React.createElement("div", {
        key: m.id,
        className: "p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-bn"
      },
        /*#__PURE__*/React.createElement("div", { className: "font-medium text-slate-800 dark:text-slate-200" }, m.mcq.q || m.mcq.question),
        /*#__PURE__*/React.createElement("div", { className: "text-xs text-emerald-600 dark:text-emerald-400 mt-1" }, "সঠিক উত্তর: ", m.mcq.options[m.mcq.correct])
      )))
    ),

    /* 2 Clean Quick Actions */
    /*#__PURE__*/React.createElement("div", {
      className: "grid md:grid-cols-2 gap-3"
    },
      /*#__PURE__*/React.createElement(QuickAction, {
        icon: "graduation-cap",
        title: "MCQ পরীক্ষা",
        desc: "ডিউ প্রশ্ন, বিষয় ও অধ্যায় ভিত্তিক কাস্টম টেস্ট",
        onClick: () => go('exam')
      }),
      /*#__PURE__*/React.createElement(QuickAction, {
        icon: "layers",
        title: "ফ্ল্যাশকার্ড রিভিশন",
        desc: "৩ডি ফ্লিপ কার্ড ও স্পিচ স্টাডি সেশন",
        onClick: () => go('cards')
      })
    )
  );
}

`;
  content = content.slice(0, dashStart) + cleanDashboard + content.slice(statStart);
  console.log('Successfully cleaned Dashboard to minimalist premium aesthetic');
} else {
  console.warn('Dashboard bounds not found', dashStart, statStart);
}

// 2. Clean SettingsView (ZERO demo data options, iOS/Linear minimal style)
const settingsStart = content.indexOf('function SettingsView() {');
const rootStart = content.indexOf('/* ---------- Root ---------- */');

if (settingsStart !== -1 && rootStart !== -1) {
  const cleanSettings = `function SettingsView() {
  const {
    state,
    dispatch
  } = useVault();
  const p = state.profile;

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
    className: "space-y-4 max-w-xl mx-auto pb-12"
  },
    /* Minimal Header */
    /*#__PURE__*/React.createElement("div", { className: "border-b border-slate-200/80 dark:border-slate-800 pb-3" },
      /*#__PURE__*/React.createElement("h2", { className: "text-lg font-semibold font-bn text-slate-900 dark:text-white" }, "সেটিংস"),
      /*#__PURE__*/React.createElement("p", { className: "text-xs text-slate-400 font-bn mt-0.5" }, "প্রোফাইল, থিম এবং ব্যাকআপ ব্যবস্থাপনা।")
    ),

    /* 1. Profile */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-4 space-y-3"
    },
      /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2 text-sm font-semibold font-bn text-slate-800 dark:text-slate-200" },
        /*#__PURE__*/React.createElement(Icon, { name: "user", size: 16 }),
        "শিক্ষার্থীর পরিচিতি"
      ),
      /*#__PURE__*/React.createElement("div", { className: "space-y-2 pt-1 font-bn" },
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("label", { className: "text-[11px] text-slate-400 mb-1 block" }, "নাম"),
          /*#__PURE__*/React.createElement(Input, {
            placeholder: "যেমন: মোঃ ওয়াদুদ হোসেন",
            value: p.name || '',
            onChange: e => dispatch({
              type: 'SET_PROFILE',
              patch: { name: e.target.value }
            })
          })
        ),
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("label", { className: "text-[11px] text-slate-400 mb-1 block" }, "লক্ষ্য / টার্গেট"),
          /*#__PURE__*/React.createElement(Input, {
            placeholder: "যেমন: বুয়েট ও মেডিকেল ভর্তি ২০২৬",
            value: p.target || '',
            onChange: e => dispatch({
              type: 'SET_PROFILE',
              patch: { target: e.target.value }
            })
          })
        )
      )
    ),

    /* 2. Appearance & Language */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-4 space-y-3"
    },
      /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2 text-sm font-semibold font-bn text-slate-800 dark:text-slate-200" },
        /*#__PURE__*/React.createElement(Icon, { name: "sun-moon", size: 16 }),
        "রূপরেখা ও ভাষা"
      ),
      /*#__PURE__*/React.createElement("div", { className: "grid grid-cols-2 gap-2.5 pt-1" },
        /* Light/Dark Toggle */
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: () => dispatch({ type: 'SET_UI', patch: { theme: state.ui.theme === 'dark' ? 'light' : 'dark' } }),
          className: "p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 flex items-center justify-center gap-2 text-xs font-semibold font-bn text-slate-700 dark:text-slate-300 transition"
        },
          /*#__PURE__*/React.createElement(Icon, { name: state.ui.theme === 'dark' ? 'sun' : 'moon', size: 15 }),
          state.ui.theme === 'dark' ? 'লাইট মোড' : 'ডার্ক মোড'
        ),
        /* Lang Toggle */
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: () => dispatch({ type: 'SET_UI', patch: { lang: state.ui.lang === 'bn' ? 'en' : 'bn' } }),
          className: "p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 flex items-center justify-center gap-2 text-xs font-semibold font-bn text-slate-700 dark:text-slate-300 transition"
        },
          /*#__PURE__*/React.createElement(Icon, { name: "languages", size: 15 }),
          state.ui.lang === 'bn' ? 'English' : 'বাংলা'
        )
      )
    ),

    /* 3. Notifications */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-4 space-y-2.5"
    },
      /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2 text-sm font-semibold font-bn text-slate-800 dark:text-slate-200" },
        /*#__PURE__*/React.createElement(Icon, { name: "bell", size: 16 }),
        "নোটিফিকেশন ও অ্যালার্ম"
      ),
      /*#__PURE__*/React.createElement("div", { className: "space-y-2 pt-1 font-bn" },
        /*#__PURE__*/React.createElement("label", {
          className: "flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
        },
          /*#__PURE__*/React.createElement("span", { className: "text-xs text-slate-700 dark:text-slate-300" }, "পপআপ নোটিফিকেশন"),
          /*#__PURE__*/React.createElement("input", {
            type: "checkbox",
            checked: notif.popup,
            onChange: e => dispatch({
              type: 'SET_NOTIF',
              patch: { popup: e.target.checked }
            }),
            className: "w-4 h-4 accent-brand-600 rounded"
          })
        ),
        /*#__PURE__*/React.createElement("label", {
          className: "flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
        },
          /*#__PURE__*/React.createElement("span", { className: "text-xs text-slate-700 dark:text-slate-300" }, "অ্যালার্ম ও রিমাইন্ডার সাউন্ড"),
          /*#__PURE__*/React.createElement("input", {
            type: "checkbox",
            checked: notif.beep,
            onChange: e => dispatch({
              type: 'SET_NOTIF',
              patch: { beep: e.target.checked }
            }),
            className: "w-4 h-4 accent-brand-600 rounded"
          })
        )
      )
    ),

    /* 4. Backup & Storage */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-4 space-y-3"
    },
      /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2 text-sm font-semibold font-bn text-slate-800 dark:text-slate-200" },
        /*#__PURE__*/React.createElement(Icon, { name: "folder-archive", size: 16 }),
        "ব্যাকআপ ও রিস্টোর"
      ),
      /*#__PURE__*/React.createElement("div", { className: "flex flex-wrap gap-2.5 pt-1 font-bn" },
        /* Export Backup */
        /*#__PURE__*/React.createElement(Btn, {
          onClick: exportJSON,
          className: "text-xs px-3.5 py-2 font-medium"
        },
          /*#__PURE__*/React.createElement(Icon, { name: "download", size: 14 }),
          "ব্যাকআপ এক্সপোর্ট (.json)"
        ),
        /* Import Backup */
        /*#__PURE__*/React.createElement("label", {
          className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium cursor-pointer transition shadow-sm"
        },
          /*#__PURE__*/React.createElement(Icon, { name: "upload", size: 14 }),
          "ব্যাকআপ ইমপোর্ট",
          /*#__PURE__*/React.createElement("input", {
            type: "file",
            accept: ".json",
            className: "hidden",
            onChange: importJSON
          })
        )
      ),
      /* Reset */
      /*#__PURE__*/React.createElement("div", { className: "pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end" },
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: handleResetAll,
          className: "text-xs text-rose-500 hover:text-rose-600 font-bn font-medium hover:underline"
        }, "সব ডাটা রিসেট করুন")
      )
    ),

    /* Minimalist Footer */
    /*#__PURE__*/React.createElement("div", {
      className: "text-center pt-2 text-[11px] text-slate-400 font-bn"
    }, BRAND, " · v4.0 · ", CREDIT)
  );
}
`;
  content = content.slice(0, settingsStart) + cleanSettings + content.slice(rootStart);
  console.log('Successfully cleaned SettingsView to production minimal layout');
} else {
  console.warn('SettingsView bounds not found', settingsStart, rootStart);
}

fs.writeFileSync(appPath, content, 'utf8');
console.log('public/app.js updated cleanly!');
