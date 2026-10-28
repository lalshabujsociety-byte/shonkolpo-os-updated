const fs = require('fs');

const appPath = 'public/app.js';
let content = fs.readFileSync(appPath, 'utf8');

// 1. StudyRunner translations
content = content.replace(
  "function StudyRunner({\n  cards,\n  mode = 'study',\n  onExit\n}) {\n  const { state, dispatch } = useVault();",
  "function StudyRunner({\n  cards,\n  mode = 'study',\n  onExit\n}) {\n  const { state, dispatch } = useVault();\n  const lang = state?.ui?.lang || 'bn';"
);

content = content.replace(
  'title: "ফ্ল্যাশকার্ড সেশন সম্পন্ন"',
  'title: lang === "en" ? "Flashcard Session Complete" : "ফ্ল্যাশকার্ড সেশন সম্পন্ন"'
);

content = content.replace(
  "mode === 'exam' ? `ফ্ল্যাশকার্ড টেস্ট স্কোর: ${knownPct}%` : \"অনুশীলন সম্পন্ন হয়েছে\"",
  "mode === 'exam' ? (lang === 'en' ? `Flashcard Test Score: ${knownPct}%` : `ফ্ল্যাশকার্ড টেস্ট স্কোর: ${knownPct}%`) : (lang === 'en' ? 'Practice Complete' : 'অনুশীলন সম্পন্ন হয়েছে')"
);

content = content.replace(
  "`মোট ${total} টি কার্ডের মধ্যে ${score.known} টি মনে রাখতে পেরেছেন।`",
  "lang === 'en' ? `Recalled ${score.known} out of ${total} cards.` : `মোট ${total} টি কার্ডের মধ্যে ${score.known} টি মনে রাখতে পেরেছেন।`"
);

content = content.replace(
  '<div className: "text-[11px] text-slate-500 font-bn" }, "পেরেছি")',
  '<div className: "text-[11px] text-slate-500 font-bn" }, lang === "en" ? "Mastered" : "পেরেছি")'
);

content = content.replace(
  '<div className: "text-[11px] text-slate-500 font-bn" }, "কঠিন / রিভিউ")',
  '<div className: "text-[11px] text-slate-500 font-bn" }, lang === "en" ? "Hard / Review" : "কঠিন / রিভিউ")'
);

content = content.replace(
  'className: "w-full py-2.5 font-bn font-semibold"\n        }, "সম্পন্ন করুন")',
  'className: "w-full py-2.5 font-bn font-semibold"\n        }, lang === "en" ? "Finish Session" : "সম্পন্ন করুন")'
);

content = content.replace(
  "mode === 'exam' ? 'ফ্ল্যাশকার্ড টেস্ট' : 'ফ্ল্যাশকার্ড স্টাডি'",
  "mode === 'exam' ? (lang === 'en' ? 'Flashcard Test' : 'ফ্ল্যাশকার্ড টেস্ট') : (lang === 'en' ? 'Flashcard Study' : 'ফ্ল্যাশকার্ড স্টাডি')"
);

content = content.replace(
  '"প্রশ্ন (Question)"',
  'lang === "en" ? "Question" : "প্রশ্ন (Question)"'
);

content = content.replace(
  '"✓ উত্তর (Answer)"',
  'lang === "en" ? "✓ Answer" : "✓ উত্তর (Answer)"'
);

content = content.replace(
  '"উত্তর দেখতে ট্যাপ করুন / স্পেসবার চাপুন"',
  'lang === "en" ? "Tap or press Space to reveal answer" : "উত্তর দেখতে ট্যাপ করুন / স্পেসবার চাপুন"'
);

content = content.replace(
  '"নিচে আপনার অবস্থা নির্বাচন করুন"',
  'lang === "en" ? "Select your recall rating below" : "নিচে আপনার অবস্থা নির্বাচন করুন"'
);

content = content.replace(
  '}, "কঠিন (আবার)")',
  '}, lang === "en" ? "Hard (Again)" : "কঠিন (আবার)")'
);

content = content.replace(
  '}, "মাঝারি")',
  '}, lang === "en" ? "Medium" : "মাঝারি")'
);

content = content.replace(
  '}, "পেরেছি")',
  '}, lang === "en" ? "Good" : "পেরেছি")'
);

content = content.replace(
  'className: "w-full py-3 justify-center text-sm font-bn font-medium"\n        }, "উত্তর দেখুন")',
  'className: "w-full py-3 justify-center text-sm font-bn font-medium"\n        }, lang === "en" ? "Show Answer" : "উত্তর দেখুন")'
);

