const fs = require('fs');

console.log('Starting upgrade_all_views...');
const appJsPath = 'public/app.js';
let src = fs.readFileSync(appJsPath, 'utf8');

// =========================================================================
// 1. DASHBOARD PROFILE CARD REPLACEMENT
// =========================================================================
const welcomeIdx = src.indexOf('স্বাগতম / Welcome back');
if (welcomeIdx !== -1) {
  const cardStart = src.lastIndexOf('/*#__PURE__*/React.createElement(Card,', welcomeIdx);
  const motivStart = src.indexOf('/*#__PURE__*/React.createElement("div", {\n    className: "relative mt-5 p-3 rounded-xl', welcomeIdx);
  if (cardStart !== -1 && motivStart !== -1) {
    const newDashboardCard = `/*#__PURE__*/React.createElement(CreditCard, {
      profile: p,
      onOpenCustomizer: () => setCardCustomizerOpen(true),
      onUseStreakSaver: () => {
        if ((p.streakSavers || 0) <= 0) {
          toast('এই মাসের স্ট্রাইক সেভার শেষ!', 'error');
          return;
        }
        if (confirm('১টি স্ট্রাইক সেভার ব্যবহার করে আজকের স্ট্রাইক সুরক্ষিত রাখতে চাও?')) {
          dispatch({ type: 'USE_STREAK_SAVER' });
          toast('স্ট্রাইক সেভার সফলভাবে ব্যবহৃত হয়েছে! 🛡️', 'success');
        }
      }
    }),
    cardCustomizerOpen && /*#__PURE__*/React.createElement(CardThemeModal, {
      open: cardCustomizerOpen,
      onClose: () => setCardCustomizerOpen(false),
      profile: p,
      dispatch: dispatch
    }),
    state.levelUpModal && /*#__PURE__*/React.createElement(LevelUpCelebrationModal, {
      modal: state.levelUpModal,
      onClose: () => dispatch({ type: 'CLEAR_LEVELUP_MODAL' })
    }),
    p.demotedAlert && /*#__PURE__*/React.createElement("div", {
      className: "p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-start gap-3 animate-fadeIn my-2"
    },
      /*#__PURE__*/React.createElement(Icon, { name: "alert-circle", className: "text-amber-500 shrink-0 mt-0.5", size: 20 }),
      /*#__PURE__*/React.createElement("div", { className: "flex-1 text-xs text-slate-700 dark:text-slate-300" },
        /*#__PURE__*/React.createElement("div", { className: "font-bold text-amber-700 dark:text-amber-300 text-sm mb-0.5" }, "স্ট্রাইক সতর্কবার্তা ও রিওয়ার্ড আপডেট"),
        /*#__PURE__*/React.createElement("p", null, "গত মাসে ৩০ দিনের স্ট্রাইক ধারাবাহিকতা বজায় না থাকায় কার্ড গোল্ড থেকে প্ল্যাটিনামে ডিমোট হয়েছে। মন খারাপের কিছু নেই—আজ থেকেই নতুন প্রত্যয়ে শুরু করে আবার ৩০ দিনের গোল্ড কার্ড ফিরিয়ে নাও! 💪"),
        /*#__PURE__*/React.createElement("button", {
          onClick: () => dispatch({ type: 'DISMISS_DEMOTED_ALERT' }),
          className: "mt-2 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 font-semibold text-amber-800 dark:text-amber-200 transition"
        }, "বুঝেছি, আজ থেকেই শুরু করব 🎯")
      )
    ),
    /* Compact Stat Pills Bar */
    /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-3 gap-2 my-2"
    },
      /*#__PURE__*/React.createElement(Card, { className: "p-2.5 text-center flex items-center justify-center gap-2" },
        /*#__PURE__*/React.createElement(Icon, { name: "flame", size: 16, className: "text-amber-500" }),
        /*#__PURE__*/React.createElement("div", { className: "text-left" },
          /*#__PURE__*/React.createElement("div", { className: "text-[10px] text-slate-400 font-medium" }, "স্ট্রাইক"),
          /*#__PURE__*/React.createElement("div", { className: "text-sm font-bold" }, p.streak, " দিন")
        )
      ),
      /*#__PURE__*/React.createElement(Card, { className: "p-2.5 text-center flex items-center justify-center gap-2" },
        /*#__PURE__*/React.createElement(Icon, { name: "zap", size: 16, className: "text-brand-500" }),
        /*#__PURE__*/React.createElement("div", { className: "text-left" },
          /*#__PURE__*/React.createElement("div", { className: "text-[10px] text-slate-400 font-medium" }, "লেভেল"),
          /*#__PURE__*/React.createElement("div", { className: "text-sm font-bold" }, "Lvl ", p.level)
        )
      ),
      /*#__PURE__*/React.createElement(Card, { className: "p-2.5 text-center flex items-center justify-center gap-2" },
        /*#__PURE__*/React.createElement(Icon, { name: "timer", size: 16, className: "text-indigo-500" }),
        /*#__PURE__*/React.createElement("div", { className: "text-left" },
          /*#__PURE__*/React.createElement("div", { className: "text-[10px] text-slate-400 font-medium" }, "মোট ফোকাস"),
          /*#__PURE__*/React.createElement("div", { className: "text-sm font-bold" }, totalFocus, " মি.")
        )
      )
    ),`;
    src = src.slice(0, cardStart) + newDashboardCard + '\n    ' + src.slice(motivStart);
    console.log('1. Replaced Dashboard profile card with CreditCard.');
  }
}

