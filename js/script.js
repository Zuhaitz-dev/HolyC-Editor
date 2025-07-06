// 1. Define static data and helper functions.
const holyCKeywords = ['U0','I8','U8','I16','U16','I32','U32','I64','U64','F64','Bool','class','union','extern','public','asm','const','static','inline','sizeof','break','case','continue','default','do','else','for','goto','if','return','switch','while','try','catch','throw','NULL','TRUE','FALSE','ON','OFF','MOV','CALL','PUSH','LEAVE','RET','SUB','ADD','CMP','JMP','INC','RAX','RCX','RDX','RBX','RSP','RBP','RSI','RDI','Print','Warning','StrNew','DocNew','DocPrint','HolyC'];
const holyCSnippets = [{displayText:"main",text:"I32 main() {\n\t@@CURSOR@@\n\n\treturn 0;\n}"},{displayText:"if",text:"if (@@CURSOR@@) {\n\n}"},{displayText:"else",text:"else {\n\t@@CURSOR@@\n}"},{displayText:"elseif",text:"else if (@@CURSOR@@) {\n\n}"},{displayText:"for",text:"for (I64 i = 0; i < @@CURSOR@@; i++) {\n\n}"},{displayText:"while",text:"while (@@CURSOR@@) {\n\n}"},{displayText:"do",text:"do {\n\t@@CURSOR@@\n} while ();"},{displayText:"switch",text:"switch (@@CURSOR@@) {\n\tcase :\n\t\tbreak;\n\tdefault:\n\t\tbreak;\n}"},{displayText:"func",text:"U0 MyFunction() {\n\t@@CURSOR@@\n}"},{displayText:"class",text:"class MyClass {\n\t@@CURSOR@@\n};"},{displayText:"union",text:"union MyUnion {\n\t@@CURSOR@@\n};"},{displayText:"try",text:"try {\n\t@@CURSOR@@\n} catch {\n\n}"},{displayText:"#include",text:'#include "@@CURSOR@@"'}];
function holyCHint(editor) {const cursor = editor.getCursor();const token = editor.getTokenAt(cursor);const start = token.start;const end = cursor.ch;const currentWord = token.string.trim();if (currentWord === "") return;let list = [];const addedHints = new Set();holyCSnippets.forEach(snippet => {if (snippet.displayText.toLowerCase().startsWith(currentWord.toLowerCase())) {const hintObj = {text: snippet.text,displayText: `${snippet.displayText} ...`,className: 'snippet-hint',hint: function(cm, data, completion) {const from = completion.from || data.from;let text = completion.text;const cursorPlaceholder = "@@CURSOR@@";const cursorIndex = text.indexOf(cursorPlaceholder);text = text.replace(cursorPlaceholder, "");cm.replaceRange(text, from, { line: from.line, ch: from.ch + currentWord.length });if (cursorIndex > -1) {const lines = text.substring(0, cursorIndex).split('\n');const line = from.line + lines.length - 1;const ch = lines.length === 1 ? from.ch + cursorIndex : lines[lines.length - 1].length;cm.setCursor({ line, ch });}}};list.push(hintObj);addedHints.add(snippet.displayText);}});holyCKeywords.forEach(keyword => {if (keyword.toLowerCase().startsWith(currentWord.toLowerCase()) && !addedHints.has(keyword)) {list.push(keyword);addedHints.add(keyword);}});const anywordHints = CodeMirror.hint.anyword(editor).list || [];anywordHints.forEach(word => {if (word.toLowerCase().startsWith(currentWord.toLowerCase()) && !addedHints.has(word)) {list.push(word);addedHints.add(word);}});return { list: list, from: CodeMirror.Pos(cursor.line, start), to: CodeMirror.Pos(cursor.line, end) };}

