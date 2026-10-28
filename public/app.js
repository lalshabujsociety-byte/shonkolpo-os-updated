/* =========================================================================
   সংকল্প OS v3 — Single-file offline-first productivity vault
   Developed by Md. Wadud Hossain, NDC 26, 12606098
   ========================================================================= */
var React = (typeof window !== 'undefined' && window.React) ? window.React : (typeof React !== 'undefined' ? React : {});
var ReactDOM = (typeof window !== 'undefined' && window.ReactDOM) ? window.ReactDOM : (typeof ReactDOM !== 'undefined' ? ReactDOM : {});
var _R = () => (typeof window !== 'undefined' && window.React) ? window.React : React;

const useState = (initial) => _R().useState(initial);
const useEffect = (effect, deps) => _R().useEffect(effect, deps);
const useMemo = (factory, deps) => _R().useMemo(factory, deps);
const useRef = (initial) => _R().useRef(initial);
const useReducer = (reducer, init, initArg) => _R().useReducer(reducer, init, initArg);
const useCallback = (callback, deps) => _R().useCallback(callback, deps);
const createContext = (defaultValue) => _R().createContext(defaultValue);
const useContext = (context) => _R().useContext(context);


/* ---------- Constants ---------- */
const STORAGE_KEY = 'focus-vault-v1';
const CREDIT = 'Developed by Md. Wadud Hossain, NDC 26, 12606098';
const BRAND = 'সংকল্প OS';
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const DEFAULT_MOTIVATIONS = [{
  bn: 'ছোট ছোট পদক্ষেপ বড় স্বপ্ন গড়ে।',
  en: 'Small steps build big dreams.'
}, {
  bn: 'আজকের সংকল্পই কালকের সাফল্য।',
  en: "Today's resolve is tomorrow's success."
}, {
  bn: 'ধৈর্য হারিও না, সময় সব জবাব দেবে।',
  en: 'Stay patient—time answers everything.'
}, {
  bn: 'শৃঙ্খলা প্রতিভার চেয়ে শক্তিশালী।',
  en: 'Discipline outlasts talent.'
}, {
  bn: 'একটি অধ্যায় শেষ করো, একটি জয় বাড়ুক।',
  en: 'Finish one chapter, earn one win.'
}];
const REMINDER_LINES = ['ভুলে গেছ নাকি? এখনই কাজটা শেষ করো, না হলে কিন্তু রাগ করব! 🥺', 'পড়াশোনার সময় হয়ে গেছে! আজ একটু বেশি কষ্ট করো, আগামী কালকের সাফল্যটা তো তোমারই হবে! ✨', 'হেয়ি, এই কাজটা তো তোমারই করার কথা ছিল! অলসতা সরিয়ে একটু শুরু তো করে দাও! 💪🌸', 'আরেকটু পরেই বিরতি নিও, আগে এই টাস্কটা শেষ করে মিষ্টি একটা হাসি দাও! 😊', 'আমি জানি তোমার ক্লান্তি লাগছে, কিন্তু তুমি তো বিজয়ী হতে চাও, তাই না? উঠে পড়ো! 🚀', 'একটু একটু করেই তো বড় স্বপ্ন সত্যি হয়। আজকের এই ছোট কাজটা ফিনিশ করে ফেলো তো লক্ষ্মীটি! 🧸', 'সময়টা চলে যাচ্ছে কিন্তু! ঝটপট কাজটা শেষ করে ফেলো, আমি তোমার জন্য রুটিন ধরে বসে আছি! ⏳', 'স্বপ্নের পথে আর একটা ছোট পদক্ষেপ! টাস্কটা কমপ্লিট করে টিক মার্ক বসিয়ে দাও তো! 🎯'];
const SPLASH_LINES = ['তুমিই পারবে — শুরু করে দাও এখনই।', 'সংকল্প যেখানে, সাফল্য সেখানে।', 'আজকের পরিশ্রমই কালকের গর্ব।'];
const DEFAULT_STATE = {
  profile: {
    name: '',
    target: '',
    institution: '',
    batch: '',
    xp: 0,
    level: 1,
    streak: 0,
    shield: false,
    lastActive: ''
  },
  mcqs: [],
  attempts: [],
  mistakeVault: [],
  flashcards: [],
  schedule: [],
  todos: [],
  notes: [],
  habits: [],
  timerSessions: [],
  subjects: [],
  // [{id,name,topics:[{id,name,subtopics:[{id,name}]}]}]
  information: [],
  // [{id,subjectId,topicId,subtopicId,title,body,difficulty,updated}]
  quotes: [],
  // user-added quotes [{bn,en}]
  alarms: [],
  // [{id,time,label,ringtone,active,days:[0..6]}]
  notifiedIds: [],
  // ids of schedule/todo that already fired today {id, date}
  records: {
    weekly: {},
    monthly: {},
    badges: []
  },
  // gamification
  ui: {
    theme: 'light',
    tourDone: false,
    motivationIdx: 0,
    lang: 'bn',
    notif: {
      popup: true,
      beep: true
    },
    reminderIdx: 0
  }
};


/* ---------- Embedded Demo Data for 1-Click Offline Testing ---------- */
const EMBEDDED_DEMO_DATA = {"profile":{"name":"ওয়াদুদ হোসেন (NDC 26)","target":"বুয়েট ও মেডিকেল ভর্তি পরীক্ষা ২০২৬","institution":"নটর ডেম কলেজ, ঢাকা","batch":"HSC 2026","streak":12,"lastActive":"2026-10-28","level":4,"xp":340,"shield":false},"ui":{"theme":"light","lang":"bn","motivationIdx":2,"tourDone":true,"notif":{"popup":true,"beep":true},"reminderIdx":0},"subjects":[{"id":"subj-phy","name":"পদার্থবিজ্ঞান","code":"PHY-101","color":"brand","topics":[{"id":"top-vector","name":"ভেক্টর ও গতিবিদ্যা","subtopics":[{"id":"sub-dot-cross","name":"ডট ও ক্রস গুণন","formula":"A·B = AB cos(θ); |A×B| = AB sin(θ)"},{"id":"sub-projectile","name":"প্রাসের গতি","formula":"H_max = (v₀² sin²θ)/(2g); R = (v₀² sin 2θ)/g"}]},{"id":"top-mechanics","name":"নিউটনিয়ান বলবিদ্যা ও কাজ-শক্তি","subtopics":[{"id":"sub-torque","name":"টর্ক ও জড়তার ভ্রামক","formula":"τ = Iα; L = Iω"},{"id":"sub-work-energy","name":"কাজ-শক্তি উপপাদ্য","formula":"W = ΔK = 1/2 m(v² - u²)"}]},{"id":"top-electricity","name":"চলতড়িৎ ও বর্তনী","subtopics":[{"id":"sub-kirchhoff","name":"কার্শফের সূত্র ও হুইটস্টোন ব্রিজ","formula":"P/Q = R/S"},{"id":"sub-potentiometer","name":"পটেনশিওমিটার ও রোধের সমবায়","formula":"E₁/E₂ = l₁/l₂"}]}]},{"id":"subj-chem","name":"রসায়ন","code":"CHEM-102","color":"rose","topics":[{"id":"top-quantum","name":"গুণগত রসায়ন ও পর্যায়বৃত্ত ধর্ম","subtopics":[{"id":"sub-quantum-nos","name":"কোয়ান্টাম সংখ্যা ও অরবিটাল","formula":"n, l, m, s"},{"id":"sub-solubility","name":"দ্রাব্যতা ও দ্রাব্যতা গুণফল (Ksp)","formula":"Ksp = [A⁺]ᵃ[B⁻]ᵇ"}]},{"id":"top-chemical-change","name":"রাসায়নিক পরিবর্তন ও সাম্যাবস্থা","subtopics":[{"id":"sub-le-chatelier","name":"লা শাতেলীয়ার নীতি ও Kp/Kc","formula":"Kp = Kc(RT)^Δn"},{"id":"sub-buffer","name":"বাফার দ্রবণ ও pH হিসাব","formula":"pH = pKa + log([লবণ]/[অ্যাসিড])"}]},{"id":"top-organic","name":"জৈব রসায়ন","subtopics":[{"id":"sub-hydrocarbon","name":"অ্যালকেন, অ্যালকিন ও বেনজিন","formula":"CnH2n+2, CnH2n, C6H6"},{"id":"sub-isomerism","name":"জ্যামিতিক ও আলোক সমাণুতা","formula":"Cis-Trans & Chiral Carbon"}]}]},{"id":"subj-math","name":"উচ্চতর গণিত","code":"MATH-103","color":"emerald","topics":[{"id":"top-calculus","name":"ক্যালকুলাস (অন্তরীকরণ ও যোগজীকরণ)","subtopics":[{"id":"sub-diff","name":"ডিফারেন্সিয়েশন ও স্পর্শকের ঢাল","formula":"dy/dx = lim(h->0) [f(x+h)-f(x)]/h"},{"id":"sub-integ","name":"যোগজীকরণ ও ক্ষেত্রফল নির্ণয়","formula":"∫ xⁿ dx = (xⁿ⁺¹)/(n+1) + c"}]},{"id":"top-conics","name":"কনিক ও জ্যামিতি","subtopics":[{"id":"sub-parabola","name":"পরাবৃত্ত ও উপবৃত্তের সমীকরণ","formula":"y² = 4ax; x²/a² + y²/b² = 1"}]}]},{"id":"subj-bio","name":"জীববিজ্ঞান","code":"BIO-104","color":"amber","topics":[{"id":"top-genetics","name":"কোষ ও বংশগতিবিদ্যা","subtopics":[{"id":"sub-dna","name":"ডিএনএ ও আরএনএ রেপ্লিকেশন","formula":"A=T, G≡C (Watson-Crick Model)"},{"id":"sub-mendel","name":"মেন্ডেলের বংশগতির সূত্র","formula":"৩:১ (একসংকর অনুপাত)"}]},{"id":"top-circulation","name":"রক্ত সংবহন ও হৃদপিণ্ড","subtopics":[{"id":"sub-heart","name":"কার্ডিয়াক চক্র ও রক্তচাপ","formula":"Systole: 120 mmHg, Diastole: 80 mmHg"}]}]}],"mcqs":[{"id":"mcq-p1","subjectId":"subj-phy","topicId":"top-vector","subtopicId":"sub-dot-cross","q":"দুটি ভেক্টর A এবং B পরস্পরের উপর লম্ব হলে তাদের ডট গুণনের মান কত হবে?","options":["শূন্য (০)","AB","১ (এক)","-AB"],"correct":0,"explanation":"A · B = AB cos(θ)। যেহেতু ভেক্টরদ্বয় পরস্পর লম্ব, θ = 90°। cos(90°) = 0, সুতরাং A · B = 0।"},{"id":"mcq-p2","subjectId":"subj-phy","topicId":"top-vector","subtopicId":"sub-projectile","q":"কোন কোণে নিক্ষিপ্ত প্রাসের পাল্লা (Horizontal Range) সর্বোচ্চ হয়?","options":["30°","45°","60°","90°"],"correct":1,"explanation":"পাল্লার সূত্র R = (v₀² sin 2θ)/g। sin(2θ) এর সর্বোচ্চ মান ১ যখন 2θ = 90°, অর্থাৎ θ = 45°।"},{"id":"mcq-p3","subjectId":"subj-phy","topicId":"top-mechanics","subtopicId":"sub-torque","q":"টর্কের একক নিচের কোনটি?","options":["N/m","N·m","J/s","kg·m/s"],"correct":1,"explanation":"টর্ক τ = r × F, তাই টর্কের SI একক নিউটন-মিটার (N·m)।"},{"id":"mcq-p4","subjectId":"subj-phy","topicId":"top-electricity","subtopicId":"sub-kirchhoff","q":"কার্শফের প্রথম সূত্র (KCL) কোন রাশির সংরক্ষণশীলতা নীতি মেনে চলে?","options":["শক্তি","ভরবেগ","তড়িৎ আধান (Charge)","কৌণিক ভরবেগ"],"correct":2,"explanation":"কার্শফের কারেন্ট সূত্র (KCL) চার্জ বা আধানের সংরক্ষণশীলতার প্রত্যক্ষ ফলাফল।"},{"id":"mcq-c1","subjectId":"subj-chem","topicId":"top-quantum","subtopicId":"sub-quantum-nos","q":"সহকারী কোয়ান্টাম সংখ্যা l = 2 হলে অরবিটালটি কী রূপ?","options":["s অরবিটাল","p অরবিটাল","d অরবিটাল","f অরবিটাল"],"correct":2,"explanation":"l = 0 হলে s, l = 1 হলে p, l = 2 হলে d, এবং l = 3 হলে f অরবিটাল।"},{"id":"mcq-c2","subjectId":"subj-chem","topicId":"top-chemical-change","subtopicId":"sub-buffer","q":"মানুষের রক্তের স্বাভাবিক pH কত?","options":["6.8 - 7.0","7.35 - 7.45","7.8 - 8.0","5.5 - 6.5"],"correct":1,"explanation":"মানব রক্তের স্বাভাবিক pH মান 7.35 থেকে 7.45 এর মধ্যে কঠোরভাবে নিয়ন্ত্রিত থাকে।"},{"id":"mcq-c3","subjectId":"subj-chem","topicId":"top-organic","subtopicId":"sub-hydrocarbon","q":"বেনজিন বলয়ে কার্বন-কার্বন বন্ধন দূরত্ব কত?","options":["0.154 nm","0.134 nm","0.139 nm","0.120 nm"],"correct":2,"explanation":"বেনজিনের রেজোন্যান্সের কারণে প্রতিটি C-C বন্ধন দৈর্ঘ্য একক ও দ্বি-বন্ধনের মাঝামাঝি 0.139 nm হয়।"},{"id":"mcq-m1","subjectId":"subj-math","topicId":"top-calculus","subtopicId":"sub-diff","q":"d/dx (ln sin x) এর মান কত?","options":["tan x","cot x","-cot x","sec x"],"correct":1,"explanation":"চেইন রুল অনুসারে: d/dx(ln sin x) = (1/sin x) · cos x = cot x।"},{"id":"mcq-m2","subjectId":"subj-math","topicId":"top-calculus","subtopicId":"sub-integ","q":"∫ e^(2x) dx এর মান কত?","options":["2e^(2x) + c","(1/2)e^(2x) + c","e^(2x) + c","e^x + c"],"correct":1,"explanation":"∫ e^(ax) dx = (1/a)e^(ax) + c। এখানে a = 2, সুতরাং (1/2)e^(2x) + c।"},{"id":"mcq-m3","subjectId":"subj-math","topicId":"top-conics","subtopicId":"sub-parabola","q":"y² = 16x পরাবৃত্তের উপকেন্দ্রের স্থানাঙ্ক কত?","options":["(4, 0)","(0, 4)","(16, 0)","(2, 0)"],"correct":0,"explanation":"y² = 4ax সমীকরণের সাথে তুলনা করলে 4a = 16 => a = 4। উপকেন্দ্র (a, 0) = (4, 0)।"},{"id":"mcq-b1","subjectId":"subj-bio","topicId":"top-genetics","subtopicId":"sub-dna","q":"ডিএনএ অণুতে সাইটোসিনের সাথে গুয়ানিন কয়টি হাইড্রোজেন বন্ধন দ্বারা যুক্ত থাকে?","options":["১ টি","২ টি","৩ টি","৪ টি"],"correct":2,"explanation":"অ্যাডেনিন ও থাইমিন ২টি হাইড্রোজেন বন্ড (A=T) এবং গুয়ানিন ও সাইটোসিন ৩টি হাইড্রোজেন বন্ড (G≡C) দিয়ে যুক্ত থাকে।"},{"id":"mcq-b2","subjectId":"subj-bio","topicId":"top-circulation","subtopicId":"sub-heart","q":"হৃদপিণ্ডের প্রাকৃতিক পেসমেকার কোনটি?","options":["SA নোড","AV নোড","হিজের বান্ডিল","পারকিনজি তন্তু"],"correct":0,"explanation":"সাইনোট্রিয়াল নোড (SA Node) স্বতঃস্ফূর্তভাবে অ্যাকশন পটেনশিয়াল তৈরি করে হৃদস্পন্দন শুরু করে, তাই একে প্রাকৃতিক পেসমেকার বলা হয়।"}],"flashcards":[{"id":"fc-1","subjectId":"subj-phy","topicId":"top-vector","subtopicId":"sub-dot-cross","front":"লব্ধির সর্বোচ্চ ও সর্বনিম্ন মান","back":"R_max = P + Q (যখন কোণ α = 0°)\nR_min = |P - Q| (যখন কোণ α = 180°)","box":1,"due":"2026-10-28","rep":3},{"id":"fc-2","subjectId":"subj-phy","topicId":"top-electricity","subtopicId":"sub-kirchhoff","front":"হুইটস্টোন ব্রিজের সাম্যাবস্থার শর্ত","back":"P / Q = R / S\n(যখন গ্যালভানোমিটারের ভেতর দিয়ে কোনো বিদ্যুৎ প্রবাহিত হয় না, Ig = 0)","box":2,"due":"2026-10-29","rep":4},{"id":"fc-3","subjectId":"subj-chem","topicId":"top-chemical-change","subtopicId":"sub-buffer","front":"হেন্ডারসন-হ্যাসেলবাল্ক সমীকরণ","back":"অ্যাসিড বাফার: pH = pKa + log([Salt] / [Acid])\nক্ষারীয় বাফার: pOH = pKb + log([Salt] / [Base])","box":3,"due":"2026-10-28","rep":5},{"id":"fc-4","subjectId":"subj-chem","topicId":"top-quantum","subtopicId":"sub-solubility","front":"ক্যাটেশন ও অ্যানায়নের অধঃক্ষেপণের শর্ত","back":"Kip > Ksp হলে দ্রবণটি অতিপৃক্ত হবে এবং অধঃক্ষেপ পড়বে।\nKip = Ksp হলে সম্পৃক্ত দ্রবণ।","box":1,"due":"2026-10-28","rep":2},{"id":"fc-5","subjectId":"subj-math","topicId":"top-calculus","subtopicId":"sub-diff","front":"গুরুমান ও লঘুমান নির্ণয়ের শর্ত","back":"১. প্রথম অন্তরক dy/dx = 0\n২. d²y/dx² < 0 হলে গুরুমান (Maximum)\n৩. d²y/dx² > 0 হলে লঘুমান (Minimum)","box":2,"due":"2026-10-30","rep":3},{"id":"fc-6","subjectId":"subj-bio","topicId":"top-genetics","subtopicId":"sub-mendel","front":"মেন্ডেলের ১ম ও ২য় সূত্রের ফিনোটাইপ অনুপাত","back":"১ম সূত্র (পৃথকীকরণ সূত্র): ৩ : ১\n২য় সূত্র (স্বাধীন সঞ্চালন সূত্র): ৯ : ৩ : ৩ : ১\nসমপ্রকটতার অনুপাত: ১ : ২ : ১","box":1,"due":"2026-10-28","rep":1}],"schedule":[{"id":"sch-1","day":6,"time":"08:30","title":"পদার্থবিজ্ঞান ১ম পত্র গাণিতিক সমস্যা"},{"id":"sch-2","day":6,"time":"11:00","title":"উচ্চতর গণিত ক্যালকুলাস অনুশীলন"},{"id":"sch-3","day":0,"time":"09:00","title":"রসায়ন ২য় পত্র জৈব যৌগ বিক্রিয়া রিভিশন"},{"id":"sch-4","day":0,"time":"15:00","title":"জীববিজ্ঞান ডায়াগ্রাম অঙ্কন ও বোর্ড প্রশ্ন সমাধান"},{"id":"sch-5","day":1,"time":"10:00","title":"MCQ প্রশ্নব্যাংক ও ফুল টেস্ট"},{"id":"sch-6","day":2,"time":"09:30","title":"পদার্থবিজ্ঞান চলতড়িৎ সার্কিট সমাধান"},{"id":"sch-7","day":3,"time":"14:00","title":"ইংরেজি ট্রান্সলেশন ও রিভিশন"},{"id":"sch-8","day":4,"time":"16:00","title":"সাপ্তাহিক ভুল ভান্ডার (Mistake Vault) রিভিশন"},{"id":"sch-9","day":5,"time":"09:00","title":"মক এক্সাম ও দুর্বল অধ্যায় পর্যালোচনা"}],"todos":[{"id":"td-1","title":"পদার্থবিজ্ঞান ২য় অধ্যায়ের সব বিগত বছরের বোর্ড MCQ শেষ করা","due":"2026-10-28","time":"14:00","priority":"high","done":false},{"id":"td-2","title":"রসায়ন Kp ও Kc এর ৫টি গাণিতিক টাইপ সমাধান করা","due":"2026-10-28","time":"17:30","priority":"normal","done":false},{"id":"td-3","title":"ক্যালকুলাস স্পর্শক ও অভিলম্বের সমীকরণ নোট রিভিশন","due":"2026-10-29","time":"10:00","priority":"high","done":false},{"id":"td-4","title":"জীববিজ্ঞান হৃদপিণ্ডের গঠন চিত্র আঁকা অনুশীলন","due":"2026-10-27","time":"20:00","priority":"normal","done":true},{"id":"td-5","title":"সংকল্প ওএস এ একটি ১০ নম্বরের ফ্ল্যাশকার্ড টেস্ট সম্পন্ন করা","due":"2026-10-28","time":"21:30","priority":"high","done":false}],"notes":[{"id":"note-1","title":"চলতড়িৎ মনে রাখার শর্টকাট টেকনিক","body":"হুইটস্টোন ব্রিজ সাম্যাবস্থায় থাকলে মাঝের গ্যালভানোমিটার দিয়ে কারেন্ট শূন্য। তাই মাঝের রোধ বিবেচনা করার প্রয়োজন নেই। ব্রিজ সংবেদনশীল হয় যখন চারটি রোধের মান সমান বা কাছাকাছি হয়।","tags":["Physics","Shortcuts","Admission"]},{"id":"note-2","title":"জৈব রসায়ন নামকরণ ও রূপান্তরের চাবিকাঠি","body":"অ্যালকোহলকে জারিত করলে অ্যালডিহাইড, তীব্র জারণে এসিড তৈরি হয়। গ্রিগনার্ড বিকারক (RMgX) হলো কার্বন শিকল বাড়ানোর অন্যতম প্রধান অস্ত্র।","tags":["Chemistry","Organic"]}],"habits":[{"id":"hab-1","title":"প্রতিদিন ফজরের পর ২ ঘণ্টা নিবিড় অধ্যয়ন","streak":14,"history":{"2026-10-27":true,"2026-10-28":true}},{"id":"hab-2","title":"রাতে ঘুমানোর আগে সংকল্প ডায়েরিতে আজকের ভুল সংশোধন","streak":9,"history":{"2026-10-27":true,"2026-10-28":true}},{"id":"hab-3","title":"দৈনিক কমপক্ষে ৩টি ফ্ল্যাশকার্ড ডেক রিভিশন","streak":6,"history":{"2026-10-28":true}}],"alarms":[{"id":"alm-1","time":"05:00","label":"ভোরের নিরবতায় পড়াশোনা শুরু","days":[0,1,2,3,4,5,6],"active":true,"ringtone":"Classic Bell"},{"id":"alm-2","time":"22:30","label":"আজকের দিনের প্রগ্রেস রিভিউ ও আগামীকালকের রুটিন","days":[0,1,2,3,4,5,6],"active":true,"ringtone":"Soft Chime"}],"timerSessions":[{"id":"sess-1","minutes":45,"date":"2026-10-28","subject":"পদার্থবিজ্ঞান"},{"id":"sess-2","minutes":50,"date":"2026-10-28","subject":"উচ্চতর গণিত"},{"id":"sess-3","minutes":60,"date":"2026-10-27","subject":"রসায়ন"}],"mistakeVault":[{"id":"mv-1","date":"2026-10-27","myAnswer":1,"mcq":{"id":"mcq-p1","subjectId":"subj-phy","topicId":"top-vector","subtopicId":"sub-dot-cross","q":"দুটি ভেক্টর A এবং B পরস্পরের উপর লম্ব হলে তাদের ডট গুণনের মান কত হবে?","options":["শূন্য (০)","AB","১ (এক)","-AB"],"correct":0,"explanation":"A · B = AB cos(θ)। যেহেতু ভেক্টরদ্বয় পরস্পর লম্ব, θ = 90°। cos(90°) = 0, সুতরাং A · B = 0।"}}],"attempts":[{"id":"att-1","date":"2026-10-27","total":1,"score":0,"answers":{"mcq-p1":1},"pool":[{"id":"mcq-p1","subjectId":"subj-phy","topicId":"top-vector","subtopicId":"sub-dot-cross"}]}],"quotes":[{"bn":"পরিশ্রম কখনো বৃথা যায় না, সময়ের ব্যবধানে সাফল্য ধরা দেয়।","en":"Hard work always pays off with time."}]};