// Add state in Dashboard if needed
if (!src.includes('const [cardCustomizerOpen, setCardCustomizerOpen]')) {
  src = src.replace('function Dashboard({\n  go,\n  setSubjectPath\n}) {\n  const {\n    state,\n    dispatch\n  } = useVault();',
    'function Dashboard({\n  go,\n  setSubjectPath\n}) {\n  const {\n    state,\n    dispatch\n  } = useVault();\n  const [cardCustomizerOpen, setCardCustomizerOpen] = useState(false);'
  );
  console.log('Added cardCustomizerOpen state to Dashboard');
}


// =========================================================================
// 2. EXAMVIEW UPGRADE: Support Untested & Due Questions
// =========================================================================
const oldExamViewStart = `function ExamView() {
  const {
    state,
    dispatch
  } = useVault();
  const [mode, setMode] = useState('config'); // config | quiz | result
  const [filter, setFilter] = useState({});
  const [difficulty, setDifficulty] = useState('');
  const [source, setSource] = useState('all'); // all | filter | mistakes
  const [count, setCount] = useState(10);
  const [timerMode, setTimerMode] = useState('none'); // none | perq | full
  const [timePerQ, setTimePerQ] = useState(30);
  const [totalMin, setTotalMin] = useState(15);
  const [quiz, setQuiz] = useState(null);`;

