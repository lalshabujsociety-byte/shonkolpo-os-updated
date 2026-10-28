const fs = require('fs');

console.log('Running final_patch...');
const appJsPath = 'public/app.js';
let src = fs.readFileSync(appJsPath, 'utf8');

// =========================================================================
// 1. UPGRADE EXAMVIEW (UNTESTED & DUE QUESTIONS)
// =========================================================================
const examStart = src.indexOf('function ExamView() {');
const examEnd = src.indexOf('/* ---------- Mistakes vault ---------- */');

if (examStart !== -1 && examEnd !== -1) {
  const newExamView = `function ExamView() {
  const { state, dispatch } = useVault();
  const [mode, setMode] = useState('config'); // config | quiz | result
  const [filter, setFilter] = useState({});
  const [difficulty, setDifficulty] = useState('');
  const [questionStatus, setQuestionStatus] = useState('all'); // all | untested | due | mistakes
  const [count, setCount] = useState(10);
  const [timerMode, setTimerMode] = useState('none'); // none | perq | full
  const [timePerQ, setTimePerQ] = useState(30);
  const [totalMin, setTotalMin] = useState(15);
  const [quiz, setQuiz] = useState(null);

  // Compute tested question IDs and mistake vault IDs
  const testedIds = useMemo(() => getTestedQuestionIds(state), [state.attempts]);
  const mistakenIds = useMemo(() => getMistakenQuestionIds(state), [state.mistakeVault]);

  // Matching pool computation
  const matchingPool = useMemo(() => {
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
    let pool = matchingPool;
    if (pool.length === 0) {
      toast('এই ফিল্টারে কোনো প্রশ্ন পাওয়া যায়নি। অন্য অপশন বা সব প্রশ্ন বেছে নিন।', 'error');
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
  }

  if (mode === 'config') {
    return /*#__PURE__*/React.createElement("div", {
      className: "grid gap-4 max-w-3xl mx-auto"
    }, /*#__PURE__*/React.createElement(Card, {
      className: "p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md grid gap-4"
    },
      /* Header */
      /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3" },
        /*#__PURE__*/React.createElement("div", { className: "w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-md font-bold" },
          /*#__PURE__*/React.createElement(Icon, { name: "award", size: 18 })
        ),
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("h3", { className: "font-bold text-base text-slate-900 dark:text-white font-bn" }, "এমসিকিউ এক্সাম কনফিগারেশন"),
          /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500" }, "বিষয়, নতুন/ডিউ প্রশ্ন এবং সময়সীমা নির্বাচন করুন")
        )
      ),

      /* Subject / Topic Filter */
      /*#__PURE__*/React.createElement("div", { className: "space-y-1.5" },
        /*#__PURE__*/React.createElement("div", { className: "text-xs font-semibold text-slate-700 dark:text-slate-300" }, "বিষয় / অধ্যায় / টপিক নির্বাচন"),
        /*#__PURE__*/React.createElement(SubjectPicker, {
          value: filter,
          onChange: p => setFilter({ ...filter, ...p }),
          allowEmpty: true
        })
      ),

      /* 3 Options Row: Question Status, Difficulty, Count */
      /*#__PURE__*/React.createElement("div", {
        className: "grid sm:grid-cols-3 gap-3"
      },
        /* Question Status Selection */
        /*#__PURE__*/React.createElement("label", {
          className: "flex flex-col text-xs text-slate-500 gap-1 font-medium"
        }, "প্রশ্নের অবস্থা (Question Status)",
          /*#__PURE__*/React.createElement(Select, {
            value: questionStatus,
            onChange: e => setQuestionStatus(e.target.value)
          },
            /*#__PURE__*/React.createElement("option", { value: "all" }, "📚 সব প্রশ্ন (All Questions)"),
            /*#__PURE__*/React.createElement("option", { value: "untested" }, "🆕 এখনো টেস্ট নেওয়া হয়নি (Untested Only)"),
            /*#__PURE__*/React.createElement("option", { value: "due" }, "🔄 রিভিশন বাকি / ডিউ (Due for Review)"),
            /*#__PURE__*/React.createElement("option", { value: "mistakes" }, "⚠️ ভুল হওয়া প্রশ্নসমূহ (Mistakes Vault)")
          )
        ),

        /* Difficulty */
        /*#__PURE__*/React.createElement("label", {
          className: "flex flex-col text-xs text-slate-500 gap-1 font-medium"
        }, "ডিফিকাল্টি (Difficulty)",
          /*#__PURE__*/React.createElement(Select, {
            value: difficulty,
            onChange: e => setDifficulty(e.target.value)
          },
            /*#__PURE__*/React.createElement("option", { value: "" }, "যেকোনো ডিফিকাল্টি"),
            /*#__PURE__*/React.createElement("option", { value: "easy" }, "সহজ (Easy)"),
            /*#__PURE__*/React.createElement("option", { value: "hard" }, "কঠিন (Hard)")
          )
        ),

        /* Count */
        /*#__PURE__*/React.createElement("label", {
          className: "flex flex-col text-xs text-slate-500 gap-1 font-medium"
        }, "প্রশ্নের সংখ্যা (Count)",
          /*#__PURE__*/React.createElement(Select, {
            value: count,
            onChange: e => setCount(e.target.value)
          },
            /*#__PURE__*/React.createElement("option", { value: "5" }, "৫ টি প্রশ্ন"),
            /*#__PURE__*/React.createElement("option", { value: "10" }, "১০ টি প্রশ্ন"),
            /*#__PURE__*/React.createElement("option", { value: "15" }, "১৫ টি প্রশ্ন"),
            /*#__PURE__*/React.createElement("option", { value: "20" }, "২০ টি প্রশ্ন"),
            /*#__PURE__*/React.createElement("option", { value: "25" }, "২৫ টি প্রশ্ন"),
            /*#__PURE__*/React.createElement("option", { value: "50" }, "৫০ টি প্রশ্ন"),
            /*#__PURE__*/React.createElement("option", { value: "100" }, "১০০ টি প্রশ্ন")
          )
        )
      ),

      /* Live Question Count Indicator Badge */
      /*#__PURE__*/React.createElement("div", {
        className: "p-3 rounded-2xl bg-brand-50/80 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/60 flex items-center justify-between text-xs"
      },
        /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2 text-brand-900 dark:text-brand-300 font-medium" },
          /*#__PURE__*/React.createElement(Icon, { name: "check-circle", size: 16, className: "text-brand-600" }),
          /*#__PURE__*/React.createElement("span", null,
            questionStatus === 'untested' ? 'সিলেক্টেড বিষয়ে টেস্ট না দেওয়া নতুন প্রশ্ন:' :
            questionStatus === 'due' ? 'সিলেক্টেড বিষয়ে রিভিশন বাকি প্রশ্ন:' :
            questionStatus === 'mistakes' ? 'সিলেক্টেড বিষয়ে ভুল হওয়া প্রশ্ন:' : 'সিলেক্টেড বিষয়ে মোট প্রশ্ন:'
          )
        ),
        /*#__PURE__*/React.createElement("span", {
          className: "font-mono font-bold text-sm px-2.5 py-0.5 rounded-xl bg-brand-600 text-white shadow-sm"
        }, matchingPool.length, " টি")
      ),

      /* Timer Configuration */
      /*#__PURE__*/React.createElement("div", {
        className: "grid sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800"
      },
        /* Timer Mode */
        /*#__PURE__*/React.createElement("label", {
          className: "flex flex-col text-xs text-slate-500 gap-1 font-medium"
        }, "টাইমার মোড (Timer)",
          /*#__PURE__*/React.createElement(Select, {
            value: timerMode,
            onChange: e => setTimerMode(e.target.value)
          },
            /*#__PURE__*/React.createElement("option", { value: "none" }, "টাইমার ছাড়া (No timer)"),
            /*#__PURE__*/React.createElement("option", { value: "perq" }, "প্রতি প্রশ্নে সেকেন্ড (Per question)"),
            /*#__PURE__*/React.createElement("option", { value: "full" }, "পুরো পরীক্ষার সময় (Full test timer)")
          )
        ),

        /* Timer input */
        timerMode === 'perq' ? /*#__PURE__*/React.createElement("label", {
          className: "flex flex-col text-xs text-slate-500 gap-1 font-medium"
        }, "প্রতি প্রশ্নে সেকেন্ড",
          /*#__PURE__*/React.createElement(Input, {
            type: "number",
            min: "5",
            max: "300",
            value: timePerQ,
            onChange: e => setTimePerQ(e.target.value)
          })
        ) : timerMode === 'full' ? /*#__PURE__*/React.createElement("label", {
          className: "flex flex-col text-xs text-slate-500 gap-1 font-medium"
        }, "মোট পরীক্ষার মিনিট",
          /*#__PURE__*/React.createElement(Input, {
            type: "number",
            min: "1",
            max: "180",
            value: totalMin,
            onChange: e => setTotalMin(e.target.value)
          })
        ) : /*#__PURE__*/React.createElement("div", {
          className: "flex items-center text-xs text-slate-400 italic"
        }, "ধীরেসুস্থে প্রতিটি প্রশ্ন অনুশীলন করতে পারবেন।")
      ),

      /* Start Exam Button */
      /*#__PURE__*/React.createElement("div", { className: "pt-2" },
        /*#__PURE__*/React.createElement(Btn, {
          onClick: start,
          className: "w-full py-3.5 bg-gradient-to-r from-brand-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white font-bold text-base shadow-lg shadow-brand-900/30 rounded-2xl flex items-center justify-center gap-2"
        },
          /*#__PURE__*/React.createElement(Icon, { name: "play", size: 20 }),
          /*#__PURE__*/React.createElement("span", null, "পরীক্ষা শুরু করুন")
        )
      )
    ));
  }

  if (mode === 'quiz') {
    return /*#__PURE__*/React.createElement(QuizRunner, {
      quiz: quiz,
      onFinish: result => {
        setQuiz(result);
        setMode('result');
        dispatch({
          type: 'ADD_ITEM',
          key: 'attempts',
          item: {
            id: uid(),
            date: todayISO(),
            time: nowHM(),
            score: result.score,
            total: result.total,
            answers: result.answers,
            pool: result.pool
          }
        });
        dispatch({
          type: 'ADD_XP',
          amount: result.score * 5
        });
        toast('পরীক্ষা সম্পন্ন হয়েছে!', 'success');
      },
      onAbort: () => setMode('config')
    });
  }

  return /*#__PURE__*/React.createElement(QuizResult, {
    quiz: quiz,
    onClose: () => setMode('config')
  });
}

`;
  src = src.slice(0, examStart) + newExamView + src.slice(examEnd);
  console.log('1. Replaced ExamView with Untested & Due questions selector and matching count.');
}


