const fs = require('fs');

const appPath = 'public/app.js';
let content = fs.readFileSync(appPath, 'utf8');

// 1. Remove emojis from SPLASH_LINES
content = content.replace(
  "const SPLASH_LINES = ['তুমিই পারবে — শুরু করে দাও এখনই ✨', 'সংকল্প যেখানে, সাফল্য সেখানে 💫', 'আজকের পরিশ্রমই কালকের গর্ব 🌸'];",
  "const SPLASH_LINES = ['তুমিই পারবে — শুরু করে দাও এখনই।', 'সংকল্প যেখানে, সাফল্য সেখানে।', 'আজকের পরিশ্রমই কালকের গর্ব।'];"
);
console.log('1. Cleaned emojis from SPLASH_LINES');

// 2. Fix ReminderOverlay mobile width and right cutoff
const oldReminderOverlay = `function ReminderOverlay() {
  const [q, setQ] = useState([]);
  useEffect(() => {
    function h(e) {
      setQ(x => [...x, {
        id: uid(),
        ...e.detail
      }]);
    }
    window.addEventListener('sonkolpo:remind', h);
    return () => window.removeEventListener('sonkolpo:remind', h);
  }, []);
  if (q.length === 0) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed z-[150] bottom-4 right-4 space-y-2 max-w-sm"
  }, q.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.id,
    className: "animate-pop bg-white dark:bg-slate-900 border border-brand-300 dark:border-brand-700 rounded-2xl shadow-glow p-4 relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 opacity-10 grad-premium animate-gradientMove pointer-events-none"
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-brand-600 dark:text-brand-300 text-xs font-semibold uppercase tracking-widest"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell-ring",
    size: 14
  }), " Reminder"), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 font-semibold"
  }, r.title), /*#__PURE__*/React.createElement("div", {
    className: "font-bn text-sm text-slate-600 dark:text-slate-300 mt-1"
  }, r.line), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 flex justify-end"
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "subtle",
    onClick: () => setQ(x => x.filter(i => i.id !== r.id))
  }, "ঠিক আছে"))))));
}`;

const newReminderOverlay = `function ReminderOverlay() {
  const { state } = useVault();
  const lang = state?.ui?.lang || 'bn';
  const [q, setQ] = useState([]);
  useEffect(() => {
    function h(e) {
      setQ(x => [...x, {
        id: uid(),
        ...e.detail
      }]);
    }
    window.addEventListener('sonkolpo:remind', h);
    return () => window.removeEventListener('sonkolpo:remind', h);
  }, []);
  if (q.length === 0) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed z-[150] bottom-4 right-3 left-3 sm:left-auto sm:right-4 sm:max-w-sm space-y-2 pointer-events-none"
  }, q.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.id,
    className: "pointer-events-auto animate-pop bg-white dark:bg-slate-900 border border-brand-300 dark:border-brand-700 rounded-2xl shadow-lg p-3.5 sm:p-4 relative overflow-hidden max-w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-brand-600 dark:text-brand-300 text-xs font-semibold uppercase tracking-wider"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell-ring",
    size: 14
  }), lang === 'en' ? " Reminder" : " রিমাইন্ডার / Reminder"), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 font-semibold text-slate-900 dark:text-white text-sm"
  }, r.title), /*#__PURE__*/React.createElement("div", {
    className: "font-bn text-xs text-slate-600 dark:text-slate-300 mt-1"
  }, r.line), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 flex justify-end"
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "subtle",
    size: "sm",
    onClick: () => setQ(x => x.filter(i => i.id !== r.id))
  }, lang === 'en' ? "Dismiss" : "ঠিক আছে"))))));
}`;

if (content.includes('function ReminderOverlay() {')) {
  content = content.replace(oldReminderOverlay, newReminderOverlay);
  console.log('2. Fixed ReminderOverlay bounds and mobile cutoff');
}

// 3. Fix Dashboard Due Now card overflow + Add bilingual support
const oldDueNowBlock = `    dueNow.length > 0 && /*#__PURE__*/React.createElement(Card, {
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
    ),`;

