const fs = require('fs');

console.log('Building upgrades for FlashcardsView, TimerView, and SettingsView...');
const appJsPath = 'public/app.js';
let src = fs.readFileSync(appJsPath, 'utf8');

// =========================================================================
// 1. FLASHCARDSVIEW UPGRADE: Custom Study Modal & Study Anytime
// =========================================================================
// We replace FlashcardsView to add custom study session modal with untested & due filters
const oldFlashcardsViewRegex = /function FlashcardsView\(\)\s*\{[\s\S]*?\/\/\s*Inline flash list for Subjects drill/;

const newFlashcardsView = `function FlashcardsView() {
  const { state, dispatch } = useVault();
  const [add, setAdd] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState({});
  const [studying, setStudying] = useState(false);
  const [sessionCards, setSessionCards] = useState([]);
  const [sessionMode, setSessionMode] = useState('study'); // 'study' | 'exam'

  // Session builder options
  const [cardStatusFilter, setCardStatusFilter] = useState('all'); // all | untested | due | hard
  const [cardCount, setCardCount] = useState(10);
  const [cardOrder, setCardOrder] = useState('shuffle'); // shuffle | seq

  const list = state.flashcards.filter(c => matchFilter(c, filter));
  const due = list.filter(c => !c.due || c.due <= todayISO());
  const untested = list.filter(c => !c.interval || c.interval === 0);
  const hard = list.filter(c => c.difficulty === 'hard');

  // Filter pool based on session builder settings
  function getMatchingPool(customFilter, statusFilter) {
    let pool = state.flashcards.filter(c => matchFilter(c, customFilter));
    if (statusFilter === 'untested') {
      pool = pool.filter(c => !c.interval || c.interval === 0);
    } else if (statusFilter === 'due') {
      pool = pool.filter(c => !c.due || c.due <= todayISO());
    } else if (statusFilter === 'hard') {
      pool = pool.filter(c => c.difficulty === 'hard');
    }
    return pool;
  }

  function startSession(targetMode = 'study', overridePool = null) {
    let pool = overridePool || getMatchingPool(filter, cardStatusFilter);
    if (pool.length === 0) {
      toast('এই ফিল্টারে কোনো ফ্ল্যাশকার্ড পাওয়া যায়নি।', 'error');
      return;
    }
    if (cardOrder === 'shuffle') {
      pool = [...pool].sort(() => Math.random() - 0.5);
    }
    const count = Math.max(1, +cardCount || 10);
    const selected = pool.slice(0, Math.min(count, pool.length));
    setSessionCards(selected);
    setSessionMode(targetMode);
    setShowSessionModal(false);
    setStudying(true);
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "grid gap-4"
  },
    /* Filter Bar Card */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-3.5 grid gap-2.5"
    },
      /* Subject Picker */
      /*#__PURE__*/React.createElement(SubjectPicker, {
        value: filter,
        onChange: p => setFilter({ ...filter, ...p }),
        allowEmpty: true
      }),
      /* Secondary filter row */
      /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-2 flex-wrap"
      },
        /* Difficulty */
        /*#__PURE__*/React.createElement(Select, {
          value: filter.difficulty || '',
          onChange: e => setFilter({ ...filter, difficulty: e.target.value || undefined }),
          className: "text-xs"
        },
          /*#__PURE__*/React.createElement("option", { value: "" }, "সব ডিফিকাল্টি"),
          /*#__PURE__*/React.createElement("option", { value: "easy" }, "সহজ"),
          /*#__PURE__*/React.createElement("option", { value: "hard" }, "কঠিন")
        ),
        /* Clear */
        /*#__PURE__*/React.createElement(Btn, {
          variant: "ghost",
          size: "sm",
          onClick: () => setFilter({})
        }, "রিসেট ফিল্টার"),
        /* Count Badge */
        /*#__PURE__*/React.createElement("span", {
          className: "ml-auto text-xs text-slate-500 font-medium font-mono"
        }, list.length, " টি কার্ড রয়েছে (", due.length, " ডিউ, ", untested.length, " নতুন)")
      )
    ),

    /* Action Buttons Row */
    /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2 flex-wrap items-center"
    },
      /* New Card Button */
      /*#__PURE__*/React.createElement(Btn, {
        onClick: () => {
          setEditing({
            id: uid(),
            front: '',
            back: '',
            ease: 2.5,
            interval: 0,
            due: todayISO(),
            difficulty: 'easy',
            ...filter
          });
          setAdd(true);
        }
      },
        /*#__PURE__*/React.createElement(Icon, { name: "plus", size: 16 }),
        /*#__PURE__*/React.createElement("span", null, "নতুন কার্ড")
      ),

      /* Custom Study & Exam Session Button (ANYTIME ON-DEMAND) */
      /*#__PURE__*/React.createElement(Btn, {
        variant: "primary",
        className: "bg-gradient-to-r from-brand-600 to-teal-600 text-white font-bold shadow-md",
        onClick: () => setShowSessionModal(true)
      },
        /*#__PURE__*/React.createElement(Icon, { name: "play-circle", size: 16 }),
        /*#__PURE__*/React.createElement("span", null, "স্টাডি ও এক্সাম সেশন (কাস্টম)")
      ),

      /* Quick Due Study Button (If any due) */
      due.length > 0 && /*#__PURE__*/React.createElement(Btn, {
        variant: "subtle",
        onClick: () => startSession('study', due)
      },
        /*#__PURE__*/React.createElement(Icon, { name: "clock", size: 16 }),
        /*#__PURE__*/React.createElement("span", null, \`ডিউ রিভিশন (\${due.length})\`)
      ),

      /* Bulk Add Button */
      /*#__PURE__*/React.createElement(Btn, {
        variant: "outline",
        onClick: () => setShowBulk(true)
      },
        /*#__PURE__*/React.createElement(Icon, { name: "upload", size: 16 }),
        /*#__PURE__*/React.createElement("span", null, "বাল্ক যোগ")
      )
    ),

    /* Empty state */
    list.length === 0 && /*#__PURE__*/React.createElement(Empty, {
      icon: "layers",
      text: "কোনো ফ্ল্যাশকার্ড পাওয়া যায়নি। উপরের 'নতুন কার্ড' বাটনে ক্লিক করে কার্ড যোগ করুন।"
    }),

    /* Flashcard Tiles Grid */
    /*#__PURE__*/React.createElement("div", {
      className: "grid md:grid-cols-2 gap-2.5"
    },
      list.map(c => /*#__PURE__*/React.createElement(FlashTile, {
        key: c.id,
        c: c,
        subject: c.subjectId ? subjectName(state, c.subjectId) : null,
        onEdit: () => { setEditing(c); setAdd(true); },
        onDelete: () => dispatch({ type: 'REMOVE_ITEM', key: 'flashcards', id: c.id }),
        onQuickStudy: () => {
          setSessionCards([c]);
          setSessionMode('study');
          setStudying(true);
        }
      }))
    ),

    /* Modal: Custom Session Builder (Study & Exam Anywhere/Anytime) */
    showSessionModal && /*#__PURE__*/React.createElement(Modal, {
      open: showSessionModal,
      onClose: () => setShowSessionModal(false),
      title: "🎯 কাস্টম ফ্ল্যাশকার্ড সেশন ও এক্সাম",
      wide: true
    },
      /*#__PURE__*/React.createElement("div", {
        className: "space-y-4"
      },
        /* Explanation banner */
        /*#__PURE__*/React.createElement("div", {
          className: "p-3 rounded-2xl bg-brand-50/80 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/50 text-xs text-brand-800 dark:text-brand-300 leading-relaxed"
        }, "যেকোনো বিষয়, অধ্যায় বা টপিক থেকে আপনার পছন্দমতো যেকোনো সংখ্যক কার্ড নিয়ে যখন খুশি পড়াশোনা বা ফ্ল্যাশকার্ড এক্সাম দিন।"),

        /* Subject / Topic Filter for Session */
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("div", { className: "text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" }, "বিষয় / টপিক নির্বাচন"),
          /*#__PURE__*/React.createElement(SubjectPicker, {
            value: filter,
            onChange: p => setFilter({ ...filter, ...p }),
            allowEmpty: true
          })
        ),

        /* Question Status Selection (Untested / Due / Hard / All) */
        /*#__PURE__*/React.createElement("div", { className: "grid sm:grid-cols-2 gap-3" },
          /* Status */
          /*#__PURE__*/React.createElement("label", { className: "flex flex-col text-xs text-slate-500 gap-1 font-medium" },
            "কার্ডের অবস্থা (Card Status)",
            /*#__PURE__*/React.createElement(Select, {
              value: cardStatusFilter,
              onChange: e => setCardStatusFilter(e.target.value)
            },
              /*#__PURE__*/React.createElement("option", { value: "all" }, "সব কার্ড (All Cards)"),
              /*#__PURE__*/React.createElement("option", { value: "untested" }, "🆕 এখনো পড়া হয়নি (Untested Only)"),
              /*#__PURE__*/React.createElement("option", { value: "due" }, "🔄 রিভিশন বাকি / ডিউ (Due for Review)"),
              /*#__PURE__*/React.createElement("option", { value: "hard" }, "⚠️ কঠিন চিহ্নিত কার্ড (Hard Cards Only)")
            )
          ),
          /* Card Count */
          /*#__PURE__*/React.createElement("label", { className: "flex flex-col text-xs text-slate-500 gap-1 font-medium" },
            "কার্ড সংখ্যা (Count)",
            /*#__PURE__*/React.createElement(Select, {
              value: cardCount,
              onChange: e => setCardCount(e.target.value)
            },
              /*#__PURE__*/React.createElement("option", { value: "5" }, "৫ টি কার্ড"),
              /*#__PURE__*/React.createElement("option", { value: "10" }, "১০ টি কার্ড"),
              /*#__PURE__*/React.createElement("option", { value: "15" }, "১৫ টি কার্ড"),
              /*#__PURE__*/React.createElement("option", { value: "20" }, "২০ টি কার্ড"),
              /*#__PURE__*/React.createElement("option", { value: "30" }, "৩০ টি কার্ড"),
              /*#__PURE__*/React.createElement("option", { value: "100" }, "সবগুলো উপলব্ধ কার্ড")
            )
          )
        ),

        /* Order & Mode Options */
        /*#__PURE__*/React.createElement("div", { className: "grid sm:grid-cols-2 gap-3" },
          /* Order */
          /*#__PURE__*/React.createElement("label", { className: "flex flex-col text-xs text-slate-500 gap-1 font-medium" },
            "কার্ডের ক্রম (Order)",
            /*#__PURE__*/React.createElement(Select, {
              value: cardOrder,
              onChange: e => setCardOrder(e.target.value)
            },
              /*#__PURE__*/React.createElement("option", { value: "shuffle" }, "🔀 র‍্যান্ডম / এলোমেলো (Shuffled)"),
              /*#__PURE__*/React.createElement("option", { value: "seq" }, "📋 ক্রমানুসারে (Sequential)")
            )
          ),
          /* Live Count Indicator */
          /*#__PURE__*/React.createElement("div", { className: "flex flex-col justify-end" },
            /*#__PURE__*/React.createElement("div", {
              className: "p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between"
            },
              /*#__PURE__*/React.createElement("span", null, "উপলব্ধ কার্ড সংখ্যা:"),
              /*#__PURE__*/React.createElement("span", { className: "font-bold font-mono px-2 py-0.5 rounded-lg bg-brand-600 text-white" },
                getMatchingPool(filter, cardStatusFilter).length, " টি"
              )
            )
          )
        ),

        /* Start Mode Buttons */
        /*#__PURE__*/React.createElement("div", {
          className: "grid sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-slate-800"
        },
          /* Start Study Mode */
          /*#__PURE__*/React.createElement(Btn, {
            onClick: () => startSession('study'),
            className: "py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold flex items-center justify-center gap-2"
          },
            /*#__PURE__*/React.createElement(Icon, { name: "book-open", size: 18 }),
            /*#__PURE__*/React.createElement("span", null, "🎓 সেলফ-স্টাডি মোড শুরু")
          ),
          /* Start Flashcard Exam Mode */
          /*#__PURE__*/React.createElement(Btn, {
            variant: "subtle",
            onClick: () => startSession('exam'),
            className: "py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 border border-amber-500/40 font-bold flex items-center justify-center gap-2"
          },
            /*#__PURE__*/React.createElement(Icon, { name: "timer", size: 18 }),
            /*#__PURE__*/React.createElement("span", null, "⏱️ ফ্ল্যাশকার্ড এক্সাম মোড")
          )
        )
      )
    ),

    /* Add/Edit Modal */
    /*#__PURE__*/React.createElement(Modal, {
      open: add,
      onClose: () => { setAdd(false); setEditing(null); },
      title: editing && state.flashcards.find(f => f.id === editing.id) ? 'ফ্ল্যাশকার্ড সম্পাদনা' : 'নতুন ফ্ল্যাশকার্ড',
      wide: true
    },
      editing && /*#__PURE__*/React.createElement("div", {
        className: "grid gap-3"
      },
        /* Front */
        /*#__PURE__*/React.createElement("label", { className: "flex flex-col text-xs text-slate-500 gap-1 font-medium" },
          "সামনের অংশ / প্রশ্ন (Front)",
          /*#__PURE__*/React.createElement(TextArea, {
            placeholder: "প্রশ্ন বা কী-ওয়ার্ড লিখুন...",
            rows: "3",
            value: editing.front,
            onChange: e => setEditing({ ...editing, front: e.target.value })
          })
        ),
        /* Back */
        /*#__PURE__*/React.createElement("label", { className: "flex flex-col text-xs text-slate-500 gap-1 font-medium" },
          "পেছনের অংশ / উত্তর ও ব্যাখ্যা (Back)",
          /*#__PURE__*/React.createElement(TextArea, {
            placeholder: "সঠিক উত্তর, সারসংক্ষেপ বা সূত্র...",
            rows: "4",
            value: editing.back,
            onChange: e => setEditing({ ...editing, back: e.target.value })
          })
        ),
        /* Subject Picker */
        /*#__PURE__*/React.createElement(SubjectPicker, {
          value: editing,
          onChange: p => setEditing({ ...editing, ...p }),
          allowEmpty: true
        }),
        /* Difficulty */
        /*#__PURE__*/React.createElement(Select, {
          value: editing.difficulty || 'easy',
          onChange: e => setEditing({ ...editing, difficulty: e.target.value })
        },
          /*#__PURE__*/React.createElement("option", { value: "easy" }, "সহজ (Easy)"),
          /*#__PURE__*/React.createElement("option", { value: "hard" }, "কঠিন (Hard)")
        ),
        /* Actions */
        /*#__PURE__*/React.createElement("div", {
          className: "flex justify-end gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800"
        },
          /*#__PURE__*/React.createElement(Btn, {
            variant: "ghost",
            onClick: () => { setAdd(false); setEditing(null); }
          }, "বাতিল"),
          /*#__PURE__*/React.createElement(Btn, {
            onClick: () => {
              if (!editing.front || !editing.back) {
                toast('প্রশ্ন এবং উত্তর উভয়ই পূরণ করুন', 'error');
                return;
              }
              const exists = state.flashcards.find(x => x.id === editing.id);
              if (exists) {
                dispatch({ type: 'UPDATE_ITEM', key: 'flashcards', item: editing });
              } else {
                dispatch({ type: 'ADD_ITEM', key: 'flashcards', item: editing });
              }
              setAdd(false);
              setEditing(null);
              toast('ফ্ল্যাশকার্ড সংরক্ষিত হয়েছে', 'success');
            }
          }, "সংরক্ষণ করুন")
        )
      )
    ),

    /* Bulk Add Modal */
    /*#__PURE__*/React.createElement(Modal, {
      open: showBulk,
      onClose: () => setShowBulk(false),
      title: "একসাথে অনেক ফ্ল্যাশকার্ড যোগ করুন (Bulk Add)",
      wide: true
    },
      /*#__PURE__*/React.createElement(BulkFlash, {
        onDone: items => {
          dispatch({ type: 'ADD_MANY', key: 'flashcards', items });
          setShowBulk(false);
          toast(\`\${items.length} টি ফ্ল্যাশকার্ড যোগ হয়েছে\`, 'success');
        }
      })
    ),

    /* Study Runner Active */
    studying && /*#__PURE__*/React.createElement(StudyRunner, {
      cards: sessionCards.length > 0 ? sessionCards : (due.length > 0 ? due : list),
      mode: sessionMode,
      onExit: () => setStudying(false)
    })
  );
}

// Inline flash list for Subjects drill`;

if (oldFlashcardsViewRegex.test(src)) {
  src = src.replace(oldFlashcardsViewRegex, newFlashcardsView);
  console.log('1. Upgraded FlashcardsView with Custom Study & Exam session modal.');
} else {
  console.warn('Could not match oldFlashcardsViewRegex');
}


// =========================================================================
// 2. FOCUS TIMER OVERHAUL: Circular Progress Ring, Ambient Sounds, Stats
// =========================================================================
const oldTimerRegex = /function TimerView\(\)\s*\{[\s\S]*?\/\* ---------- Quotes ---------- \*\//;

const newTimerView = `function TimerView() {
  const { state, dispatch } = useVault();
  const [timerType, setTimerType] = useState('pomodoro'); // 'pomodoro' | 'stopwatch'
  const [work, setWork] = useState(25);
  const [brk, setBrk] = useState(5);
  const [mode, setMode] = useState('idle'); // 'idle' | 'work' | 'break' | 'running'
  const [remaining, setRemaining] = useState(25 * 60);
  const [stopwatchSec, setStopwatchSec] = useState(0);
  const [sound, setSound] = useState('off');
  const [vol, setVol] = useState(0.15);
  const [zenMode, setZenMode] = useState(false);
  const tickRef = useRef();

  useEffect(() => {
    if (AudioEngine && AudioEngine.volume) AudioEngine.volume(vol);
  }, [vol]);

  // Pomodoro countdown effect
  useEffect(() => {
    if (timerType === 'pomodoro') {
      if (mode === 'idle') return;
      tickRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            clearInterval(tickRef.current);
            if (mode === 'work') {
              dispatch({
                type: 'ADD_ITEM',
                key: 'timerSessions',
                item: { id: uid(), date: todayISO(), minutes: work }
              });
              dispatch({ type: 'ADD_XP', amount: work });
              if (AudioEngine && AudioEngine.reminderChime) AudioEngine.reminderChime();
              toast(\`অভিনন্দন! \${work} মিনিটের ফোকাস সেশন সম্পন্ন!\`, 'success');
              setMode('break');
              return brk * 60;
            } else {
              toast('বিরতি শেষ — নতুন শক্তিতে শুরু করুন!', 'success');
              setMode('idle');
              return work * 60;
            }
          }
          return r - 1;
        });
      }, 1000);
      return () => clearInterval(tickRef.current);
    } else {
      // Stopwatch mode
      if (mode === 'running') {
        tickRef.current = setInterval(() => {
          setStopwatchSec(s => s + 1);
        }, 1000);
        return () => clearInterval(tickRef.current);
      }
    }
  }, [mode, timerType, work, brk]);

  function start() {
    if (timerType === 'pomodoro') {
      setRemaining(work * 60);
      setMode('work');
    } else {
      setMode('running');
    }
  }

  function pause() {
    clearInterval(tickRef.current);
    setMode('idle');
  }

  function stop() {
    clearInterval(tickRef.current);
    if (timerType === 'stopwatch' && stopwatchSec >= 60) {
      const mins = Math.round(stopwatchSec / 60);
      dispatch({
        type: 'ADD_ITEM',
        key: 'timerSessions',
        item: { id: uid(), date: todayISO(), minutes: mins }
      });
      dispatch({ type: 'ADD_XP', amount: mins });
      toast(\`স্টপওয়াচ সেশন সেভ হয়েছে: \${mins} মিনিট (+ \${mins} XP)\`, 'success');
    }
    setMode('idle');
    setRemaining(work * 60);
    setStopwatchSec(0);
  }

  function adjustMinutes(delta) {
    if (mode !== 'idle') return;
    const next = Math.max(1, Math.min(180, work + delta));
    setWork(next);
    setRemaining(next * 60);
  }

  function pickPreset(m) {
    if (mode !== 'idle') return;
    setWork(m);
    setRemaining(m * 60);
  }

  function pickSound(s) {
    setSound(s);
    if (!AudioEngine) return;
    if (s === 'off') AudioEngine.stop();
    else if (s === 'white') AudioEngine.whiteNoise();
    else if (s === 'brown') AudioEngine.brownNoise();
    else if (s === 'focus') AudioEngine.binaural(200, 10);
    else if (s === 'relax') AudioEngine.binaural(180, 6);
  }

  // Today focus stats
  const todaySessions = state.timerSessions.filter(s => s.date === todayISO());
  const todayFocusMinutes = todaySessions.reduce((acc, s) => acc + (s.minutes || 0), 0);

  // Time display
  const currentTotal = timerType === 'pomodoro' ? (mode === 'break' ? brk * 60 : work * 60) : 0;
  const currentRemaining = timerType === 'pomodoro' ? remaining : stopwatchSec;
  const mm = String(Math.floor(currentRemaining / 60)).padStart(2, '0');
  const ss = String(currentRemaining % 60).padStart(2, '0');

  // Ring circumference for SVG (r=120, C = 2*PI*120 ≈ 754)
  const radius = 120;
  const circ = 2 * Math.PI * radius;
  const strokeOffset = timerType === 'pomodoro'
    ? circ * (1 - (remaining / Math.max(1, currentTotal)))
    : circ * ((stopwatchSec % 60) / 60);

  return /*#__PURE__*/React.createElement("div", {
    className: \`space-y-6 max-w-4xl mx-auto \${zenMode ? 'fixed inset-0 z-[1000] bg-slate-950 p-6 flex flex-col justify-center items-center overflow-auto' : ''}\`
  },
    /* Header & Zen Mode Switch */
    /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between"
    },
      /* Mode Tabs */
      /*#__PURE__*/React.createElement("div", {
        className: "flex gap-1.5 p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800 border border-slate-300/50 dark:border-slate-700"
      },
        /* Pomodoro */
        /*#__PURE__*/React.createElement("button", {
          onClick: () => { setTimerType('pomodoro'); setMode('idle'); setRemaining(work * 60); },
          className: \`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition \${timerType === 'pomodoro' ? 'bg-white dark:bg-slate-900 text-brand-700 dark:text-brand-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'}\`
        }, "🍅 পোমোডোরো"),
        /* Stopwatch */
        /*#__PURE__*/React.createElement("button", {
          onClick: () => { setTimerType('stopwatch'); setMode('idle'); setStopwatchSec(0); },
          className: \`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition \${timerType === 'stopwatch' ? 'bg-white dark:bg-slate-900 text-brand-700 dark:text-brand-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'}\`
        }, "⏱️ স্টপওয়াচ")
      ),
      /* Zen Mode Button */
      /*#__PURE__*/React.createElement("button", {
        onClick: () => setZenMode(!zenMode),
        className: \`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition \${zenMode ? 'bg-amber-500 text-white border-amber-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}\`
      },
        /*#__PURE__*/React.createElement(Icon, { name: zenMode ? "minimize-2" : "maximize-2", size: 14 }),
        /*#__PURE__*/React.createElement("span", null, zenMode ? "জেন মোড বন্ধ" : "জেন ফোকাস")
      )
    ),

    /* Main Dial Card */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-6 sm:p-8 text-center relative overflow-hidden bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-xl rounded-3xl"
    },
      /* Mode Status Chip */
      /*#__PURE__*/React.createElement("div", {
        className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 " +
          (mode === 'work' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' :
           mode === 'break' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30' :
           mode === 'running' ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30' :
           'bg-slate-100 dark:bg-slate-800 text-slate-500')
      },
        /*#__PURE__*/React.createElement("span", { className: "w-2 h-2 rounded-full " + (mode !== 'idle' ? 'bg-emerald-500 animate-ping' : 'bg-slate-400') }),
        /*#__PURE__*/React.createElement("span", null,
          mode === 'work' ? '🎯 পড়াশোনা চলছে (DEEP FOCUS)' :
          mode === 'break' ? '☕ বিরতি সময় (RECHARGE)' :
          mode === 'running' ? '⏱️ স্টপওয়াচ কাউন্টিং' : 'প্রস্তুত (READY TO STUDY)'
        )
      ),

      /* Circular SVG Progress Meter & Timer Digits */
      /*#__PURE__*/React.createElement("div", {
        className: "relative w-64 h-64 sm:w-72 sm:h-72 mx-auto my-2 flex items-center justify-center"
      },
        /* SVG Ring */
        /*#__PURE__*/React.createElement("svg", {
          className: "w-full h-full transform -rotate-90",
          viewBox: "0 0 280 280"
        },
          /* Background Ring */
          /*#__PURE__*/React.createElement("circle", {
            cx: "140",
            cy: "140",
            r: radius,
            className: "text-slate-200 dark:text-slate-800/80 stroke-current",
            strokeWidth: "12",
            fill: "transparent"
          }),
          /* Progress Ring */
          /*#__PURE__*/React.createElement("circle", {
            cx: "140",
            cy: "140",
            r: radius,
            className: \`stroke-current transition-all duration-500 \${mode === 'break' ? 'text-amber-500' : 'text-brand-500'}\`,
            strokeWidth: "12",
            strokeDasharray: circ,
            strokeDashoffset: strokeOffset,
            strokeLinecap: "round",
            fill: "transparent"
          })
        ),

        /* Central Digits and Controls */
        /*#__PURE__*/React.createElement("div", {
          className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        },
          /* Clock Digits */
          /*#__PURE__*/React.createElement("div", {
            className: "text-5xl sm:text-6xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-white select-all drop-shadow-sm"
          }, mm, ":", ss),
          /* Tagline */
          /*#__PURE__*/React.createElement("div", {
            className: "text-xs text-slate-400 font-medium mt-1 font-bn"
          }, timerType === 'pomodoro' ? (mode === 'break' ? 'বিশ্রাম নিন' : 'মনোযোগ ধরে রাখুন') : 'চলমান সময়')
        )
      ),

      /* Quick Adjust Buttons (Only in idle pomodoro) */
      timerType === 'pomodoro' && mode === 'idle' && /*#__PURE__*/React.createElement("div", {
        className: "flex justify-center items-center gap-2 my-3"
      },
        /*#__PURE__*/React.createElement("button", {
          onClick: () => adjustMinutes(-5),
          className: "px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold transition"
        }, "-৫মি."),
        /*#__PURE__*/React.createElement("button", {
          onClick: () => adjustMinutes(-1),
          className: "px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold transition"
        }, "-১মি."),
        /*#__PURE__*/React.createElement("span", { className: "text-xs font-semibold px-2 text-slate-500" }, "সময় সেট: ", work, " মিনিট"),
        /*#__PURE__*/React.createElement("button", {
          onClick: () => adjustMinutes(1),
          className: "px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold transition"
        }, "+১মি."),
        /*#__PURE__*/React.createElement("button", {
          onClick: () => adjustMinutes(5),
          className: "px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold transition"
        }, "+৫মি.")
      ),

      /* Quick Preset Chips */
      timerType === 'pomodoro' && mode === 'idle' && /*#__PURE__*/React.createElement("div", {
        className: "flex flex-wrap justify-center gap-2 my-3"
      },
        [
          { m: 25, label: "🍅 ২৫ মি. পোমোডোরো" },
          { m: 45, label: "⚡ ৪৫ মি. ডিপ ওয়ার্ক" },
          { m: 60, label: "🎯 ৬০ মি. ম্যারাথন" },
          { m: 5, label: "☕ ৫ মি. ব্রেক" },
          { m: 15, label: "🌴 ১৫ মি. লং ব্রেক" }
        ].map(pr => /*#__PURE__*/React.createElement("button", {
          key: pr.m,
          onClick: () => pickPreset(pr.m),
          className: \`px-3 py-1.5 rounded-xl text-xs font-medium border transition \${work === pr.m ? 'bg-brand-600 text-white border-brand-600 shadow-sm' : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-500'}\`
        }, pr.label))
      ),

      /* Primary Play / Pause / Reset Buttons */
      /*#__PURE__*/React.createElement("div", {
        className: "flex justify-center items-center gap-3 mt-4"
      },
        mode === 'idle' ? /*#__PURE__*/React.createElement(Btn, {
          size: "lg",
          onClick: start,
          className: "px-8 py-3 bg-gradient-to-r from-brand-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white font-bold text-base shadow-lg shadow-brand-900/30 flex items-center gap-2 rounded-2xl"
        },
          /*#__PURE__*/React.createElement(Icon, { name: "play", size: 20 }),
          /*#__PURE__*/React.createElement("span", null, "শুরু করুন")
        ) : /*#__PURE__*/React.createElement("div", { className: "flex gap-2" },
          /* Pause */
          /*#__PURE__*/React.createElement(Btn, {
            size: "lg",
            variant: "subtle",
            onClick: pause,
            className: "px-6 py-3 font-bold text-base flex items-center gap-2 rounded-2xl"
          },
            /*#__PURE__*/React.createElement(Icon, { name: "pause", size: 20 }),
            /*#__PURE__*/React.createElement("span", null, "পজ")
          ),
          /* Stop */
          /*#__PURE__*/React.createElement(Btn, {
            size: "lg",
            variant: "danger",
            onClick: stop,
            className: "px-6 py-3 font-bold text-base flex items-center gap-2 rounded-2xl"
          },
            /*#__PURE__*/React.createElement(Icon, { name: "square", size: 18 }),
            /*#__PURE__*/React.createElement("span", null, "সমাপ্ত করুন")
          )
        )
      )
    ),

    /* Ambient Sound Generator Card */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-5 rounded-3xl border border-slate-200 dark:border-slate-800"
    },
      /* Header & Equalizer Animation */
      /*#__PURE__*/React.createElement("div", {
        className: "flex items-center justify-between mb-3"
      },
        /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2" },
          /*#__PURE__*/React.createElement(Icon, { name: "headphones", size: 18, className: "text-indigo-500" }),
          /*#__PURE__*/React.createElement("span", { className: "font-semibold text-sm font-bn" }, "মনোযোগ বৃদ্ধির অ্যাম্বিয়েন্ট সাউন্ডস (হোয়াইট নয়েজ)")
        ),
        /* Soundwave Equalizer when active */
        sound !== 'off' && /*#__PURE__*/React.createElement("div", {
          className: "flex items-center gap-1 h-5 px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-500"
        },
          /*#__PURE__*/React.createElement("span", { className: "w-1 bg-indigo-500 rounded-full animate-eq1" }),
          /*#__PURE__*/React.createElement("span", { className: "w-1 bg-indigo-500 rounded-full animate-eq2" }),
          /*#__PURE__*/React.createElement("span", { className: "w-1 bg-indigo-500 rounded-full animate-eq3" }),
          /*#__PURE__*/React.createElement("span", { className: "w-1 bg-indigo-500 rounded-full animate-eq4" })
        )
      ),

      /* Ambient Sound Preset Buttons */
      /*#__PURE__*/React.createElement("div", {
        className: "grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3"
      },
        [
          { id: 'off', label: '🔇 বন্ধ', icon: 'volume-x' },
          { id: 'white', label: '🌫️ হোয়াইট নয়েজ', icon: 'wind' },
          { id: 'brown', label: '☕ ব্রাউন নয়েজ', icon: 'coffee' },
          { id: 'focus', label: '⚡ আলফা ওয়েভস', icon: 'zap' },
          { id: 'relax', label: '🌊 কাম ওয়েভস', icon: 'droplet' }
        ].map(s => /*#__PURE__*/React.createElement("button", {
          key: s.id,
          onClick: () => pickSound(s.id),
          className: \`p-2.5 rounded-2xl text-xs font-semibold border flex flex-col items-center justify-center gap-1 transition \${sound === s.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'}\`
        },
          /*#__PURE__*/React.createElement("span", null, s.label)
        ))
      ),

      /* Volume Slider */
      sound !== 'off' && /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80"
      },
        /*#__PURE__*/React.createElement(Icon, { name: "volume-1", size: 16, className: "text-slate-400" }),
        /*#__PURE__*/React.createElement("input", {
          type: "range",
          min: "0.02",
          max: "0.4",
          step: "0.01",
          value: vol,
          onChange: e => setVol(+e.target.value),
          className: "flex-1 accent-indigo-600 h-1.5 rounded-lg cursor-pointer"
        }),
        /*#__PURE__*/React.createElement(Icon, { name: "volume-2", size: 16, className: "text-slate-400" }),
        /*#__PURE__*/React.createElement("span", { className: "text-xs font-mono text-slate-500 w-8 text-right" }, Math.round((vol / 0.4) * 100), "%")
      )
    ),

    /* Daily Focus Statistics */
    /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-3 gap-3"
    },
      /*#__PURE__*/React.createElement(Card, { className: "p-4 text-center rounded-2xl" },
        /*#__PURE__*/React.createElement("div", { className: "text-2xl font-bold font-mono text-brand-600 dark:text-brand-400" }, todayFocusMinutes, " মি."),
        /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500 mt-0.5 font-medium" }, "আজকের মোট ফোকাস")
      ),
      /*#__PURE__*/React.createElement(Card, { className: "p-4 text-center rounded-2xl" },
        /*#__PURE__*/React.createElement("div", { className: "text-2xl font-bold font-mono text-amber-500" }, todaySessions.length, " টি"),
        /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500 mt-0.5 font-medium" }, "সম্পন্ন পোমোডোরো")
      ),
      /*#__PURE__*/React.createElement(Card, { className: "p-4 text-center rounded-2xl" },
        /*#__PURE__*/React.createElement("div", { className: "text-2xl font-bold font-mono text-indigo-500" }, "+" + todayFocusMinutes),
        /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500 mt-0.5 font-medium" }, "অর্জিত ফোকাস XP")
      )
    )
  );
}
/* ---------- Quotes ---------- */`;

if (oldTimerRegex.test(src)) {
  src = src.replace(oldTimerRegex, newTimerView);
  console.log('2. Upgraded TimerView with circular progress, stopwatch, presets & ambient soundscape.');
} else {
  console.warn('Could not match oldTimerRegex');
}


// =========================================================================
// 3. SETTINGSVIEW OVERHAUL: Full Home Card Themes, Modes, Profile & Backup
// =========================================================================
const oldSettingsRegex = /function SettingsView\(\)\s*\{[\s\S]*?\/\* ---------- Root ---------- \*\//;

const newSettingsView = `function SettingsView() {
  const { state, dispatch } = useVault();
  const fileRef = useRef();
  const [activeTab, setActiveTab] = useState('card'); // 'card' | 'profile' | 'system'
  const p = state.profile;
  const currentMode = p.cardMode || 'auto';
  const currentColor = p.cardColor || 'emerald';
  const autoTier = getAutoTier(p);

  function exportJSON() {
    const fname = \`sonkolpo-os-backup-\${todayISO()}.json\`;
    if (window.NativeBridge && window.NativeBridge.exportFile) {
      window.NativeBridge.exportFile(fname, JSON.stringify(state, null, 2))
        .then(where => toast('Saved: ' + where, 'success'))
        .catch(err => toast('Export failed: ' + (err && err.message || err), 'error'));
      return;
    }
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fname;
    a.click();
    URL.revokeObjectURL(url);
    toast('ব্যাকআপ ফাইল ডাউনলোড হয়েছে', 'success');
  }

  function importJSON(e) {
    const file = e.target.files[0];
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

  function handleSelectMode(m) {
    dispatch({
      type: 'SET_CARD_PREF',
      patch: { cardMode: m }
    });
    toast(m === 'auto' ? 'অটোমেটিক রিওয়ার্ড সিস্টেম সক্রিয় হয়েছে' : 'কাস্টম কালার মোড সক্রিয় হয়েছে', 'success');
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
    toast('হোম কার্ডের রঙ পরিবর্তিত হয়েছে', 'success');
  }

  const notif = state.ui.notif || { popup: true, beep: true };

  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6 max-w-3xl mx-auto pb-12"
  },
    /* Page Title */
    /*#__PURE__*/React.createElement("div", { className: "border-b border-slate-200 dark:border-slate-800 pb-3" },
      /*#__PURE__*/React.createElement("h2", { className: "text-xl font-bold font-bn text-slate-900 dark:text-white" }, "সেটিংস ও প্রিফারেন্স"),
      /*#__PURE__*/React.createElement("p", { className: "text-xs text-slate-500 mt-0.5" }, "হোম কার্ড স্টাইল, প্রোফাইল, নোটিফিকেশন ও ব্যাকআপ পরিচালনা করুন।")
    ),

    /* 1. HOME CARD PREVIEW & CUSTOMIZER CARD (KEY REQUIREMENT #6) */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-5"
    },
      /* Section Header */
      /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2.5" },
        /*#__PURE__*/React.createElement("div", { className: "w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-md" },
          /*#__PURE__*/React.createElement(Icon, { name: "credit-card", size: 18 })
        ),
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("h3", { className: "font-bold text-base text-slate-900 dark:text-white font-bn" }, "হোম কার্ডের প্রিমিয়াম রঙ ও রিওয়ার্ড মোড"),
          /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500" }, "ক্রেডিট কার্ড লুক ও অটোমেটিক লেভেল-আপ সিস্টেম")
        )
      ),

      /* Live Mini Card Preview */
      /*#__PURE__*/React.createElement("div", { className: "max-w-md mx-auto" },
        /*#__PURE__*/React.createElement(CreditCard, {
          profile: p,
          onOpenCustomizer: () => {},
          onUseStreakSaver: () => {
            if ((p.streakSavers || 0) > 0) {
              dispatch({ type: 'USE_STREAK_SAVER' });
              toast('স্ট্রাইক সেভার সক্রিয় করা হয়েছে! 🛡️', 'success');
            }
          }
        })
      ),

      /* 2-Mode Selector Switch */
      /*#__PURE__*/React.createElement("div", {
        className: "grid sm:grid-cols-2 gap-3"
      },
        /* Mode 1: Automatic Reward System */
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: () => handleSelectMode('auto'),
          className: \`p-4 rounded-2xl text-left border-2 transition \${currentMode === 'auto' ? 'border-amber-500 bg-amber-500/10 text-amber-950 dark:text-amber-200 shadow-sm' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'}\`
        },
          /*#__PURE__*/React.createElement("div", { className: "flex items-center justify-between mb-1" },
            /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-1.5 font-bold text-sm" },
              /*#__PURE__*/React.createElement(Icon, { name: "award", size: 16, className: "text-amber-500" }),
              /*#__PURE__*/React.createElement("span", null, "মোড ১: অটো রিওয়ার্ড সিস্টেম")
            ),
            currentMode === 'auto' && /*#__PURE__*/React.createElement("span", { className: "px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-bold" }, "সক্রিয়")
          ),
          /*#__PURE__*/React.createElement("div", { className: "text-xs opacity-80 leading-relaxed font-bn" },
            "আপনার লেভেল, এক্সপি ও ৩০ দিনের স্ট্রাইকের সাথে কার্ড স্বয়ংক্রিয়ভাবে আপগ্রেড হবে (গোল্ড ও প্ল্যাটিনাম সহ)।"
          )
        ),

        /* Mode 2: Custom Selection */
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: () => handleSelectMode('custom'),
          className: \`p-4 rounded-2xl text-left border-2 transition \${currentMode === 'custom' ? 'border-brand-500 bg-brand-500/10 text-brand-950 dark:text-brand-200 shadow-sm' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'}\`
        },
          /*#__PURE__*/React.createElement("div", { className: "flex items-center justify-between mb-1" },
            /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-1.5 font-bold text-sm" },
              /*#__PURE__*/React.createElement(Icon, { name: "palette", size: 16, className: "text-brand-500" }),
              /*#__PURE__*/React.createElement("span", null, "মোড ২: কাস্টম কালার মোড")
            ),
            currentMode === 'custom' && /*#__PURE__*/React.createElement("span", { className: "px-2 py-0.5 rounded-full text-[10px] bg-brand-600 text-white font-bold" }, "সক্রিয়")
          ),
          /*#__PURE__*/React.createElement("div", { className: "text-xs opacity-80 leading-relaxed font-bn" },
            "পছন্দমতো যেকোনো রঙ বেছে নিতে পারবেন (ব্রোঞ্জ গোল্ড ও প্ল্যাটিনাম ছাড়া)।"
          )
        )
      ),

      /* 30-Day Gold Streak Rule & Demotion Explanation Box */
      currentMode === 'auto' ? /*#__PURE__*/React.createElement("div", {
        className: "p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-700 dark:text-slate-300 space-y-1.5 leading-relaxed font-bn"
      },
        /*#__PURE__*/React.createElement("div", { className: "font-bold text-amber-800 dark:text-amber-300 text-sm flex items-center gap-1.5" },
          /*#__PURE__*/React.createElement(Icon, { name: "sparkles", size: 16 }),
          /*#__PURE__*/React.createElement("span", null, "🏆 গোল্ড লিজেন্ড ও ডিমোশন সিস্টেমের নিয়ম:")
        ),
        /*#__PURE__*/React.createElement("p", null, "১. টানা ৩০ দিন অ্যাপে পড়াশোনা সম্পন্ন করলে অর্জিত হবে অতি-মর্যাদাপূর্ণ ", /*#__PURE__*/React.createElement("strong", { className: "text-amber-600 dark:text-amber-400" }, "ব্রোঞ্জ গোল্ড কার্ড"), " এবং প্রতি মাসের শুরুতে পাওয়া যাবে ২ টি স্ট্রাইক সেভার।"),
        /*#__PURE__*/React.createElement("p", null, "২. যদি পরের মাসে ৩০ দিনের ধারাবাহিকতা ধরে রাখতে না পারো (এবং স্ট্রাইক সেভার শেষ হয়ে যায়), তবে গোল্ড কার্ড আর থাকবে না, ডিমোশন হয়ে প্ল্যাটিনাম কার্ডে নেমে আসবে।"),
        /*#__PURE__*/React.createElement("p", null, "৩. যেকোনো ১-২ দিন পড়াশোনা মিস হলে সাথে সাথেই স্ট্রাইক সেভার দিয়ে স্ট্রাইক রক্ষা করে নেওয়া যাবে।")
      ) : /*#__PURE__*/React.createElement("div", {
        className: "p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 leading-relaxed font-bn"
      }, "ℹ️ কাস্টম মোডে ব্রোঞ্জ গোল্ড ও প্ল্যাটিনাম লক করা থাকে, যাতে কঠোর পরিশ্রমী শিক্ষার্থীরা তাদের বিশেষ গোল্ড কার্ডের মর্যাদা ধরে রাখতে পারে।"),

      /* Color Selection Palette Grid */
      /*#__PURE__*/React.createElement("div", null,
        /*#__PURE__*/React.createElement("div", { className: "text-sm font-semibold mb-3 text-slate-800 dark:text-slate-200" }, "রঙ নির্বাচন করুন:"),
        /*#__PURE__*/React.createElement("div", { className: "grid grid-cols-3 gap-3" },
          Object.keys(CARD_THEMES).map(k => {
            const t = CARD_THEMES[k];
            const isSelected = currentMode === 'auto' ? autoTier.color === k : currentColor === k;
            const isLocked = currentMode === 'custom' && t.lockedInCustom;

            return /*#__PURE__*/React.createElement("button", {
              key: k,
              type: "button",
              disabled: isLocked,
              onClick: () => handleSelectColor(k),
              className: \`relative flex flex-col items-center p-3 rounded-2xl border-2 transition \${isSelected ? 'border-slate-900 dark:border-white shadow-md scale-105' : 'border-slate-200 dark:border-slate-800'} \${isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:border-slate-400'}\`
            },
              /* Color box */
              /*#__PURE__*/React.createElement("div", {
                className: \`w-full h-10 rounded-xl bg-gradient-to-r \${t.gradient} shadow-inner flex items-center justify-center\`
              },
                isSelected && /*#__PURE__*/React.createElement(Icon, { name: "check", size: 16, className: "text-emerald-400 drop-shadow" }),
                isLocked && /*#__PURE__*/React.createElement(Icon, { name: "lock", size: 16, className: "text-amber-300 drop-shadow" })
              ),
              /* Label */
              /*#__PURE__*/React.createElement("span", { className: \`text-xs font-semibold font-bn mt-2 \${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}\` }, t.name),
              isLocked && /*#__PURE__*/React.createElement("span", { className: "text-[9px] text-amber-500 font-medium" }, "রিওয়ার্ডে আনলক")
            );
          })
        )
      ),

      /* Streak Savers Bank Status */
      /*#__PURE__*/React.createElement("div", {
        className: "p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between"
      },
        /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2.5" },
          /*#__PURE__*/React.createElement(Icon, { name: "shield-check", size: 20, className: "text-brand-500" }),
          /*#__PURE__*/React.createElement("div", null,
            /*#__PURE__*/React.createElement("div", { className: "text-xs font-semibold text-slate-800 dark:text-slate-200 font-bn" }, "মাসিক স্ট্রাইক সেভার ব্যাংক"),
            /*#__PURE__*/React.createElement("div", { className: "text-[11px] text-slate-500" }, "পড়াশোনা মিস হলেও আপনার টানা স্ট্রাইক অটুট রাখবে")
          )
        ),
        /*#__PURE__*/React.createElement("div", { className: "text-right" },
          /*#__PURE__*/React.createElement("span", { className: "font-mono font-bold text-sm px-2.5 py-1 rounded-xl bg-brand-500/20 text-brand-600 dark:text-brand-400" },
            p.streakSavers !== undefined ? p.streakSavers : 2, " / ২ টি বাকি"
          )
        )
      )
    ),

    /* 2. PROFILE SETTINGS CARD */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4"
    },
      /* Header */
      /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2.5" },
        /*#__PURE__*/React.createElement("div", { className: "w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-md" },
          /*#__PURE__*/React.createElement(Icon, { name: "user", size: 18 })
        ),
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("h3", { className: "font-bold text-base text-slate-900 dark:text-white font-bn" }, "প্রোফাইল তথ্য"),
          /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500" }, "আপনার নাম ও কার্ডহোল্ডার পরিচিতি")
        )
      ),

      /* Input */
      /*#__PURE__*/React.createElement("div", { className: "space-y-1.5" },
        /*#__PURE__*/React.createElement("label", { className: "text-xs text-slate-500 font-medium" }, "শিক্ষার্থীর পুরো নাম (Name)"),
        /*#__PURE__*/React.createElement(Input, {
          placeholder: "যেমন: মোঃ ওয়াদুদ হোসেন",
          value: p.name,
          onChange: e => dispatch({
            type: 'SET_PROFILE',
            patch: { name: e.target.value }
          })
        })
      )
    ),

    /* 3. APPEARANCE & LANGUAGE */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4"
    },
      /* Header */
      /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2.5" },
        /*#__PURE__*/React.createElement("div", { className: "w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-md" },
          /*#__PURE__*/React.createElement(Icon, { name: "sun-moon", size: 18 })
        ),
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("h3", { className: "font-bold text-base text-slate-900 dark:text-white font-bn" }, "অ্যাপের রূপরেখা ও ভাষা"),
          /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500" }, "ডার্ক/লাইট মোড এবং ভাষা নির্বাচন")
        )
      ),

      /* Theme selector */
      /*#__PURE__*/React.createElement("div", { className: "grid grid-cols-2 gap-3" },
        /* Light */
        /*#__PURE__*/React.createElement("button", {
          onClick: () => dispatch({ type: 'SET_UI', patch: { theme: 'light' } }),
          className: \`p-3.5 rounded-2xl border-2 flex items-center justify-center gap-2 font-semibold text-sm transition \${state.ui.theme === 'light' ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300' : 'border-slate-200 dark:border-slate-800 text-slate-600'}\`
        },
          /*#__PURE__*/React.createElement(Icon, { name: "sun", size: 18 }),
          /*#__PURE__*/React.createElement("span", null, "লাইট মোড")
        ),
        /* Dark */
        /*#__PURE__*/React.createElement("button", {
          onClick: () => dispatch({ type: 'SET_UI', patch: { theme: 'dark' } }),
          className: \`p-3.5 rounded-2xl border-2 flex items-center justify-center gap-2 font-semibold text-sm transition \${state.ui.theme === 'dark' ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300' : 'border-slate-200 dark:border-slate-800 text-slate-600'}\`
        },
          /*#__PURE__*/React.createElement(Icon, { name: "moon", size: 18 }),
          /*#__PURE__*/React.createElement("span", null, "ডার্ক মোড")
        )
      ),

      /* Language selector */
      /*#__PURE__*/React.createElement("div", { className: "grid grid-cols-2 gap-3 pt-2" },
        /* BN */
        /*#__PURE__*/React.createElement("button", {
          onClick: () => dispatch({ type: 'SET_UI', patch: { lang: 'bn' } }),
          className: \`py-2.5 rounded-xl border text-xs font-bold transition \${state.ui.lang === 'bn' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent' : 'border-slate-200 dark:border-slate-700'}\`
        }, "বাংলা (Bengali)"),
        /* EN */
        /*#__PURE__*/React.createElement("button", {
          onClick: () => dispatch({ type: 'SET_UI', patch: { lang: 'en' } }),
          className: \`py-2.5 rounded-xl border text-xs font-bold transition \${state.ui.lang === 'en' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent' : 'border-slate-200 dark:border-slate-700'}\`
        }, "English (ইংরেজি)")
      )
    ),

    /* 4. NOTIFICATIONS & REMINDERS */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4"
    },
      /* Header */
      /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2.5" },
        /*#__PURE__*/React.createElement("div", { className: "w-9 h-9 rounded-xl bg-purple-500 text-white flex items-center justify-center shadow-md" },
          /*#__PURE__*/React.createElement(Icon, { name: "bell", size: 18 })
        ),
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("h3", { className: "font-bold text-base text-slate-900 dark:text-white font-bn" }, "রিমাইন্ডার ও নোটিফিকেশন"),
          /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500" }, "পড়াশোনার সময় হলে কীভাবে সতর্ক করবে")
        )
      ),

      /* Buttons */
      /*#__PURE__*/React.createElement("div", { className: "flex gap-2 flex-wrap" },
        /* Popup */
        /*#__PURE__*/React.createElement(Btn, {
          variant: notif.popup && !notif.beep ? 'primary' : 'outline',
          onClick: () => dispatch({ type: 'SET_NOTIF', patch: { popup: true, beep: false } })
        }, "শুধুমাত্র পপআপ"),
        /* Beep */
        /*#__PURE__*/React.createElement(Btn, {
          variant: !notif.popup && notif.beep ? 'primary' : 'outline',
          onClick: () => dispatch({ type: 'SET_NOTIF', patch: { popup: false, beep: true } })
        }, "শুধুমাত্র সাউন্ড"),
        /* Both */
        /*#__PURE__*/React.createElement(Btn, {
          variant: notif.popup && notif.beep ? 'primary' : 'outline',
          onClick: () => dispatch({ type: 'SET_NOTIF', patch: { popup: true, beep: true } })
        }, "উভয়ই (পপআপ + সাউন্ড)")
      ),

      /* Test Chime */
      /*#__PURE__*/React.createElement("div", { className: "pt-2" },
        /*#__PURE__*/React.createElement(Btn, {
          variant: "subtle",
          onClick: () => {
            if (AudioEngine && AudioEngine.reminderChime) AudioEngine.reminderChime();
            window.dispatchEvent(new CustomEvent('sonkolpo:remind', {
              detail: { title: 'টেস্ট রিমাইন্ডার', line: REMINDER_LINES[0] }
            }));
          }
        },
          /*#__PURE__*/React.createElement(Icon, { name: "bell-ring", size: 16 }),
          /*#__PURE__*/React.createElement("span", null, "রিমাইন্ডার টেস্ট করুন")
        )
      )
    ),

    /* 5. BACKUP & RESTORE */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4"
    },
      /* Header */
      /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2.5" },
        /*#__PURE__*/React.createElement("div", { className: "w-9 h-9 rounded-xl bg-teal-500 text-white flex items-center justify-center shadow-md" },
          /*#__PURE__*/React.createElement(Icon, { name: "hard-drive", size: 18 })
        ),
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("h3", { className: "font-bold text-base text-slate-900 dark:text-white font-bn" }, "ডাটা ব্যাকআপ ও রিস্টোর"),
          /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500" }, "আপনার সমস্ত রুটিন, ফ্ল্যাশকার্ড ও নোট নিরাপদে সংরক্ষণ করুন")
        )
      ),

      /* Action Buttons */
      /*#__PURE__*/React.createElement("div", { className: "flex gap-2.5 flex-wrap" },
        /* Export */
        /*#__PURE__*/React.createElement(Btn, {
          onClick: exportJSON,
          className: "bg-brand-600 text-white font-medium"
        },
          /*#__PURE__*/React.createElement(Icon, { name: "download", size: 16 }),
          /*#__PURE__*/React.createElement("span", null, "ব্যাকআপ ডাউনলোড (JSON)")
        ),
        /* Import */
        /*#__PURE__*/React.createElement(Btn, {
          variant: "outline",
          onClick: () => fileRef.current.click()
        },
          /*#__PURE__*/React.createElement(Icon, { name: "upload", size: 16 }),
          /*#__PURE__*/React.createElement("span", null, "ব্যাকআপ রিস্টোর করুন")
        ),
        /* Hidden file input */
        /*#__PURE__*/React.createElement("input", {
          type: "file",
          accept: "application/json",
          ref: fileRef,
          onChange: importJSON,
          className: "hidden"
        })
      )
    ),

    /* 6. RESET & DANGER ZONE */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-5 sm:p-6 rounded-3xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/30 dark:bg-rose-950/10 shadow-md space-y-3"
    },
      /* Header */
      /*#__PURE__*/React.createElement("div", { className: "font-bold text-rose-600 dark:text-rose-400 text-sm flex items-center gap-2" },
        /*#__PURE__*/React.createElement(Icon, { name: "alert-triangle", size: 18 }),
        /*#__PURE__*/React.createElement("span", null, "ডেঞ্জার জোন (Danger Zone)")
      ),
      /* Text */
      /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500 leading-relaxed" },
        "অ্যাপের সমস্ত ডাটা মুছে ফেলে ফ্যাক্টরি রিসেট করতে চাইলে নিচের বাটনটি ব্যবহার করুন।"
      ),
      /* Reset button */
      /*#__PURE__*/React.createElement(Btn, {
        variant: "danger",
        onClick: () => {
          if (confirm('আপনি কি নিশ্চিত যে সমস্ত ডাটা রিসেট করতে চান? এটি আর ফিরিয়ে আনা যাবে না।')) {
            dispatch({ type: 'RESET' });
            toast('সমস্ত ডাটা রিসেট হয়েছে', 'success');
          }
        }
      },
        /*#__PURE__*/React.createElement(Icon, { name: "trash-2", size: 16 }),
        /*#__PURE__*/React.createElement("span", null, "সমস্ত ডাটা রিসেট করুন")
      )
    ),

    /* Footer Credits */
    /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-center text-slate-400 pt-3"
    }, BRAND, " · v4.0 · ", CREDIT)
  );
}
/* ---------- Root ---------- */`;

if (oldSettingsRegex.test(src)) {
  src = src.replace(oldSettingsRegex, newSettingsView);
  console.log('3. Upgraded SettingsView with 2-mode Home Card customizer, profile, appearance, reminders & backup.');
} else {
  console.warn('Could not match oldSettingsRegex');
}

fs.writeFileSync(appJsPath, src, 'utf8');
console.log('Successfully written FlashcardsView, TimerView & SettingsView upgrades.');