// =========================================================================
// 2. UPGRADE STUDYRUNNER (3D SPRING CARDS & VOICE)
// =========================================================================
const runnerStart = src.indexOf('function StudyRunner({');
const runnerEnd = src.indexOf('/* ---------- Information ---------- */');

if (runnerStart !== -1 && runnerEnd !== -1) {
  const newStudyRunner = `function StudyRunner({
  cards,
  mode = 'study',
  onExit
}) {
  const { state, dispatch } = useVault();
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const [score, setScore] = useState({ known: 0, unknown: 0 });
  const [speaking, setSpeaking] = useState(false);

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

  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/<[^>]*>/g, '').trim();
    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang = /[\\u0980-\\u09FF]/.test(clean) ? 'bn-BD' : 'en-US';
    utter.rate = 0.95;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  }

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
      /*#__PURE__*/React.createElement("div", {
        className: "w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-brand-500 to-teal-400 text-white flex items-center justify-center text-3xl shadow-lg shadow-brand-500/30 animate-pop"
      }, knownPct >= 80 ? "🏆" : "✨"),
      /*#__PURE__*/React.createElement("div", null,
        /*#__PURE__*/React.createElement("h3", {
          className: "text-lg font-bold font-bn text-slate-900 dark:text-white"
        }, mode === 'exam' ? \`ফ্ল্যাশকার্ড এক্সাম স্কোর: \${knownPct}%\` : "দারুণ পড়াশোনা হয়েছে!"),
        /*#__PURE__*/React.createElement("p", {
          className: "text-xs text-slate-500 mt-1"
        }, \`মোট \${total} টি ফ্ল্যাশকার্ড সফলভাবে অনুশীলন করা হয়েছে।\`)
      ),
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
      /*#__PURE__*/React.createElement("div", { className: "flex justify-center gap-2 pt-2" },
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
      item: { ...c, ease, interval, due }
    });

    const isSuccess = q >= 2;
    setScore(s => ({
      known: s.known + (isSuccess ? 1 : 0),
      unknown: s.unknown + (isSuccess ? 0 : 1)
    }));

    dispatch({ type: 'ADD_XP', amount: q >= 2 ? 4 : 2 });
    if (AudioEngine && AudioEngine.reminderChime && isSuccess) {
      AudioEngine.reminderChime();
    }
    setFlip(false);
    setI(i + 1);
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md flex flex-col justify-between overflow-y-auto",
    "data-native-overlay": "1"
  },
    /* Header Bar */
    /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3 px-4 py-3 bg-slate-900/80 border-b border-slate-800 text-white shrink-0",
      style: { paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }
    },
      /*#__PURE__*/React.createElement("button", {
        onClick: onExit,
        className: "p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition",
        title: "ফিরে যান"
      }, /*#__PURE__*/React.createElement(Icon, { name: "x", size: 18 })),

      /*#__PURE__*/React.createElement("div", { className: "flex-1 flex flex-col gap-1" },
        /*#__PURE__*/React.createElement("div", { className: "flex justify-between text-[11px] text-slate-400 font-medium" },
          /*#__PURE__*/React.createElement("span", null, mode === 'exam' ? '⏱️ ফ্ল্যাশকার্ড এক্সাম' : '🎓 ফ্ল্যাশকার্ড স্টাডি'),
          /*#__PURE__*/React.createElement("span", { className: "font-mono" }, i + 1, " / ", total, " (", pct, "%)")
        ),
        /*#__PURE__*/React.createElement("div", { className: "w-full h-2 rounded-full bg-slate-800 overflow-hidden" },
          /*#__PURE__*/React.createElement("div", {
            className: "h-full bg-gradient-to-r from-brand-500 to-teal-400 rounded-full transition-all duration-300",
            style: { width: pct + '%' }
          })
        )
      )
    ),

    /* Main 3D Card Zone */
    /*#__PURE__*/React.createElement("div", {
      className: "flex-1 flex items-center justify-center p-4 sm:p-6"
    },
      /*#__PURE__*/React.createElement("div", {
        className: "fc-flip-scene max-w-xl w-full",
        onClick: () => setFlip(!flip)
      },
        /*#__PURE__*/React.createElement("div", {
          className: \`fc-flip-card \${flip ? 'is-flipped' : ''}\`
        },
          /* FRONT */
          /*#__PURE__*/React.createElement("div", {
            className: "fc-face fc-face-front"
          },
            /* Top */
            /*#__PURE__*/React.createElement("div", {
              className: "flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3"
            },
              /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2" },
                /*#__PURE__*/React.createElement("span", {
                  className: "px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800"
                }, "প্রশ্ন (QUESTION)"),
                c.difficulty && /*#__PURE__*/React.createElement("span", {
                  className: \`px-2 py-0.5 rounded-full text-[10px] font-medium \${c.difficulty === 'hard' ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400' : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'}\`
                }, c.difficulty === 'hard' ? 'কঠিন' : 'সহজ')
              ),
              /*#__PURE__*/React.createElement("button", {
                type: "button",
                onClick: (e) => { e.stopPropagation(); speak(c.front); },
                className: \`p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-brand-600 transition \${speaking ? 'text-brand-600 animate-pulse' : ''}\`,
                title: "শুনুন"
              }, /*#__PURE__*/React.createElement(Icon, { name: "volume-2", size: 18 }))
            ),
            /* Content */
            /*#__PURE__*/React.createElement("div", {
              className: "py-6 flex-1 flex items-center justify-center text-center overflow-y-auto"
            },
              /*#__PURE__*/React.createElement("div", {
                className: "text-lg sm:text-2xl font-semibold font-bn text-slate-900 dark:text-white leading-relaxed select-text"
              }, c.front)
            ),
            /* Bottom */
            /*#__PURE__*/React.createElement("div", {
              className: "pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center"
            },
              /*#__PURE__*/React.createElement("div", {
                className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-500 dark:text-slate-400 font-medium"
              },
                /*#__PURE__*/React.createElement(Icon, { name: "refresh-cw", size: 12, className: "text-brand-500" }),
                /*#__PURE__*/React.createElement("span", null, "উত্তর দেখতে ট্যাপ করুন / স্পেসবার চাপুন")
              )
            )
          ),

          /* BACK */
          /*#__PURE__*/React.createElement("div", {
            className: "fc-face fc-face-back"
          },
            /* Top */
            /*#__PURE__*/React.createElement("div", {
              className: "flex items-center justify-between gap-2 border-b border-brand-100 dark:border-brand-900/60 pb-3"
            },
              /*#__PURE__*/React.createElement("span", {
                className: "px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
              }, "✓ উত্তর (ANSWER)"),
              /*#__PURE__*/React.createElement("button", {
                type: "button",
                onClick: (e) => { e.stopPropagation(); speak(c.back); },
                className: "p-1.5 rounded-xl hover:bg-white/40 dark:hover:bg-slate-800 text-slate-500 hover:text-brand-600 transition",
                title: "শুনুন"
              }, /*#__PURE__*/React.createElement(Icon, { name: "volume-2", size: 18 }))
            ),
            /* Content */
            /*#__PURE__*/React.createElement("div", {
              className: "py-6 flex-1 flex items-center justify-center text-center overflow-y-auto"
            },
              /*#__PURE__*/React.createElement("div", {
                className: "text-base sm:text-xl font-medium font-bn text-emerald-950 dark:text-emerald-100 leading-relaxed select-text"
              }, c.back)
            ),
            /* Bottom */
            /*#__PURE__*/React.createElement("div", {
              className: "pt-2 text-center text-xs text-brand-700/70 dark:text-brand-300/70 font-bn"
            }, "নিচের বাটন চেপে আপনার প্রস্তুতির রেটিং দিন")
          )
        )
      )
    ),

    /* Bottom Controls */
    /*#__PURE__*/React.createElement("div", {
      className: "px-4 py-4 bg-slate-900/90 border-t border-slate-800 shrink-0",
      style: { paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }
    },
      flip ? /*#__PURE__*/React.createElement("div", {
        className: "grid grid-cols-4 gap-2 max-w-xl mx-auto"
      },
        /* Again */
        /*#__PURE__*/React.createElement("button", {
          onClick: () => grade(0),
          className: "flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 transition active:scale-95 font-bn"
        },
          /*#__PURE__*/React.createElement("span", { className: "text-sm font-bold" }, "🔴 আবার"),
          /*#__PURE__*/React.createElement("span", { className: "text-[10px] opacity-75 mt-0.5" }, "১ মিনিট")
        ),
        /* Hard */
        /*#__PURE__*/React.createElement("button", {
          onClick: () => grade(1),
          className: "flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 transition active:scale-95 font-bn"
        },
          /*#__PURE__*/React.createElement("span", { className: "text-sm font-bold" }, "🟠 কঠিন"),
          /*#__PURE__*/React.createElement("span", { className: "text-[10px] opacity-75 mt-0.5" }, "১ দিন")
        ),
        /* Good */
        /*#__PURE__*/React.createElement("button", {
          onClick: () => grade(2),
          className: "flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 transition active:scale-95 font-bn"
        },
          /*#__PURE__*/React.createElement("span", { className: "text-sm font-bold" }, "🟢 পেরেছি"),
          /*#__PURE__*/React.createElement("span", { className: "text-[10px] opacity-75 mt-0.5" }, "৩ দিন")
        ),
        /* Easy */
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

`;
  src = src.slice(0, runnerStart) + newStudyRunner + src.slice(runnerEnd);
  console.log('2. Replaced StudyRunner with 3D spring cards.');
}