const newDueNowBlock = `    dueNow.length > 0 && /*#__PURE__*/React.createElement(Card, {
      className: "p-3.5 sm:p-4 border-rose-300 dark:border-rose-800 task-due-glow max-w-full overflow-hidden"
    },
      /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-2 mb-2 text-rose-600 dark:text-rose-300 font-semibold text-sm font-bn"
      },
        /*#__PURE__*/React.createElement(Icon, { name: "bell-ring" }),
        state.ui.lang === 'en' ? "Due Right Now" : "এখনকার তাগিদ / Due Right Now"
      ),
      /*#__PURE__*/React.createElement("div", {
        className: "grid gap-2 max-w-full"
      }, dueNow.map(x => /*#__PURE__*/React.createElement("div", {
        key: x.kind + x.id,
        className: "flex items-center gap-2 p-2 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 max-w-full overflow-hidden"
      },
        /*#__PURE__*/React.createElement(Chip, { tone: "rose", className: "shrink-0" }, x.kind === 'schedule' ? (state.ui.lang === 'en' ? 'Routine' : 'রুটিন') : (state.ui.lang === 'en' ? 'Task' : 'কাজ')),
        /*#__PURE__*/React.createElement("div", { className: "flex-1 min-w-0 truncate font-medium text-sm font-bn" }, x.title),
        /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500 font-mono shrink-0" }, x.time),
        /*#__PURE__*/React.createElement(Btn, {
          size: "sm",
          variant: "subtle",
          className: "shrink-0",
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
    ),`;

if (content.includes('task-due-glow')) {
  content = content.replace(oldDueNowBlock, newDueNowBlock);
  console.log('3. Fixed Dashboard Due Now card flex truncation and overflow');
}

// Ensure Shell main has max-w-full overflow-x-hidden
content = content.replace(
  'className: "flex-1 overflow-y-auto p-4 sm:p-6 pb-24 sm:pb-8"',
  'className: "flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6 pb-24 sm:pb-8 max-w-full"'
);

// 4. Upgrade QuizRunner, QuizResult, and ExamView with stable min-height, sleek rounded-xl result, and full bilingual support
const qrStart = content.indexOf('function QuizRunner({');
const subjectsSectionStart = content.indexOf('/* ---------- Mistake Vault ---------- */');