// 2. TimerView translations
content = content.replace(
  "function TimerView() {\n  const { state, dispatch } = useVault();",
  "function TimerView() {\n  const { state, dispatch } = useVault();\n  const lang = state?.ui?.lang || 'bn';"
);

content = content.replace(
  '}, "পোমোডোরো")',
  '}, lang === "en" ? "Pomodoro" : "পোমোডোরো")'
);

content = content.replace(
  '}, "স্টপওয়াচ")',
  '}, lang === "en" ? "Stopwatch" : "স্টপওয়াচ")'
);

content = content.replace(
  '/*#__PURE__*/React.createElement("span", { className: "font-bn" }, "জেন মোড")',
  '/*#__PURE__*/React.createElement("span", { className: "font-bn" }, lang === "en" ? "Zen Mode" : "জেন মোড")'
);

content = content.replace(
  "mode === 'work' ? 'শান্ত থাকুন ও গভীর মনোযোগ ধরে রাখুন' : mode === 'break' ? 'বিরতি নিন' : 'সময় অতিবাহিত হচ্ছে'",
  "mode === 'work' ? (lang === 'en' ? 'Stay calm and deeply focused' : 'শান্ত থাকুন ও গভীর মনোযোগ ধরে রাখুন') : mode === 'break' ? (lang === 'en' ? 'Take a refreshing break' : 'বিরতি নিন') : (lang === 'en' ? 'Time is flowing' : 'সময় অতিবাহিত হচ্ছে')"
);

content = content.replace(
  "mode === 'work' ? 'পড়াশোনা চলছে' :\n          mode === 'break' ? 'বিরতি চলছে' :\n          mode === 'running' ? 'স্টপওয়াচ চলছে' : 'ফোকাস সেশন'",
  "mode === 'work' ? (lang === 'en' ? 'Deep Focus' : 'পড়াশোনা চলছে') :\n          mode === 'break' ? (lang === 'en' ? 'Break' : 'বিরতি চলছে') :\n          mode === 'running' ? (lang === 'en' ? 'Stopwatch Active' : 'স্টপওয়াচ চলছে') : (lang === 'en' ? 'Focus Session' : 'ফোকাস সেশন')"
);

content = content.replace(
  '}, "শুরু করুন")',
  '}, lang === "en" ? "Start" : "শুরু করুন")'
);

content = content.replace(
  '}, "বিরতি")',
  '}, lang === "en" ? "Pause" : "বিরতি")'
);

content = content.replace(
  '}, "রিসেট")',
  '}, lang === "en" ? "Reset" : "রিসেট")'
);

content = content.replace(
  '"অ্যাম্বিয়েন্ট সাউন্ড"',
  'lang === "en" ? "Ambient Sounds" : "অ্যাম্বিয়েন্ট সাউন্ড"'
);

content = content.replace(
  "sound === 'off' ? 'বন্ধ' : sound",
  "sound === 'off' ? (lang === 'en' ? 'Off' : 'বন্ধ') : sound"
);

content = content.replace(
  '}, "বন্ধ")',
  '}, lang === "en" ? "Off" : "বন্ধ")'
);

content = content.replace(
  '}, "ফোকাস")',
  '}, lang === "en" ? "Focus" : "ফোকাস")'
);

content = content.replace(
  '}, "হোয়াইট")',
  '}, lang === "en" ? "White" : "হোয়াইট")'
);

content = content.replace(
  '}, "ব্রাউন")',
  '}, lang === "en" ? "Brown" : "ব্রাউন")'
);

// 3. AlarmView translations
content = content.replace(
  "function AlarmView() {\n  const { state, dispatch } = useVault();",
  "function AlarmView() {\n  const { state, dispatch } = useVault();\n  const lang = state?.ui?.lang || 'bn';"
);

content = content.replace(
  '/*#__PURE__*/React.createElement("h2", { className: "text-lg font-semibold font-bn text-slate-900 dark:text-white" }, "অ্যালার্ম"),\n        /*#__PURE__*/React.createElement("p", { className: "text-xs text-slate-400 font-bn mt-0.5" }, "পড়াশোনা ও রুটিন অনুস্মারক অ্যালার্ম")',
  '/*#__PURE__*/React.createElement("h2", { className: "text-lg font-semibold font-bn text-slate-900 dark:text-white" }, lang === "en" ? "Alarms" : "অ্যালার্ম"),\n        /*#__PURE__*/React.createElement("p", { className: "text-xs text-slate-400 font-bn mt-0.5" }, lang === "en" ? "Study & routine reminder alarms" : "পড়াশোনা ও রুটিন অনুস্মারক অ্যালার্ম")'
);

