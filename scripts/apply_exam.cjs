const fs = require('fs');

console.log('Patching ExamView via apply_exam.cjs...');
let code = fs.readFileSync('public/app.js', 'utf8');

const examStart = code.indexOf('function ExamView() {');
const examEnd = code.indexOf('/* ---------- Mistake Vault ---------- */');

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

  code = code.slice(0, examStart) + newExamView + code.slice(examEnd);
  fs.writeFileSync('public/app.js', code, 'utf8');
  console.log('ExamView patched successfully!');
} else {
  console.warn('Could not find examStart/examEnd indices');
}