function getTestedQuestionIds(state) {
  const set = new Set();
  (state.attempts || []).forEach(a => {
    if (a.pool) {
      a.pool.forEach(q => { if (q && q.id) set.add(q.id); });
    }
    if (a.answers) {
      Object.keys(a.answers).forEach(id => set.add(id));
    }
  });
  return set;
}

function getMistakenQuestionIds(state) {
  const set = new Set();
  (state.mistakeVault || []).forEach(mv => {
    if (mv && mv.mcq && mv.mcq.id) set.add(mv.mcq.id);
  });
  return set;
}

/* ---------- Storage ---------- */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    const merged = {
      ...structuredClone(DEFAULT_STATE),
      ...parsed
    };
    for (const k of Object.keys(DEFAULT_STATE)) {
      if (typeof DEFAULT_STATE[k] === 'object' && !Array.isArray(DEFAULT_STATE[k]) && DEFAULT_STATE[k] !== null) {
        merged[k] = {
          ...DEFAULT_STATE[k],
          ...(parsed[k] || {})
        };
        // deep-merge ui.notif
        if (k === 'ui') {
          merged.ui.notif = {
            ...DEFAULT_STATE.ui.notif,
            ...((parsed.ui || {}).notif || {})
          };
        }
      }
    }
    return merged;
  } catch (e) {
    return structuredClone(DEFAULT_STATE);
  }
}
let saveTimer = null;
function saveState(state) {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      if (window.NativeBridge && window.NativeBridge.syncAlarms) window.NativeBridge.syncAlarms(state);
    } catch (e) {
      toast('Storage full — export a backup.', 'error');
    }
  }, 250);
}

/* ---------- Toast ---------- */
let toastRoot = null,
  toastId = 0;
function toast(msg, kind = 'info') {
  if (!toastRoot) {
    toastRoot = document.createElement('div');
    toastRoot.className = 'fixed z-[200] top-4 right-4 flex flex-col gap-2';
    document.body.appendChild(toastRoot);
  }
  const id = ++toastId;
  const el = document.createElement('div');
  const color = kind === 'error' ? 'bg-rose-600' : kind === 'success' ? 'bg-emerald-600' : 'bg-slate-900';
  el.className = `text-white ${color} px-4 py-2 rounded-xl shadow-soft text-sm animate-fadeIn`;
  el.textContent = msg;
  el.dataset.id = id;
  toastRoot.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity .3s';
    setTimeout(() => el.remove(), 300);
  }, 2600);
}

/* ---------- XP & Streak ---------- */
function xpForLevel(lv) {
  return 100 + (lv - 1) * 80;
}
function addXP(profile, delta) {
  let {
    xp,
    level
  } = profile;
  xp += delta;
  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level++;
    toast(`লেভেল আপ! Level ${level}`, 'success');
  }
  return {
    ...profile,
    xp,
    level
  };
}
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function nowHM() {
  const d = new Date();
  return d.toTimeString().slice(0, 5);
}
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_ORDER = [6, 0, 1, 2, 3, 4, 5]; // Sat, Sun, Mon..Fri
function todayDow() {
  return new Date().getDay();
}
function scheduleMatchesToday(s) {
  if (s.day != null) return s.day === todayDow();
  return s.date === todayISO();
}
function weekKey(d = new Date()) {
  const dt = new Date(d);
  dt.setHours(0, 0, 0, 0);
  const day = dt.getDay();
  dt.setDate(dt.getDate() - day);
  return dt.toISOString().slice(0, 10);
}
function monthKey(d = new Date()) {
  return d.toISOString().slice(0, 7);
}
function monthName(k) {
  const [y, m] = k.split('-');
  return new Date(+y, +m - 1, 1).toLocaleString('en', {
    month: 'long'
  });
}
function updateStreak(profile) {
  const today = todayISO();
  if (profile.lastActive === today) return profile;
  const yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (profile.lastActive === yest) return {
    ...profile,
    streak: profile.streak + 1,
    lastActive: today
  };
  if (profile.lastActive === '') return {
    ...profile,
    streak: 1,
    lastActive: today
  };
  if (profile.shield) return {
    ...profile,
    streak: profile.streak + 1,
    shield: false,
    lastActive: today
  };
  return {
    ...profile,
    streak: 1,
    lastActive: today
  };
}

/* ---------- Reducer ---------- */
function reducer(state, action) {
  switch (action.type) {

    case 'HYDRATE':
      return action.state;
    case 'SET_PROFILE':
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.patch
        }
      };
    case 'SET_UI':
      return {
        ...state,
        ui: {
          ...state.ui,
          ...action.patch
        }
      };
    case 'SET_NOTIF':
      return {
        ...state,
        ui: {
          ...state.ui,
          notif: {
            ...state.ui.notif,
            ...action.patch
          }
        }
      };
    case 'ADD_XP':
      {
        let p = addXP(state.profile, action.amount);
        p = updateStreak(p);
        return {
          ...state,
          profile: p
        };
      }
    case 'SET_LIST':
      return {
        ...state,
        [action.key]: action.list
      };
    case 'ADD_ITEM':
      return {
        ...state,
        [action.key]: [action.item, ...state[action.key]]
      };
    case 'ADD_MANY':
      return {
        ...state,
        [action.key]: [...action.items, ...state[action.key]]
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        [action.key]: state[action.key].map(x => x.id === action.item.id ? {
          ...x,
          ...action.item
        } : x)
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        [action.key]: state[action.key].filter(x => x.id !== action.id)
      };
    case 'RESET':
      return structuredClone(DEFAULT_STATE);
    default:
      return state;
  }
}
const VaultCtx = createContext(null);
function useVault() {
  return useContext(VaultCtx);
}
function VaultProvider({
  children
}) {
  const [state, dispatch] = useReducer(reducer, null, loadState);
  useEffect(() => {
    saveState(state);
  }, [state]);
  useEffect(() => {
    if (state.ui.theme === 'dark') document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');
  }, [state.ui.theme]);
  return /*#__PURE__*/React.createElement(VaultCtx.Provider, {
    value: {
      state,
      dispatch
    }
  }, children);
}

/* ---------- Icons ---------- */
function Icon({
  name,
  size = 18,
  className = ''
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = '';
      const el = document.createElement('i');
      el.setAttribute('data-lucide', name);
      ref.current.appendChild(el);
      window.lucide.createIcons({
        attrs: {
          width: size,
          height: size,
          'stroke-width': 2
        }
      });
    }
  }, [name, size]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    className: 'inline-flex ' + className,
    style: {
      width: size,
      height: size
    }
  });
}

/* ---------- App Logo (brand mark image) ---------- */
function Logo({
  size = 32,
  ring = false
}) {
  return /*#__PURE__*/React.createElement("img", {
    src: "logo.png",
    alt: BRAND,
    className: "inline-block shadow-soft " + (ring ? 'ring-2 ring-white/40' : ''),
    style: {
      width: size,
      height: size,
      borderRadius: Math.max(7, Math.round(size * 0.28)),
      objectFit: 'cover'
    }
  });
}

/* ---------- UI Primitives ---------- */
function Card({
  children,
  className = ''
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: 'bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl ' + className
  }, children);
}
function Btn({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled
}) {
  const styles = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-white',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200',
    outline: 'border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white',
    subtle: 'bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-200 hover:bg-brand-100'
  };
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    onClick: onClick,
    className: `inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition ${styles[variant]} disabled:opacity-40 ${className}`
  }, children);
}
function FormatBlock({
  text,
  label = 'Format'
}) {
  const [copied, setCopied] = useState(false);
  function copy() {
    const done = () => {
      setCopied(true);
      toast('Format copied', 'success');
      setTimeout(() => setCopied(false), 1500);
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, () => fallback());
      } else fallback();
    } catch (e) {
      fallback();
    }
    function fallback() {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        done();
      } catch (_) {
        toast('Copy failed', 'error');
      }
      document.body.removeChild(ta);
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: copy,
    className: "absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 hover:bg-brand-50 dark:hover:bg-brand-900/40 text-slate-700 dark:text-slate-200 shadow-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: copied ? 'check' : 'copy',
    size: 12
  }), copied ? 'Copied' : 'Copy'), /*#__PURE__*/React.createElement("pre", {
    className: "p-2.5 pr-14 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs overflow-auto whitespace-pre-wrap max-h-24 scrollbar-thin"
  }, text));
}
function Input(props) {
  return /*#__PURE__*/React.createElement("input", {
    ...props,
    className: 'w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/40 ' + (props.className || '')
  });
}
function TextArea(props) {
  return /*#__PURE__*/React.createElement("textarea", {
    ...props,
    className: 'w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/40 ' + (props.className || '')
  });
}
function Select({
  children,
  ...props
}) {
  return /*#__PURE__*/React.createElement("select", {
    ...props,
    className: 'px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/40 ' + (props.className || '')
  }, children);
}
function Chip({
  children,
  tone = 'slate',
  className = ''
}) {
  const tones = {
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
    brand: 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-200',
    rose: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200',
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200'
  };
  return /*#__PURE__*/React.createElement("span", {
    className: `text-[10px] px-1.5 py-0.5 rounded ${tones[tone]} ${className}`
  }, children);
}
function Modal({
  open,
  onClose,
  title,
  children,
  wide,
  xl
}) {
  if (!open) return null;
  const w = xl ? 'max-w-5xl' : wide ? 'max-w-3xl' : 'max-w-lg';
  const modalVNode = /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-sm overflow-y-auto p-2 sm:p-4 flex items-start sm:items-center justify-center animate-fadeIn",
    onClick: onClose,
    style: { WebkitOverflowScrolling: 'touch' }
  }, /*#__PURE__*/React.createElement("div", {
    className: 'bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full my-3 sm:my-auto flex flex-col max-h-[calc(100dvh-1.5rem)] sm:max-h-[86vh] overflow-hidden animate-pop ' + w,
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-200 dark:border-slate-800 shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur z-10"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-semibold font-bn text-base sm:text-lg text-slate-900 dark:text-white"
  }, title), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition",
    title: "Close"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 sm:p-5 overflow-y-auto flex-1 scrollbar-thin"
  }, children)));

  if (typeof document !== 'undefined' && document.body && ReactDOM.createPortal) {
    return ReactDOM.createPortal(modalVNode, document.body);
  }
  return modalVNode;
}

/* ---------- Audio Engine (procedural + alarm ringtones) ---------- */
const AudioEngine = (() => {
  let ctx = null,
    master = null,
    nodes = [];
  let alarmTimers = [];
  function ensure() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0.15;
      master.connect(ctx.destination);
    }
  }
  function stop() {
    nodes.forEach(n => {
      try {
        n.stop && n.stop();
        n.disconnect && n.disconnect();
      } catch (e) {}
    });
    nodes = [];
  }
  function whiteNoise() {
    ensure();
    stop();
    const bufferSize = 2 * ctx.sampleRate;
    const noise = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const out = noise.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) out[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = noise;
    src.loop = true;
    src.connect(master);
    src.start();
    nodes.push(src);
  }
  function brownNoise() {
    ensure();
    stop();
    const bufferSize = 2 * ctx.sampleRate;
    const noise = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const out = noise.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const w = Math.random() * 2 - 1;
      out[i] = (last + 0.02 * w) / 1.02;
      last = out[i];
      out[i] *= 3.5;
    }
    const src = ctx.createBufferSource();
    src.buffer = noise;
    src.loop = true;
    src.connect(master);
    src.start();
    nodes.push(src);
  }
  function binaural(base = 200, beat = 8) {
    ensure();
    stop();
    const merger = ctx.createChannelMerger(2);
    const oscL = ctx.createOscillator();
    oscL.frequency.value = base;
    const oscR = ctx.createOscillator();
    oscR.frequency.value = base + beat;
    const gL = ctx.createGain();
    gL.gain.value = 0.5;
    const gR = ctx.createGain();
    gR.gain.value = 0.5;
    oscL.connect(gL).connect(merger, 0, 0);
    oscR.connect(gR).connect(merger, 0, 1);
    merger.connect(master);
    oscL.start();
    oscR.start();
    nodes.push(oscL, oscR, gL, gR, merger);
  }
  function volume(v) {
    ensure();
    master.gain.value = v;
  }
  // Short attention beep for reminders
  function beep(freq = 880, dur = 0.15) {
    ensure();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur + 0.02);
  }
  function reminderChime() {
    beep(880, .15);
    setTimeout(() => beep(1175, .18), 160);
    setTimeout(() => beep(1480, .22), 340);
  }
  // Ringtones (patterns of tones)
  const RINGTONES = {
    'Classic Bell': () => {
      [880, 660, 880, 660].forEach((f, i) => setTimeout(() => beep(f, .3), i * 350));
    },
    'Digital Alarm': () => {
      for (let i = 0; i < 8; i++) setTimeout(() => beep(i % 2 ? 880 : 1200, .12), i * 160);
    },
    'Gentle Chime': () => {
      [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, .4), i * 220));
    },
    'Rise & Shine': () => {
      [400, 500, 600, 700, 800, 900, 1000].forEach((f, i) => setTimeout(() => beep(f, .14), i * 130));
    },
    'Cosmic Ping': () => {
      [1568, 1319, 1046, 784].forEach((f, i) => setTimeout(() => beep(f, .35), i * 260));
    },
    'Soft Marimba': () => {
      [523, 659, 784, 659, 523, 784].forEach((f, i) => setTimeout(() => beep(f, .25), i * 180));
    }
  };
  function playRingtone(name, times = 3) {
    const fn = RINGTONES[name] || RINGTONES['Classic Bell'];
    for (let i = 0; i < times; i++) {
      const t = setTimeout(fn, i * 1800);
      alarmTimers.push(t);
    }
  }
  function stopAlarm() {
    alarmTimers.forEach(clearTimeout);
    alarmTimers = [];
  }
  return {
    whiteNoise,
    brownNoise,
    binaural,
    stop,
    volume,
    beep,
    reminderChime,
    playRingtone,
    stopAlarm,
    ringtones: () => Object.keys(RINGTONES)
  };
})();

