const fs = require('fs');

console.log('Building upgraded Sonkolpo OS v4 script...');

// Read the existing public/app.js
const appJsPath = 'public/app.js';
let src = fs.readFileSync(appJsPath, 'utf8');

// Ensure DEFAULT_STATE has all new credit card, gamification, and streak saver fields
if (!src.includes('cardMode:')) {
  src = src.replace(/profile:\s*\{[\s\S]*?lastActive:\s*''\s*\}/, `profile: {
    name: '',
    xp: 0,
    level: 1,
    streak: 0,
    shield: false,
    lastActive: '',
    cardMode: 'auto', // 'auto' | 'custom'
    cardColor: 'emerald', // emerald, mint, obsidian, royal, burgundy, amethyst, ocean, gold, platinum
    streakSavers: 2,
    streakSaversUsed: 0,
    lastGoldMonth: '',
    previousTier: 'emerald',
    demotedAlert: false
  },
  levelUpModal: null`);
}

// Ensure reducer handles SET_CARD_PREF, USE_STREAK_SAVER, CLEAR_LEVELUP_MODAL, DISMISS_DEMOTED_ALERT
if (!src.includes('SET_CARD_PREF')) {
  src = src.replace(/switch\s*\(\s*action\.type\s*\)\s*\{/, `switch (action.type) {
    case 'SET_CARD_PREF': {
      return {
        ...state,
        profile: {
          ...state.profile,
          ...(action.patch || {})
        }
      };
    }
    case 'USE_STREAK_SAVER': {
      if ((state.profile.streakSavers || 0) <= 0) return state;
      return {
        ...state,
        profile: {
          ...state.profile,
          streakSavers: Math.max(0, (state.profile.streakSavers || 2) - 1),
          streakSaversUsed: (state.profile.streakSaversUsed || 0) + 1,
          streak: (state.profile.streak || 0) + 1,
          lastActive: todayISO()
        }
      };
    }
    case 'TRIGGER_LEVELUP_MODAL': {
      return { ...state, levelUpModal: action.modal };
    }
    case 'CLEAR_LEVELUP_MODAL': {
      return { ...state, levelUpModal: null };
    }
    case 'DISMISS_DEMOTED_ALERT': {
      return {
        ...state,
        profile: {
          ...state.profile,
          demotedAlert: false
        }
      };
    }`);
}

fs.writeFileSync(appJsPath, src, 'utf8');
console.log('Base reducer & state updated in public/app.js');