const newExamViewStart = `function ExamView() {
  const {
    state,
    dispatch
  } = useVault();
  const [mode, setMode] = useState('config'); // config | quiz | result
  const [filter, setFilter] = useState({});
  const [difficulty, setDifficulty] = useState('');
  const [source, setSource] = useState('all'); // all | filter | mistakes
  const [questionStatus, setQuestionStatus] = useState('all'); // all | untested | due | mistakes
  const [count, setCount] = useState(10);
  const [timerMode, setTimerMode] = useState('none'); // none | perq | full
  const [timePerQ, setTimePerQ] = useState(30);
  const [totalMin, setTotalMin] = useState(15);
  const [quiz, setQuiz] = useState(null);

  // Compute question pool with Untested & Due filters
  const testedIds = useMemo(() => getTestedQuestionIds(state), [state.attempts]);
  const mistakenIds = useMemo(() => getMistakenQuestionIds(state), [state.mistakeVault]);

  const availableMatchingPool = useMemo(() => {
    let pool = state.mcqs.filter(m => matchFilter(m, filter));
    if (difficulty) pool = pool.filter(m => m.difficulty === difficulty);
    if (questionStatus === 'untested') {
      pool = pool.filter(m => !testedIds.has(m.id));
    } else if (questionStatus === 'due') {
      pool = pool.filter(m => mistakenIds.has(m.id) || !testedIds.has(m.id));
    } else if (questionStatus === 'mistakes') {
      pool = pool.filter(m => mistakenIds.has(m.id));
    }
    return pool;
  }, [state.mcqs, filter, difficulty, questionStatus, testedIds, mistakenIds]);

  function start() {
    let pool = availableMatchingPool;
    if (pool.length === 0) {
      toast('এই ফিল্টারে কোনো প্রশ্ন পাওয়া যায়নি। অন্য অপশন বেছে নিন।', 'error');
      return;
    }
    const n = Math.max(1, +count || 10);
    pool = [...pool].sort(() => Math.random() - .5).slice(0, Math.min(n, pool.length));
    setQuiz({
      pool,
      timePerQ: timerMode === 'perq' ? +timePerQ || 30 : null,
      totalSec: timerMode === 'full' ? (+totalMin || 15) * 60 : null
    });
    setMode('quiz');
  }`;

if (src.includes(oldExamViewStart)) {
  src = src.replace(oldExamViewStart, newExamViewStart);
  console.log('2. Patched ExamView logic for Untested & Due questions.');
}

// Update the ExamView config UI to include Question Status selector & live count
const oldExamSourceUI = `/*#__PURE__*/React.createElement("label", {
        className: "flex flex-col text-xs text-slate-500 gap-1"
      }, "Source", /*#__PURE__*/React.createElement(Select, {
        value: source,
        onChange: e => setSource(e.target.value)
      }, /*#__PURE__*/React.createElement("option", {
        value: "all"
      }, "Full mixed (all MCQs)"), /*#__PURE__*/React.createElement("option", {
        value: "filter"
      }, "Filtered (subject/topic/subtopic)"), /*#__PURE__*/React.createElement("option", {
        value: "mistakes"
      }, "Mistaken questions only")))`;

const newExamSourceUI = `/*#__PURE__*/React.createElement("label", {
        className: "flex flex-col text-xs text-slate-500 gap-1"
      }, "প্রশ্নের অবস্থা (Question Status)", /*#__PURE__*/React.createElement(Select, {
        value: questionStatus,
        onChange: e => setQuestionStatus(e.target.value)
      }, /*#__PURE__*/React.createElement("option", {
        value: "all"
      }, "সব প্রশ্ন (All Questions)"), /*#__PURE__*/React.createElement("option", {
        value: "untested"
      }, "🆕 এখনো টেস্ট নেওয়া হয়নি (Untested Only)"), /*#__PURE__*/React.createElement("option", {
        value: "due"
      }, "🔄 রিভিশন বাকি / ডিউ প্রশ্ন (Due for Review)"), /*#__PURE__*/React.createElement("option", {
        value: "mistakes"
      }, "⚠️ ভুল হওয়া প্রশ্নসমূহ (Mistakes Vault)"))),
      /*#__PURE__*/React.createElement("div", {
        className: "col-span-full py-1 px-3 rounded-xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/50 flex items-center justify-between text-xs text-brand-800 dark:text-brand-300 font-medium"
      },
        /*#__PURE__*/React.createElement("span", null, "🎯 এই সিলেকশনে উপলব্ধ প্রশ্ন সংখ্যা:"),
        /*#__PURE__*/React.createElement("span", { className: "font-bold font-mono px-2 py-0.5 rounded-full bg-brand-600 text-white" }, availableMatchingPool.length, " টি")
      )`;

if (src.includes(oldExamSourceUI)) {
  src = src.replace(oldExamSourceUI, newExamSourceUI);
  console.log('2. Patched ExamView UI with Question Status filter and live question count.');
}


