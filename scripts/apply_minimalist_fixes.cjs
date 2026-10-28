const fs = require('fs');

const appPath = 'public/app.js';
let content = fs.readFileSync(appPath, 'utf8');

// 1. Upgrade QuizRunner and QuizResult (Fix missing question text and improve exam typography)
const qrStart = content.indexOf('function QuizRunner({');
const examViewStart = content.indexOf('function ExamView() {');

if (qrStart !== -1 && examViewStart !== -1) {
  const newQuizRunner = `function QuizRunner({
  quiz,
  onDone
}) {
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
    onDone([...cur, ...rest]);
  }

  function pick(i) {
    const a = {
      mcq,
      chosen: i,
      correct: i === mcq.correct
    };
    const next = [...answers, a];
    setAnswers(next);
    if (idx + 1 >= quiz.pool.length) onDone(next);
    else setIdx(idx + 1);
  }

  const mm = totalLeft !== null ? String(Math.floor(totalLeft / 60)).padStart(2, '0') + ':' + String(totalLeft % 60).padStart(2, '0') : null;
  const questionText = mcq.q || mcq.question || 'প্রশ্ন পাওয়া যায়নি';
  const options = Array.isArray(mcq.options) ? mcq.options : [];
  const progressPct = Math.round(((idx + 1) / quiz.pool.length) * 100);

  return /*#__PURE__*/React.createElement(Card, {
    className: "p-5 sm:p-6 rounded-2xl max-w-2xl mx-auto shadow-sm"
  },
    /* Top Progress & Timers */
    /*#__PURE__*/React.createElement("div", {
      className: "border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 space-y-2"
    },
      /*#__PURE__*/React.createElement("div", {
        className: "flex justify-between items-center text-xs text-slate-500 font-mono"
      },
        /*#__PURE__*/React.createElement("span", { className: "font-bn font-medium text-slate-600 dark:text-slate-400" },
          "প্রশ্ন ", idx + 1, " / ", quiz.pool.length
        ),
        /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-3" },
          mm && /*#__PURE__*/React.createElement("span", {
            className: \`px-2 py-0.5 rounded-md font-mono \${totalLeft <= 60 ? 'bg-rose-50 text-rose-600 font-bold animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}\`
          }, "বাকি সময়: ", mm),
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

    /* Question Body with clear, comfortable typography */
    /*#__PURE__*/React.createElement("div", {
      className: "text-[15px] sm:text-base font-medium font-bn text-slate-900 dark:text-slate-100 leading-relaxed mb-5"
    }, questionText),

    /* Options List */
    /*#__PURE__*/React.createElement("div", {
      className: "space-y-2.5"
    }, options.map((o, i) => /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      onClick: () => pick(i),
      className: "w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 hover:bg-brand-50/30 dark:hover:bg-brand-950/20 transition flex items-center gap-3 group"
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
  const { dispatch } = useVault();
  const score = quiz.answers.filter(a => a.correct).length;
  const total = quiz.answers.length;
  const pct = Math.round((score / Math.max(1, total)) * 100);

  return /*#__PURE__*/React.createElement(Card, {
    className: "p-5 sm:p-6 rounded-2xl max-w-2xl mx-auto shadow-sm space-y-5"
  },
    /* Score Header */
    /*#__PURE__*/React.createElement("div", {
      className: "text-center py-2"
    },
      /*#__PURE__*/React.createElement("div", {
        className: "text-xs font-semibold text-slate-400 uppercase tracking-wider font-bn"
      }, "পরীক্ষার ফলাফল"),
      /*#__PURE__*/React.createElement("div", {
        className: "text-4xl font-bold font-mono text-slate-900 dark:text-white my-1"
      }, score, " / ", total),
      /*#__PURE__*/React.createElement("div", {
        className: "text-xs text-slate-500 font-bn"
      }, "সঠিকতার হার: ", pct, "% · +", score * 10, " XP অর্জিত")
    ),

    /* Question Review List */
    /*#__PURE__*/React.createElement("div", {
      className: "space-y-2.5 max-h-[55vh] overflow-y-auto pr-1 scrollbar-thin"
    }, quiz.answers.map((a, i) => {
      const qText = a.mcq.q || a.mcq.question || '';
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        className: \`p-3.5 rounded-xl border text-sm font-bn \${a.correct ? 'border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/40 dark:bg-emerald-950/20' : 'border-rose-200 dark:border-rose-800/40 bg-rose-50/40 dark:bg-rose-950/20'}\`
      },
        /*#__PURE__*/React.createElement("div", {
          className: "font-medium text-slate-900 dark:text-slate-100 mb-1"
        }, (i + 1), ". ", qText),
        /*#__PURE__*/React.createElement("div", {
          className: "text-xs flex flex-wrap gap-2 text-slate-600 dark:text-slate-400"
        },
          /*#__PURE__*/React.createElement("span", null, "আপনার উত্তর: ", a.chosen >= 0 ? a.mcq.options[a.chosen] : 'উত্তর দেননি'),
          !a.correct && /*#__PURE__*/React.createElement("span", {
            className: "text-emerald-700 dark:text-emerald-300 font-semibold"
          }, "✓ সঠিক: ", a.mcq.options[a.mcq.correct])
        ),
        a.mcq.explanation && /*#__PURE__*/React.createElement("div", {
          className: "text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 pt-1.5 border-t border-slate-200/50 dark:border-slate-800"
        }, "ব্যাখ্যা: ", a.mcq.explanation)
      );
    })),

    /* Close */
    /*#__PURE__*/React.createElement("div", {
      className: "flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800"
    },
      /*#__PURE__*/React.createElement(Btn, {
        onClick: onClose,
        className: "px-6 font-bn"
      }, "সম্পন্ন করুন")
    )
  );
}
`;

  content = content.slice(0, qrStart) + newQuizRunner + content.slice(examViewStart);
  console.log('Successfully upgraded QuizRunner and QuizResult');
}

