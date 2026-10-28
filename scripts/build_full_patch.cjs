const fs = require('fs');

console.log('Writing full upgrade patch...');
const appJsPath = 'public/app.js';
let code = fs.readFileSync(appJsPath, 'utf8');

// 1. In Dashboard: replace the old profile card with CreditCard
// Let's locate function Dashboard and replace the old card
const oldCardSearch = `/*#__PURE__*/React.createElement(Card, {
    className: "p-5 relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 opacity-10 grad-premium animate-gradientMove pointer-events-none"
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative flex flex-wrap items-center gap-6"
  }, /*#__PURE__*/React.createElement(Logo, {
    size: 56
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-[200px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-slate-500"
  }, "স্বাগতম / Welcome back"), /*#__PURE__*/React.createElement("div", {
    className: "text-xl font-semibold"
  }, p.name || 'Achiever'), /*#__PURE__*/React.createElement("div", {
    className: "mt-2 flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500"
  }, "Level ", p.level), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden max-w-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full grad-bar transition-all",
    style: {
      width: Math.min(100, p.xp / need * 100) + '%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500"
  }, p.xp, "/", need, " XP"))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3"
  }, /*#__PURE__*/React.createElement(Stat, {
    icon: "flame",
    label: "Streak",
    value: p.streak
  }), /*#__PURE__*/React.createElement(Stat, {
    icon: "zap",
    label: "Level",
    value: p.level
  }), /*#__PURE__*/React.createElement(Stat, {
    icon: "timer",
    label: "Focus",
    value: totalFocus + 'm'
  }))),`;

const newCardReplacement = `/*#__PURE__*/React.createElement(CreditCard, {
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
      className: "grid grid-cols-3 gap-2 my-1"
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

if (code.includes(oldCardSearch)) {
  code = code.replace(oldCardSearch, newCardReplacement);
  console.log('Successfully replaced Dashboard profile card with CreditCard & stat pills.');
} else {
  console.warn('oldCardSearch not found directly; searching normalized...');
  const idx = code.indexOf('"স্বাগতম / Welcome back"');
  if (idx !== -1) {
    const cardStart = code.lastIndexOf('/*#__PURE__*/React.createElement(Card,', idx);
    const motivStart = code.indexOf('/*#__PURE__*/React.createElement("div", {\n    className: "relative mt-5 p-3 rounded-xl', idx);
    if (cardStart !== -1 && motivStart !== -1) {
      code = code.slice(0, cardStart) + newCardReplacement + '\n    ' + code.slice(motivStart);
      console.log('Replaced via index boundaries!');
    }
  }
}

// 2. Ensure Dashboard state has cardCustomizerOpen
if (!code.includes('const [cardCustomizerOpen, setCardCustomizerOpen]')) {
  code = code.replace('function Dashboard({\n  go,\n  setSubjectPath\n}) {\n  const {\n    state,\n    dispatch\n  } = useVault();',
    'function Dashboard({\n  go,\n  setSubjectPath\n}) {\n  const {\n    state,\n    dispatch\n  } = useVault();\n  const [cardCustomizerOpen, setCardCustomizerOpen] = useState(false);'
  );
  console.log('Added cardCustomizerOpen in Dashboard');
}

fs.writeFileSync(appJsPath, code, 'utf8');
console.log('Dashboard patch complete');