content = content.replace(
  '"নতুন অ্যালার্ম"',
  'lang === "en" ? "New Alarm" : "নতুন অ্যালার্ম"'
);

content = content.replace(
  'text: "কোনো অ্যালার্ম সেট করা নেই।"',
  'text: lang === "en" ? "No alarms configured." : "কোনো অ্যালার্ম সেট করা নেই।"'
);

// 4. SettingsView translations
content = content.replace(
  "function SettingsView() {\n  const {\n    state,\n    dispatch\n  } = useVault();",
  "function SettingsView() {\n  const {\n    state,\n    dispatch\n  } = useVault();\n  const lang = state?.ui?.lang || 'bn';"
);

content = content.replace(
  '/*#__PURE__*/React.createElement("h2", { className: "text-lg font-semibold font-bn text-slate-900 dark:text-white" }, "সেটিংস"),\n      /*#__PURE__*/React.createElement("p", { className: "text-xs text-slate-400 font-bn mt-0.5" }, "প্রোফাইল, থিম এবং ব্যাকআপ ব্যবস্থাপনা।")',
  '/*#__PURE__*/React.createElement("h2", { className: "text-lg font-semibold font-bn text-slate-900 dark:text-white" }, lang === "en" ? "Settings" : "সেটিংস"),\n      /*#__PURE__*/React.createElement("p", { className: "text-xs text-slate-400 font-bn mt-0.5" }, lang === "en" ? "Profile, theme, and backup management." : "প্রোফাইল, থিম এবং ব্যাকআপ ব্যবস্থাপনা।")'
);

content = content.replace(
  '"শিক্ষার্থীর পরিচিতি"',
  'lang === "en" ? "Student Profile" : "শিক্ষার্থীর পরিচিতি"'
);

content = content.replace(
  '> "নাম"',
  '> lang === "en" ? "Name" : "নাম"'
);

content = content.replace(
  '> "লক্ষ্য / টার্গেট"',
  '> lang === "en" ? "Target / Goal" : "লক্ষ্য / টার্গেট"'
);

content = content.replace(
  '"রূপরেখা ও ভাষা"',
  'lang === "en" ? "Appearance & Language" : "রূপরেখা ও ভাষা"'
);

content = content.replace(
  "state.ui.theme === 'dark' ? 'লাইট মোড' : 'ডার্ক মোড'",
  "state.ui.theme === 'dark' ? (lang === 'en' ? 'Light Mode' : 'লাইট মোড') : (lang === 'en' ? 'Dark Mode' : 'ডার্ক মোড')"
);

content = content.replace(
  '"নোটিফিকেশন ও অ্যালার্ম"',
  'lang === "en" ? "Notifications & Alarms" : "নোটিফিকেশন ও অ্যালার্ম"'
);

content = content.replace(
  '}, "পপআপ নোটিফিকেশন")',
  '}, lang === "en" ? "Popup Notifications" : "পপআপ নোটিফিকেশন")'
);

content = content.replace(
  '}, "অ্যালার্ম ও রিমাইন্ডার সাউন্ড")',
  '}, lang === "en" ? "Alarm & Reminder Sound" : "অ্যালার্ম ও রিমাইন্ডার সাউন্ড")'
);

content = content.replace(
  '"ব্যাকআপ ও রিস্টোর"',
  'lang === "en" ? "Backup & Restore" : "ব্যাকআপ ও রিস্টোর"'
);

content = content.replace(
  '"ব্যাকআপ এক্সপোর্ট (.json)"',
  'lang === "en" ? "Export Backup (.json)" : "ব্যাকআপ এক্সপোর্ট (.json)"'
);

content = content.replace(
  '"ব্যাকআপ ইমপোর্ট"',
  'lang === "en" ? "Import Backup" : "ব্যাকআপ ইমপোর্ট"'
);

content = content.replace(
  '"সব ডাটা রিসেট করুন"',
  'lang === "en" ? "Reset All Data" : "সব ডাটা রিসেট করুন"'
);

fs.writeFileSync(appPath, content, 'utf8');
console.log('Successfully wrote bilingual translations to public/app.js');
