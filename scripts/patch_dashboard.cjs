const fs = require('fs');

console.log('Writing full component enhancements...');
let src = fs.readFileSync('public/app.js', 'utf8');

// --- 1. Replace Dashboard Profile Card with CreditCard ---
// We search for the old profile card in function Dashboard
const oldDashboardCardRegex = /\/\*#__PURE__\*\/React\.createElement\(Card,\s*\{\s*className:\s*"p-5 relative overflow-hidden"[\s\S]*?\/\*#__PURE__\*\/React\.createElement\(Icon,\s*\{\s*name:\s*"timer",\s*label:\s*"Focus",\s*value:\s*totalFocus \+ 'm'\s*\}\)\)\),/;

const newDashboardCardCode = `/*#__PURE__*/React.createElement(CreditCard, {
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
    ),`;

// Also in Dashboard, add const [cardCustomizerOpen, setCardCustomizerOpen] = useState(false);
const oldDashboardStart = `function Dashboard({
  go,
  setSubjectPath
}) {
  const {
    state,
    dispatch
  } = useVault();`;

const newDashboardStart = `function Dashboard({
  go,
  setSubjectPath
}) {
  const {
    state,
    dispatch
  } = useVault();
  const [cardCustomizerOpen, setCardCustomizerOpen] = useState(false);`;

if (src.includes(oldDashboardStart)) {
  src = src.replace(oldDashboardStart, newDashboardStart);
  console.log('Added cardCustomizerOpen state in Dashboard');
}

if (oldDashboardCardRegex.test(src)) {
  src = src.replace(oldDashboardCardRegex, newDashboardCardCode);
  console.log('Replaced old profile card with CreditCard in Dashboard');
} else {
  console.warn('Could not match oldDashboardCardRegex');
}

fs.writeFileSync('public/app.js', src, 'utf8');
console.log('Step 2: Dashboard updated');