/* ---------- Premium Splash (minimal, demo-style) ---------- */
function Splash({
  onDone
}) {
  const [line] = useState(() => SPLASH_LINES[Math.floor(Math.random() * SPLASH_LINES.length)]);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const dur = 2400;
    const t = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / dur);
      setProgress(p);
      if (p >= 1) {
        clearInterval(t);
        setTimeout(onDone, 250);
      }
    }, 30);
    return () => clearInterval(t);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "splash-bg fixed inset-0 flex flex-col items-center justify-center overflow-hidden px-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative flex flex-col items-center animate-pop",
    style: {
      transform: 'translateY(-3vh)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "logo.png",
    alt: BRAND,
    className: "shadow-glow",
    style: {
      width: 112,
      height: 112,
      borderRadius: 26,
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("h1", {
    className: "font-display text-4xl mt-7 tracking-tight"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-900 dark:text-slate-100"
  }, "সংকল্প "), /*#__PURE__*/React.createElement("span", {
    className: "text-brand-600 dark:text-brand-400"
  }, "OS")), /*#__PURE__*/React.createElement("p", {
    className: "mt-1.5 text-[13px] tracking-wide text-slate-500 dark:text-slate-400"
  }, "Study Discipline & Exam Mastery"), /*#__PURE__*/React.createElement("p", {
    className: "mt-7 font-bn text-base text-slate-600 dark:text-slate-300 text-center animate-fadeIn max-w-xs leading-relaxed"
  }, line), /*#__PURE__*/React.createElement("div", {
    className: "mt-7 w-40 h-1 rounded-full bg-slate-200/70 dark:bg-slate-700/60 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-brand-600 dark:bg-brand-400 transition-all",
    style: {
      width: progress * 100 + '%'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "absolute bottom-7 left-0 right-0 text-center text-[11px] tracking-wide text-slate-400 dark:text-slate-500"
  }, "Version 4.0 \u00b7 Bangladesh"));
}

/* ---------- Onboarding ---------- */
function Onboarding({
  onDone
}) {
  const {
    state,
    dispatch
  } = useVault();
  const [name, setName] = useState(state.profile.name || '');
  return /*#__PURE__*/React.createElement("div", {
    className: "splash-bg fixed inset-0 flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "max-w-md w-full p-6 animate-pop"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement(Logo, {
    size: 44
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "font-bn text-xl font-bold"
  }, BRAND, " — স্বাগতম"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "Welcome, achiever."))), /*#__PURE__*/React.createElement("p", {
    className: "mt-4 text-sm text-slate-600 dark:text-slate-400"
  }, "তোমার নাম কী? / What should we call you?"), /*#__PURE__*/React.createElement(Input, {
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "তোমার নাম / Your name",
    className: "mt-2"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-5 flex justify-end"
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: () => {
      dispatch({
        type: 'SET_PROFILE',
        patch: {
          name: name.trim() || 'Achiever'
        }
      });
      dispatch({
        type: 'SET_UI',
        patch: {
          tourDone: true
        }
      });
      onDone();
    }
  }, "শুরু করি ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right"
  })))));
}

/* ---------- Views registry ---------- */
const VIEWS = [{
  key: 'dashboard',
  label: 'Dashboard',
  bn: 'ড্যাশবোর্ড',
  icon: 'layout-dashboard'
}, {
  key: 'subjects',
  label: 'Subjects',
  bn: 'বিষয়',
  icon: 'library'
}, {
  key: 'mcq',
  label: 'MCQ Bank',
  bn: 'এমসিকিউ',
  icon: 'list-checks'
}, {
  key: 'exam',
  label: 'Exam Mode',
  bn: 'পরীক্ষা',
  icon: 'graduation-cap'
}, {
  key: 'mistakes',
  label: 'Mistake Vault',
  bn: 'ভুল ভান্ডার',
  icon: 'alert-triangle'
}, {
  key: 'cards',
  label: 'Flashcards',
  bn: 'ফ্ল্যাশকার্ড',
  icon: 'layers'
}, {
  key: 'schedule',
  label: 'Schedule',
  bn: 'সময়সূচি',
  icon: 'calendar-days'
}, {
  key: 'todos',
  label: 'To-dos',
  bn: 'কাজের তালিকা',
  icon: 'check-square'
}, {
  key: 'notes',
  label: 'Notes',
  bn: 'নোট',
  icon: 'notebook-pen'
}, {
  key: 'habits',
  label: 'Habits',
  bn: 'অভ্যাস',
  icon: 'repeat'
}, {
  key: 'alarm',
  label: 'Alarms',
  bn: 'অ্যালার্ম',
  icon: 'alarm-clock'
}, {
  key: 'timer',
  label: 'Focus Timer',
  bn: 'ফোকাস টাইমার',
  icon: 'timer'
}, {
  key: 'quotes',
  label: 'Motivation',
  bn: 'অনুপ্রেরণা',
  icon: 'quote'
}, {
  key: 'analytics',
  label: 'Analytics',
  bn: 'বিশ্লেষণ',
  icon: 'bar-chart-3'
}, {
  key: 'settings',
  label: 'Settings',
  bn: 'সেটিংস',
  icon: 'settings'
}];

/* ---------- Helpers: subjects/topics/subtopics ---------- */
function findSubject(state, id) {
  return state.subjects.find(s => s.id === id);
}
function findTopic(subj, id) {
  return subj?.topics.find(t => t.id === id);
}
function findSubtopic(topic, id) {
  return topic?.subtopics.find(s => s.id === id);
}
function subjectName(state, id) {
  return findSubject(state, id)?.name || '—';
}
function topicName(state, sid, tid) {
  return findTopic(findSubject(state, sid), tid)?.name || '—';
}
function subtopicName(state, sid, tid, stid) {
  return findSubtopic(findTopic(findSubject(state, sid), tid), stid)?.name || '—';
}

/* ---------- Shell ---------- */
function Shell() {
  const {
    state,
    dispatch
  } = useVault();
  const [view, setView] = useState('dashboard');
  const [sideOpen, setSideOpen] = useState(false);
  const [subjectPath, setSubjectPath] = useState({}); // for cross-view drill
  const lang = state.ui.lang || 'bn';
  const active = VIEWS.find(v => v.key === view);

  // ---------- Notification/Reminder engine ----------
  const notifiedRef = useRef(new Set()); // in-memory keys "sched:ID:HH:MM" per day
  useEffect(() => {
    const t = setInterval(() => {
      const hm = nowHM();
      const today = todayISO();
      // schedule
      state.schedule.forEach(s => {
        if (scheduleMatchesToday(s) && s.time === hm) {
          const key = 'sched:' + s.id + ':' + today;
          if (!notifiedRef.current.has(key)) {
            notifiedRef.current.add(key);
            fireReminder(s.title, state.ui.notif);
          }
        }
      });
      // todos with due date+time
      state.todos.forEach(t => {
        if (!t.done && t.due === today && t.time === hm) {
          const key = 'todo:' + t.id + ':' + today;
          if (!notifiedRef.current.has(key)) {
            notifiedRef.current.add(key);
            fireReminder(t.title, state.ui.notif);
          }
        }
      });
      // alarms
      state.alarms.forEach(a => {
        if (!a.active) return;
        const dow = new Date().getDay();
        if (a.days && a.days.length && !a.days.includes(dow)) return;
        if (a.time === hm) {
          const key = 'alarm:' + a.id + ':' + today + ':' + hm;
          if (!notifiedRef.current.has(key)) {
            notifiedRef.current.add(key);
            fireAlarm(a);
          }
        }
      });
    }, 15000); // check every 15s
    return () => clearInterval(t);
  }, [state.schedule, state.todos, state.alarms, state.ui.notif]);
  function fireReminder(title, notif) {
    const line = REMINDER_LINES[Math.floor(Math.random() * REMINDER_LINES.length)];
    if (notif.beep) AudioEngine.reminderChime();
    if (notif.popup) {
      window.__reminderQueue = window.__reminderQueue || [];
      window.dispatchEvent(new CustomEvent('sonkolpo:remind', {
        detail: {
          title,
          line
        }
      }));
    }
  }
  function fireAlarm(alarm) {
    AudioEngine.playRingtone(alarm.ringtone || 'Classic Bell', 4);
    window.dispatchEvent(new CustomEvent('sonkolpo:alarm', {
      detail: alarm
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex flex-col"
  }, /*#__PURE__*/React.createElement(ReminderOverlay, null), /*#__PURE__*/React.createElement(AlarmOverlay, null), /*#__PURE__*/React.createElement("header", {
    className: "sticky top-0 z-40 glass bg-white/80 dark:bg-slate-900/70 border-b border-slate-200/70 dark:border-slate-800"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-[1400px] mx-auto px-4 h-14 flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    className: "hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800",
    onClick: () => setSideOpen(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "menu"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => setView('dashboard'),
    className: "flex items-center gap-2 group"
  }, /*#__PURE__*/React.createElement(Logo, {
    size: 30
  }), /*#__PURE__*/React.createElement("div", {
    className: "leading-tight text-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-bn font-semibold text-base text-slate-900 dark:text-white"
  }, BRAND))), /*#__PURE__*/React.createElement("div", {
    className: "ml-auto flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(StreakChip, null), /*#__PURE__*/React.createElement(XPChip, null), /*#__PURE__*/React.createElement("button", {
    onClick: () => dispatch({
      type: 'SET_UI',
      patch: {
        theme: state.ui.theme === 'dark' ? 'light' : 'dark'
      }
    }),
    className: "p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800",
    title: "Toggle theme"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: state.ui.theme === 'dark' ? 'sun' : 'moon'
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => dispatch({
      type: 'SET_UI',
      patch: {
        lang: lang === 'bn' ? 'en' : 'bn'
      }
    }),
    className: "px-2 py-1 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
  }, lang === 'bn' ? 'বাং' : 'EN')))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 max-w-[1400px] w-full mx-auto px-4 pt-4 pb-28 md:pb-6 grid md:grid-cols-[240px_1fr] gap-6"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "hidden md:block"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "sticky top-20 space-y-1 max-h-[calc(100vh-6rem)] overflow-auto scrollbar-thin pr-1"
  }, VIEWS.map(v => /*#__PURE__*/React.createElement("button", {
    key: v.key,
    onClick: () => setView(v.key),
    className: `w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition ${view === v.key ? 'bg-brand-600 text-white shadow-soft' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: v.icon
  }), /*#__PURE__*/React.createElement("span", {
    className: lang === 'bn' ? 'font-bn' : ''
  }, lang === 'bn' ? v.bn : v.label))))), sideOpen && /*#__PURE__*/React.createElement("div", {
    className: "md:hidden fixed inset-0 bottom-16 z-50 bg-slate-900/40 backdrop-blur-sm",
    onClick: () => setSideOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute left-0 right-0 bottom-0 max-h-[80vh] rounded-t-3xl bg-white dark:bg-slate-900 p-4 pb-8 overflow-auto grid grid-cols-3 gap-2 content-start animate-fadeIn more-sheet",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-span-3 flex justify-center pb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700"
  })), VIEWS.map(v => /*#__PURE__*/React.createElement("button", {
    key: v.key,
    onClick: () => {
      setView(v.key);
      setSideOpen(false);
    },
    className: `flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl text-[11px] font-medium text-center ${view === v.key ? 'bg-brand-600 text-white' : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300'}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: v.icon,
    size: 20
  }), /*#__PURE__*/React.createElement("span", { className: "font-bn leading-tight" }, lang === 'bn' ? v.bn : v.label))))), /*#__PURE__*/React.createElement("main", {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4 flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("h1", {
    className: 'text-lg font-semibold tracking-tight ' + (lang === 'bn' ? 'font-bn' : '')
  }, lang === 'bn' ? active.bn : active.label), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto text-xs text-slate-400 hidden md:inline"
  }, new Date().toLocaleDateString(), " · ", nowHM())), /*#__PURE__*/React.createElement("div", {
    className: "animate-fadeIn"
  }, view === 'dashboard' && /*#__PURE__*/React.createElement(Dashboard, {
    go: setView,
    setSubjectPath: setSubjectPath
  }), view === 'subjects' && /*#__PURE__*/React.createElement(SubjectsView, {
    initialPath: subjectPath,
    clearPath: () => setSubjectPath({})
  }), view === 'mcq' && /*#__PURE__*/React.createElement(MCQView, null), view === 'exam' && /*#__PURE__*/React.createElement(ExamView, null), view === 'mistakes' && /*#__PURE__*/React.createElement(MistakeView, null), view === 'cards' && /*#__PURE__*/React.createElement(FlashcardsView, null), view === 'schedule' && /*#__PURE__*/React.createElement(ScheduleView, null), view === 'todos' && /*#__PURE__*/React.createElement(TodosView, null), view === 'notes' && /*#__PURE__*/React.createElement(NotesView, null), view === 'habits' && /*#__PURE__*/React.createElement(HabitsView, null), view === 'alarm' && /*#__PURE__*/React.createElement(AlarmView, null), view === 'timer' && /*#__PURE__*/React.createElement(TimerView, null), view === 'quotes' && /*#__PURE__*/React.createElement(QuotesView, null), view === 'analytics' && /*#__PURE__*/React.createElement(AnalyticsView, null), view === 'settings' && /*#__PURE__*/React.createElement(SettingsView, null)))), /*#__PURE__*/React.createElement(Footer, null), /*#__PURE__*/React.createElement(BottomNav, {
    view: view,
    setView: v => { setSideOpen(false); setView(v); },
    openMore: () => setSideOpen(!sideOpen),
    moreOpen: sideOpen,
    lang: lang
  }));
}
const NAV_MAIN = [
  { key: 'dashboard', bn: 'হোম', en: 'Home', icon: 'house' },
  { key: 'subjects', bn: 'বিষয়', en: 'Study', icon: 'book-open' },
  { key: 'cards', bn: 'কার্ড', en: 'Cards', icon: 'layers' },
  { key: 'todos', bn: 'কাজ', en: 'Tasks', icon: 'check-circle-2' }
];
function BottomNav({ view, setView, openMore, moreOpen, lang }) {
  const inMain = NAV_MAIN.some(n => n.key === view);
  const item = (active, icon, label, onClick, key) => /*#__PURE__*/React.createElement("button", {
    key: key,
    onClick: onClick,
    className: "bnav-item flex-1 flex flex-col items-center justify-center gap-1 py-1.5 " + (active ? 'is-active' : '')
  }, /*#__PURE__*/React.createElement("span", { className: "bnav-pill" }, /*#__PURE__*/React.createElement(Icon, { name: icon, size: 20 })), /*#__PURE__*/React.createElement("span", { className: "text-[10.5px] font-medium font-bn leading-none" }, label));
  return /*#__PURE__*/React.createElement("nav", {
    className: "bnav md:hidden fixed bottom-0 inset-x-0 z-[60] flex px-2 pt-1.5"
  }, NAV_MAIN.map(n => item(!moreOpen && view === n.key, n.icon, lang === 'bn' ? n.bn : n.en, () => setView(n.key), n.key)), item(moreOpen || !inMain, 'layout-grid', lang === 'bn' ? 'আরও' : 'More', openMore, 'more'));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    className: "hidden md:block border-t border-slate-200/70 dark:border-slate-800 py-4 text-center text-[11px] text-slate-400 select-none"
  }, CREDIT);
}
function StreakChip() {
  const {
    state
  } = useVault();
  return /*#__PURE__*/React.createElement("div", {
    className: "hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-medium"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "flame",
    size: 14
  }), " ", state.profile.streak, " day", state.profile.streak === 1 ? '' : 's');
}
function XPChip() {
  const {
    state
  } = useVault();
  const need = xpForLevel(state.profile.level);
  const pct = Math.min(100, Math.round(state.profile.xp / need * 100));
  return /*#__PURE__*/React.createElement("div", {
    className: "hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-200 text-xs font-medium"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "zap",
    size: 14
  }), " Lv ", state.profile.level, /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-1.5 bg-brand-200/70 dark:bg-brand-900 rounded-full overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full grad-bar transition-all",
    style: {
      width: pct + '%'
    }
  })));
}

/* ---------- Reminder & Alarm overlays ---------- */
function ReminderOverlay() {
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
}
function AlarmOverlay() {
  const [a, setA] = useState(null);
  useEffect(() => {
    function h(e) {
      setA(e.detail);
    }
    window.addEventListener('sonkolpo:alarm', h);
    return () => window.removeEventListener('sonkolpo:alarm', h);
  }, []);
  if (!a) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed z-[180] inset-0 bg-slate-900/70 backdrop-blur flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "p-8 text-center max-w-md w-full animate-pop relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 opacity-20 grad-premium animate-gradientMove"
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mx-auto w-20 h-20 rounded-full grad-premium animate-gradientMove flex items-center justify-center text-white animate-floaty"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alarm-clock",
    size: 40
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 text-3xl font-bold tabular-nums"
  }, a.time), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 text-lg font-medium"
  }, a.label || 'Alarm'), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500 mt-1"
  }, "Ringtone · ", a.ringtone || 'Classic Bell'), /*#__PURE__*/React.createElement("div", {
    className: "mt-6 flex gap-2 justify-center"
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "danger",
    onClick: () => {
      AudioEngine.stopAlarm();
      setA(null);
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x"
  }), "Stop"), /*#__PURE__*/React.createElement(Btn, {
    variant: "outline",
    onClick: () => {
      AudioEngine.stopAlarm();
      setTimeout(() => AudioEngine.playRingtone(a.ringtone || 'Classic Bell', 3), 5 * 60 * 1000);
      setA(null);
      toast('Snoozed 5 min', 'success');
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "timer-reset"
  }), "Snooze 5m")))));
}

/* ---------- Dashboard ---------- */