// 2. Upgrade Flashcard StudyRunner (Remove dark bg, clean 3 rating buttons, minimal radius)
const studyRunnerStart = content.indexOf('function StudyRunner({');
const flashTileStart = content.indexOf('function FlashTile({');

if (studyRunnerStart !== -1 && flashTileStart !== -1) {
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
    utter.lang = /[\u0980-\u09FF]/.test(clean) ? 'bn-BD' : 'en-US';
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
      title: "ফ্ল্যাশকার্ড সেশন সম্পন্ন"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center py-4 space-y-4"
    },
      /*#__PURE__*/React.createElement("div", {
        className: "w-12 h-12 mx-auto rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center text-xl font-bold font-mono"
      }, knownPct + "%"),
      /*#__PURE__*/React.createElement("div", null,
        /*#__PURE__*/React.createElement("h3", {
          className: "text-base font-semibold font-bn text-slate-900 dark:text-white"
        }, mode === 'exam' ? \`ফ্ল্যাশকার্ড টেস্ট স্কোর: \${knownPct}%\` : "অনুশীলন সম্পন্ন হয়েছে"),
        /*#__PURE__*/React.createElement("p", {
          className: "text-xs text-slate-500 font-bn mt-0.5"
        }, \`মোট \${total} টি কার্ডের মধ্যে \${score.known} টি মনে রাখতে পেরেছেন।\`)
      ),
      /* Stats */
      /*#__PURE__*/React.createElement("div", {
        className: "grid grid-cols-2 gap-2 max-w-xs mx-auto text-center"
      },
        /*#__PURE__*/React.createElement("div", { className: "p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60" },
          /*#__PURE__*/React.createElement("div", { className: "text-lg font-semibold font-mono text-emerald-600 dark:text-emerald-400" }, score.known),
          /*#__PURE__*/React.createElement("div", { className: "text-[11px] text-slate-500 font-bn" }, "পেরেছি")
        ),
        /*#__PURE__*/React.createElement("div", { className: "p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60" },
          /*#__PURE__*/React.createElement("div", { className: "text-lg font-semibold font-mono text-rose-600 dark:text-rose-400" }, score.unknown),
          /*#__PURE__*/React.createElement("div", { className: "text-[11px] text-slate-500 font-bn" }, "কঠিন / রিভিউ")
        )
      ),
      /* Done button */
      /*#__PURE__*/React.createElement("div", { className: "pt-2" },
        /*#__PURE__*/React.createElement(Btn, {
          onClick: onExit,
          className: "w-full py-2.5 font-bn font-semibold"
        }, "সম্পন্ন করুন")
      )
    ));
  }

  const c = cards[i] || {};
  const total = cards.length;
  const pct = Math.round(((i + 1) / total) * 100);

  function grade(rating) {
    // rating: 0 (Hard), 1 (Medium), 2 (Good)
    let ease = c.ease || 2.5,
      interval = c.interval || 0;
    if (rating === 0) {
      interval = 1;
      ease = Math.max(1.3, ease - 0.2);
    } else if (rating === 1) {
      interval = Math.max(1, Math.round((interval || 1) * 1.3));
    } else {
      interval = interval === 0 ? 2 : Math.round(interval * ease * 1.4);
      ease += 0.15;
    }
    const due = new Date(Date.now() + interval * 86400000).toISOString().slice(0, 10);
    dispatch({
      type: 'UPDATE_ITEM',
      key: 'flashcards',
      item: { ...c, ease, interval, due }
    });

    const isSuccess = rating >= 1;
    setScore(s => ({
      known: s.known + (isSuccess ? 1 : 0),
      unknown: s.unknown + (isSuccess ? 0 : 1)
    }));

    dispatch({ type: 'ADD_XP', amount: rating === 2 ? 4 : 2 });
    setFlip(false);
    setI(i + 1);
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-[9999] bg-slate-50 dark:bg-slate-950 flex flex-col justify-between overflow-y-auto animate-fadeIn",
    "data-native-overlay": "1"
  },
    /* Header Bar */
    /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white shrink-0",
      style: { paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }
    },
      /* Exit */
      /*#__PURE__*/React.createElement("button", {
        onClick: onExit,
        className: "p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition",
        title: "ফিরে যান"
      }, /*#__PURE__*/React.createElement(Icon, { name: "x", size: 18 })),

      /* Progress Info */
      /*#__PURE__*/React.createElement("div", { className: "flex-1 flex flex-col gap-1" },
        /*#__PURE__*/React.createElement("div", { className: "flex justify-between text-xs text-slate-500 dark:text-slate-400 font-mono" },
          /*#__PURE__*/React.createElement("span", { className: "font-bn font-medium" }, mode === 'exam' ? 'ফ্ল্যাশকার্ড টেস্ট' : 'ফ্ল্যাশকার্ড স্টাডি'),
          /*#__PURE__*/React.createElement("span", null, i + 1, " / ", total)
        ),
        /* Progress track */
        /*#__PURE__*/React.createElement("div", { className: "w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden" },
          /*#__PURE__*/React.createElement("div", {
            className: "h-full bg-brand-500 rounded-full transition-all duration-300",
            style: { width: pct + '%' }
          })
        )
      )
    ),

    /* Main 3D Card Scene */
    /*#__PURE__*/React.createElement("div", {
      className: "flex-1 flex items-center justify-center p-4 sm:p-6"
    },
      /*#__PURE__*/React.createElement("div", {
        className: "fc-flip-scene max-w-lg w-full",
        onClick: () => setFlip(!flip)
      },
        /*#__PURE__*/React.createElement("div", {
          className: \`fc-flip-card \${flip ? 'is-flipped' : ''}\`
        },
          /* FRONT FACE */
          /*#__PURE__*/React.createElement("div", {
            className: "fc-face fc-face-front"
          },
            /* Top Tag */
            /*#__PURE__*/React.createElement("div", {
              className: "flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2.5"
            },
              /*#__PURE__*/React.createElement("span", {
                className: "text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-bn"
              }, "প্রশ্ন (Question)"),
              /* Speech */
              /*#__PURE__*/React.createElement("button", {
                type: "button",
                onClick: (e) => { e.stopPropagation(); speak(c.front); },
                className: \`p-1.5 rounded-lg text-slate-400 hover:text-brand-600 transition \${speaking ? 'text-brand-600 animate-pulse' : ''}\`,
                title: "শুনুন"
              }, /*#__PURE__*/React.createElement(Icon, { name: "volume-2", size: 16 }))
            ),
            /* Content */
            /*#__PURE__*/React.createElement("div", {
              className: "py-6 flex-1 flex items-center justify-center text-center overflow-y-auto"
            },
              /*#__PURE__*/React.createElement("div", {
                className: "text-base sm:text-xl font-medium font-bn text-slate-900 dark:text-white leading-relaxed select-text"
              }, c.front)
            ),
            /* Hint */
            /*#__PURE__*/React.createElement("div", {
              className: "pt-2 text-center text-[11px] text-slate-400 font-bn"
            }, "উত্তর দেখতে ট্যাপ করুন / স্পেসবার চাপুন")
          ),

          /* BACK FACE */
          /*#__PURE__*/React.createElement("div", {
            className: "fc-face fc-face-back"
          },
            /* Top Tag */
            /*#__PURE__*/React.createElement("div", {
              className: "flex items-center justify-between gap-2 border-b border-brand-100 dark:border-brand-900/40 pb-2.5"
            },
              /*#__PURE__*/React.createElement("span", {
                className: "text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-bn"
              }, "✓ উত্তর (Answer)"),
              /* Speech */
              /*#__PURE__*/React.createElement("button", {
                type: "button",
                onClick: (e) => { e.stopPropagation(); speak(c.back); },
                className: "p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 transition",
                title: "শুনুন"
              }, /*#__PURE__*/React.createElement(Icon, { name: "volume-2", size: 16 }))
            ),
            /* Content */
            /*#__PURE__*/React.createElement("div", {
              className: "py-6 flex-1 flex items-center justify-center text-center overflow-y-auto"
            },
              /*#__PURE__*/React.createElement("div", {
                className: "text-sm sm:text-base font-medium font-bn text-slate-900 dark:text-white leading-relaxed select-text"
              }, c.back)
            ),
            /* Hint */
            /*#__PURE__*/React.createElement("div", {
              className: "pt-2 text-center text-[11px] text-slate-400 font-bn"
            }, "নিচে আপনার অবস্থা নির্বাচন করুন")
          )
        )
      )
    ),

    /* Bottom Rating Options (3 Clean Text-Focused Buttons, Zero Icon Clutter) */
    /*#__PURE__*/React.createElement("div", {
      className: "px-4 py-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0",
      style: { paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }
    },
      flip ? /*#__PURE__*/React.createElement("div", {
        className: "grid grid-cols-3 gap-2.5 max-w-lg mx-auto"
      },
        /* 1. Hard / Again */
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: () => grade(0),
          className: "py-3 px-3 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/60 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100 font-bn font-medium text-xs sm:text-sm transition text-center"
        }, "কঠিন (আবার)"),
        /* 2. Medium */
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: () => grade(1),
          className: "py-3 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-bn font-medium text-xs sm:text-sm transition text-center"
        }, "মাঝারি"),
        /* 3. Good / Mastered */
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: () => grade(2),
          className: "py-3 px-3 rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-bn font-semibold text-xs sm:text-sm transition text-center"
        }, "পেরেছি")
      ) : /*#__PURE__*/React.createElement("div", {
        className: "text-center max-w-lg mx-auto"
      },
        /*#__PURE__*/React.createElement(Btn, {
          onClick: () => setFlip(true),
          className: "w-full py-3 justify-center text-sm font-bn font-medium"
        }, "উত্তর দেখুন")
      )
    )
  );
}
`;

  content = content.slice(0, studyRunnerStart) + newStudyRunner + content.slice(flashTileStart);
  console.log('Successfully upgraded StudyRunner with clean neutral styling');
}

// 3. Upgrade TimerView (Minimalist Apple Clock feel + Clean Zen Mode)
const timerStart = content.indexOf('function TimerView() {');
const quotesStart = content.indexOf('function QuotesView() {');

if (timerStart !== -1 && quotesStart !== -1) {
  const newTimerView = `function TimerView() {
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
              toast(\`\${work} মিনিটের ফোকাস সেশন সম্পন্ন!\`, 'success');
              setMode('break');
              return brk * 60;
            } else {
              toast('বিরতি শেষ — নতুন সেশন শুরু করুন', 'info');
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
      if (mode === 'idle') setRemaining(work * 60);
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
    }
    setMode('idle');
    setRemaining(work * 60);
    setStopwatchSec(0);
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
  }

  const currentRemaining = timerType === 'pomodoro' ? remaining : stopwatchSec;
  const mm = String(Math.floor(currentRemaining / 60)).padStart(2, '0');
  const ss = String(currentRemaining % 60).padStart(2, '0');

  // CLEAN DEDICATED ZEN MODE
  if (zenMode) {
    return /*#__PURE__*/React.createElement("div", {
      className: "fixed inset-0 z-[9999] bg-white dark:bg-slate-950 flex flex-col justify-between p-6 sm:p-10 select-none animate-fadeIn",
      "data-native-overlay": "1"
    },
      /* Top bar: minimal mode status + exit button */
      /*#__PURE__*/React.createElement("div", { className: "flex items-center justify-between" },
        /*#__PURE__*/React.createElement("span", {
          className: "text-xs font-mono font-medium text-slate-400 tracking-wider uppercase"
        }, timerType === 'pomodoro' ? (mode === 'break' ? 'BREAK' : 'DEEP FOCUS') : 'STOPWATCH'),
        /*#__PURE__*/React.createElement("button", {
          onClick: () => setZenMode(false),
          className: "p-2 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white transition",
          title: "জেন মোড বন্ধ"
        }, /*#__PURE__*/React.createElement(Icon, { name: "minimize-2", size: 20 }))
      ),
      /* Center: Huge, serene, ultra-crisp typography */
      /*#__PURE__*/React.createElement("div", { className: "text-center my-auto" },
        /*#__PURE__*/React.createElement("div", {
          className: "text-7xl sm:text-9xl font-light font-mono tabular-nums tracking-tighter text-slate-900 dark:text-slate-100"
        }, mm, ":", ss),
        /*#__PURE__*/React.createElement("div", {
          className: "text-sm text-slate-400 font-bn mt-3 font-medium"
        }, mode === 'work' ? 'শান্ত থাকুন ও গভীর মনোযোগ ধরে রাখুন' : mode === 'break' ? 'বিরতি নিন' : 'সময় অতিবাহিত হচ্ছে')
      ),
      /* Bottom: Quiet play/pause & reset controls */
      /*#__PURE__*/React.createElement("div", { className: "flex items-center justify-center gap-3" },
        mode === 'idle'
          ? /*#__PURE__*/React.createElement(Btn, { onClick: start, className: "px-8 py-3 text-sm font-bn font-semibold rounded-xl" }, "শুরু করুন")
          : /*#__PURE__*/React.createElement(Btn, { variant: "outline", onClick: pause, className: "px-8 py-3 text-sm font-bn font-semibold rounded-xl" }, "বিরতি"),
        /*#__PURE__*/React.createElement(Btn, { variant: "ghost", onClick: stop, className: "px-6 py-3 text-sm font-bn rounded-xl text-slate-500" }, "রিসেট")
      )
    );
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 max-w-xl mx-auto pb-8"
  },
    /* Header Tabs */
    /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between"
    },
      /* Tabs */
      /*#__PURE__*/React.createElement("div", {
        className: "flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60"
      },
        /* Pomodoro */
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: () => { setTimerType('pomodoro'); setMode('idle'); setRemaining(work * 60); },
          className: \`px-3 py-1.5 rounded-lg text-xs font-semibold font-bn transition \${timerType === 'pomodoro' ? 'bg-white dark:bg-slate-900 text-brand-700 dark:text-brand-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'}\`
        }, "পোমোডোরো"),
        /* Stopwatch */
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: () => { setTimerType('stopwatch'); setMode('idle'); setStopwatchSec(0); },
          className: \`px-3 py-1.5 rounded-lg text-xs font-semibold font-bn transition \${timerType === 'stopwatch' ? 'bg-white dark:bg-slate-900 text-brand-700 dark:text-brand-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'}\`
        }, "স্টপওয়াচ")
      ),
      /* Zen toggle */
      /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: () => setZenMode(true),
        className: "px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5 transition"
      },
        /*#__PURE__*/React.createElement(Icon, { name: "maximize-2", size: 14 }),
        /*#__PURE__*/React.createElement("span", { className: "font-bn" }, "জেন মোড")
      )
    ),

    /* Main Timer Card */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-6 sm:p-8 text-center rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
    },
      /* Status Tag */
      /*#__PURE__*/React.createElement("div", {
        className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium font-bn " +
          (mode === 'work' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' :
           mode === 'break' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' :
           'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400')
      },
        /*#__PURE__*/React.createElement("span", { className: "w-2 h-2 rounded-full " + (mode !== 'idle' ? 'bg-emerald-500 animate-ping' : 'bg-slate-400') }),
        /*#__PURE__*/React.createElement("span", null,
          mode === 'work' ? 'পড়াশোনা চলছে' :
          mode === 'break' ? 'বিরতি চলছে' :
          mode === 'running' ? 'স্টপওয়াচ চলছে' : 'ফোকাস সেশন'
        )
      ),

      /* Digital Clock Readout (Sharp, Crisp Font) */
      /*#__PURE__*/React.createElement("div", {
        className: "text-6xl sm:text-7xl font-light font-mono tabular-nums tracking-tight text-slate-900 dark:text-white my-3 select-all"
      }, mm, ":", ss),

      /* Presets row */
      timerType === 'pomodoro' && mode === 'idle' && /*#__PURE__*/React.createElement("div", {
        className: "flex justify-center gap-1.5 font-mono text-xs"
      }, [15, 25, 45, 60].map(m => /*#__PURE__*/React.createElement("button", {
        key: m,
        type: "button",
        onClick: () => pickPreset(m),
        className: \`px-3 py-1.5 rounded-lg border transition \${work === m ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-semibold' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}\`
      }, m, "m"))),

      /* Controls */
      /*#__PURE__*/React.createElement("div", {
        className: "flex justify-center gap-3 pt-2"
      },
        mode === 'idle'
          ? /*#__PURE__*/React.createElement(Btn, {
              onClick: start,
              className: "px-8 py-2.5 font-bn font-semibold rounded-xl"
            }, "শুরু করুন")
          : /*#__PURE__*/React.createElement(Btn, {
              variant: "outline",
              onClick: pause,
              className: "px-8 py-2.5 font-bn font-semibold rounded-xl"
            }, "বিরতি"),
        /*#__PURE__*/React.createElement(Btn, {
          variant: "ghost",
          onClick: stop,
          className: "px-4 py-2.5 font-bn text-slate-500 rounded-xl"
        }, "রিসেট")
      )
    ),

    /* Ambient Soundscapes Card (Quiet & Minimal) */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-2.5"
    },
      /*#__PURE__*/React.createElement("div", {
        className: "flex items-center justify-between text-xs font-semibold font-bn text-slate-700 dark:text-slate-300"
      },
        /*#__PURE__*/React.createElement("span", { className: "flex items-center gap-1.5" },
          /*#__PURE__*/React.createElement(Icon, { name: "volume-2", size: 15 }),
          "অ্যাম্বিয়েন্ট সাউন্ড"
        ),
        /*#__PURE__*/React.createElement("span", { className: "text-slate-400 text-[11px] font-mono" },
          sound === 'off' ? 'বন্ধ' : sound
        )
      ),
      /* Sound buttons */
      /*#__PURE__*/React.createElement("div", {
        className: "grid grid-cols-4 gap-1.5 text-xs font-bn"
      },
        /* Off */
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: () => pickSound('off'),
          className: \`py-2 rounded-lg border transition \${sound === 'off' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent font-medium' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}\`
        }, "বন্ধ"),
        /* Focus */
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: () => pickSound('focus'),
          className: \`py-2 rounded-lg border transition \${sound === 'focus' ? 'bg-brand-600 text-white border-transparent font-medium' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}\`
        }, "ফোকাস"),
        /* White */
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: () => pickSound('white'),
          className: \`py-2 rounded-lg border transition \${sound === 'white' ? 'bg-brand-600 text-white border-transparent font-medium' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}\`
        }, "হোয়াইট"),
        /* Brown */
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: () => pickSound('brown'),
          className: \`py-2 rounded-lg border transition \${sound === 'brown' ? 'bg-brand-600 text-white border-transparent font-medium' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}\`
        }, "ব্রাউন")
      )
    )
  );
}
`;

  content = content.slice(0, timerStart) + newTimerView + content.slice(quotesStart);
  console.log('Successfully upgraded TimerView with minimalist layout and clean Zen mode');
}

// 4. Upgrade AlarmView (Clean iOS style clock)
const alarmStart = content.indexOf('function AlarmView() {');
const timerViewHeaderStart = content.indexOf('function TimerView() {');

if (alarmStart !== -1 && timerViewHeaderStart !== -1) {
  const newAlarmView = `function AlarmView() {
  const { state, dispatch } = useVault();
  const [editing, setEditing] = useState(null);
  const ringtones = AudioEngine.ringtones ? AudioEngine.ringtones() : ['Classic Bell', 'Soft Chime', 'Gentle Pulse'];

  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 max-w-xl mx-auto pb-8"
  },
    /* Header */
    /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3"
    },
      /*#__PURE__*/React.createElement("div", null,
        /*#__PURE__*/React.createElement("h2", { className: "text-lg font-semibold font-bn text-slate-900 dark:text-white" }, "অ্যালার্ম"),
        /*#__PURE__*/React.createElement("p", { className: "text-xs text-slate-400 font-bn mt-0.5" }, "পড়াশোনা ও রুটিন অনুস্মারক অ্যালার্ম")
      ),
      /* Add Alarm */
      /*#__PURE__*/React.createElement(Btn, {
        onClick: () => setEditing({
          id: uid(),
          time: '06:00',
          label: 'পড়াশোনা শুরু',
          ringtone: 'Classic Bell',
          active: true,
          days: [0, 1, 2, 3, 4, 5, 6]
        }),
        className: "text-xs font-bn py-2"
      },
        /*#__PURE__*/React.createElement(Icon, { name: "plus", size: 14 }),
        "নতুন অ্যালার্ম"
      )
    ),

    /* Alarms List */
    state.alarms.length === 0 ? /*#__PURE__*/React.createElement(Empty, {
      icon: "alarm-clock",
      text: "কোনো অ্যালার্ম সেট করা নেই।"
    }) : /*#__PURE__*/React.createElement("div", {
      className: "space-y-2.5"
    }, state.alarms.map(a => /*#__PURE__*/React.createElement(Card, {
      key: a.id,
      className: \`p-4 rounded-xl border transition \${a.active ? 'border-slate-200 dark:border-slate-800' : 'opacity-60 border-slate-100 dark:border-slate-800/40'}\`
    },
      /*#__PURE__*/React.createElement("div", { className: "flex items-center justify-between" },
        /* Time & Details */
        /*#__PURE__*/React.createElement("div", { className: "space-y-0.5" },
          /* Big clean time digits */
          /*#__PURE__*/React.createElement("div", {
            className: \`text-3xl font-light font-mono tabular-nums tracking-tight \${a.active ? 'text-slate-900 dark:text-white' : 'text-slate-400'}\`
          }, a.time),
          /* Label */
          /*#__PURE__*/React.createElement("div", {
            className: "text-sm font-medium font-bn text-slate-700 dark:text-slate-300"
          }, a.label || 'অ্যালার্ম'),
          /* Days info */
          /*#__PURE__*/React.createElement("div", {
            className: "text-xs text-slate-400 font-bn"
          }, (a.days || []).length === 7 ? 'প্রতিদিন' : (a.days || []).map(d => ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'][d]).join(', ') || 'একবার')
        ),

        /* Toggle & Actions */
        /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-3" },
          /* Toggle */
          /*#__PURE__*/React.createElement("input", {
            type: "checkbox",
            checked: a.active,
            onChange: e => dispatch({
              type: 'UPDATE_ITEM',
              key: 'alarms',
              item: { ...a, active: e.target.checked }
            }),
            className: "w-5 h-5 accent-brand-600 rounded cursor-pointer"
          }),
          /* Edit */
          /*#__PURE__*/React.createElement("button", {
            type: "button",
            onClick: () => setEditing(a),
            className: "p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
          }, /*#__PURE__*/React.createElement(Icon, { name: "pencil", size: 14 })),
          /* Delete */
          /*#__PURE__*/React.createElement("button", {
            type: "button",
            onClick: () => dispatch({ type: 'REMOVE_ITEM', key: 'alarms', id: a.id }),
            className: "p-1.5 text-slate-400 hover:text-rose-500"
          }, /*#__PURE__*/React.createElement(Icon, { name: "trash-2", size: 14 }))
        )
      )
    ))),

    /* Add/Edit Modal */
    editing && /*#__PURE__*/React.createElement(Modal, {
      open: true,
      onClose: () => setEditing(null),
      title: "অ্যালার্ম সম্পাদনা"
    },
      /*#__PURE__*/React.createElement("div", { className: "space-y-3 font-bn" },
        /* Time Input */
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("label", { className: "text-xs text-slate-400 mb-1 block" }, "সময় (Time)"),
          /*#__PURE__*/React.createElement(Input, {
            type: "time",
            value: editing.time,
            onChange: e => setEditing({ ...editing, time: e.target.value }),
            className: "font-mono text-base"
          })
        ),
        /* Label Input */
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("label", { className: "text-xs text-slate-400 mb-1 block" }, "লেবেল / বিবরণ"),
          /*#__PURE__*/React.createElement(Input, {
            placeholder: "যেমন: সকালে পড়ার সময়",
            value: editing.label,
            onChange: e => setEditing({ ...editing, label: e.target.value })
          })
        ),
        /* Ringtone */
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("label", { className: "text-xs text-slate-400 mb-1 block" }, "রিংটোন"),
          /*#__PURE__*/React.createElement(Select, {
            value: editing.ringtone,
            onChange: e => setEditing({ ...editing, ringtone: e.target.value }),
            className: "w-full"
          }, ringtones.map(r => /*#__PURE__*/React.createElement("option", { key: r, value: r }, r)))
        ),
        /* Repeat Days */
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("label", { className: "text-xs text-slate-400 mb-1.5 block" }, "পুনরাবৃত্তি দিনসমূহ"),
          /*#__PURE__*/React.createElement("div", { className: "grid grid-cols-7 gap-1 font-mono text-xs" },
            ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'].map((d, i) => {
              const on = (editing.days || []).includes(i);
              return /*#__PURE__*/React.createElement("button", {
                key: i,
                type: "button",
                onClick: () => {
                  const s = new Set(editing.days || []);
                  if (on) s.delete(i); else s.add(i);
                  setEditing({ ...editing, days: [...s].sort() });
                },
                className: \`py-2 rounded-lg font-bn text-xs transition \${on ? 'bg-brand-600 text-white font-semibold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}\`
              }, d);
            })
          )
        ),
        /* Actions */
        /*#__PURE__*/React.createElement("div", { className: "flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800" },
          /*#__PURE__*/React.createElement(Btn, { variant: "ghost", onClick: () => setEditing(null) }, "বাতিল"),
          /*#__PURE__*/React.createElement(Btn, {
            onClick: () => {
              const exists = state.alarms.find(x => x.id === editing.id);
              if (exists) dispatch({ type: 'UPDATE_ITEM', key: 'alarms', item: editing });
              else dispatch({ type: 'ADD_ITEM', key: 'alarms', item: editing });
              setEditing(null);
              toast('অ্যালার্ম সংরক্ষিত হয়েছে', 'success');
            }
          }, "সংরক্ষণ")
        )
      )
    )
  );
}
`;

  content = content.slice(0, alarmStart) + newAlarmView + content.slice(timerViewHeaderStart);
  console.log('Successfully upgraded AlarmView');
}

// 5. Replace bloated rounded-3xl with rounded-xl or rounded-2xl throughout app.js
content = content.replace(/rounded-3xl/g, 'rounded-2xl');

fs.writeFileSync(appPath, content, 'utf8');
console.log('Updated public/app.js successfully with all requested UI improvements!');
