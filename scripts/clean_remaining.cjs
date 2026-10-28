const fs = require('fs');

const appJsPath = 'public/app.js';
let src = fs.readFileSync(appJsPath, 'utf8');

src = src.replace('knownPct >= 80 ? "🏆" : "✨"', '""');
src = src.replace("toast('স্ট্রাইক সেভার সক্রিয় করা হয়েছে! 🛡️', 'success');", "toast('স্ট্রাইক সেভার সক্রিয় করা হয়েছে', 'success');");
src = src.replace('"🏆 গোল্ড লিজেন্ড ও ডিমোশন সিস্টেমের নিয়ম:"', '"গোল্ড লিজেন্ড ও ডিমোশন নিয়ম:"');
src = src.replace('/*#__PURE__*/React.createElement("div", {\n        className: "w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-brand-500 to-teal-400 text-white flex items-center justify-center text-3xl shadow-lg shadow-brand-500/30 animate-pop"\n      }, knownPct >= 80 ? "🏆" : "✨")',
  '/*#__PURE__*/React.createElement("div", {\n        className: "w-14 h-14 mx-auto rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-500 flex items-center justify-center shadow-sm animate-pop"\n      }, /*#__PURE__*/React.createElement(Icon, { name: "award", size: 28 }))'
);

fs.writeFileSync(appJsPath, src, 'utf8');
console.log('Cleaned remaining emojis.');
