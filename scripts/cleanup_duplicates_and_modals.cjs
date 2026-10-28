const fs = require('fs');

const appPath = 'public/app.js';
let content = fs.readFileSync(appPath, 'utf8');

// 1. Remove duplicate Flashcard block (lines ~3938 through 4416)
const secondFlashTileIdx = content.lastIndexOf('function FlashTile({ c, subject, onEdit, onDelete }) {');
const infoSectionIdx = content.indexOf('/* ---------- Information ---------- */');

if (secondFlashTileIdx !== -1 && infoSectionIdx !== -1 && secondFlashTileIdx < infoSectionIdx) {
  content = content.slice(0, secondFlashTileIdx) + content.slice(infoSectionIdx);
  console.log('Successfully stripped out duplicate FlashTile / FlashList / BulkFlash / StudyRunner block!');
} else {
  console.log('Could not find duplicate block bounds: secondFlashTileIdx=' + secondFlashTileIdx + ', infoSectionIdx=' + infoSectionIdx);
}

// 2. Fix Modal half-screen bug
const oldModalStart = content.indexOf('function Modal({');
const audioSectionStart = content.indexOf('/* ---------- Audio Engine');

if (oldModalStart !== -1 && audioSectionStart !== -1) {
  const newModal = `function Modal({
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

`;
  content = content.slice(0, oldModalStart) + newModal + content.slice(audioSectionStart);
  console.log('Successfully upgraded Modal component with responsive items-start/center and 100dvh bounding');
}

// 3. Compact FormatBlock and TextAreas in bulk modals
content = content.replace(
  'className: "p-3 pr-16 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs overflow-auto whitespace-pre-wrap"',
  'className: "p-2.5 pr-14 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs overflow-auto whitespace-pre-wrap max-h-24 scrollbar-thin"'
);

content = content.replace(
  'function BulkSchedule({\n  onDone\n}) {\n  const [text, setText] = useState(\'\');',
  'function BulkSchedule({\n  onDone\n}) {\n  const [text, setText] = useState(\'\');'
);

// Reduce bulk rows from 10 to 5 so modals fit on all phones
content = content.replace(/rows:\s*["']10["']/g, 'rows: "5"');

// Ensure all rounded-3xl are replaced
content = content.replace(/rounded-3xl/g, 'rounded-2xl');

fs.writeFileSync(appPath, content, 'utf8');
console.log('Applied cleanup and mobile fixes to public/app.js');