function Dashboard({
  go,
  setSubjectPath
}) {
  const {
    state,
    dispatch
  } = useVault();
  const p = state.profile;
  const level = p.level || 1;
  const xp = p.xp || 0;
  const need = xpForLevel(level);
  const today = todayISO();
  const now = nowHM();
  const todaySchedule = state.schedule.filter(scheduleMatchesToday);
  const openTodos = state.todos.filter(t => !t.done).length;
  const mistakes = state.mistakeVault.length;
  const totalFocus = state.timerSessions.reduce((a, s) => a + (s.minutes || 0), 0);
  const combined = [...DEFAULT_MOTIVATIONS, ...state.quotes];
  const m = combined[state.ui.motivationIdx % combined.length];

  // Currently-due tasks (highlight)
  function isDueNowTime(timeStr) {
    if (!timeStr) return false;
    const [h, mn] = timeStr.split(':').map(Number);
    const [nh, nm] = now.split(':').map(Number);
    const target = h * 60 + mn,
      cur = nh * 60 + nm;
    return cur >= target && cur <= target + 30;
  }
  const [dismissedDue, setDismissedDue] = useState({});
  const dueNow = [...todaySchedule.filter(s => isDueNowTime(s.time)).map(s => ({
    ...s,
    kind: 'schedule'
  })), ...state.todos.filter(t => !t.done && t.due === today && isDueNowTime(t.time)).map(t => ({
    ...t,
    kind: 'todo'
  }))].filter(x => !dismissedDue[x.kind + x.id]);

  // Focus area: mistakes by subject/topic
  const focusArea = useMemo(() => {
    const map = {};
    state.mistakeVault.forEach(mv => {
      const sid = mv.mcq.subjectId || '';
      const tid = mv.mcq.topicId || '';
      const k = sid + '|' + tid;
      map[k] = map[k] || {
        subjectId: sid,
        topicId: tid,
        count: 0,
        items: []
      };
      map[k].count++;
      map[k].items.push(mv);
    });
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [state.mistakeVault]);
  const [focusOpen, setFocusOpen] = useState(null);

  return /*#__PURE__*/React.createElement("div", {
    className: "grid gap-4"
  },
    dueNow.length > 0 && /*#__PURE__*/React.createElement(Card, {
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
    ),

    /* Minimalist Profile Hero Card */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-5 relative overflow-hidden"
    },
      /*#__PURE__*/React.createElement("div", {
        className: "relative flex flex-wrap items-center gap-5"
      },
        /*#__PURE__*/React.createElement(Logo, { size: 52 }),
        /*#__PURE__*/React.createElement("div", {
          className: "flex-1 min-w-[180px]"
        },
          /*#__PURE__*/React.createElement("div", {
            className: "text-xs text-slate-400 font-medium font-bn"
          }, "স্বাগতম / Welcome back"),
          /*#__PURE__*/React.createElement("div", {
            className: "text-xl font-semibold font-bn text-slate-900 dark:text-white mt-0.5"
          }, p.name || 'শিক্ষার্থী (Achiever)'),
          /*#__PURE__*/React.createElement("div", {
            className: "mt-2 flex items-center gap-3"
          },
            /*#__PURE__*/React.createElement("div", {
              className: "text-xs text-slate-500 font-bn"
            }, "Level ", level),
            /*#__PURE__*/React.createElement("div", {
              className: "flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden max-w-xs"
            },
              /*#__PURE__*/React.createElement("div", {
                className: "h-full bg-brand-500 rounded-full transition-all duration-300",
                style: { width: Math.min(100, Math.round((xp / need) * 100)) + '%' }
              })
            ),
            /*#__PURE__*/React.createElement("div", {
              className: "text-xs text-slate-400 font-mono"
            }, xp, " / ", need, " XP")
          )
        ),
        /* Clean Stat Chips */
        /*#__PURE__*/React.createElement("div", {
          className: "flex gap-2.5"
        },
          /*#__PURE__*/React.createElement(Stat, {
            icon: "flame",
            label: "Streak",
            value: (p.streak || 0) + 'd'
          }),
          /*#__PURE__*/React.createElement(Stat, {
            icon: "zap",
            label: "Level",
            value: 'Lv ' + level
          }),
          /*#__PURE__*/React.createElement(Stat, {
            icon: "timer",
            label: "Focus",
            value: totalFocus + 'm'
          })
        )
      ),

      /* Daily Motivation Box */
      /*#__PURE__*/React.createElement("div", {
        className: "relative mt-4 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800"
      },
        /*#__PURE__*/React.createElement("div", {
          className: "text-[10px] uppercase tracking-widest text-slate-400 mb-0.5 font-bn font-medium"
        }, "অনুপ্রেরণা"),
        /*#__PURE__*/React.createElement("div", {
          className: "font-bn text-sm sm:text-base text-slate-800 dark:text-slate-200 font-medium leading-snug"
        }, m.bn),
        m.en && /*#__PURE__*/React.createElement("div", {
          className: "text-xs text-slate-400 mt-0.5 italic font-sans"
        }, '"', m.en, '"'),
        /*#__PURE__*/React.createElement("button", {
          className: "absolute right-2 top-2 p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 text-slate-400 hover:text-slate-600 transition",
          onClick: () => dispatch({
            type: 'SET_UI',
            patch: { motivationIdx: state.ui.motivationIdx + 1 }
          }),
          title: "পরবর্তী উক্তি"
        }, /*#__PURE__*/React.createElement(Icon, { name: "refresh-cw", size: 14 }))
      )
    ),

    /* 3 Clean QuickCards Grid */
    /*#__PURE__*/React.createElement("div", {
      className: "grid md:grid-cols-3 gap-4"
    },
      /* Today's Schedule */
      /*#__PURE__*/React.createElement(QuickCard, {
        title: "আজকের সময়সূচি",
        icon: "calendar-days",
        empty: todaySchedule.length === 0,
        onGo: () => go('schedule'),
        count: todaySchedule.length
      }, todaySchedule.slice(0, 4).map(s => {
        const due = isDueNowTime(s.time);
        return /*#__PURE__*/React.createElement("div", {
          key: s.id,
          className: "flex items-center justify-between py-1 text-sm " + (due ? 'text-rose-600 font-semibold' : '')
        },
          /*#__PURE__*/React.createElement("span", { className: "font-bn truncate flex-1 pr-2" }, s.title),
          /*#__PURE__*/React.createElement("span", { className: "text-xs text-slate-500 font-mono" }, s.time || '—')
        );
      })),

      /* Open To-Dos */
      /*#__PURE__*/React.createElement(QuickCard, {
        title: "কাজের তালিকা",
        icon: "check-square",
        empty: openTodos === 0,
        onGo: () => go('todos'),
        count: openTodos
      }, state.todos.filter(t => !t.done).slice(0, 4).map(t => /*#__PURE__*/React.createElement("div", {
        key: t.id,
        className: "py-1 text-sm truncate font-bn text-slate-700 dark:text-slate-300"
      }, "• ", t.title))),

      /* Mistake Vault */
      /*#__PURE__*/React.createElement(QuickCard, {
        title: "ভুল ভান্ডার",
        icon: "alert-triangle",
        empty: mistakes === 0,
        onGo: () => go('mistakes'),
        count: mistakes
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-sm text-slate-500 font-bn py-1"
      }, mistakes, " টি প্রশ্ন রিভিশনের অপেক্ষায়।"))
    ),

    /* Focus Area — Mistakes Tracker */
    focusArea.length > 0 && /*#__PURE__*/React.createElement(Card, {
      className: "p-4"
    },
      /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-2 mb-2 font-bn"
      },
        /*#__PURE__*/React.createElement(Icon, { name: "target", size: 16 }),
        /*#__PURE__*/React.createElement("div", { className: "font-medium text-sm text-slate-800 dark:text-slate-200" }, "দুর্বল বিষয় ও অধ্যায় ট্র্যাকার"),
        /*#__PURE__*/React.createElement("span", { className: "ml-auto text-xs text-slate-400 font-sans" }, "Sorted by errors")
      ),
      /*#__PURE__*/React.createElement("div", {
        className: "grid md:grid-cols-2 gap-2"
      }, focusArea.slice(0, 4).map((f, i) => /*#__PURE__*/React.createElement("button", {
        key: i,
        onClick: () => setFocusOpen(f),
        className: "text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-300 hover:bg-rose-50/30 dark:hover:bg-rose-950/20 transition flex items-center gap-3"
      },
        /*#__PURE__*/React.createElement("div", {
          className: "w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300 flex items-center justify-center text-xs font-bold font-mono"
        }, f.count),
        /*#__PURE__*/React.createElement("div", { className: "flex-1 min-w-0" },
          /*#__PURE__*/React.createElement("div", { className: "text-xs font-semibold truncate font-bn text-slate-800 dark:text-slate-200" }, subjectName(state, f.subjectId) || 'Unassigned'),
          /*#__PURE__*/React.createElement("div", { className: "text-[11px] text-slate-400 truncate font-bn" }, f.topicId ? topicName(state, f.subjectId, f.topicId) : '—')
        ),
        /*#__PURE__*/React.createElement(Icon, { name: "chevron-right", size: 14, className: "text-slate-400" })
      )))
    ),

    /* Modal for Mistakes list */
    /*#__PURE__*/React.createElement(Modal, {
      open: !!focusOpen,
      onClose: () => setFocusOpen(null),
      title: focusOpen ? `ভুল প্রশ্ন — ${subjectName(state, focusOpen.subjectId) || 'Unassigned'} / ${topicName(state, focusOpen.subjectId, focusOpen.topicId) || '—'}` : '',
      wide: true
    },
      /*#__PURE__*/React.createElement("div", {
        className: "grid gap-2 max-h-[60vh] overflow-auto scrollbar-thin"
      }, focusOpen?.items.map(m => /*#__PURE__*/React.createElement("div", {
        key: m.id,
        className: "p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-bn"
      },
        /*#__PURE__*/React.createElement("div", { className: "font-medium text-slate-800 dark:text-slate-200" }, m.mcq.q || m.mcq.question),
        /*#__PURE__*/React.createElement("div", { className: "text-xs text-emerald-600 dark:text-emerald-400 mt-1" }, "সঠিক উত্তর: ", m.mcq.options[m.mcq.correct])
      )))
    ),

    /* 2 Clean Quick Actions */
    /*#__PURE__*/React.createElement("div", {
      className: "grid md:grid-cols-2 gap-3"
    },
      /*#__PURE__*/React.createElement(QuickAction, {
        icon: "graduation-cap",
        title: "MCQ পরীক্ষা",
        desc: "ডিউ প্রশ্ন, বিষয় ও অধ্যায় ভিত্তিক কাস্টম টেস্ট",
        onClick: () => go('exam')
      }),
      /*#__PURE__*/React.createElement(QuickAction, {
        icon: "layers",
        title: "ফ্ল্যাশকার্ড রিভিশন",
        desc: "৩ডি ফ্লিপ কার্ড ও স্পিচ স্টাডি সেশন",
        onClick: () => go('cards')
      })
    )
  );
}

function Stat({
  icon,
  label,
  value
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-center min-w-[70px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center text-brand-600 dark:text-brand-300"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon
  })), /*#__PURE__*/React.createElement("div", {
    className: "text-lg font-semibold leading-tight mt-0.5"
  }, value), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] uppercase tracking-widest text-slate-400"
  }, label));
}
function QuickCard({
  title,
  icon,
  children,
  empty,
  onGo
}) {
  return /*#__PURE__*/React.createElement(Card, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-sm font-medium"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon
  }), " ", title), /*#__PURE__*/React.createElement("button", {
    onClick: onGo,
    className: "text-xs text-brand-600 hover:underline"
  }, "Open →")), empty ? /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-slate-400 py-3"
  }, "Nothing here yet.") : /*#__PURE__*/React.createElement("div", null, children));
}
function QuickAction({
  icon,
  title,
  desc,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    className: "text-left p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 hover:border-brand-400 hover:shadow-soft transition group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-300 flex items-center justify-center group-hover:scale-105 transition"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "font-medium"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500"
  }, desc)), /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    className: "ml-auto text-slate-400 group-hover:text-brand-600"
  })));
}

/* ---------- Subjects hierarchical view ---------- */
function SubjectsView() {
  const {
    state,
    dispatch
  } = useVault();
  const [level, setLevel] = useState({}); // {subjectId, topicId, subtopicId, tool}
  const [add, setAdd] = useState(null); // {type,parent?}
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(null); // {type, id, subjectId?, topicId?}

  function addSubject() {
    if (!name.trim()) return;
    dispatch({
      type: 'ADD_ITEM',
      key: 'subjects',
      item: {
        id: uid(),
        name: name.trim(),
        topics: []
      }
    });
    setName('');
    setAdd(null);
  }
  function addTopic(sid) {
    if (!name.trim()) return;
    const subj = findSubject(state, sid);
    const updated = {
      ...subj,
      topics: [{
        id: uid(),
        name: name.trim(),
        subtopics: []
      }, ...subj.topics]
    };
    dispatch({
      type: 'UPDATE_ITEM',
      key: 'subjects',
      item: updated
    });
    setName('');
    setAdd(null);
  }
  function addSubtopic(sid, tid) {
    if (!name.trim()) return;
    const subj = findSubject(state, sid);
    const updated = {
      ...subj,
      topics: subj.topics.map(t => t.id === tid ? {
        ...t,
        subtopics: [{
          id: uid(),
          name: name.trim()
        }, ...t.subtopics]
      } : t)
    };
    dispatch({
      type: 'UPDATE_ITEM',
      key: 'subjects',
      item: updated
    });
    setName('');
    setAdd(null);
  }
  function renameItem() {
    if (!editing || !name.trim()) return;
    if (editing.type === 'subject') {
      const subj = findSubject(state, editing.id);
      dispatch({
        type: 'UPDATE_ITEM',
        key: 'subjects',
        item: {
          ...subj,
          name: name.trim()
        }
      });
    } else if (editing.type === 'topic') {
      const subj = findSubject(state, editing.subjectId);
      dispatch({
        type: 'UPDATE_ITEM',
        key: 'subjects',
        item: {
          ...subj,
          topics: subj.topics.map(t => t.id === editing.id ? {
            ...t,
            name: name.trim()
          } : t)
        }
      });
    } else {
      const subj = findSubject(state, editing.subjectId);
      dispatch({
        type: 'UPDATE_ITEM',
        key: 'subjects',
        item: {
          ...subj,
          topics: subj.topics.map(t => t.id === editing.topicId ? {
            ...t,
            subtopics: t.subtopics.map(s => s.id === editing.id ? {
              ...s,
              name: name.trim()
            } : s)
          } : t)
        }
      });
    }
    setEditing(null);
    setName('');
  }
  function delSubject(id) {
    if (confirm('Delete this subject and all its topics?')) dispatch({
      type: 'REMOVE_ITEM',
      key: 'subjects',
      id
    });
  }
  function delTopic(sid, tid) {
    if (!confirm('Delete this topic?')) return;
    const subj = findSubject(state, sid);
    dispatch({
      type: 'UPDATE_ITEM',
      key: 'subjects',
      item: {
        ...subj,
        topics: subj.topics.filter(t => t.id !== tid)
      }
    });
  }
  function delSubtopic(sid, tid, stid) {
    if (!confirm('Delete this subtopic?')) return;
    const subj = findSubject(state, sid);
    dispatch({
      type: 'UPDATE_ITEM',
      key: 'subjects',
      item: {
        ...subj,
        topics: subj.topics.map(t => t.id === tid ? {
          ...t,
          subtopics: t.subtopics.filter(s => s.id !== stid)
        } : t)
      }
    });
  }
  const subj = level.subjectId ? findSubject(state, level.subjectId) : null;
  const topic = subj && level.topicId ? findTopic(subj, level.topicId) : null;
  const subtopic = topic && level.subtopicId ? findSubtopic(topic, level.subtopicId) : null;
  return /*#__PURE__*/React.createElement("div", {
    className: "grid gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 text-sm flex-wrap"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setLevel({}),
    className: "hover:underline text-brand-600"
  }, "Subjects"), subj && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 14
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setLevel({
      subjectId: subj.id
    }),
    className: "hover:underline text-brand-600"
  }, subj.name)), topic && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 14
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setLevel({
      subjectId: subj.id,
      topicId: topic.id
    }),
    className: "hover:underline text-brand-600"
  }, topic.name)), subtopic && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 14
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-medium"
  }, subtopic.name))), !subj && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: () => setAdd({
      type: 'subject'
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus"
  }), "Add Subject")), state.subjects.length === 0 && /*#__PURE__*/React.createElement(Empty, {
    icon: "library",
    text: "No subjects yet. Create your first subject."
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid md:grid-cols-3 gap-2"
  }, state.subjects.map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.id,
    className: "p-4 group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setLevel({
      subjectId: s.id
    }),
    className: "flex-1 text-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-xl grad-premium animate-gradientMove text-white flex items-center justify-center font-bold mb-2"
  }, s.name.slice(0, 1).toUpperCase()), /*#__PURE__*/React.createElement("div", {
    className: "font-semibold"
  }, s.name), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500 mt-0.5"
  }, s.topics.length, " topics")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setEditing({
        type: 'subject',
        id: s.id
      });
      setName(s.name);
    },
    className: "p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pencil",
    size: 14
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => delSubject(s.id),
    className: "p-1 text-rose-500 hover:bg-rose-50 rounded"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash-2",
    size: 14
  })))))))), subj && !topic && subj.topics.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: () => setAdd({
      type: 'topic',
      parent: subj.id
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus"
  }), "Add Topic")), /*#__PURE__*/React.createElement("div", {
    className: "grid md:grid-cols-2 gap-2"
  }, subj.topics.map(t => /*#__PURE__*/React.createElement(Card, {
    key: t.id,
    className: "p-3 group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setLevel({
      subjectId: subj.id,
      topicId: t.id
    }),
    className: "flex-1 text-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-medium"
  }, t.name), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500"
  }, t.subtopics.length, " subtopics")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setEditing({
        type: 'topic',
        id: t.id,
        subjectId: subj.id
      });
      setName(t.name);
    },
    className: "p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pencil",
    size: 14
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => delTopic(subj.id, t.id),
    className: "p-1 text-rose-500"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash-2",
    size: 14
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500 mt-2"
  }, "Items saved directly under this subject (or across all its topics):"), /*#__PURE__*/React.createElement(SubtopicTools, {
    subjectId: subj.id,
    showScope: true
  })), subj && !topic && subj.topics.length === 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: () => setAdd({
      type: 'topic',
      parent: subj.id
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus"
  }), "Add Topic")), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500"
  }, "No topics yet — you can still add MCQ / Flashcard / Information directly under this subject."), /*#__PURE__*/React.createElement(SubtopicTools, {
    subjectId: subj.id
  })), subj && topic && !subtopic && topic.subtopics.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: () => setAdd({
      type: 'subtopic',
      parent: topic.id
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus"
  }), "Add Subtopic")), /*#__PURE__*/React.createElement("div", {
    className: "grid md:grid-cols-2 gap-2"
  }, topic.subtopics.map(st => /*#__PURE__*/React.createElement(Card, {
    key: st.id,
    className: "p-3 group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setLevel({
      subjectId: subj.id,
      topicId: topic.id,
      subtopicId: st.id
    }),
    className: "flex-1 text-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-medium"
  }, st.name), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500"
  }, "Tap to view MCQ / Flashcard / Info")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setEditing({
        type: 'subtopic',
        id: st.id,
        subjectId: subj.id,
        topicId: topic.id
      });
      setName(st.name);
    },
    className: "p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pencil",
    size: 14
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => delSubtopic(subj.id, topic.id, st.id),
    className: "p-1 text-rose-500"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash-2",
    size: 14
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500 mt-2"
  }, "Items saved directly under this topic (or across all its subtopics):"), /*#__PURE__*/React.createElement(SubtopicTools, {
    subjectId: subj.id,
    topicId: topic.id,
    showScope: true
  })), subj && topic && !subtopic && topic.subtopics.length === 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: () => setAdd({
      type: 'subtopic',
      parent: topic.id
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus"
  }), "Add Subtopic")), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500"
  }, "No subtopics — you can add MCQ / Flashcard / Information directly under this topic."), /*#__PURE__*/React.createElement(SubtopicTools, {
    subjectId: subj.id,
    topicId: topic.id
  })), subj && topic && subtopic && /*#__PURE__*/React.createElement(SubtopicTools, {
    subjectId: subj.id,
    topicId: topic.id,
    subtopicId: subtopic.id
  }), /*#__PURE__*/React.createElement(Modal, {
    open: !!add,
    onClose: () => {
      setAdd(null);
      setName('');
    },
    title: add?.type === 'subject' ? 'New Subject' : add?.type === 'topic' ? 'New Topic' : 'New Subtopic'
  }, /*#__PURE__*/React.createElement(Input, {
    autoFocus: true,
    placeholder: "Name",
    value: name,
    onChange: e => setName(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end mt-3 gap-2"
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    onClick: () => {
      setAdd(null);
      setName('');
    }
  }, "Cancel"), /*#__PURE__*/React.createElement(Btn, {
    onClick: () => {
      if (add.type === 'subject') addSubject();else if (add.type === 'topic') addTopic(add.parent);else addSubtopic(subj.id, add.parent);
    }
  }, "Add"))), /*#__PURE__*/React.createElement(Modal, {
    open: !!editing,
    onClose: () => {
      setEditing(null);
      setName('');
    },
    title: "Rename"
  }, /*#__PURE__*/React.createElement(Input, {
    autoFocus: true,
    value: name,
    onChange: e => setName(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end mt-3 gap-2"
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    onClick: () => {
      setEditing(null);
      setName('');
    }
  }, "Cancel"), /*#__PURE__*/React.createElement(Btn, {
    onClick: renameItem
  }, "Save"))));
}
function SubtopicTools({
  subjectId,
  topicId,
  subtopicId,
  showScope
}) {
  const {
    state
  } = useVault();
  const [tool, setTool] = useState(null); // 'mcq' | 'flash' | 'info'
  // scope: 'direct' = items saved exactly at this level; 'all' = cumulative (this level + all descendants)
  const [scope, setScope] = useState('direct');
  const isLeaf = !!subtopicId;
  const effectiveScope = isLeaf ? 'direct' : scope;
  function pred(item) {
    if (effectiveScope === 'direct') {
      return (item.subjectId || null) === (subjectId || null) && (item.topicId || null) === (topicId || null) && (item.subtopicId || null) === (subtopicId || null);
    }
    if (subjectId && item.subjectId !== subjectId) return false;
    if (topicId && item.topicId !== topicId) return false;
    return true;
  }
  const mcqs = state.mcqs.filter(pred);
  const flash = state.flashcards.filter(pred);
  const info = state.information.filter(pred);
  const listFilter = {
    subjectId,
    topicId,
    subtopicId,
    _scope: effectiveScope
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "grid gap-3"
  }, showScope && !isLeaf && /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1 text-xs"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setScope('direct'),
    className: "px-2 py-1 rounded-lg border " + (scope === 'direct' ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300' : 'border-slate-200 dark:border-slate-700')
  }, "Direct only"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setScope('all'),
    className: "px-2 py-1 rounded-lg border " + (scope === 'all' ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300' : 'border-slate-200 dark:border-slate-700')
  }, "Include nested")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setTool('mcq'),
    className: "p-4 rounded-2xl border transition text-center " + (tool === 'mcq' ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40' : 'border-slate-200 dark:border-slate-700 hover:border-brand-400')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "list-checks",
    size: 22
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 font-medium"
  }, "MCQ"), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500"
  }, mcqs.length, " items")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTool('flash'),
    className: "p-4 rounded-2xl border transition text-center " + (tool === 'flash' ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40' : 'border-slate-200 dark:border-slate-700 hover:border-brand-400')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "layers",
    size: 22
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 font-medium"
  }, "Flashcard"), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500"
  }, flash.length, " items")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTool('info'),
    className: "p-4 rounded-2xl border transition text-center " + (tool === 'info' ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40' : 'border-slate-200 dark:border-slate-700 hover:border-brand-400')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 22
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 font-medium"
  }, "Information"), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500"
  }, info.length, " items"))), tool === 'mcq' && /*#__PURE__*/React.createElement(MCQList, {
    filter: listFilter,
    inline: true
  }), tool === 'flash' && /*#__PURE__*/React.createElement(FlashList, {
    filter: listFilter,
    inline: true
  }), tool === 'info' && /*#__PURE__*/React.createElement(InfoList, {
    filter: listFilter,
    inline: true
  }));
}