// 2. Define the custom language mode.
CodeMirror.defineSimpleMode("holyc", { start: [{ regex: /\/\/.*/, token: "comment" }, { regex: /\/\*/, token: "comment", next: "comment" }, { regex: /^\s*#\s*\w+/, token: "meta" }, { regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string" }, { regex: /'(?:[^\\]|\\.)*?(?:'|$)/, token: "string" }, { regex: /\b(U0|I8|U8|I16|U16|I32|U32|I64|U64|F64|Bool|class|union|DU8|DU16|DU32|DU64)\b/, token: "type" }, { regex: /\b(break|case|continue|default|do|else|for|goto|if|return|switch|while|throw|try|catch|extern|public|asm|const|static|inline|sizeof)\b/, token: "keyword" }, { regex: /\b(MOV|CALL|PUSH|LEAVE|RET|SUB|SHR|ADD|RETF|CMP|JNE|BTS|INT|XOR|JC|JZ|LOOP|POP|TEST|SHL|ADC|SBB|JMP|INC)\b/, token: "builtin" }, { regex: /\b(RAX|RCX|RDX|RBX|RSP|RBP|RSI|RDI|EAX|ECX|EDX|EBX|ESP|EBP|ESI|EDI|AX|CX|DX|BX|SP|BP|SI|DI|SS|CS|DS|ES|FS|GS|CH)\b/, token: "variable-2" }, { regex: /\b(NULL|TRUE|FALSE|ON|OFF)\b/, token: "atom" }, { regex: /\b(?:0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?)\b/i, token: "number" }, { regex: /[a-zA-Z_]\w*/, token: "variable" }, { regex: /[-+/*=<>!&|~^%]+/, token: "operator" }, { regex: /[{}()\[\],;.]/, token: "punctuation" }], comment: [{ regex: /.*?\*\//, token: "comment", next: "start" }, { regex: /.*/, token: "comment" }], meta: { electricChars: "}" }});

// 3. Get DOM elements and saved theme.
const themeSelector = document.getElementById('theme-selector');
const savedTheme = localStorage.getItem('holyc-editor-theme') || 'material-darker';
const filenameInput = document.getElementById('filename-input');
themeSelector.value = savedTheme;

// Status Bar elements
const statusLineCol = document.getElementById('status-line-col');
const statusTotalLines = document.getElementById('status-total-lines');
const statusCharCount = document.getElementById('status-char-count');

// 4. Initialize the editor.
var editor = CodeMirror.fromTextArea(document.getElementById("holyc-editor"), {
    mode: "holyc", theme: savedTheme, lineNumbers: true, 
    autofocus: true, matchBrackets: true, autoCloseBrackets: true,
    hintOptions: { hint: holyCHint },
    extraKeys: { "Ctrl-Space": "autocomplete" }
});

// 5. Save/Load and Unsaved Changes Logic
function saveEditorState() {
    localStorage.setItem('holyc-editor-code', editor.getValue());
    localStorage.setItem('holyc-editor-filename', filenameInput.value);
    document.body.classList.remove('has-unsaved-changes');
}

function loadEditorState() {
    const savedCode = localStorage.getItem('holyc-editor-code');
    const savedFilename = localStorage.getItem('holyc-editor-filename');
    if (savedCode !== null) { editor.setValue(savedCode); }
    if (savedFilename !== null) { filenameInput.value = savedFilename; }
}

loadEditorState();

// 6. Theme switcher logic.
themeSelector.addEventListener('change', (event) => {
    const newTheme = event.target.value;
    editor.setOption("theme", newTheme);
    document.body.className = 'theme-' + newTheme.replace(' ', '-');
    localStorage.setItem('holyc-editor-theme', newTheme);
});

// 7. Status Bar Logic
function updateStatusBar() {
    const cursor = editor.getCursor();
    statusLineCol.textContent = `Ln ${cursor.line + 1}, Col ${cursor.ch + 1}`;
    const lineCount = editor.lineCount();
    statusTotalLines.textContent = `${lineCount} Lines`;
    const charCount = editor.getValue().length;
    statusCharCount.textContent = `${charCount} Chars`;
}
editor.on("cursorActivity", updateStatusBar);
editor.on("change", updateStatusBar);
updateStatusBar();

// 8. Attach other event listeners.
document.getElementById('format-button').addEventListener('click', () => { const currentCode = editor.getValue(); const cursorPos = editor.getCursor(); const options = { indent_size: 4, space_in_empty_paren: true, brace_style: 'expand' }; editor.setValue(js_beautify(currentCode, options)); editor.setCursor(cursorPos); });

const fileInput = document.getElementById('file-input');
document.getElementById('upload-button').addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (event) => { 
    const file = event.target.files[0]; 
    if (file) { 
        const reader = new FileReader(); 
        reader.onload = (e) => {
            editor.setValue(e.target.result);
            filenameInput.value = file.name.replace(/\.(hc|HC)$/, '');
        }; 
        reader.readAsText(file); 
    } 
});

document.getElementById('download-button').addEventListener('click', () => {
    const code = editor.getValue(); 
    const tempLink = document.createElement('a'); 
    const blob = new Blob([code], { type: 'text/plain' }); 
    tempLink.href = URL.createObjectURL(blob); 
    const filename = filenameInput.value || 'untitled';
    tempLink.download = `${filename}.HC`; 
    document.body.appendChild(tempLink); 
    tempLink.click(); 
    document.body.removeChild(tempLink);
    saveEditorState();
});

// 9. Track changes for autosave and unsaved warning
let saveTimeout;
const markUnsavedAndTriggerSave = () => {
    document.body.classList.add('has-unsaved-changes');
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveEditorState, 1000);
};

editor.on("change", markUnsavedAndTriggerSave);
filenameInput.addEventListener('input', markUnsavedAndTriggerSave);

window.addEventListener('beforeunload', (event) => {
    if (document.body.classList.contains('has-unsaved-changes')) {
        event.preventDefault();
        event.returnValue = '';
    }
});