// =========================================================================
// 3. FLASHCARDSVIEW UPGRADE: Study anytime, any subject/topic, untested/due filter, 3D animations
// =========================================================================
// Replace disabled: due.length === 0 in FlashcardsView
src = src.replace('disabled: due.length === 0,', '');

// Replace StudyRunner with complete upgraded 3D spring card, pronounce voice, exam mode, results celebration
const oldStudyRunnerRegex = /function StudyRunner\(\{[\s\S]*?\}\/\* ---------- Information ---------- \*\//;

const newStudyRunner = `/* ---------- Enhanced 3D Flashcard Study Runner & Exam Engine ---------- */
function StudyRunner({
  cards,
  mode = 'study', // 'study' | 'exam'
  onExit
}) {
  const { state, dispatch } = useVault();
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const [score, setScore] = useState({ known: 0, unknown: 0 });
  const [history, setHistory] = useState([]);
  const [speaking, setSpeaking] = useState(false);

  // Keyboard shortcut support (Space: flip, 1-4: rating)
  useEffect(() => {
    function onKeyDown(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        setFlip(f => !f);
      } else if (flip) {
        if (e.key === '1') grade(0);
        else if (e.key === '2') grade(1);
        else if (e.key === '3') grade(2);
        else if (e.key === '4') grade(3);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [flip, i]);

  // Read aloud audio feature
  function speak(text) {
    if (!('speechSynthesis' in window)) {
      toast('ভয়েস প্লেয়ার এই ডিভাইসে সমর্থিত নয়।', 'error');
      return;
    }
    window.speechSynthesis.cancel();
    const clean = text.replace(/<[^>]*>/g, '').trim();
    const utter = new SpeechSynthesisUtterance(clean);
    // Auto-detect language
    const isBn = /[\\u0980-\\u09FF]/.test(clean);
    utter.lang = isBn ? 'bn-BD' : 'en-US';
    utter.rate = 0.95;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  }

  // Session completion view
  if (i >= cards.length) {
    const total = cards.length;
    const knownPct = Math.round((score.known / Math.max(1, total)) * 100);
    const xpEarned = total * 3;

    return /*#__PURE__*/React.createElement(Modal, {
      open: true,
      onClose: onExit,
      title: "🎉 ফ্ল্যাশকার্ড সেশন সম্পন্ন!"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center py-5 space-y-4"
    },
      /* Celebration Icon */
      /*#__PURE__*/React.createElement("div", {
        className: "w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-brand-500 to-teal-400 text-white flex items-center justify-center text-3xl shadow-lg shadow-brand-500/30 animate-pop"
      }, knownPct >= 80 ? "🏆" : "✨"),

      /* Title & Score Summary */
      /*#__PURE__*/React.createElement("div", null,
        /*#__PURE__*/React.createElement("h3", {
          className: "text-lg font-bold font-bn text-slate-900 dark:text-white"
        }, mode === 'exam' ? \`ফ্ল্যাশকার্ড এক্সাম স্কোর: \${knownPct}%\` : "দারুণ পড়াশোনা হয়েছে!"),
        /*#__PURE__*/React.createElement("p", {
          className: "text-xs text-slate-500 mt-1"
        }, \`মোট \${total} টি ফ্ল্যাশকার্ড সফলভাবে অনুশীলন করা হয়েছে।\`)
      ),

      /* Stats Breakdown Card */
      /*#__PURE__*/React.createElement("div", {
        className: "grid grid-cols-3 gap-2.5 max-w-sm mx-auto"
      },
        /*#__PURE__*/React.createElement("div", { className: "p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-center" },
          /*#__PURE__*/React.createElement("div", { className: "text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400" }, score.known),
          /*#__PURE__*/React.createElement("div", { className: "text-[11px] text-emerald-700 dark:text-emerald-300 font-medium mt-0.5" }, "পেরেছি")
        ),
        /*#__PURE__*/React.createElement("div", { className: "p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-center" },
          /*#__PURE__*/React.createElement("div", { className: "text-xl font-bold font-mono text-rose-600 dark:text-rose-400" }, score.unknown),
          /*#__PURE__*/React.createElement("div", { className: "text-[11px] text-rose-700 dark:text-rose-300 font-medium mt-0.5" }, "কঠিন / রিভিউ")
        ),
        /*#__PURE__*/React.createElement("div", { className: "p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-center" },
          /*#__PURE__*/React.createElement("div", { className: "text-xl font-bold font-mono text-amber-600 dark:text-amber-400" }, "+" + xpEarned),
          /*#__PURE__*/React.createElement("div", { className: "text-[11px] text-amber-700 dark:text-amber-300 font-medium mt-0.5" }, "XP অর্জিত")
        )
      ),

      /* Buttons */
      /*#__PURE__*/React.createElement("div", {
        className: "flex justify-center gap-2 pt-2"
      },
        /*#__PURE__*/React.createElement(Btn, {
          onClick: onExit,
          className: "w-full max-w-xs py-2.5 font-bold"
        }, "সম্পন্ন করুন")
      )
    ));
  }

  const c = cards[i];
  const total = cards.length;
  const pct = Math.round(((i + 1) / total) * 100);

  function grade(q) {
    let ease = c.ease || 2.5,
      interval = c.interval || 0;
    if (q === 0) {
      interval = 1;
      ease = Math.max(1.3, ease - 0.2);
    } else if (q === 1) {
      interval = Math.max(1, Math.round((interval || 1) * 1.2));
      ease = Math.max(1.3, ease - 0.15);
    } else if (q === 2) {
      interval = interval === 0 ? 1 : Math.round(interval * ease);
    } else {
      interval = interval === 0 ? 3 : Math.round(interval * ease * 1.3);
      ease += 0.15;
    }
    const due = new Date(Date.now() + interval * 86400000).toISOString().slice(0, 10);
    dispatch({
      type: 'UPDATE_ITEM',
      key: 'flashcards',
      item: {
        ...c,
        ease,
        interval,
        due
      }
    });

    const isSuccess = q >= 2;
    setScore(s => ({
      known: s.known + (isSuccess ? 1 : 0),
      unknown: s.unknown + (isSuccess ? 0 : 1)
    }));

    dispatch({
      type: 'ADD_XP',
      amount: q >= 2 ? 4 : 2
    });

    // Audio chime on answer
    if (AudioEngine && AudioEngine.reminderChime) {
      if (isSuccess) AudioEngine.reminderChime();
    }

    setFlip(false);
    setI(i + 1);
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md flex flex-col justify-between overflow-y-auto",
    "data-native-overlay": "1"
  },
    /* Header Bar: Exit button, Progress Bar, Card index */
    /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3 px-4 py-3 bg-slate-900/80 border-b border-slate-800 text-white shrink-0",
      style: { paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }
    },
      /* Exit */
      /*#__PURE__*/React.createElement("button", {
        onClick: onExit,
        className: "p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition",
        title: "ফিরে যান"
      }, /*#__PURE__*/React.createElement(Icon, { name: "x", size: 18 })),

      /* Progress Bar */
      /*#__PURE__*/React.createElement("div", {
        className: "flex-1 flex flex-col gap-1"
      },
        /*#__PURE__*/React.createElement("div", { className: "flex justify-between text-[11px] text-slate-400 font-medium" },
          /*#__PURE__*/React.createElement("span", null, mode === 'exam' ? '⏱️ ফ্ল্যাশকার্ড এক্সাম' : '🎓 ফ্ল্যাশকার্ড স্টাডি'),
          /*#__PURE__*/React.createElement("span", { className: "font-mono" }, i + 1, " / ", total, " (", pct, "%)")
        ),
        /*#__PURE__*/React.createElement("div", {
          className: "w-full h-2 rounded-full bg-slate-800 overflow-hidden"
        },
          /*#__PURE__*/React.createElement("div", {
            className: "h-full bg-gradient-to-r from-brand-500 to-teal-400 rounded-full transition-all duration-300",
            style: { width: pct + '%' }
          })
        )
      )
    ),

    /* Main 3D Card Interactive Zone */
    /*#__PURE__*/React.createElement("div", {
      className: "flex-1 flex items-center justify-center p-4 sm:p-6"
    },
      /*#__PURE__*/React.createElement("div", {
        className: "fc-flip-scene max-w-xl w-full",
        onClick: () => setFlip(!flip)
      },
        /* 3D Flip Card Container */
        /*#__PURE__*/React.createElement("div", {
          className: \`fc-flip-card \${flip ? 'is-flipped' : ''}\`
        },
          /* FRONT FACE (Question) */
          /*#__PURE__*/React.createElement("div", {
            className: "fc-face fc-face-front"
          },
            /* Card Top metadata */
            /*#__PURE__*/React.createElement("div", {
              className: "flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3"
            },
              /* Badge */
              /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2" },
                /*#__PURE__*/React.createElement("span", {
                  className: "px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800"
                }, "প্রশ্ন (QUESTION)"),
                c.difficulty && /*#__PURE__*/React.createElement("span", {
                  className: \`px-2 py-0.5 rounded-full text-[10px] font-medium \${c.difficulty === 'hard' ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400' : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'}\`
                }, c.difficulty === 'hard' ? 'কঠিন' : 'সহজ')
              ),
              /* Pronounce Button */
              /*#__PURE__*/React.createElement("button", {
                type: "button",
                onClick: (e) => { e.stopPropagation(); speak(c.front); },
                className: \`p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-brand-600 transition \${speaking ? 'text-brand-600 animate-pulse' : ''}\`,
                title: "প্রশ্নটি শুনুন (Voice Pronounce)"
              }, /*#__PURE__*/React.createElement(Icon, { name: "volume-2", size: 18 }))
            ),

            /* Question Content */
            /*#__PURE__*/React.createElement("div", {
              className: "py-6 flex-1 flex items-center justify-center text-center overflow-y-auto"
            },
              /*#__PURE__*/React.createElement("div", {
                className: "text-lg sm:text-2xl font-semibold font-bn text-slate-900 dark:text-white leading-relaxed select-text"
              }, c.front)
            ),

            /* Bottom Hint / Flip prompt */
            /*#__PURE__*/React.createElement("div", {
              className: "pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center"
            },
              /*#__PURE__*/React.createElement("div", {
                className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-500 dark:text-slate-400 font-medium"
              },
                /*#__PURE__*/React.createElement(Icon, { name: "refresh-cw", size: 12, className: "animate-spin text-brand-500" }),
                /*#__PURE__*/React.createElement("span", null, "উত্তর দেখতে ট্যাপ করুন / স্পেসবার চাপুন")
              )
            )
          ),

          /* BACK FACE (Answer) */
          /*#__PURE__*/React.createElement("div", {
            className: "fc-face fc-face-back"
          },
            /* Back Top metadata */
            /*#__PURE__*/React.createElement("div", {
              className: "flex items-center justify-between gap-2 border-b border-brand-100 dark:border-brand-900/60 pb-3"
            },
              /* Badge */
              /*#__PURE__*/React.createElement("span", {
                className: "px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
              }, "✓ উত্তর (ANSWER)"),
              /* Pronounce Button */
              /*#__PURE__*/React.createElement("button", {
                type: "button",
                onClick: (e) => { e.stopPropagation(); speak(c.back); },
                className: "p-1.5 rounded-xl hover:bg-white/40 dark:hover:bg-slate-800 text-slate-500 hover:text-brand-600 transition",
                title: "উত্তরটি শুনুন (Voice Pronounce)"
              }, /*#__PURE__*/React.createElement(Icon, { name: "volume-2", size: 18 }))
            ),

            /* Answer Content */
            /*#__PURE__*/React.createElement("div", {
              className: "py-6 flex-1 flex items-center justify-center text-center overflow-y-auto"
            },
              /*#__PURE__*/React.createElement("div", {
                className: "text-base sm:text-xl font-medium font-bn text-emerald-950 dark:text-emerald-100 leading-relaxed select-text"
              }, c.back)
            ),

            /* Bottom hint */
            /*#__PURE__*/React.createElement("div", {
              className: "pt-2 text-center text-xs text-brand-700/70 dark:text-brand-300/70"
            }, "নিচের বাটন চেপে আপনার প্রস্তুতির রেটিং দিন")
          )
        )
      )
    ),

    /* Bottom Grading / Action Controls Bar */
    /*#__PURE__*/React.createElement("div", {
      className: "px-4 py-4 bg-slate-900/90 border-t border-slate-800 shrink-0",
      style: { paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }
    },
      flip ? /*#__PURE__*/React.createElement("div", {
        className: "grid grid-cols-4 gap-2 max-w-xl mx-auto"
      },
        /* Again (1) */
        /*#__PURE__*/React.createElement("button", {
          onClick: () => grade(0),
          className: "flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 transition active:scale-95 font-bn"
        },
          /*#__PURE__*/React.createElement("span", { className: "text-sm font-bold" }, "🔴 আবার"),
          /*#__PURE__*/React.createElement("span", { className: "text-[10px] opacity-75 mt-0.5" }, "১ মিনিট")
        ),
        /* Hard (2) */
        /*#__PURE__*/React.createElement("button", {
          onClick: () => grade(1),
          className: "flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 transition active:scale-95 font-bn"
        },
          /*#__PURE__*/React.createElement("span", { className: "text-sm font-bold" }, "🟠 কঠিন"),
          /*#__PURE__*/React.createElement("span", { className: "text-[10px] opacity-75 mt-0.5" }, "১ দিন")
        ),
        /* Good (3) */
        /*#__PURE__*/React.createElement("button", {
          onClick: () => grade(2),
          className: "flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 transition active:scale-95 font-bn"
        },
          /*#__PURE__*/React.createElement("span", { className: "text-sm font-bold" }, "🟢 পেরেছি"),
          /*#__PURE__*/React.createElement("span", { className: "text-[10px] opacity-75 mt-0.5" }, "৩ দিন")
        ),
        /* Easy (4) */
        /*#__PURE__*/React.createElement("button", {
          onClick: () => grade(3),
          className: "flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 transition active:scale-95 font-bn"
        },
          /*#__PURE__*/React.createElement("span", { className: "text-sm font-bold" }, "🔵 সহজ"),
          /*#__PURE__*/React.createElement("span", { className: "text-[10px] opacity-75 mt-0.5" }, "৭ দিন")
        )
      ) : /*#__PURE__*/React.createElement("div", {
        className: "max-w-xl mx-auto flex items-center gap-2"
      },
        /*#__PURE__*/React.createElement("button", {
          onClick: () => setFlip(true),
          className: "flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white font-bold font-bn text-base shadow-lg shadow-brand-900/40 transition active:scale-98 flex items-center justify-center gap-2"
        },
          /*#__PURE__*/React.createElement(Icon, { name: "refresh-cw", size: 18 }),
          /*#__PURE__*/React.createElement("span", null, "উত্তর দেখুন (Flip Card)")
        )
      )
    )
  );
}
/* ---------- Information ---------- */`;

if (oldStudyRunnerRegex.test(src)) {
  src = src.replace(oldStudyRunnerRegex, newStudyRunner);
  console.log('3. Replaced StudyRunner with 3D spring cards, voice pronounce, and completion stats.');
}


// Save the file
fs.writeFileSync(appJsPath, src, 'utf8');
console.log('Successfully completed upgrade_all_views script.');