/* ---------- Shared: Subject/Topic/Subtopic selector ---------- */
function SubjectPicker({
  value,
  onChange,
  allowEmpty = false
}) {
  const {
    state
  } = useVault();
  const {
    subjectId,
    topicId,
    subtopicId
  } = value || {};
  const subj = findSubject(state, subjectId);
  const topic = findTopic(subj, topicId);
  return /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2"
  }, /*#__PURE__*/React.createElement(Select, {
    value: subjectId || '',
    onChange: e => onChange({
      subjectId: e.target.value || undefined,
      topicId: undefined,
      subtopicId: undefined
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, allowEmpty ? 'All subjects' : '— Subject —'), state.subjects.map(s => /*#__PURE__*/React.createElement("option", {
    key: s.id,
    value: s.id
  }, s.name))), /*#__PURE__*/React.createElement(Select, {
    value: topicId || '',
    onChange: e => onChange({
      subjectId,
      topicId: e.target.value || undefined,
      subtopicId: undefined
    }),
    disabled: !subj
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, allowEmpty ? 'All topics' : '— Topic —'), subj?.topics.map(t => /*#__PURE__*/React.createElement("option", {
    key: t.id,
    value: t.id
  }, t.name))), /*#__PURE__*/React.createElement(Select, {
    value: subtopicId || '',
    onChange: e => onChange({
      subjectId,
      topicId,
      subtopicId: e.target.value || undefined
    }),
    disabled: !topic
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, allowEmpty ? 'All subtopics' : '— Subtopic —'), topic?.subtopics.map(s => /*#__PURE__*/React.createElement("option", {
    key: s.id,
    value: s.id
  }, s.name))));
}
function matchFilter(item, f) {
  if (f && f._scope === 'direct') {
    return (item.subjectId || null) === (f.subjectId || null) && (item.topicId || null) === (f.topicId || null) && (item.subtopicId || null) === (f.subtopicId || null) && (!f.difficulty || item.difficulty === f.difficulty);
  }
  if (f.subjectId && item.subjectId !== f.subjectId) return false;
  if (f.topicId && item.topicId !== f.topicId) return false;
  if (f.subtopicId && item.subtopicId !== f.subtopicId) return false;
  if (f.difficulty && item.difficulty !== f.difficulty) return false;
  return true;
}

/* ---------- MCQ ---------- */
function MCQView() {
  const {
    state,
    dispatch
  } = useVault();
  const [mode, setMode] = useState('list');
  const [editing, setEditing] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [filter, setFilter] = useState({});
  const [showBulk, setShowBulk] = useState(false);
  const list = state.mcqs.filter(m => matchFilter(m, filter));
  function startQuiz() {
    if (list.length === 0) {
      toast('No MCQs match your filter.', 'error');
      return;
    }
    const pool = [...list].sort(() => Math.random() - .5).slice(0, Math.min(10, list.length));
    setQuiz({
      pool,
      idx: 0,
      answers: []
    });
    setMode('quiz');
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "grid gap-4"
  }, mode === 'list' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, {
    className: "p-3 grid gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500 font-medium"
  }, "Filter"), /*#__PURE__*/React.createElement(SubjectPicker, {
    value: filter,
    onChange: p => setFilter({
      ...filter,
      ...p
    }),
    allowEmpty: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2 items-center"
  }, /*#__PURE__*/React.createElement(Select, {
    value: filter.difficulty || '',
    onChange: e => setFilter({
      ...filter,
      difficulty: e.target.value || undefined
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Any difficulty"), /*#__PURE__*/React.createElement("option", {
    value: "easy"
  }, "Easy"), /*#__PURE__*/React.createElement("option", {
    value: "hard"
  }, "Hard")), /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    onClick: () => setFilter({})
  }, "Clear"), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto text-xs text-slate-500"
  }, list.length, " shown / ", state.mcqs.length, " total"))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: () => {
      setEditing({
        id: uid(),
        question: '',
        options: ['', '', '', ''],
        correct: 0,
        tag: '',
        difficulty: 'easy',
        ...filter
      });
      setMode('create');
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus"
  }), "Add MCQ"), /*#__PURE__*/React.createElement(Btn, {
    variant: "subtle",
    onClick: startQuiz
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "play"
  }), "Quick Quiz"), /*#__PURE__*/React.createElement(Btn, {
    variant: "outline",
    onClick: () => setShowBulk(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "upload"
  }), "Bulk Add")), list.length === 0 && /*#__PURE__*/React.createElement(Empty, {
    icon: "list-checks",
    text: "No MCQs match this filter."
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid gap-2"
  }, list.map(m => /*#__PURE__*/React.createElement(Card, {
    key: m.id,
    className: "p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-medium"
  }, m.question), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500 mt-1"
  }, "Answer: ", m.options[m.correct]), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-1 mt-1"
  }, m.difficulty && /*#__PURE__*/React.createElement(Chip, {
    tone: m.difficulty === 'hard' ? 'rose' : 'emerald'
  }, m.difficulty), m.subjectId && /*#__PURE__*/React.createElement(Chip, {
    tone: "brand"
  }, subjectName(state, m.subjectId)), m.topicId && /*#__PURE__*/React.createElement(Chip, null, topicName(state, m.subjectId, m.topicId)), m.subtopicId && /*#__PURE__*/React.createElement(Chip, null, subtopicName(state, m.subjectId, m.topicId, m.subtopicId)), m.tag && /*#__PURE__*/React.createElement(Chip, null, m.tag))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setEditing(m);
      setMode('create');
    },
    className: "p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pencil",
    size: 14
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => dispatch({
      type: 'REMOVE_ITEM',
      key: 'mcqs',
      id: m.id
    }),
    className: "p-1.5 rounded hover:bg-rose-50 text-rose-600"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash-2",
    size: 14
  }))))))), mode === 'create' && /*#__PURE__*/React.createElement(MCQEditor, {
    item: editing,
    onCancel: () => setMode('list'),
    onSave: item => {
      const exists = state.mcqs.find(x => x.id === item.id);
      if (exists) dispatch({
        type: 'UPDATE_ITEM',
        key: 'mcqs',
        item
      });else dispatch({
        type: 'ADD_ITEM',
        key: 'mcqs',
        item
      });
      setMode('list');
    }
  }), mode === 'quiz' && /*#__PURE__*/React.createElement(QuizRunner, {
    quiz: quiz,
    onDone: answers => {
      const score = answers.filter(a => a.correct).length;
      dispatch({
        type: 'ADD_ITEM',
        key: 'attempts',
        item: {
          id: uid(),
          date: todayISO(),
          score,
          total: answers.length
        }
      });
      answers.filter(a => !a.correct).forEach(a => {
        if (!state.mistakeVault.find(x => x.mcqId === a.mcq.id)) dispatch({
          type: 'ADD_ITEM',
          key: 'mistakeVault',
          item: {
            id: uid(),
            mcqId: a.mcq.id,
            mcq: a.mcq,
            addedAt: todayISO()
          }
        });
      });
      dispatch({
        type: 'ADD_XP',
        amount: score * 10
      });
      setQuiz({
        ...quiz,
        answers,
        done: true
      });
      setMode('result');
    }
  }), mode === 'result' && /*#__PURE__*/React.createElement(QuizResult, {
    quiz: quiz,
    onClose: () => setMode('list')
  }), /*#__PURE__*/React.createElement(Modal, {
    open: showBulk,
    onClose: () => setShowBulk(false),
    title: "Bulk add MCQs",
    wide: true
  }, /*#__PURE__*/React.createElement(BulkMCQ, {
    onDone: items => {
      dispatch({
        type: 'ADD_MANY',
        key: 'mcqs',
        items
      });
      setShowBulk(false);
      toast(`Added ${items.length} MCQs`, 'success');
    }
  })));
}

// Reusable MCQ list (inline mode used inside Subjects drill)
function MCQList({
  filter,
  inline
}) {
  const {
    state,
    dispatch
  } = useVault();
  const [editing, setEditing] = useState(null);
  const list = state.mcqs.filter(m => matchFilter(m, filter));
  if (list.length === 0) return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Empty, {
    icon: "list-checks",
    text: "No MCQs in this subtopic. Add one from MCQ Bank."
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center mt-2"
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: () => setEditing({
      id: uid(),
      question: '',
      options: ['', '', '', ''],
      correct: 0,
      difficulty: 'easy',
      ...filter
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus"
  }), "Add here")), editing && /*#__PURE__*/React.createElement(Modal, {
    open: true,
    onClose: () => setEditing(null),
    title: "Add MCQ",
    wide: true
  }, /*#__PURE__*/React.createElement(MCQEditor, {
    item: editing,
    onCancel: () => setEditing(null),
    onSave: item => {
      dispatch({
        type: 'ADD_ITEM',
        key: 'mcqs',
        item
      });
      setEditing(null);
    }
  })));
  return /*#__PURE__*/React.createElement("div", {
    className: "grid gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end"
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: () => setEditing({
      id: uid(),
      question: '',
      options: ['', '', '', ''],
      correct: 0,
      difficulty: 'easy',
      ...filter
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus"
  }), "Add MCQ")), list.map(m => /*#__PURE__*/React.createElement(Card, {
    key: m.id,
    className: "p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-medium"
  }, m.question), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-emerald-600 mt-1"
  }, "Correct: ", m.options[m.correct]), m.difficulty && /*#__PURE__*/React.createElement(Chip, {
    tone: m.difficulty === 'hard' ? 'rose' : 'emerald',
    className: "mt-1"
  }, m.difficulty)), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditing(m),
    className: "p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pencil",
    size: 14
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => dispatch({
      type: 'REMOVE_ITEM',
      key: 'mcqs',
      id: m.id
    }),
    className: "p-1.5 text-rose-600"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash-2",
    size: 14
  }))))), editing && /*#__PURE__*/React.createElement(Modal, {
    open: true,
    onClose: () => setEditing(null),
    title: "Edit MCQ",
    wide: true
  }, /*#__PURE__*/React.createElement(MCQEditor, {
    item: editing,
    onCancel: () => setEditing(null),
    onSave: item => {
      const exists = state.mcqs.find(x => x.id === item.id);
      if (exists) dispatch({
        type: 'UPDATE_ITEM',
        key: 'mcqs',
        item
      });else dispatch({
        type: 'ADD_ITEM',
        key: 'mcqs',
        item
      });
      setEditing(null);
    }
  })));
}
function MCQEditor({
  item,
  onSave,
  onCancel
}) {
  const [q, setQ] = useState(item);
  return /*#__PURE__*/React.createElement(Card, {
    className: "p-4 grid gap-3"
  }, /*#__PURE__*/React.createElement(TextArea, {
    rows: "2",
    placeholder: "Question",
    value: q.question,
    onChange: e => setQ({
      ...q,
      question: e.target.value
    })
  }), q.options.map((o, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "correct",
    checked: q.correct === i,
    onChange: () => setQ({
      ...q,
      correct: i
    }),
    className: "accent-brand-600"
  }), /*#__PURE__*/React.createElement(Input, {
    placeholder: 'Option ' + (i + 1),
    value: o,
    onChange: e => {
      const opts = [...q.options];
      opts[i] = e.target.value;
      setQ({
        ...q,
        options: opts
      });
    }
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500 mb-1"
  }, "Categorize (optional)"), /*#__PURE__*/React.createElement(SubjectPicker, {
    value: {
      subjectId: q.subjectId,
      topicId: q.topicId,
      subtopicId: q.subtopicId
    },
    onChange: p => setQ({
      ...q,
      ...p
    }),
    allowEmpty: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, /*#__PURE__*/React.createElement(Select, {
    value: q.difficulty || 'easy',
    onChange: e => setQ({
      ...q,
      difficulty: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: "easy"
  }, "Easy"), /*#__PURE__*/React.createElement("option", {
    value: "hard"
  }, "Hard")), /*#__PURE__*/React.createElement(Input, {
    placeholder: "Tag",
    value: q.tag || '',
    onChange: e => setQ({
      ...q,
      tag: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2"
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    onClick: onCancel
  }, "Cancel"), /*#__PURE__*/React.createElement(Btn, {
    onClick: () => {
      if (!q.question.trim() || q.options.some(o => !o.trim())) {
        toast('Fill all fields', 'error');
        return;
      }
      onSave(q);
    }
  }, "Save")));
}
function BulkMCQ({
  onDone
}) {
  const [text, setText] = useState('');
  const [filter, setFilter] = useState({});
  const [diff, setDiff] = useState('easy');
  const example = `Q: What is the capital of Bangladesh?
A) Chittagong
B) Dhaka *
C) Sylhet
D) Rajshahi
---
Q: 2 + 2 = ?
A) 3
B) 4 *
C) 5
D) 6`;
  function parse() {
    const blocks = text.split(/^-{3,}$/m).map(b => b.trim()).filter(Boolean);
    const items = [];
    for (const b of blocks) {
      const lines = b.split(/\n+/).map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) continue;
      const qLine = lines[0].replace(/^Q\s*[:.\-)]\s*/i, '');
      const opts = [];
      let correct = 0;
      lines.slice(1).forEach((l, i) => {
        let clean = l.replace(/^[A-Da-d1-4]\s*[\).:\-]\s*/, '');
        const star = /\*\s*$/.test(clean);
        if (star) {
          correct = opts.length;
          clean = clean.replace(/\*\s*$/, '').trim();
        }
        opts.push(clean);
      });
      if (opts.length >= 2) {
        items.push({
          id: uid(),
          question: qLine,
          options: opts.slice(0, 6),
          correct,
          difficulty: diff,
          ...filter
        });
      }
    }
    if (items.length === 0) {
      toast('Nothing parsed. Check format.', 'error');
      return;
    }
    onDone(items);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "grid gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500"
  }, "Paste multiple MCQs, separated by ", /*#__PURE__*/React.createElement("code", null, "---"), ". Mark the correct option with a trailing ", /*#__PURE__*/React.createElement("code", null, "*"), "."), /*#__PURE__*/React.createElement(FormatBlock, {
    text: example,
    label: "MCQ format"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500 mb-1"
  }, "Assign to (optional)"), /*#__PURE__*/React.createElement(SubjectPicker, {
    value: filter,
    onChange: p => setFilter({
      ...filter,
      ...p
    }),
    allowEmpty: true
  })), /*#__PURE__*/React.createElement(Select, {
    value: diff,
    onChange: e => setDiff(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "easy"
  }, "Easy"), /*#__PURE__*/React.createElement("option", {
    value: "hard"
  }, "Hard")), /*#__PURE__*/React.createElement(TextArea, {
    rows: "5",
    value: text,
    onChange: e => setText(e.target.value),
    placeholder: "Paste here..."
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2"
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: parse
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check"
  }), "Parse & Add")));
}
function QuizRunner({
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
          lang === 'en' ? `Question ${idx + 1} / ${quiz.pool.length}` : `প্রশ্ন ${idx + 1} / ${quiz.pool.length}`
        ),
        /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2.5" },
          mm && /*#__PURE__*/React.createElement("span", {
            className: `px-2 py-0.5 rounded-md font-mono ${totalLeft <= 60 ? 'bg-rose-50 text-rose-600 font-bold animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`
          }, lang === 'en' ? 'Left: ' : 'বাকি সময়: ', mm),
          timeLeft !== null && /*#__PURE__*/React.createElement("span", {
            className: `px-2 py-0.5 rounded-md font-mono ${timeLeft <= 5 ? 'bg-rose-50 text-rose-600 font-bold animate-pulse' : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'}`
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
        className: `p-3.5 rounded-lg border text-sm font-bn ${a.correct ? 'border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/40 dark:bg-emerald-950/20' : 'border-rose-200 dark:border-rose-800/40 bg-rose-50/40 dark:bg-rose-950/20'}`
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
/* ---------- Mistake Vault ---------- */
function MistakeView() {
  const {
    state,
    dispatch
  } = useVault();
  const [filter, setFilter] = useState({});
  const list = state.mistakeVault.filter(m => matchFilter(m.mcq, filter));
  if (state.mistakeVault.length === 0) return /*#__PURE__*/React.createElement(Empty, {
    icon: "alert-triangle",
    text: "No mistakes yet. Take a quiz to populate."
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "grid gap-3"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "p-3"
  }, /*#__PURE__*/React.createElement(SubjectPicker, {
    value: filter,
    onChange: p => setFilter({
      ...filter,
      ...p
    }),
    allowEmpty: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500"
  }, "Mistakes are removed automatically when answered correctly in an exam."), /*#__PURE__*/React.createElement("div", {
    className: "grid gap-2"
  }, list.map(m => /*#__PURE__*/React.createElement(Card, {
    key: m.id,
    className: "p-3 flex items-start gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-medium"
  }, m.mcq.question), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500 mt-1"
  }, "Correct: ", /*#__PURE__*/React.createElement("span", {
    className: "text-emerald-600"
  }, m.mcq.options[m.mcq.correct])), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-slate-400 mt-0.5"
  }, "Added ", m.addedAt)), /*#__PURE__*/React.createElement("button", {
    onClick: () => dispatch({
      type: 'REMOVE_ITEM',
      key: 'mistakeVault',
      id: m.id
    }),
    className: "p-1 text-rose-500",
    title: "Remove"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash-2",
    size: 14
  }))))));
}