if (qrStart !== -1 && subjectsSectionStart !== -1) {
  const newQuizAndExam = `function QuizRunner({
  quiz,
  onDone,
  onFinish
}) {
  const { state } = useVault();
  const lang = state?.ui?.lang || 'bn';
  const finishCallback = onDone || onFinish;

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(quiz.timePerQ || null);
  const [totalLeft, setTotalLeft] = useState(quiz.totalSec || null);
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const mcq = quiz.pool[idx] || {};

  useEffect(() => {
    if (!quiz.timePerQ) return;
    setTimeLeft(quiz.timePerQ);
    const t = setInterval(() => {
      setTimeLeft(s => {
        if (s <= 1) {
          clearInterval(t);
          pick(-1);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [idx, quiz.timePerQ]);

  useEffect(() => {
    if (!quiz.totalSec) return;
    const t = setInterval(() => {
      setTotalLeft(x => {
        if (x <= 1) {
          clearInterval(t);
          finishAll();
          return 0;
        }
        return x - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  function finishAll() {
    const cur = answersRef.current;
    const rest = quiz.pool.slice(cur.length).map(m => ({
      mcq: m,
      chosen: -1,
      correct: false
    }));
    deliverResult([...cur, ...rest]);
  }

  function pick(i) {
    const a = {
      mcq,
      chosen: i,
      correct: i === mcq.correct
    };
    const next = [...answers, a];
    setAnswers(next);
    if (idx + 1 >= quiz.pool.length) deliverResult(next);
    else setIdx(idx + 1);
  }

  function deliverResult(allAnswers) {
    const score = allAnswers.filter(a => a.correct).length;
    const total = allAnswers.length;
    const res = {
      score,
      total,
      answers: allAnswers,
      pool: quiz.pool
    };
    if (onFinish) onFinish(res);
    if (onDone) onDone(allAnswers, res);
  }

  const mm = totalLeft !== null ? String(Math.floor(totalLeft / 60)).padStart(2, '0') + ':' + String(totalLeft % 60).padStart(2, '0') : null;
  const questionText = mcq.q || mcq.question || (lang === 'en' ? 'Question not found' : 'প্রশ্ন পাওয়া যায়নি');
  const options = Array.isArray(mcq.options) ? mcq.options : [];
  const progressPct = Math.round(((idx + 1) / quiz.pool.length) * 100);

  return /*#__PURE__*/React.createElement(Card, {
    className: "p-5 sm:p-7 rounded-2xl max-w-2xl w-full mx-auto shadow-sm min-h-[470px] sm:min-h-[500px] flex flex-col justify-between transition-all border border-slate-200 dark:border-slate-800"
  },
    /* Top Progress & Timers */
    /*#__PURE__*/React.createElement("div", {
      className: "border-b border-slate-100 dark:border-slate-800 pb-3 mb-3 space-y-2 shrink-0"
    },
      /*#__PURE__*/React.createElement("div", {
        className: "flex justify-between items-center text-xs text-slate-500 font-mono"
      },
        /*#__PURE__*/React.createElement("span", { className: "font-bn font-medium text-slate-600 dark:text-slate-400" },
          lang === 'en' ? \`Question \${idx + 1} / \${quiz.pool.length}\` : \`প্রশ্ন \${idx + 1} / \${quiz.pool.length}\`
        ),
        /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2.5" },
          mm && /*#__PURE__*/React.createElement("span", {
            className: \`px-2 py-0.5 rounded-md font-mono \${totalLeft <= 60 ? 'bg-rose-50 text-rose-600 font-bold animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}\`
          }, lang === 'en' ? 'Left: ' : 'বাকি সময়: ', mm),
          timeLeft !== null && /*#__PURE__*/React.createElement("span", {
            className: \`px-2 py-0.5 rounded-md font-mono \${timeLeft <= 5 ? 'bg-rose-50 text-rose-600 font-bold animate-pulse' : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'}\`
          }, timeLeft, "s")
        )
      ),
      /* Progress bar */
      /*#__PURE__*/React.createElement("div", {
        className: "w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"
      },
        /*#__PURE__*/React.createElement("div", {
          className: "h-full bg-brand-500 rounded-full transition-all duration-300",
          style: { width: progressPct + '%' }
        })
      )
    ),

    /* Question Body with comfortable stable min-height */
    /*#__PURE__*/React.createElement("div", {
      className: "flex-1 flex flex-col justify-center my-auto min-h-[90px] sm:min-h-[110px] mb-4 text-[15px] sm:text-base font-medium font-bn text-slate-900 dark:text-slate-100 leading-relaxed"
    }, questionText),

    /* Options List */
    /*#__PURE__*/React.createElement("div", {
      className: "space-y-2.5 shrink-0"
    }, options.map((o, i) => /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      onClick: () => pick(i),
      className: "w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 hover:bg-brand-50/30 dark:hover:bg-brand-950/20 transition flex items-center gap-3 group active:scale-[0.99]"
    },
      /* Option Badge (A, B, C, D) */
      /*#__PURE__*/React.createElement("span", {
        className: "w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-semibold text-xs flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700 group-hover:border-brand-500 group-hover:text-brand-600 transition"
      }, String.fromCharCode(65 + i)),
      /* Option Label */
      /*#__PURE__*/React.createElement("span", {
        className: "text-sm sm:text-[15px] font-bn text-slate-800 dark:text-slate-200 leading-normal flex-1"
      }, o)
    )))
  );
}

function QuizResult({
  quiz,
  onClose
}) {
  const { state } = useVault();
  const lang = state?.ui?.lang || 'bn';

  const answers = Array.isArray(quiz) ? quiz : (quiz?.answers || []);
  const score = quiz?.score !== undefined ? quiz.score : answers.filter(a => a.correct).length;
  const total = quiz?.total !== undefined ? quiz.total : answers.length;
  const pct = Math.round((score / Math.max(1, total)) * 100);

  return /*#__PURE__*/React.createElement(Card, {
    className: "p-6 sm:p-8 rounded-xl max-w-2xl w-full mx-auto shadow-sm min-h-[480px] flex flex-col justify-between border border-slate-200 dark:border-slate-800 space-y-6"
  },
    /* Score Header */
    /*#__PURE__*/React.createElement("div", {
      className: "text-center pt-1 pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0"
    },
      /*#__PURE__*/React.createElement("div", {
        className: "text-xs font-semibold text-slate-400 uppercase tracking-wider font-bn"
      }, lang === 'en' ? "EXAM RESULT" : "পরীক্ষার ফলাফল"),
      /* Score */
      /*#__PURE__*/React.createElement("div", {
        className: "text-4xl sm:text-5xl font-light font-mono tabular-nums text-slate-900 dark:text-white my-1 tracking-tight"
      }, score, " / ", total),
      /* Badges */
      /*#__PURE__*/React.createElement("div", {
        className: "flex items-center justify-center gap-3 text-xs text-slate-500 font-bn mt-2"
      },
        /*#__PURE__*/React.createElement("span", {
          className: "px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-mono font-medium"
        }, (lang === 'en' ? "Accuracy: " : "সঠিকতার হার: ") + pct + "%"),
        /*#__PURE__*/React.createElement("span", {
          className: "px-2.5 py-1 rounded-md bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-mono font-medium"
        }, "+" + (score * 10) + (lang === 'en' ? " XP Earned" : " XP অর্জিত"))
      )
    ),

    /* Question Review List */
    /*#__PURE__*/React.createElement("div", {
      className: "space-y-2.5 flex-1 min-h-[220px] max-h-[45vh] overflow-y-auto pr-1 scrollbar-thin"
    }, answers.map((a, i) => {
      const qText = a.mcq.q || a.mcq.question || '';
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        className: \`p-3.5 rounded-lg border text-sm font-bn \${a.correct ? 'border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/40 dark:bg-emerald-950/20' : 'border-rose-200 dark:border-rose-800/40 bg-rose-50/40 dark:bg-rose-950/20'}\`
      },
        /*#__PURE__*/React.createElement("div", {
          className: "font-medium text-slate-900 dark:text-slate-100 mb-1"
        }, (i + 1), ". ", qText),
        /*#__PURE__*/React.createElement("div", {
          className: "text-xs flex flex-wrap gap-2 text-slate-600 dark:text-slate-400"
        },
          /*#__PURE__*/React.createElement("span", null, (lang === 'en' ? "Your answer: " : "আপনার উত্তর: "), a.chosen >= 0 ? a.mcq.options[a.chosen] : (lang === 'en' ? 'Did not answer' : 'উত্তর দেননি')),
          !a.correct && /*#__PURE__*/React.createElement("span", {
            className: "text-emerald-700 dark:text-emerald-300 font-semibold"
          }, "✓ " + (lang === 'en' ? "Correct: " : "সঠিক: ") + a.mcq.options[a.mcq.correct])
        ),
        a.mcq.explanation && /*#__PURE__*/React.createElement("div", {
          className: "text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 pt-1.5 border-t border-slate-200/50 dark:border-slate-800"
        }, (lang === 'en' ? "Explanation: " : "ব্যাখ্যা: ") + a.mcq.explanation)
      );
    })),

    /* Close */
    /*#__PURE__*/React.createElement("div", {
      className: "flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800 shrink-0"
    },
      /*#__PURE__*/React.createElement(Btn, {
        onClick: onClose,
        className: "px-7 py-2.5 font-bn rounded-lg"
      }, lang === 'en' ? "Complete Exam" : "সম্পন্ন করুন")
    )
  );
}

function ExamView() {
  const { state, dispatch } = useVault();
  const lang = state?.ui?.lang || 'bn';

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
      toast(lang === 'en' ? 'No questions found with this filter.' : 'এই ফিল্টারে কোনো প্রশ্ন পাওয়া যায়নি। অন্য অপশন বা সব প্রশ্ন বেছে নিন।', 'error');
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
      className: "p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md grid gap-4"
    },
      /* Header */
      /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3" },
        /*#__PURE__*/React.createElement("div", { className: "w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-md font-bold" },
          /*#__PURE__*/React.createElement(Icon, { name: "award", size: 18 })
        ),
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("h3", { className: "font-bold text-base text-slate-900 dark:text-white font-bn" }, lang === 'en' ? "MCQ Exam Configuration" : "এমসিকিউ এক্সাম কনফিগারেশন"),
          /*#__PURE__*/React.createElement("div", { className: "text-xs text-slate-500" }, lang === 'en' ? "Select subject, question status and timer rules" : "বিষয়, নতুন/ডিউ প্রশ্ন এবং সময়সীমা নির্বাচন করুন")
        )
      ),

      /* Subject / Topic Filter */
      /*#__PURE__*/React.createElement("div", { className: "space-y-1.5" },
        /*#__PURE__*/React.createElement("div", { className: "text-xs font-semibold text-slate-700 dark:text-slate-300" }, lang === 'en' ? "Subject / Chapter / Topic" : "বিষয় / অধ্যায় / টপিক নির্বাচন"),
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
        }, lang === 'en' ? "Question Status" : "প্রশ্নের অবস্থা (Question Status)",
          /*#__PURE__*/React.createElement(Select, {
            value: questionStatus,
            onChange: e => setQuestionStatus(e.target.value)
          },
            /*#__PURE__*/React.createElement("option", { value: "all" }, lang === 'en' ? "All Questions" : "সব প্রশ্ন (All Questions)"),
            /*#__PURE__*/React.createElement("option", { value: "untested" }, lang === 'en' ? "Untested Only" : "নতুন প্রশ্ন (Untested Only)"),
            /*#__PURE__*/React.createElement("option", { value: "due" }, lang === 'en' ? "Due for Revision" : "রিভিশন বাকি / ডিউ (Due)"),
            /*#__PURE__*/React.createElement("option", { value: "mistakes" }, lang === 'en' ? "Mistakes Vault" : "ভুল হওয়া প্রশ্নসমূহ (Mistakes)")
          )
        ),

        /* Difficulty */
        /*#__PURE__*/React.createElement("label", {
          className: "flex flex-col text-xs text-slate-500 gap-1 font-medium"
        }, lang === 'en' ? "Difficulty" : "ডিফিকাল্টি (Difficulty)",
          /*#__PURE__*/React.createElement(Select, {
            value: difficulty,
            onChange: e => setDifficulty(e.target.value)
          },
            /*#__PURE__*/React.createElement("option", { value: "" }, lang === 'en' ? "Any Difficulty" : "যেকোনো ডিফিকাল্টি"),
            /*#__PURE__*/React.createElement("option", { value: "easy" }, lang === 'en' ? "Easy" : "সহজ (Easy)"),
            /*#__PURE__*/React.createElement("option", { value: "hard" }, lang === 'en' ? "Hard" : "কঠিন (Hard)")
          )
        ),

        /* Count */
        /*#__PURE__*/React.createElement("label", {
          className: "flex flex-col text-xs text-slate-500 gap-1 font-medium"
        }, lang === 'en' ? "Question Count" : "প্রশ্নের সংখ্যা (Count)",
          /*#__PURE__*/React.createElement(Select, {
            value: count,
            onChange: e => setCount(e.target.value)
          },
            /*#__PURE__*/React.createElement("option", { value: "5" }, "5 " + (lang === 'en' ? 'Questions' : 'টি প্রশ্ন')),
            /*#__PURE__*/React.createElement("option", { value: "10" }, "10 " + (lang === 'en' ? 'Questions' : 'টি প্রশ্ন')),
            /*#__PURE__*/React.createElement("option", { value: "15" }, "15 " + (lang === 'en' ? 'Questions' : 'টি প্রশ্ন')),
            /*#__PURE__*/React.createElement("option", { value: "20" }, "20 " + (lang === 'en' ? 'Questions' : 'টি প্রশ্ন')),
            /*#__PURE__*/React.createElement("option", { value: "25" }, "25 " + (lang === 'en' ? 'Questions' : 'টি প্রশ্ন')),
            /*#__PURE__*/React.createElement("option", { value: "50" }, "50 " + (lang === 'en' ? 'Questions' : 'টি প্রশ্ন'))
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
            questionStatus === 'untested' ? (lang === 'en' ? 'Available untested questions:' : 'সিলেক্টেড বিষয়ে টেস্ট না দেওয়া নতুন প্রশ্ন:') :
            questionStatus === 'due' ? (lang === 'en' ? 'Questions due for review:' : 'সিলেক্টেড বিষয়ে রিভিশন বাকি প্রশ্ন:') :
            questionStatus === 'mistakes' ? (lang === 'en' ? 'Mistake vault questions:' : 'সিলেক্টেড বিষয়ে ভুল হওয়া প্রশ্ন:') : (lang === 'en' ? 'Total available questions:' : 'সিলেক্টেড বিষয়ে মোট প্রশ্ন:')
          )
        ),
        /*#__PURE__*/React.createElement("span", {
          className: "font-mono font-bold text-sm px-2.5 py-0.5 rounded-xl bg-brand-600 text-white shadow-sm"
        }, matchingPool.length, lang === 'en' ? " Qs" : " টি")
      ),

      /* Timer Configuration */
      /*#__PURE__*/React.createElement("div", {
        className: "grid sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800"
      },
        /* Timer Mode */
        /*#__PURE__*/React.createElement("label", {
          className: "flex flex-col text-xs text-slate-500 gap-1 font-medium"
        }, lang === 'en' ? "Timer Mode" : "টাইমার মোড (Timer)",
          /*#__PURE__*/React.createElement(Select, {
            value: timerMode,
            onChange: e => setTimerMode(e.target.value)
          },
            /*#__PURE__*/React.createElement("option", { value: "none" }, lang === 'en' ? "No Timer (Practice)" : "টাইমার ছাড়া (No timer)"),
            /*#__PURE__*/React.createElement("option", { value: "perq" }, lang === 'en' ? "Seconds per question" : "প্রতি প্রশ্নে সেকেন্ড (Per question)"),
            /*#__PURE__*/React.createElement("option", { value: "full" }, lang === 'en' ? "Total test time" : "পুরো পরীক্ষার সময় (Full test timer)")
          )
        ),

        /* Timer input */
        timerMode === 'perq' ? /*#__PURE__*/React.createElement("label", {
          className: "flex flex-col text-xs text-slate-500 gap-1 font-medium"
        }, lang === 'en' ? "Seconds per Question" : "প্রতি প্রশ্নে সেকেন্ড",
          /*#__PURE__*/React.createElement(Input, {
            type: "number",
            min: "5",
            max: "300",
            value: timePerQ,
            onChange: e => setTimePerQ(e.target.value)
          })
        ) : timerMode === 'full' ? /*#__PURE__*/React.createElement("label", {
          className: "flex flex-col text-xs text-slate-500 gap-1 font-medium"
        }, lang === 'en' ? "Total Exam Minutes" : "মোট পরীক্ষার মিনিট",
          /*#__PURE__*/React.createElement(Input, {
            type: "number",
            min: "1",
            max: "180",
            value: totalMin,
            onChange: e => setTotalMin(e.target.value)
          })
        ) : /*#__PURE__*/React.createElement("div", {
          className: "flex items-center text-xs text-slate-400 italic"
        }, lang === 'en' ? "Take your time and practice without rush." : "ধীরেসুস্থে প্রতিটি প্রশ্ন অনুশীলন করতে পারবেন।")
      ),

      /* Start Exam Button */
      /*#__PURE__*/React.createElement("div", { className: "pt-2" },
        /*#__PURE__*/React.createElement(Btn, {
          onClick: start,
          className: "w-full py-3.5 bg-gradient-to-r from-brand-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white font-bold text-base shadow-lg shadow-brand-900/30 rounded-2xl flex items-center justify-center gap-2"
        },
          /*#__PURE__*/React.createElement(Icon, { name: "play", size: 20 }),
          /*#__PURE__*/React.createElement("span", null, lang === 'en' ? "Start Exam" : "পরীক্ষা শুরু করুন")
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
        toast(lang === 'en' ? 'Exam completed!' : 'পরীক্ষা সম্পন্ন হয়েছে!', 'success');
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

  content = content.slice(0, qrStart) + newQuizAndExam + content.slice(subjectsSectionStart);
  console.log('4. Successfully upgraded QuizRunner, QuizResult, and ExamView with stable min-height and bilingual translations');
}

// 5. Update FlashcardsView with bilingual translations
content = content.replace(
  '"রিসেট ফিল্টার"',
  'lang === "en" ? "Reset Filter" : "রিসেট ফিল্টার"'
);
content = content.replace(
  '"নতুন কার্ড"',
  'lang === "en" ? "New Card" : "নতুন কার্ড"'
);
content = content.replace(
  '"স্টাডি ও এক্সাম সেশন (কাস্টম)"',
  'lang === "en" ? "Study & Test Session" : "স্টাডি ও এক্সাম সেশন (কাস্টম)"'
);

fs.writeFileSync(appPath, content, 'utf8');
console.log('Applied all refinements to public/app.js');
