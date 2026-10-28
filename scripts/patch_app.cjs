const fs = require('fs');

console.log('Reading public/app.js...');
let code = fs.readFileSync('public/app.js', 'utf8');

// 1. Update DEFAULT_STATE
const oldDefaultState = `const DEFAULT_STATE = {
  profile: {
    name: '',
    xp: 0,
    level: 1,
    streak: 0,
    shield: false,
    lastActive: ''
  },`;

const newDefaultState = `const DEFAULT_STATE = {
  profile: {
    name: '',
    xp: 0,
    level: 1,
    streak: 0,
    shield: false,
    lastActive: '',
    cardMode: 'auto', // 'auto' (automatic reward) | 'custom'
    cardColor: 'emerald', // emerald, mint, obsidian, royal, burgundy, amethyst, ocean, gold, platinum
    streakSavers: 2, // 2 streak savers per month
    streakSaversUsed: 0,
    lastGoldMonth: '',
    previousTier: 'emerald',
    demotedAlert: false,
  },
  levelUpModal: null, // { title, tierName, color, rewardMsg, level }`;

if (code.includes(oldDefaultState)) {
  code = code.replace(oldDefaultState, newDefaultState);
  console.log('Patched DEFAULT_STATE');
} else {
  console.warn('Could not find oldDefaultState pattern');
}

// 2. Add Reducer cases for card prefs and level up
const oldReducer = `function vaultReducer(state, action) {
  switch (action.type) {`;

const newReducer = `function vaultReducer(state, action) {
  switch (action.type) {
    case 'SET_CARD_PREF': {
      const profile = { ...state.profile, ...(action.patch || {}) };
      return { ...state, profile };
    }
    case 'USE_STREAK_SAVER': {
      if (state.profile.streakSavers <= 0) return state;
      const profile = {
        ...state.profile,
        streakSavers: state.profile.streakSavers - 1,
        streakSaversUsed: (state.profile.streakSaversUsed || 0) + 1,
        streak: (state.profile.streak || 0) + 1,
        lastActive: todayISO()
      };
      return { ...state, profile };
    }
    case 'CLEAR_LEVELUP_MODAL': {
      return { ...state, levelUpModal: null };
    }
    case 'DISMISS_DEMOTED_ALERT': {
      return { ...state, profile: { ...state.profile, demotedAlert: false } };
    }`;

if (code.includes(oldReducer)) {
  code = code.replace(oldReducer, newReducer);
  console.log('Patched vaultReducer');
} else {
  console.warn('Could not find oldReducer pattern');
}

// 3. Fix Modal component to use ReactDOM.createPortal and prevent half-screen cut off
const oldModalRegex = /function Modal\(\{\s*open,\s*onClose,\s*title,\s*children,\s*wide,\s*xl\s*\}\)\s*\{[\s\S]*?className:\s*\"p-5\"\s*\}, children\)\)\);?\s*\}/;

const newModalCode = `function Modal({
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
    className: "fixed inset-0 z-[9999] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto overscroll-contain animate-fadeIn",
    onClick: onClose,
    style: { touchAction: 'pan-y' }
  }, /*#__PURE__*/React.createElement("div", {
    className: 'bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 w-full my-auto flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden animate-pop ' + w,
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur z-10"
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
    className: "p-4 sm:p-5 overflow-y-auto flex-1 scrollbar-thin overscroll-contain"
  }, children)));

  if (typeof document !== 'undefined' && document.body && ReactDOM.createPortal) {
    return ReactDOM.createPortal(modalVNode, document.body);
  }
  return modalVNode;
}`;

if (oldModalRegex.test(code)) {
  code = code.replace(oldModalRegex, newModalCode);
  console.log('Patched Modal component with createPortal and flexible height');
} else {
  console.warn('Could not match oldModalRegex');
}

fs.writeFileSync('public/app.js', code, 'utf8');
console.log('Saved preliminary patch to public/app.js');