/* ---------- Flashcards ---------- */
function FlashcardsView() {
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
        }, lang === "en" ? "Reset Filter" : lang === "en" ? "Reset Filter" : "রিসেট ফিল্টার"),
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
        /*#__PURE__*/React.createElement("span", null, lang === "en" ? "New Card" : lang === "en" ? "New Card" : "নতুন কার্ড")
      ),

      /* Custom Study & Exam Session Button (ANYTIME ON-DEMAND) */
      /*#__PURE__*/React.createElement(Btn, {
        variant: "primary",
        className: "bg-gradient-to-r from-brand-600 to-teal-600 text-white font-bold shadow-md",
        onClick: () => setShowSessionModal(true)
      },
        /*#__PURE__*/React.createElement(Icon, { name: "play-circle", size: 16 }),
        /*#__PURE__*/React.createElement("span", null, lang === "en" ? "Study & Test Session" : lang === "en" ? "Study & Test Session" : "স্টাডি ও এক্সাম সেশন (কাস্টম)")
      ),

      /* Quick Due Study Button (If any due) */
      due.length > 0 && /*#__PURE__*/React.createElement(Btn, {
        variant: "subtle",
        onClick: () => startSession('study', due)
      },
        /*#__PURE__*/React.createElement(Icon, { name: "clock", size: 16 }),
        /*#__PURE__*/React.createElement("span", null, `ডিউ রিভিশন (${due.length})`)
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
      title: "ফ্ল্যাশকার্ড সেশন কনফিগারেশন",
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
              /*#__PURE__*/React.createElement("option", { value: "all" }, "সব কার্ড"),
              /*#__PURE__*/React.createElement("option", { value: "untested" }, "নতুন কার্ড (পড়া হয়নি)"),
              /*#__PURE__*/React.createElement("option", { value: "due" }, "রিভিশন বাকি / ডিউ"),
              /*#__PURE__*/React.createElement("option", { value: "hard" }, "কঠিন কার্ডসমূহ")
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
              /*#__PURE__*/React.createElement("option", { value: "shuffle" }, "র‍্যান্ডম (Shuffled)"),
              /*#__PURE__*/React.createElement("option", { value: "seq" }, "ক্রমানুসারে (Sequential)")
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
            /*#__PURE__*/React.createElement("span", null, "স্টাডি সেশন")
          ),
          /* Start Flashcard Exam Mode */
          /*#__PURE__*/React.createElement(Btn, {
            variant: "subtle",
            onClick: () => startSession('exam'),
            className: "py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 border border-amber-500/40 font-bold flex items-center justify-center gap-2"
          },
            /*#__PURE__*/React.createElement(Icon, { name: "timer", size: 18 }),
            /*#__PURE__*/React.createElement("span", null, "ফ্ল্যাশকার্ড এক্সাম")
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
          toast(`${items.length} টি ফ্ল্যাশকার্ড যোগ হয়েছে`, 'success');
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

// Inline flash list for Subjects drill
function FlashTile({ c, subject, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const isDue = !c.due || c.due <= todayISO();
  return /*#__PURE__*/React.createElement("div", {
    className: "fc-tile",
    onClick: () => setOpen(!open)
  }, /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2 mb-2" },
    /*#__PURE__*/React.createElement("span", { className: "fc-dot " + (c.difficulty === 'hard' ? 'is-hard' : '') }),
    subject && /*#__PURE__*/React.createElement("span", { className: "text-[11px] text-slate-500 truncate" }, subject),
    /*#__PURE__*/React.createElement("span", { className: "ml-auto text-[11px] " + (isDue ? 'text-brand-600 font-medium' : 'text-slate-400') }, isDue ? 'Due' : c.due)),
    /*#__PURE__*/React.createElement("div", { className: "font-bn text-[15px] font-medium leading-snug text-slate-900 dark:text-slate-100 whitespace-pre-wrap" }, c.front),
    open ? /*#__PURE__*/React.createElement("div", { className: "fc-answer font-bn whitespace-pre-wrap" }, c.back)
         : /*#__PURE__*/React.createElement("div", { className: "mt-2 text-[11px] text-slate-400" }, "Tap to reveal"),
    open && /*#__PURE__*/React.createElement("div", { className: "mt-3 flex gap-1 justify-end", onClick: e => e.stopPropagation() },
      /*#__PURE__*/React.createElement("button", { onClick: onEdit, className: "fc-act" }, /*#__PURE__*/React.createElement(Icon, { name: "pencil", size: 14 })),
      /*#__PURE__*/React.createElement("button", { onClick: () => { if (confirm('Delete this card?')) onDelete(); }, className: "fc-act text-rose-500" }, /*#__PURE__*/React.createElement(Icon, { name: "trash-2", size: 14 }))));
}
function FlashList({
  filter
}) {
  const {
    state,
    dispatch
  } = useVault();
  const list = state.flashcards.filter(c => matchFilter(c, filter));
  const [editing, setEditing] = useState(null);
  return /*#__PURE__*/React.createElement("div", {
    className: "grid gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end"
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: () => setEditing({
      id: uid(),
      front: '',
      back: '',
      ease: 2.5,
      interval: 0,
      due: todayISO(),
      difficulty: 'easy',
      ...filter
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus"
  }), "Add Card")), list.length === 0 && /*#__PURE__*/React.createElement(Empty, {
    icon: "layers",
    text: "No flashcards here yet."
  }), list.map(c => /*#__PURE__*/React.createElement(FlashTile, {
    key: c.id,
    c: c,
    onEdit: () => setEditing(c),
    onDelete: () => dispatch({ type: 'REMOVE_ITEM', key: 'flashcards', id: c.id })
  })), editing && /*#__PURE__*/React.createElement(Modal, {
    open: true,
    onClose: () => setEditing(null),
    title: "Flashcard",
    wide: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid gap-2"
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Front",
    value: editing.front,
    onChange: e => setEditing({
      ...editing,
      front: e.target.value
    })
  }), /*#__PURE__*/React.createElement(TextArea, {
    rows: "3",
    placeholder: "Back",
    value: editing.back,
    onChange: e => setEditing({
      ...editing,
      back: e.target.value
    })
  }), /*#__PURE__*/React.createElement(SubjectPicker, {
    value: editing,
    onChange: p => setEditing({
      ...editing,
      ...p
    }),
    allowEmpty: true
  }), /*#__PURE__*/React.createElement(Select, {
    value: editing.difficulty || 'easy',
    onChange: e => setEditing({
      ...editing,
      difficulty: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: "easy"
  }, "Easy"), /*#__PURE__*/React.createElement("option", {
    value: "hard"
  }, "Hard")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2"
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    onClick: () => setEditing(null)
  }, "Cancel"), /*#__PURE__*/React.createElement(Btn, {
    onClick: () => {
      const exists = state.flashcards.find(x => x.id === editing.id);
      if (exists) dispatch({
        type: 'UPDATE_ITEM',
        key: 'flashcards',
        item: editing
      });else dispatch({
        type: 'ADD_ITEM',
        key: 'flashcards',
        item: editing
      });
      setEditing(null);
    }
  }, "Save")))));
}
function BulkFlash({
  onDone
}) {
  const [text, setText] = useState('');
  const [filter, setFilter] = useState({});
  const [diff, setDiff] = useState('easy');
  const example = `Front :: Back
Bangla capital :: Dhaka
Speed of light :: 3x10^8 m/s`;
  function parse() {
    const items = text.split(/\n+/).map(l => l.trim()).filter(Boolean).map(l => {
      const [f, b] = l.split(/::|\|/).map(s => s?.trim());
      if (!f || !b) return null;
      return {
        id: uid(),
        front: f,
        back: b,
        ease: 2.5,
        interval: 0,
        due: todayISO(),
        difficulty: diff,
        ...filter
      };
    }).filter(Boolean);
    if (!items.length) {
      toast('Nothing parsed', 'error');
      return;
    }
    onDone(items);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "grid gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500"
  }, "One card per line. Separate front and back with ", /*#__PURE__*/React.createElement("code", null, "::"), " or ", /*#__PURE__*/React.createElement("code", null, "|"), "."), /*#__PURE__*/React.createElement(FormatBlock, {
    text: example,
    label: "Flashcard format"
  }), /*#__PURE__*/React.createElement(SubjectPicker, {
    value: filter,
    onChange: p => setFilter({
      ...filter,
      ...p
    }),
    allowEmpty: true
  }), /*#__PURE__*/React.createElement(Select, {
    value: diff,
    onChange: e => setDiff(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "easy"
  }, "Easy"), /*#__PURE__*/React.createElement("option", {
    value: "hard"
  }, "Hard")), /*#__PURE__*/React.createElement(TextArea, {
    rows: "8",
    value: text,
    onChange: e => setText(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end"
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: parse
  }, "Parse & Add")));
}
function StudyRunner({
  cards,
  mode = 'study',
  onExit
}) {
  const { state, dispatch } = useVault();
  const lang = state?.ui?.lang || 'bn';
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
    utter.lang = /[ঀ-৿]/.test(clean) ? 'bn-BD' : 'en-US';
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
      title: lang === "en" ? "Flashcard Session Complete" : "ফ্ল্যাশকার্ড সেশন সম্পন্ন"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center py-4 space-y-4"
    },
      /*#__PURE__*/React.createElement("div", {
        className: "w-12 h-12 mx-auto rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center text-xl font-bold font-mono"
      }, knownPct + "%"),
      /*#__PURE__*/React.createElement("div", null,
        /*#__PURE__*/React.createElement("h3", {
          className: "text-base font-semibold font-bn text-slate-900 dark:text-white"
        }, mode === 'exam' ? (lang === 'en' ? `Flashcard Test Score: ${knownPct}%` : `ফ্ল্যাশকার্ড টেস্ট স্কোর: ${knownPct}%`) : (lang === 'en' ? 'Practice Complete' : 'অনুশীলন সম্পন্ন হয়েছে')),
        /*#__PURE__*/React.createElement("p", {
          className: "text-xs text-slate-500 font-bn mt-0.5"
        }, lang === 'en' ? `Recalled ${score.known} out of ${total} cards.` : `মোট ${total} টি কার্ডের মধ্যে ${score.known} টি মনে রাখতে পেরেছেন।`)
      ),
      /* Stats */
      /*#__PURE__*/React.createElement("div", {
        className: "grid grid-cols-2 gap-2 max-w-xs mx-auto text-center"
      },
        /*#__PURE__*/React.createElement("div", { className: "p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60" },
          /*#__PURE__*/React.createElement("div", { className: "text-lg font-semibold font-mono text-emerald-600 dark:text-emerald-400" }, score.known),
          /*#__PURE__*/React.createElement("div", { className: "text-[11px] text-slate-500 font-bn" }, lang === "en" ? "Good" : "পেরেছি")
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
        }, lang === "en" ? "Finish Session" : "সম্পন্ন করুন")
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
          /*#__PURE__*/React.createElement("span", { className: "font-bn font-medium" }, mode === 'exam' ? (lang === 'en' ? 'Flashcard Test' : 'ফ্ল্যাশকার্ড টেস্ট') : (lang === 'en' ? 'Flashcard Study' : 'ফ্ল্যাশকার্ড স্টাডি')),
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
          className: `fc-flip-card ${flip ? 'is-flipped' : ''}`
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
              }, lang === "en" ? "Question" : "প্রশ্ন (Question)"),
              /* Speech */
              /*#__PURE__*/React.createElement("button", {
                type: "button",
                onClick: (e) => { e.stopPropagation(); speak(c.front); },
                className: `p-1.5 rounded-lg text-slate-400 hover:text-brand-600 transition ${speaking ? 'text-brand-600 animate-pulse' : ''}`,
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
            }, lang === "en" ? "Tap or press Space to reveal answer" : "উত্তর দেখতে ট্যাপ করুন / স্পেসবার চাপুন")
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
              }, lang === "en" ? "✓ Answer" : "✓ উত্তর (Answer)"),
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
            }, lang === "en" ? "Select your recall rating below" : "নিচে আপনার অবস্থা নির্বাচন করুন")
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
        }, lang === "en" ? "Hard (Again)" : "কঠিন (আবার)"),
        /* 2. Medium */
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: () => grade(1),
          className: "py-3 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-bn font-medium text-xs sm:text-sm transition text-center"
        }, lang === "en" ? "Medium" : "মাঝারি"),
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
        }, lang === "en" ? "Show Answer" : "উত্তর দেখুন")
      )
    )
  );
}
/* ---------- Information ---------- */
function InfoList({
  filter
}) {
  const {
    state,
    dispatch
  } = useVault();
  const [editing, setEditing] = useState(null);
  const list = state.information.filter(m => matchFilter(m, filter));
  return /*#__PURE__*/React.createElement("div", {
    className: "grid gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end"
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: () => setEditing({
      id: uid(),
      title: '',
      body: '',
      difficulty: 'easy',
      ...filter
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus"
  }), "Add Info")), list.length === 0 && /*#__PURE__*/React.createElement(Empty, {
    icon: "info",
    text: "No information notes here yet."
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid md:grid-cols-2 gap-2"
  }, list.map(inf => /*#__PURE__*/React.createElement(Card, {
    key: inf.id,
    className: "p-3 cursor-pointer",
    onClick: () => setEditing(inf)
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-medium"
  }, inf.title || 'Untitled'), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500 whitespace-pre-wrap line-clamp-3 mt-1"
  }, inf.body), inf.difficulty && /*#__PURE__*/React.createElement(Chip, {
    tone: inf.difficulty === 'hard' ? 'rose' : 'emerald',
    className: "mt-1"
  }, inf.difficulty)))), editing && /*#__PURE__*/React.createElement(Modal, {
    open: true,
    onClose: () => setEditing(null),
    title: "Information",
    wide: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid gap-2"
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Title",
    value: editing.title,
    onChange: e => setEditing({
      ...editing,
      title: e.target.value
    })
  }), /*#__PURE__*/React.createElement(TextArea, {
    rows: "5",
    placeholder: "Content...",
    value: editing.body,
    onChange: e => setEditing({
      ...editing,
      body: e.target.value
    })
  }), /*#__PURE__*/React.createElement(SubjectPicker, {
    value: editing,
    onChange: p => setEditing({
      ...editing,
      ...p
    }),
    allowEmpty: true
  }), /*#__PURE__*/React.createElement(Select, {
    value: editing.difficulty || 'easy',
    onChange: e => setEditing({
      ...editing,
      difficulty: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: "easy"
  }, "Easy"), /*#__PURE__*/React.createElement("option", {
    value: "hard"
  }, "Hard")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between"
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "danger",
    onClick: () => {
      dispatch({
        type: 'REMOVE_ITEM',
        key: 'information',
        id: editing.id
      });
      setEditing(null);
    }
  }, "Delete"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    onClick: () => setEditing(null)
  }, "Close"), /*#__PURE__*/React.createElement(Btn, {
    onClick: () => {
      const item = {
        ...editing,
        updated: todayISO()
      };
      const exists = state.information.find(x => x.id === editing.id);
      if (exists) dispatch({
        type: 'UPDATE_ITEM',
        key: 'information',
        item
      });else dispatch({
        type: 'ADD_ITEM',
        key: 'information',
        item
      });
      setEditing(null);
    }
  }, "Save"))))));
}

/* ---------- Schedule (bulk + edit) ---------- */
function ScheduleView() {
  const {
    state,
    dispatch
  } = useVault();
  const [add, setAdd] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState({});
  const list = state.schedule.filter(s => matchFilter(s, filter));
  const grouped = useMemo(() => {
    const g = {};
    list.forEach(s => {
      const d = s.day != null ? s.day : new Date(s.date || todayISO()).getDay();
      (g[d] = g[d] || []).push(s);
    });
    return DAY_ORDER.filter(d => g[d]).map(d => [d, g[d]]);
  }, [list]);
  return /*#__PURE__*/React.createElement("div", {
    className: "grid gap-4"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "p-3"
  }, /*#__PURE__*/React.createElement(SubjectPicker, {
    value: filter,
    onChange: p => setFilter({
      ...filter,
      ...p
    }),
    allowEmpty: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 flex-wrap"
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: () => {
      setEditing({
        id: uid(),
        title: '',
        day: todayDow(),
        time: '',
        notes: '',
        ...filter
      });
      setAdd(true);
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus"
  }), "Add event"), /*#__PURE__*/React.createElement(Btn, {
    variant: "outline",
    onClick: () => setShowBulk(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "upload"
  }), "Bulk Add (7-day)")), grouped.length === 0 && /*#__PURE__*/React.createElement(Empty, {
    icon: "calendar-days",
    text: "No scheduled items."
  }), grouped.map(([day, items]) => /*#__PURE__*/React.createElement(Card, {
    key: day,
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-semibold mb-2"
  }, DAY_NAMES[day], " ", day === todayDow() && /*#__PURE__*/React.createElement(Chip, {
    tone: "brand",
    className: "ml-1"
  }, "TODAY")), /*#__PURE__*/React.createElement("div", {
    className: "grid gap-2"
  }, items.sort((a, b) => (a.time || '').localeCompare(b.time || '')).map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    className: "flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-14 text-xs text-slate-500"
  }, s.time || '—'), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-medium text-sm"
  }, s.title), s.notes && /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500"
  }, s.notes)), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setEditing({
        ...s,
        day: s.day != null ? s.day : new Date(s.date || todayISO()).getDay()
      });
      setAdd(true);
    },
    className: "p-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pencil",
    size: 14
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => dispatch({
      type: 'REMOVE_ITEM',
      key: 'schedule',
      id: s.id
    }),
    className: "text-rose-500 p-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash-2",
    size: 14
  }))))))), /*#__PURE__*/React.createElement(Modal, {
    open: add,
    onClose: () => {
      setAdd(false);
      setEditing(null);
    },
    title: state.schedule.find(x => x.id === editing?.id) ? 'Edit event' : 'New event'
  }, editing && /*#__PURE__*/React.createElement("div", {
    className: "grid gap-2"
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Title",
    value: editing.title,
    onChange: e => setEditing({
      ...editing,
      title: e.target.value
    })
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, /*#__PURE__*/React.createElement("select", {
    className: "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2",
    value: editing.day,
    onChange: e => setEditing({
      ...editing,
      day: +e.target.value,
      date: undefined
    })
  }, DAY_ORDER.map(d => /*#__PURE__*/React.createElement("option", {
    key: d,
    value: d
  }, DAY_NAMES[d]))), /*#__PURE__*/React.createElement(Input, {
    type: "time",
    value: editing.time || '',
    onChange: e => setEditing({
      ...editing,
      time: e.target.value
    })
  })), /*#__PURE__*/React.createElement(SubjectPicker, {
    value: editing,
    onChange: p => setEditing({
      ...editing,
      ...p
    }),
    allowEmpty: true
  }), /*#__PURE__*/React.createElement(TextArea, {
    rows: "2",
    placeholder: "Notes",
    value: editing.notes || '',
    onChange: e => setEditing({
      ...editing,
      notes: e.target.value
    })
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2"
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    onClick: () => {
      setAdd(false);
      setEditing(null);
    }
  }, "Cancel"), /*#__PURE__*/React.createElement(Btn, {
    onClick: () => {
      if (!editing.title) return;
      const it = {
        ...editing
      };
      delete it.date;
      const exists = state.schedule.find(x => x.id === editing.id);
      if (exists) dispatch({
        type: 'UPDATE_ITEM',
        key: 'schedule',
        item: it
      });else dispatch({
        type: 'ADD_ITEM',
        key: 'schedule',
        item: it
      });
      setAdd(false);
      setEditing(null);
    }
  }, "Save")))), /*#__PURE__*/React.createElement(Modal, {
    open: showBulk,
    onClose: () => setShowBulk(false),
    title: "Bulk add weekly schedule",
    wide: true
  }, /*#__PURE__*/React.createElement(BulkSchedule, {
    onDone: items => {
      dispatch({
        type: 'ADD_MANY',
        key: 'schedule',
        items
      });
      setShowBulk(false);
      toast(`Added ${items.length} events`, 'success');
    }
  })));
}
function BulkSchedule({
  onDone
}) {
  const [text, setText] = useState('');
  const example = `Saturday
09:00 Math practice
11:00 English reading
Sunday
10:00 Physics MCQ
15:00 History revision
Monday
09:30 Bio flashcards`;
  function dayFromName(s) {
    const l = s.toLowerCase();
    const idx = DAY_NAMES.findIndex(n => n.toLowerCase() === l || n.toLowerCase().startsWith(l));
    return idx;
  }
  function parse() {
    const items = [];
    const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);
    let day = todayDow();
    for (const l of lines) {
      const dm = dayFromName(l);
      if (dm >= 0) {
        day = dm;
        continue;
      }
      const tm = l.match(/^(\d{1,2}):(\d{2})\s+(.+)$/);
      if (tm) {
        const hh = String(tm[1]).padStart(2, '0');
        items.push({
          id: uid(),
          title: tm[3].trim(),
          day,
          time: `${hh}:${tm[2]}`,
          notes: ''
        });
      }
    }
    if (!items.length) {
      toast('Nothing parsed', 'error');
      return;
    }
    onDone(items);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "grid gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500"
  }, "Use day names (", /*#__PURE__*/React.createElement("code", null, "Saturday"), ", ", /*#__PURE__*/React.createElement("code", null, "Sunday"), ", ...) as headers. Each event: ", /*#__PURE__*/React.createElement("code", null, "HH:MM Title"), "."), /*#__PURE__*/React.createElement(FormatBlock, {
    text: example,
    label: "Schedule format"
  }), /*#__PURE__*/React.createElement(TextArea, {
    rows: "5",
    value: text,
    onChange: e => setText(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end"
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: parse
  }, "Parse & Add")));
}