// =========================================================================
// 3. UPGRADE TIMERVIEW
// =========================================================================
const timerStart = src.indexOf('function TimerView() {');
const timerEnd = src.indexOf('/* ---------- Motivation quotes (bulk) ---------- */');

if (timerStart !== -1 && timerEnd !== -1) {
  const newTimer = `function TimerView() {
  const { state, dispatch } = useVault();
  const [timerType, setTimerType] = useState('pomodoro');
  const [work, setWork] = useState(25);
  const [brk, setBrk] = useState(5);
  const [mode, setMode] = useState('idle');
  const [remaining, setRemaining] = useState(25 * 60);
  const [stopwatchSec, setStopwatchSec] = useState(0);
  const [sound, setSound] = useState('off');
  const [vol, setVol] = useState(0.15);
  const [zenMode, setZenMode] = useState(false);
  const tickRef = useRef();

  useEffect(() => {
    if (AudioEngine && AudioEngine.volume) AudioEngine.volume(vol);
  }, [vol]);

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

  const todaySessions = state.timerSessions.filter(s => s.date === todayISO());
  const todayFocusMinutes = todaySessions.reduce((acc, s) => acc + (s.minutes || 0), 0);

  const currentTotal = timerType === 'pomodoro' ? (mode === 'break' ? brk * 60 : work * 60) : 0;
  const currentRemaining = timerType === 'pomodoro' ? remaining : stopwatchSec;
  const mm = String(Math.floor(currentRemaining / 60)).padStart(2, '0');
  const ss = String(currentRemaining % 60).padStart(2, '0');

  const radius = 120;
  const circ = 2 * Math.PI * radius;
  const strokeOffset = timerType === 'pomodoro'
    ? circ * (1 - (remaining / Math.max(1, currentTotal)))
    : circ * ((stopwatchSec % 60) / 60);

  return /*#__PURE__*/React.createElement("div", {
    className: \`space-y-6 max-w-4xl mx-auto \${zenMode ? 'fixed inset-0 z-[1000] bg-slate-950 p-6 flex flex-col justify-center items-center overflow-auto' : ''}\`
  },
    /* Header & Mode Tabs */
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
      /* Zen Mode */
      /*#__PURE__*/React.createElement("button", {
        onClick: () => setZenMode(!zenMode),
        className: \`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition \${zenMode ? 'bg-amber-500 text-white border-amber-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}\`
      },
        /*#__PURE__*/React.createElement(Icon, { name: zenMode ? "minimize-2" : "maximize-2", size: 14 }),
        /*#__PURE__*/React.createElement("span", null, zenMode ? "জেন বন্ধ" : "জেন মোড")
      )
    ),

    /* Circular Timer Dial Card */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-6 sm:p-8 text-center relative overflow-hidden bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-xl rounded-3xl"
    },
      /* Mode status */
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

      /* Circular SVG Meter */
      /*#__PURE__*/React.createElement("div", {
        className: "relative w-64 h-64 sm:w-72 sm:h-72 mx-auto my-2 flex items-center justify-center"
      },
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

        /* Digits inside */
        /*#__PURE__*/React.createElement("div", {
          className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        },
          /*#__PURE__*/React.createElement("div", {
            className: "text-5xl sm:text-6xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-white select-all drop-shadow-sm"
          }, mm, ":", ss),
          /*#__PURE__*/React.createElement("div", {
            className: "text-xs text-slate-400 font-medium mt-1 font-bn"
          }, timerType === 'pomodoro' ? (mode === 'break' ? 'বিশ্রাম নিন' : 'মনোযোগ ধরে রাখুন') : 'চলমান সময়')
        )
      ),

      /* Adjust Controls */
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

      /* Preset Buttons */
      timerType === 'pomodoro' && mode === 'idle' && /*#__PURE__*/React.createElement("div", {
        className: "flex flex-wrap justify-center gap-2 my-3"
      },
        [
          { m: 25, label: "🍅 ২৫ মি. পোমোডোরো" },
          { m: 45, label: "⚡ ৪৫ মি. ডিপ ফোকাস" },
          { m: 60, label: "🎯 ৬০ মি. ম্যারাথন" },
          { m: 5, label: "☕ ৫ মি. ব্রেক" },
          { m: 15, label: "🌴 ১৫ মি. লং ব্রেক" }
        ].map(pr => /*#__PURE__*/React.createElement("button", {
          key: pr.m,
          onClick: () => pickPreset(pr.m),
          className: \`px-3 py-1.5 rounded-xl text-xs font-medium border transition \${work === pr.m ? 'bg-brand-600 text-white border-brand-600 shadow-sm' : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-500'}\`
        }, pr.label))
      ),

      /* Primary Buttons */
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
          /*#__PURE__*/React.createElement(Btn, {
            size: "lg",
            variant: "subtle",
            onClick: pause,
            className: "px-6 py-3 font-bold text-base flex items-center gap-2 rounded-2xl"
          },
            /*#__PURE__*/React.createElement(Icon, { name: "pause", size: 20 }),
            /*#__PURE__*/React.createElement("span", null, "পজ")
          ),
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

    /* Ambient Sounds Card */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-5 rounded-3xl border border-slate-200 dark:border-slate-800"
    },
      /*#__PURE__*/React.createElement("div", { className: "flex items-center justify-between mb-3" },
        /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2" },
          /*#__PURE__*/React.createElement(Icon, { name: "headphones", size: 18, className: "text-indigo-500" }),
          /*#__PURE__*/React.createElement("span", { className: "font-semibold text-sm font-bn" }, "মনোযোগ বৃদ্ধির অ্যাম্বিয়েন্ট সাউন্ডস")
        ),
        sound !== 'off' && /*#__PURE__*/React.createElement("div", {
          className: "flex items-center gap-1 h-5 px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-500"
        },
          /*#__PURE__*/React.createElement("span", { className: "w-1 bg-indigo-500 rounded-full animate-eq1" }),
          /*#__PURE__*/React.createElement("span", { className: "w-1 bg-indigo-500 rounded-full animate-eq2" }),
          /*#__PURE__*/React.createElement("span", { className: "w-1 bg-indigo-500 rounded-full animate-eq3" }),
          /*#__PURE__*/React.createElement("span", { className: "w-1 bg-indigo-500 rounded-full animate-eq4" })
        )
      ),

      /* Ambient Buttons */
      /*#__PURE__*/React.createElement("div", {
        className: "grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3"
      },
        [
          { id: 'off', label: '🔇 বন্ধ' },
          { id: 'white', label: '🌫️ হোয়াইট নয়েজ' },
          { id: 'brown', label: '☕ ব্রাউন নয়েজ' },
          { id: 'focus', label: '⚡ আলফা ওয়েভস' },
          { id: 'relax', label: '🌊 কাম ওয়েভস' }
        ].map(s => /*#__PURE__*/React.createElement("button", {
          key: s.id,
          onClick: () => pickSound(s.id),
          className: \`p-2.5 rounded-2xl text-xs font-semibold border flex flex-col items-center justify-center gap-1 transition \${sound === s.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'}\`
        }, /*#__PURE__*/React.createElement("span", null, s.label)))
      ),

      /* Volume */
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

    /* Stats */
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

`;
  src = src.slice(0, timerStart) + newTimer + src.slice(timerEnd);
  console.log('3. Replaced TimerView with circular SVG dial, presets & ambient sounds.');
}

fs.writeFileSync(appJsPath, src, 'utf8');
console.log('Final patch complete!');