/* ---------- To-dos (edit + due time) ---------- */
function TodosView() {
  const {
    state,
    dispatch
  } = useVault();
  const [title, setTitle] = useState('');
  const [pri, setPri] = useState('med');
  const [due, setDue] = useState('');
  const [time, setTime] = useState('');
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState(null);
  const list = state.todos.filter(t => filter === 'all' ? true : filter === 'open' ? !t.done : t.done);
  return /*#__PURE__*/React.createElement("div", {
    className: "grid gap-3"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid md:grid-cols-[1fr_100px_130px_110px_auto] gap-2"
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "What needs doing?",
    value: title,
    onChange: e => setTitle(e.target.value)
  }), /*#__PURE__*/React.createElement(Select, {
    value: pri,
    onChange: e => setPri(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "low"
  }, "Low"), /*#__PURE__*/React.createElement("option", {
    value: "med"
  }, "Medium"), /*#__PURE__*/React.createElement("option", {
    value: "high"
  }, "High")), /*#__PURE__*/React.createElement(Input, {
    type: "date",
    value: due,
    onChange: e => setDue(e.target.value)
  }), /*#__PURE__*/React.createElement(Input, {
    type: "time",
    value: time,
    onChange: e => setTime(e.target.value)
  }), /*#__PURE__*/React.createElement(Btn, {
    onClick: () => {
      if (!title.trim()) return;
      dispatch({
        type: 'ADD_ITEM',
        key: 'todos',
        item: {
          id: uid(),
          title,
          priority: pri,
          due,
          time,
          done: false,
          createdAt: todayISO()
        }
      });
      setTitle('');
      setDue('');
      setTime('');
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus"
  }), "Add"))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 text-sm"
  }, ['all', 'open', 'done'].map(f => /*#__PURE__*/React.createElement("button", {
    key: f,
    onClick: () => setFilter(f),
    className: `px-3 py-1 rounded-full ${filter === f ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`
  }, f))), list.length === 0 && /*#__PURE__*/React.createElement(Empty, {
    icon: "check-square",
    text: "Nothing here."
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid gap-2"
  }, list.map(t => /*#__PURE__*/React.createElement(Card, {
    key: t.id,
    className: "p-3 flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: t.done,
    onChange: () => {
      const done = !t.done;
      dispatch({
        type: 'UPDATE_ITEM',
        key: 'todos',
        item: {
          ...t,
          done
        }
      });
      if (done) dispatch({
        type: 'ADD_XP',
        amount: 5
      });
    },
    className: "w-4 h-4 accent-brand-600"
  }), /*#__PURE__*/React.createElement("div", {
    className: 'flex-1 ' + (t.done ? 'line-through text-slate-400' : '')
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-medium"
  }, t.title), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-slate-500 flex gap-2"
  }, /*#__PURE__*/React.createElement(Chip, {
    tone: t.priority === 'high' ? 'rose' : t.priority === 'med' ? 'amber' : 'slate'
  }, t.priority), t.due && /*#__PURE__*/React.createElement("span", null, "Due ", t.due, " ", t.time || ''))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditing(t),
    className: "p-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pencil",
    size: 14
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => dispatch({
      type: 'REMOVE_ITEM',
      key: 'todos',
      id: t.id
    }),
    className: "text-rose-500 p-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash-2",
    size: 14
  }))))), /*#__PURE__*/React.createElement(Modal, {
    open: !!editing,
    onClose: () => setEditing(null),
    title: "Edit to-do"
  }, editing && /*#__PURE__*/React.createElement("div", {
    className: "grid gap-2"
  }, /*#__PURE__*/React.createElement(Input, {
    value: editing.title,
    onChange: e => setEditing({
      ...editing,
      title: e.target.value
    })
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2"
  }, /*#__PURE__*/React.createElement(Select, {
    value: editing.priority,
    onChange: e => setEditing({
      ...editing,
      priority: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: "low"
  }, "Low"), /*#__PURE__*/React.createElement("option", {
    value: "med"
  }, "Medium"), /*#__PURE__*/React.createElement("option", {
    value: "high"
  }, "High")), /*#__PURE__*/React.createElement(Input, {
    type: "date",
    value: editing.due || '',
    onChange: e => setEditing({
      ...editing,
      due: e.target.value
    })
  }), /*#__PURE__*/React.createElement(Input, {
    type: "time",
    value: editing.time || '',
    onChange: e => setEditing({
      ...editing,
      time: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2"
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    onClick: () => setEditing(null)
  }, "Cancel"), /*#__PURE__*/React.createElement(Btn, {
    onClick: () => {
      dispatch({
        type: 'UPDATE_ITEM',
        key: 'todos',
        item: editing
      });
      setEditing(null);
    }
  }, "Save")))));
}

/* ---------- Notes (subject/topic/subtopic + preview cards) ---------- */
function NotesView() {
  const {
    state,
    dispatch
  } = useVault();
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState({});
  const list = state.notes.filter(n => matchFilter(n, filter) && (!q || (n.title + ' ' + n.body + ' ' + (n.tags || []).join(' ')).toLowerCase().includes(q.toLowerCase())));
  return /*#__PURE__*/React.createElement("div", {
    className: "grid gap-3"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "p-3 grid gap-2"
  }, /*#__PURE__*/React.createElement(SubjectPicker, {
    value: filter,
    onChange: p => setFilter({
      ...filter,
      ...p
    }),
    allowEmpty: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Search notes...",
    value: q,
    onChange: e => setQ(e.target.value)
  }), /*#__PURE__*/React.createElement(Btn, {
    onClick: () => setEditing({
      id: uid(),
      title: '',
      body: '',
      tags: [],
      updated: todayISO(),
      ...filter
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus"
  }), "New"))), list.length === 0 && /*#__PURE__*/React.createElement(Empty, {
    icon: "notebook-pen",
    text: "No notes match."
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid md:grid-cols-2 lg:grid-cols-3 gap-3"
  }, list.map(n => /*#__PURE__*/React.createElement(Card, {
    key: n.id,
    className: "p-4 cursor-pointer hover:border-brand-400 transition group",
    onClick: () => setEditing(n)
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-semibold"
  }, n.title || 'Untitled'), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    className: "text-slate-300 group-hover:text-brand-600"
  })), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500 whitespace-pre-wrap line-clamp-4 mt-2 min-h-[3.5em]"
  }, n.body), /*#__PURE__*/React.createElement("div", {
    className: "mt-2 flex gap-1 flex-wrap"
  }, n.subjectId && /*#__PURE__*/React.createElement(Chip, {
    tone: "brand"
  }, subjectName(state, n.subjectId)), n.topicId && /*#__PURE__*/React.createElement(Chip, null, topicName(state, n.subjectId, n.topicId)), n.subtopicId && /*#__PURE__*/React.createElement(Chip, null, subtopicName(state, n.subjectId, n.topicId, n.subtopicId)), (n.tags || []).map(t => /*#__PURE__*/React.createElement(Chip, {
    key: t
  }, "#", t))), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-slate-400 mt-2"
  }, "Updated ", n.updated)))), editing && /*#__PURE__*/React.createElement(Modal, {
    open: true,
    onClose: () => setEditing(null),
    title: "Note",
    xl: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid gap-2"
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Title",
    value: editing.title,
    onChange: e => setEditing({
      ...editing,
      title: e.target.value
    })
  }), /*#__PURE__*/React.createElement(SubjectPicker, {
    value: editing,
    onChange: p => setEditing({
      ...editing,
      ...p
    }),
    allowEmpty: true
  }), /*#__PURE__*/React.createElement(TextArea, {
    rows: "14",
    placeholder: "Write here...",
    value: editing.body,
    onChange: e => setEditing({
      ...editing,
      body: e.target.value
    })
  }), /*#__PURE__*/React.createElement(Input, {
    placeholder: "tags (comma separated)",
    value: (editing.tags || []).join(', '),
    onChange: e => setEditing({
      ...editing,
      tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
    })
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between"
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "danger",
    onClick: () => {
      dispatch({
        type: 'REMOVE_ITEM',
        key: 'notes',
        id: editing.id
      });
      setEditing(null);
    }
  }, "Delete"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    onClick: () => setEditing(null)
  }, "Close"), /*#__PURE__*/React.createElement(Btn, {
    onClick: () => {
      const exists = state.notes.find(x => x.id === editing.id);
      const item = {
        ...editing,
        updated: todayISO()
      };
      if (exists) dispatch({
        type: 'UPDATE_ITEM',
        key: 'notes',
        item
      });else dispatch({
        type: 'ADD_ITEM',
        key: 'notes',
        item
      });
      setEditing(null);
    }
  }, "Save"))))));
}

/* ---------- Habits (edit) ---------- */
function HabitsView() {
  const {
    state,
    dispatch
  } = useVault();
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(null);
  function toggle(h) {
    const today = todayISO();
    const log = new Set(h.log || []);
    if (log.has(today)) log.delete(today);else {
      log.add(today);
      dispatch({
        type: 'ADD_XP',
        amount: 6
      });
    }
    dispatch({
      type: 'UPDATE_ITEM',
      key: 'habits',
      item: {
        ...h,
        log: [...log]
      }
    });
  }
  const days = useMemo(() => Array.from({
    length: 14
  }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().slice(0, 10);
  }), []);
  return /*#__PURE__*/React.createElement("div", {
    className: "grid gap-3"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "p-3 flex gap-2"
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "New habit (e.g. Read 20 pages)",
    value: name,
    onChange: e => setName(e.target.value)
  }), /*#__PURE__*/React.createElement(Btn, {
    onClick: () => {
      if (!name.trim()) return;
      dispatch({
        type: 'ADD_ITEM',
        key: 'habits',
        item: {
          id: uid(),
          name,
          log: []
        }
      });
      setName('');
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus"
  }), "Add")), state.habits.length === 0 && /*#__PURE__*/React.createElement(Empty, {
    icon: "repeat",
    text: "No habits yet."
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid gap-2"
  }, state.habits.map(h => /*#__PURE__*/React.createElement(Card, {
    key: h.id,
    className: "p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => toggle(h),
    className: `w-9 h-9 rounded-xl flex items-center justify-center ${h.log.includes(todayISO()) ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-medium"
  }, h.name), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500"
  }, h.log.length, " check-ins")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditing(h),
    className: "p-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pencil",
    size: 14
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => dispatch({
      type: 'REMOVE_ITEM',
      key: 'habits',
      id: h.id
    }),
    className: "text-rose-500 p-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash-2",
    size: 14
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 flex gap-1"
  }, days.map(d => {
    const on = h.log.includes(d);
    return /*#__PURE__*/React.createElement("div", {
      key: d,
      title: d,
      className: `flex-1 h-4 rounded ${on ? 'bg-emerald-500' : 'bg-slate-100 dark:bg-slate-800'}`
    });
  }))))), /*#__PURE__*/React.createElement(Modal, {
    open: !!editing,
    onClose: () => setEditing(null),
    title: "Edit habit"
  }, editing && /*#__PURE__*/React.createElement("div", {
    className: "grid gap-2"
  }, /*#__PURE__*/React.createElement(Input, {
    value: editing.name,
    onChange: e => setEditing({
      ...editing,
      name: e.target.value
    })
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2"
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    onClick: () => setEditing(null)
  }, "Cancel"), /*#__PURE__*/React.createElement(Btn, {
    onClick: () => {
      dispatch({
        type: 'UPDATE_ITEM',
        key: 'habits',
        item: editing
      });
      setEditing(null);
    }
  }, "Save")))));
}

/* ---------- Alarms ---------- */
function AlarmView() {
  const { state, dispatch } = useVault();
  const lang = state?.ui?.lang || 'bn';
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
        /*#__PURE__*/React.createElement("h2", { className: "text-lg font-semibold font-bn text-slate-900 dark:text-white" }, lang === "en" ? "Alarms" : "অ্যালার্ম"),
        /*#__PURE__*/React.createElement("p", { className: "text-xs text-slate-400 font-bn mt-0.5" }, lang === "en" ? "Study & routine reminder alarms" : "পড়াশোনা ও রুটিন অনুস্মারক অ্যালার্ম")
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
        lang === "en" ? "New Alarm" : "নতুন অ্যালার্ম"
      )
    ),

    /* Alarms List */
    state.alarms.length === 0 ? /*#__PURE__*/React.createElement(Empty, {
      icon: "alarm-clock",
      text: lang === "en" ? "No alarms configured." : "কোনো অ্যালার্ম সেট করা নেই।"
    }) : /*#__PURE__*/React.createElement("div", {
      className: "space-y-2.5"
    }, state.alarms.map(a => /*#__PURE__*/React.createElement(Card, {
      key: a.id,
      className: `p-4 rounded-xl border transition ${a.active ? 'border-slate-200 dark:border-slate-800' : 'opacity-60 border-slate-100 dark:border-slate-800/40'}`
    },
      /*#__PURE__*/React.createElement("div", { className: "flex items-center justify-between" },
        /* Time & Details */
        /*#__PURE__*/React.createElement("div", { className: "space-y-0.5" },
          /* Big clean time digits */
          /*#__PURE__*/React.createElement("div", {
            className: `text-3xl font-light font-mono tabular-nums tracking-tight ${a.active ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`
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
                className: `py-2 rounded-lg font-bn text-xs transition ${on ? 'bg-brand-600 text-white font-semibold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`
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
function TimerView() {
  const { state, dispatch } = useVault();
  const lang = state?.ui?.lang || 'bn';
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
              toast(`${work} মিনিটের ফোকাস সেশন সম্পন্ন!`, 'success');
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
        }, mode === 'work' ? (lang === 'en' ? 'Stay calm and deeply focused' : 'শান্ত থাকুন ও গভীর মনোযোগ ধরে রাখুন') : mode === 'break' ? (lang === 'en' ? 'Take a refreshing break' : 'বিরতি নিন') : (lang === 'en' ? 'Time is flowing' : 'সময় অতিবাহিত হচ্ছে'))
      ),
      /* Bottom: Quiet play/pause & reset controls */
      /*#__PURE__*/React.createElement("div", { className: "flex items-center justify-center gap-3" },
        mode === 'idle'
          ? /*#__PURE__*/React.createElement(Btn, { onClick: start, className: "px-8 py-3 text-sm font-bn font-semibold rounded-xl" }, lang === "en" ? "Start" : "শুরু করুন")
          : /*#__PURE__*/React.createElement(Btn, { variant: "outline", onClick: pause, className: "px-8 py-3 text-sm font-bn font-semibold rounded-xl" }, lang === "en" ? "Pause" : "বিরতি"),
        /*#__PURE__*/React.createElement(Btn, { variant: "ghost", onClick: stop, className: "px-6 py-3 text-sm font-bn rounded-xl text-slate-500" }, lang === "en" ? "Reset" : "রিসেট")
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
          className: `px-3 py-1.5 rounded-lg text-xs font-semibold font-bn transition ${timerType === 'pomodoro' ? 'bg-white dark:bg-slate-900 text-brand-700 dark:text-brand-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`
        }, lang === "en" ? "Pomodoro" : "পোমোডোরো"),
        /* Stopwatch */
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: () => { setTimerType('stopwatch'); setMode('idle'); setStopwatchSec(0); },
          className: `px-3 py-1.5 rounded-lg text-xs font-semibold font-bn transition ${timerType === 'stopwatch' ? 'bg-white dark:bg-slate-900 text-brand-700 dark:text-brand-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`
        }, lang === "en" ? "Stopwatch" : "স্টপওয়াচ")
      ),
      /* Zen toggle */
      /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: () => setZenMode(true),
        className: "px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5 transition"
      },
        /*#__PURE__*/React.createElement(Icon, { name: "maximize-2", size: 14 }),
        /*#__PURE__*/React.createElement("span", { className: "font-bn" }, lang === "en" ? "Zen Mode" : "জেন মোড")
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
          mode === 'work' ? (lang === 'en' ? 'Deep Focus' : 'পড়াশোনা চলছে') :
          mode === 'break' ? (lang === 'en' ? 'Break' : 'বিরতি চলছে') :
          mode === 'running' ? (lang === 'en' ? 'Stopwatch Active' : 'স্টপওয়াচ চলছে') : (lang === 'en' ? 'Focus Session' : 'ফোকাস সেশন')
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
        className: `px-3 py-1.5 rounded-lg border transition ${work === m ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-semibold' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`
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
          lang === "en" ? "Ambient Sounds" : "অ্যাম্বিয়েন্ট সাউন্ড"
        ),
        /*#__PURE__*/React.createElement("span", { className: "text-slate-400 text-[11px] font-mono" },
          sound === 'off' ? (lang === 'en' ? 'Off' : 'বন্ধ') : sound
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
          className: `py-2 rounded-lg border transition ${sound === 'off' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent font-medium' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`
        }, lang === "en" ? "Off" : "বন্ধ"),
        /* Focus */
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: () => pickSound('focus'),
          className: `py-2 rounded-lg border transition ${sound === 'focus' ? 'bg-brand-600 text-white border-transparent font-medium' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`
        }, lang === "en" ? "Focus" : "ফোকাস"),
        /* White */
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: () => pickSound('white'),
          className: `py-2 rounded-lg border transition ${sound === 'white' ? 'bg-brand-600 text-white border-transparent font-medium' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`
        }, lang === "en" ? "White" : "হোয়াইট"),
        /* Brown */
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: () => pickSound('brown'),
          className: `py-2 rounded-lg border transition ${sound === 'brown' ? 'bg-brand-600 text-white border-transparent font-medium' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`
        }, lang === "en" ? "Brown" : "ব্রাউন")
      )
    )
  );
}
function QuotesView() {
  const {
    state,
    dispatch
  } = useVault();
  const [text, setText] = useState('');
  const [bn, setBn] = useState('');
  const [en, setEn] = useState('');
  function bulk() {
    const items = text.split(/\n+/).map(l => l.trim()).filter(Boolean).map(l => {
      const [b, e] = l.split(/::|\|/).map(s => s?.trim());
      return {
        id: uid(),
        bn: b || l,
        en: e || ''
      };
    });
    if (!items.length) {
      toast('Nothing to add', 'error');
      return;
    }
    dispatch({
      type: 'ADD_MANY',
      key: 'quotes',
      items
    });
    setText('');
    toast(`Added ${items.length} quotes`, 'success');
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "grid gap-3 max-w-3xl"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-medium mb-2"
  }, "Add single quote"), /*#__PURE__*/React.createElement("div", {
    className: "grid gap-2"
  }, /*#__PURE__*/React.createElement(TextArea, {
    rows: "2",
    placeholder: "Bangla",
    value: bn,
    onChange: e => setBn(e.target.value)
  }), /*#__PURE__*/React.createElement(Input, {
    placeholder: "English (optional)",
    value: en,
    onChange: e => setEn(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end"
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: () => {
      if (!bn.trim()) return;
      dispatch({
        type: 'ADD_ITEM',
        key: 'quotes',
        item: {
          id: uid(),
          bn: bn.trim(),
          en: en.trim()
        }
      });
      setBn('');
      setEn('');
      toast('Added', 'success');
    }
  }, "Add")))), /*#__PURE__*/React.createElement(Card, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-medium mb-2"
  }, "Bulk paste"), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500 mb-2"
  }, "One per line. Optional English after ", /*#__PURE__*/React.createElement("code", null, "::"), "."), /*#__PURE__*/React.createElement(FormatBlock, {
    text: `স্বপ্ন সেটা নয় যা ঘুমিয়ে দেখো :: A dream is not what you see in sleep\nপরিশ্রমই সাফল্যের চাবিকাঠি :: Hard work is the key to success\nআজকের কষ্ট কালকের গৌরব`,
    label: "Quote format"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-2"
  }), /*#__PURE__*/React.createElement(TextArea, {
    rows: "6",
    value: text,
    onChange: e => setText(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end mt-2"
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: bulk
  }, "Bulk Add"))), /*#__PURE__*/React.createElement(Card, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-medium mb-2"
  }, "Your quotes (", state.quotes.length, ")"), state.quotes.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-slate-500"
  }, "No custom quotes yet — defaults will show on dashboard."), /*#__PURE__*/React.createElement("div", {
    className: "grid gap-2"
  }, state.quotes.map(q => /*#__PURE__*/React.createElement("div", {
    key: q.id,
    className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-start gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-bn"
  }, q.bn), q.en && /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500 italic"
  }, "\"", q.en, "\"")), /*#__PURE__*/React.createElement("button", {
    onClick: () => dispatch({
      type: 'REMOVE_ITEM',
      key: 'quotes',
      id: q.id
    }),
    className: "text-rose-500 p-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash-2",
    size: 14
  })))))));
}

/* ---------- Analytics ---------- */
function AnalyticsView() {
  const {
    state
  } = useVault();
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const c1Ref = useRef();
  const c2Ref = useRef();
  const c3Ref = useRef();
  useEffect(() => {
    const days = Array.from({
      length: 14
    }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      return d.toISOString().slice(0, 10);
    });
    const focusPerDay = days.map(d => state.timerSessions.filter(s => s.date === d).reduce((a, s) => a + (s.minutes || 0), 0));
    const attemptsPerDay = days.map(d => {
      const arr = state.attempts.filter(a => a.date === d);
      if (arr.length === 0) return 0;
      const total = arr.reduce((a, x) => a + x.total, 0);
      const score = arr.reduce((a, x) => a + x.score, 0);
      return total ? Math.round(score / total * 100) : 0;
    });
    const habitPerDay = days.map(d => state.habits.reduce((a, h) => a + (h.log?.includes(d) ? 1 : 0), 0));
    [c1Ref, c2Ref, c3Ref].forEach(r => {
      if (r.current) {
        r.current.destroy();
        r.current = null;
      }
    });
    const opts = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 0,
            autoSkip: true
          }
        }
      }
    };
    c1Ref.current = new Chart(ref1.current, {
      type: 'line',
      data: {
        labels: days,
        datasets: [{
          label: 'Focus min',
          data: focusPerDay,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99,102,241,.15)',
          fill: true,
          tension: .35
        }]
      },
      options: opts
    });
    c2Ref.current = new Chart(ref2.current, {
      type: 'bar',
      data: {
        labels: days,
        datasets: [{
          label: 'Accuracy %',
          data: attemptsPerDay,
          backgroundColor: '#10b981'
        }]
      },
      options: opts
    });
    c3Ref.current = new Chart(ref3.current, {
      type: 'bar',
      data: {
        labels: days,
        datasets: [{
          label: 'Habits',
          data: habitPerDay,
          backgroundColor: '#f59e0b'
        }]
      },
      options: opts
    });
    return () => {
      [c1Ref, c2Ref, c3Ref].forEach(r => {
        if (r.current) {
          r.current.destroy();
          r.current = null;
        }
      });
    };
  }, [state]);
  // Weekly + monthly reports
  const now = new Date();
  const wk = weekKey(now),
    mo = monthKey(now);
  const inRange = (dateStr, from) => dateStr && dateStr >= from;
  const weekAttempts = state.attempts.filter(a => inRange(a.date, wk));
  const monthAttempts = state.attempts.filter(a => a.date && a.date.startsWith(mo));
  const stat = arr => {
    const total = arr.reduce((a, x) => a + x.total, 0);
    const score = arr.reduce((a, x) => a + x.score, 0);
    return {
      exams: arr.length,
      questions: total,
      avg: total ? Math.round(score / total * 100) : 0
    };
  };
  const wStat = stat(weekAttempts),
    mStat = stat(monthAttempts);

  // Badges
  const badges = [];
  const totalXP = state.profile.xp + (state.profile.level - 1) * 100;
  if (state.profile.streak >= 7) badges.push({
    name: 'সাপ্তাহিক যোদ্ধা / Weekly Warrior',
    desc: '7-day streak',
    icon: 'flame'
  });
  if (state.profile.streak >= 30) badges.push({
    name: '৩০ দিনের রাজা / 30-day King',
    desc: '30-day streak',
    icon: 'crown'
  });
  const weekend = state.attempts.filter(a => {
    const d = new Date(a.date);
    return d.getDay() === 0 || d.getDay() === 6;
  }).length;
  if (weekend >= 5) badges.push({
    name: 'Weekend Master',
    desc: '5+ weekend exams',
    icon: 'trophy'
  });
  if (mStat.exams >= 20) badges.push({
    name: monthName(mo) + ' King',
    desc: '20+ exams this month',
    icon: 'award'
  });
  if (state.mcqs.length >= 100) badges.push({
    name: 'Century',
    desc: '100+ MCQs stored',
    icon: 'library'
  });
  if (totalXP >= 1000) badges.push({
    name: 'XP Titan',
    desc: '1000 XP earned',
    icon: 'zap'
  });

  // Exam history grouped by subject
  const bySub = {};
  state.attempts.forEach(a => {
    const k = a.filter?.subjectId || 'mixed';
    (bySub[k] = bySub[k] || []).push(a);
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "grid gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid md:grid-cols-3 gap-4"
  }, /*#__PURE__*/React.createElement(StatBig, {
    label: "Total XP",
    value: totalXP,
    icon: "zap"
  }), /*#__PURE__*/React.createElement(StatBig, {
    label: "MCQ Attempts",
    value: state.attempts.length,
    icon: "list-checks"
  }), /*#__PURE__*/React.createElement(StatBig, {
    label: "Focus Minutes",
    value: state.timerSessions.reduce((a, s) => a + (s.minutes || 0), 0),
    icon: "timer"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid md:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-medium mb-2"
  }, "This week"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2 text-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold"
  }, wStat.exams), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500"
  }, "Exams")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold"
  }, wStat.questions), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500"
  }, "Questions")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold"
  }, wStat.avg, "%"), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500"
  }, "Avg score")))), /*#__PURE__*/React.createElement(Card, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-medium mb-2"
  }, monthName(mo)), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2 text-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold"
  }, mStat.exams), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500"
  }, "Exams")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold"
  }, mStat.questions), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500"
  }, "Questions")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold"
  }, mStat.avg, "%"), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500"
  }, "Avg score"))))), /*#__PURE__*/React.createElement(Card, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-medium mb-3"
  }, "Badges"), badges.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500"
  }, "Keep going — badges unlock as you build streaks and take exams."), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, badges.map(b => /*#__PURE__*/React.createElement("div", {
    key: b.name,
    className: "flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-brand-50 to-brand-50 dark:from-brand-950/40 dark:to-brand-950/40 border border-brand-200 dark:border-brand-800"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: b.icon,
    size: 18
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-medium"
  }, b.name), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-slate-500"
  }, b.desc)))))), /*#__PURE__*/React.createElement(Card, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-medium mb-2"
  }, "Exam history by subject"), Object.keys(bySub).length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500"
  }, "No exams yet."), /*#__PURE__*/React.createElement("div", {
    className: "grid gap-2"
  }, Object.entries(bySub).map(([sid, arr]) => {
    const sub = state.subjects.find(s => s.id === sid);
    const name = sub ? sub.name : 'Mixed';
    const s = stat(arr);
    return /*#__PURE__*/React.createElement("div", {
      key: sid,
      className: "flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-sm font-medium"
    }, name), /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-slate-500"
    }, s.exams, " exams · ", s.questions, " Qs · ", s.avg, "% avg"));
  }))), /*#__PURE__*/React.createElement(Card, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-medium mb-2"
  }, "Focus (last 14 days)"), /*#__PURE__*/React.createElement("div", {
    className: "h-56"
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: ref1
  }))), /*#__PURE__*/React.createElement(Card, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-medium mb-2"
  }, "Quiz accuracy (%)"), /*#__PURE__*/React.createElement("div", {
    className: "h-56"
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: ref2
  }))), /*#__PURE__*/React.createElement(Card, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-medium mb-2"
  }, "Habit check-ins"), /*#__PURE__*/React.createElement("div", {
    className: "h-56"
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: ref3
  }))));
}
function StatBig({
  label,
  value,
  icon
}) {
  return /*#__PURE__*/React.createElement(Card, {
    className: "p-4 flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold"
  }, value)));
}

/* ---------- Empty ---------- */
function Empty({
  icon,
  text
}) {
  return /*#__PURE__*/React.createElement(Card, {
    className: "p-10 text-center text-slate-400"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mx-auto w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon
  })), /*#__PURE__*/React.createElement("div", null, text));
}

/* ---------- Settings ---------- */
function SettingsView() {
  const {
    state,
    dispatch
  } = useVault();
  const lang = state?.ui?.lang || 'bn';
  const p = state.profile;

  function exportJSON() {
    const fname = `sonkolpo-os-backup-${todayISO()}.json`;
    const jsonStr = JSON.stringify(state, null, 2);
    if (window.NativeBridge && window.NativeBridge.exportFile) {
      window.NativeBridge.exportFile(fname, jsonStr)
        .then(where => toast('ফাইল ম্যানেজারে সেভ হয়েছে: ' + where, 'success'))
        .catch(() => {
          fallbackDownload(fname, jsonStr);
        });
      return;
    }
    fallbackDownload(fname, jsonStr);
  }

  function fallbackDownload(fname, dataStr) {
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fname;
    a.click();
    URL.revokeObjectURL(url);
    toast('ব্যাকআপ ফাইল ডাউনলোড হয়েছে', 'success');
  }

  function importJSON(e) {
    const file = e.target.files && e.target.files[0];
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

  function handleResetAll() {
    if (window.confirm('আপনি কি নিশ্চিত যে সমস্ত ডাটা মুছে ফেলে প্রাথমিক অবস্থায় ফেরত যেতে চান?')) {
      dispatch({ type: 'RESET' });
      toast('সমস্ত ডাটা রিসেট করা হয়েছে', 'info');
    }
  }

  const notif = state.ui.notif || { popup: true, beep: true };

  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 max-w-xl mx-auto pb-12"
  },
    /* Minimal Header */
    /*#__PURE__*/React.createElement("div", { className: "border-b border-slate-200/80 dark:border-slate-800 pb-3" },
      /*#__PURE__*/React.createElement("h2", { className: "text-lg font-semibold font-bn text-slate-900 dark:text-white" }, lang === "en" ? "Settings" : "সেটিংস"),
      /*#__PURE__*/React.createElement("p", { className: "text-xs text-slate-400 font-bn mt-0.5" }, lang === "en" ? "Profile, theme, and backup management." : "প্রোফাইল, থিম এবং ব্যাকআপ ব্যবস্থাপনা।")
    ),

    /* 1. Profile */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-4 space-y-3"
    },
      /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2 text-sm font-semibold font-bn text-slate-800 dark:text-slate-200" },
        /*#__PURE__*/React.createElement(Icon, { name: "user", size: 16 }),
        lang === "en" ? "Student Profile" : "শিক্ষার্থীর পরিচিতি"
      ),
      /*#__PURE__*/React.createElement("div", { className: "space-y-2 pt-1 font-bn" },
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("label", { className: "text-[11px] text-slate-400 mb-1 block" }, "নাম"),
          /*#__PURE__*/React.createElement(Input, {
            placeholder: "যেমন: মোঃ ওয়াদুদ হোসেন",
            value: p.name || '',
            onChange: e => dispatch({
              type: 'SET_PROFILE',
              patch: { name: e.target.value }
            })
          })
        ),
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("label", { className: "text-[11px] text-slate-400 mb-1 block" }, "লক্ষ্য / টার্গেট"),
          /*#__PURE__*/React.createElement(Input, {
            placeholder: "যেমন: বুয়েট ও মেডিকেল ভর্তি ২০২৬",
            value: p.target || '',
            onChange: e => dispatch({
              type: 'SET_PROFILE',
              patch: { target: e.target.value }
            })
          })
        )
      )
    ),

    /* 2. Appearance & Language */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-4 space-y-3"
    },
      /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2 text-sm font-semibold font-bn text-slate-800 dark:text-slate-200" },
        /*#__PURE__*/React.createElement(Icon, { name: "sun-moon", size: 16 }),
        lang === "en" ? "Appearance & Language" : "রূপরেখা ও ভাষা"
      ),
      /*#__PURE__*/React.createElement("div", { className: "grid grid-cols-2 gap-2.5 pt-1" },
        /* Light/Dark Toggle */
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: () => dispatch({ type: 'SET_UI', patch: { theme: state.ui.theme === 'dark' ? 'light' : 'dark' } }),
          className: "p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 flex items-center justify-center gap-2 text-xs font-semibold font-bn text-slate-700 dark:text-slate-300 transition"
        },
          /*#__PURE__*/React.createElement(Icon, { name: state.ui.theme === 'dark' ? 'sun' : 'moon', size: 15 }),
          state.ui.theme === 'dark' ? (lang === 'en' ? 'Light Mode' : 'লাইট মোড') : (lang === 'en' ? 'Dark Mode' : 'ডার্ক মোড')
        ),
        /* Lang Toggle */
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: () => dispatch({ type: 'SET_UI', patch: { lang: state.ui.lang === 'bn' ? 'en' : 'bn' } }),
          className: "p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 flex items-center justify-center gap-2 text-xs font-semibold font-bn text-slate-700 dark:text-slate-300 transition"
        },
          /*#__PURE__*/React.createElement(Icon, { name: "languages", size: 15 }),
          state.ui.lang === 'bn' ? 'English' : 'বাংলা'
        )
      )
    ),

    /* 3. Notifications */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-4 space-y-2.5"
    },
      /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2 text-sm font-semibold font-bn text-slate-800 dark:text-slate-200" },
        /*#__PURE__*/React.createElement(Icon, { name: "bell", size: 16 }),
        lang === "en" ? "Notifications & Alarms" : "নোটিফিকেশন ও অ্যালার্ম"
      ),
      /*#__PURE__*/React.createElement("div", { className: "space-y-2 pt-1 font-bn" },
        /*#__PURE__*/React.createElement("label", {
          className: "flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
        },
          /*#__PURE__*/React.createElement("span", { className: "text-xs text-slate-700 dark:text-slate-300" }, lang === "en" ? "Popup Notifications" : "পপআপ নোটিফিকেশন"),
          /*#__PURE__*/React.createElement("input", {
            type: "checkbox",
            checked: notif.popup,
            onChange: e => dispatch({
              type: 'SET_NOTIF',
              patch: { popup: e.target.checked }
            }),
            className: "w-4 h-4 accent-brand-600 rounded"
          })
        ),
        /*#__PURE__*/React.createElement("label", {
          className: "flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
        },
          /*#__PURE__*/React.createElement("span", { className: "text-xs text-slate-700 dark:text-slate-300" }, lang === "en" ? "Alarm & Reminder Sound" : "অ্যালার্ম ও রিমাইন্ডার সাউন্ড"),
          /*#__PURE__*/React.createElement("input", {
            type: "checkbox",
            checked: notif.beep,
            onChange: e => dispatch({
              type: 'SET_NOTIF',
              patch: { beep: e.target.checked }
            }),
            className: "w-4 h-4 accent-brand-600 rounded"
          })
        )
      )
    ),

    /* 4. Backup & Storage */
    /*#__PURE__*/React.createElement(Card, {
      className: "p-4 space-y-3"
    },
      /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2 text-sm font-semibold font-bn text-slate-800 dark:text-slate-200" },
        /*#__PURE__*/React.createElement(Icon, { name: "folder-archive", size: 16 }),
        lang === "en" ? "Backup & Restore" : "ব্যাকআপ ও রিস্টোর"
      ),
      /*#__PURE__*/React.createElement("div", { className: "flex flex-wrap gap-2.5 pt-1 font-bn" },
        /* Export Backup */
        /*#__PURE__*/React.createElement(Btn, {
          onClick: exportJSON,
          className: "text-xs px-3.5 py-2 font-medium"
        },
          /*#__PURE__*/React.createElement(Icon, { name: "download", size: 14 }),
          lang === "en" ? "Export Backup (.json)" : "ব্যাকআপ এক্সপোর্ট (.json)"
        ),
        /* Import Backup */
        /*#__PURE__*/React.createElement("label", {
          className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium cursor-pointer transition shadow-sm"
        },
          /*#__PURE__*/React.createElement(Icon, { name: "upload", size: 14 }),
          lang === "en" ? "Import Backup" : "ব্যাকআপ ইমপোর্ট",
          /*#__PURE__*/React.createElement("input", {
            type: "file",
            accept: ".json",
            className: "hidden",
            onChange: importJSON
          })
        )
      ),
      /* Reset */
      /*#__PURE__*/React.createElement("div", { className: "pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end" },
        /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: handleResetAll,
          className: "text-xs text-rose-500 hover:text-rose-600 font-bn font-medium hover:underline"
        }, lang === "en" ? "Reset All Data" : "সব ডাটা রিসেট করুন")
      )
    ),

    /* Minimalist Footer */
    /*#__PURE__*/React.createElement("div", {
      className: "text-center pt-2 text-[11px] text-slate-400 font-bn"
    }, BRAND, " · v4.0 · ", CREDIT)
  );
}
/* ---------- Root ---------- */
function App() {
  const [phase, setPhase] = useState('splash');
  return /*#__PURE__*/React.createElement(VaultProvider, null, /*#__PURE__*/React.createElement(AppInner, {
    phase: phase,
    setPhase: setPhase
  }));
}
function AppInner({
  phase,
  setPhase
}) {
  const {
    state
  } = useVault();
  if (phase === 'splash') return /*#__PURE__*/React.createElement(Splash, {
    onDone: () => setPhase(state.ui.tourDone ? 'app' : 'onboard')
  });
  if (phase === 'onboard') return /*#__PURE__*/React.createElement(Onboarding, {
    onDone: () => setPhase('app')
  });
  return /*#__PURE__*/React.createElement(Shell, null);
}
let mountAttempts = 0;
function mountApp() {
  const el = document.getElementById('root');
  if (!el) return;
  const _RDM = (typeof window !== 'undefined' && window.ReactDOM) ? window.ReactDOM : (typeof ReactDOM !== 'undefined' && ReactDOM.createRoot ? ReactDOM : null);
  const _R = (typeof window !== 'undefined' && window.React) ? window.React : (typeof React !== 'undefined' && React.createElement ? React : null);
  if (!_RDM || !_R) {
    if (mountAttempts++ < 60) {
      setTimeout(mountApp, 50);
    }
    return;
  }
  window.React = _R;
  window.ReactDOM = _RDM;
  React = _R;
  ReactDOM = _RDM;
  try {
    const root = _RDM.createRoot(el);
    root.render(_R.createElement(App, null));
  } catch (err) {
    console.error('Failed to mount সংকল্প OS:', err);
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}