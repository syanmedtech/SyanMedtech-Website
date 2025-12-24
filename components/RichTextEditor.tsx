
import React, { useRef, useEffect, useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const saveSelection = (): Range | null => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      return sel.getRangeAt(0);
    }
    return null;
  };

  const restoreSelection = (range: Range | null) => {
    if (range) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  };

  const execCommand = (command: string, val: string | undefined = undefined) => {
    editorRef.current?.focus();
    document.execCommand('styleWithCSS', false, 'false');
    document.execCommand(command, false, val);
    handleInput();
  };

  const handleLink = () => {
    const range = saveSelection();
    const url = prompt('Enter URL:', 'https://');
    
    if (url) {
      restoreSelection(range);
      const sel = window.getSelection();
      
      // If text is selected, use standard command
      if (sel && !sel.isCollapsed) {
        document.execCommand('createLink', false, url);
        // Force target="_blank" on the link
        const links = editorRef.current?.getElementsByTagName('a');
        if (links) {
          for (let i = 0; i < links.length; i++) {
            if (links[i].href.includes(url)) {
              links[i].target = "_blank";
              links[i].rel = "noopener noreferrer";
            }
          }
        }
      } else {
        // Create link manually for collapsed selection
        const link = document.createElement('a');
        link.href = url;
        link.innerText = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        
        if (range) {
          range.deleteContents();
          range.insertNode(link);
          range.setStartAfter(link);
          range.setEndAfter(link);
          restoreSelection(range);
        } else {
          editorRef.current?.appendChild(link);
        }
      }
      handleInput();
    }
  };

  const handleImage = () => {
    const range = saveSelection();
    const url = prompt('Enter Image URL:');
    if (url) {
      restoreSelection(range);
      execCommand('insertImage', url);
    }
  };

  const handleTable = () => {
    const range = saveSelection();
    const rows = prompt('Enter number of rows:', '3');
    const cols = prompt('Enter number of columns:', '3');
    
    if (rows && cols) {
      const r = parseInt(rows);
      const c = parseInt(cols);
      if (isNaN(r) || isNaN(c)) return;

      restoreSelection(range);
      const table = document.createElement('table');
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      table.style.margin = '1.5em 0';
      table.style.border = '1px solid #e2e8f0';

      for (let i = 0; i < r; i++) {
        const row = table.insertRow();
        for (let j = 0; j < c; j++) {
          const cell = row.insertCell();
          cell.style.border = '1px solid #e2e8f0';
          cell.style.padding = '12px';
          cell.style.verticalAlign = 'top';
          cell.innerHTML = '&nbsp;';
        }
      }

      if (range) {
        range.insertNode(table);
        const p = document.createElement('p');
        p.innerHTML = '&nbsp;';
        table.after(p);
        range.setStartAfter(p);
        range.setEndAfter(p);
        restoreSelection(range);
      } else {
        editorRef.current?.appendChild(table);
      }
      handleInput();
    }
  };

  const fonts = [
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Playfair', value: "'Playfair Display', serif" },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Courier', value: "'Courier New', monospace" },
    { name: 'Georgia', value: 'Georgia, serif' }
  ];

  const sizes = [
    { label: '8 pt', value: '1' },
    { label: '10 pt', value: '2' },
    { label: '12 pt', value: '3' },
    { label: '14 pt', value: '4' },
    { label: '18 pt', value: '5' },
    { label: '24 pt', value: '6' },
    { label: '36 pt', value: '7' }
  ];

  const ToolbarBtn = ({ onClick, icon, title }: { onClick: () => void, icon: React.ReactNode, title: string }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-600 flex items-center justify-center min-w-[32px] min-h-[32px]"
      title={title}
    >
      {icon}
    </button>
  );

  return (
    <div className={`flex flex-col border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-inner transition-all duration-300 ${isFullscreen ? 'fixed inset-4 z-[200] shadow-2xl' : 'h-full'}`}>
      <div className="bg-syan-gray/50 border-b border-gray-100 p-2 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1">
          <ToolbarBtn onClick={() => execCommand('undo')} title="Undo" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" strokeWidth={2}/></svg>} />
          <ToolbarBtn onClick={() => execCommand('redo')} title="Redo" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" strokeWidth={2}/></svg>} />
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <select 
            onChange={(e) => execCommand('fontName', e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            className="h-8 px-2 bg-white border border-gray-200 rounded text-[11px] font-medium outline-none cursor-pointer"
            defaultValue="Inter, sans-serif"
          >
            {fonts.map(f => <option key={f.name} value={f.value}>{f.name}</option>)}
          </select>
          <select 
            onChange={(e) => execCommand('fontSize', e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            className="h-8 px-2 bg-white border border-gray-200 rounded text-[11px] font-medium outline-none cursor-pointer"
            defaultValue="3"
          >
            {sizes.map(s => <option key={s.label} value={s.value}>{s.label}</option>)}
          </select>
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <ToolbarBtn onClick={() => execCommand('bold')} title="Bold" icon={<span className="font-bold text-sm">B</span>} />
          <ToolbarBtn onClick={() => execCommand('italic')} title="Italic" icon={<span className="italic font-serif text-sm">I</span>} />
          <ToolbarBtn onClick={() => execCommand('underline')} title="Underline" icon={<span className="underline text-sm">U</span>} />
          <ToolbarBtn onClick={() => execCommand('strikeThrough')} title="Strikethrough" icon={<span className="line-through text-sm">S</span>} />
          <div className="flex-grow" />
          <ToolbarBtn onClick={() => setIsFullscreen(!isFullscreen)} title="Fullscreen" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" strokeWidth={2}/></svg>} />
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <div className="relative group flex items-center">
            <ToolbarBtn onClick={() => {}} title="Text Color" icon={<div className="flex flex-col items-center"><span className="text-xs leading-none">🎨</span><div className="w-4 h-0.5 bg-black" id="text-color-preview" /></div>} />
            <input 
              type="color" 
              onChange={(e) => {
                execCommand('foreColor', e.target.value);
                const preview = document.getElementById('text-color-preview');
                if (preview) preview.style.backgroundColor = e.target.value;
              }} 
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
            />
          </div>
          <div className="relative group flex items-center">
            <ToolbarBtn onClick={() => {}} title="Highlight" icon={<div className="flex flex-col items-center"><span className="text-xs leading-none">🖋️</span><div className="w-4 h-0.5 bg-yellow-400" id="bg-color-preview" /></div>} />
            <input 
              type="color" 
              onChange={(e) => {
                execCommand('backColor', e.target.value);
                const preview = document.getElementById('bg-color-preview');
                if (preview) preview.style.backgroundColor = e.target.value;
              }} 
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
            />
          </div>
          <ToolbarBtn onClick={() => execCommand('removeFormat')} title="Clear Formatting" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2.5} /></svg>} />
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <ToolbarBtn onClick={() => execCommand('justifyLeft')} title="Align Left" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 6h16M4 12h10M4 18h16" strokeWidth={2}/></svg>} />
          <ToolbarBtn onClick={() => execCommand('justifyCenter')} title="Align Center" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 6h16M7 12h10M4 18h16" strokeWidth={2}/></svg>} />
          <ToolbarBtn onClick={() => execCommand('justifyRight')} title="Align Right" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 6h16M10 12h10M4 18h16" strokeWidth={2}/></svg>} />
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <ToolbarBtn onClick={() => execCommand('insertUnorderedList')} title="Bullets" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" strokeWidth={2.5}/></svg>} />
          <ToolbarBtn onClick={() => execCommand('insertOrderedList')} title="Numbers" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 6h10M10 12h10M10 18h10M4 6h3M4 12h3M4 18h3" strokeWidth={2}/></svg>} />
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <ToolbarBtn onClick={handleLink} title="Link" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 005.656 0l4-4" strokeWidth={2}/></svg>} />
          <ToolbarBtn onClick={handleImage} title="Image" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={2}/></svg>} />
          <ToolbarBtn onClick={handleTable} title="Table" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={2}/></svg>} />
        </div>
      </div>
      
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="editor-content flex-1 p-8 outline-none max-w-none overflow-y-auto min-h-[400px] text-syan-dark bg-white font-medium leading-relaxed"
        placeholder={placeholder}
      />
      
      <style>{`
        .editor-content:empty:before {
          content: attr(placeholder);
          color: #94a3b8;
          cursor: text;
        }
        .editor-content ul {
          list-style-type: disc !important;
          margin: 1em 0 1em 2em !important;
          display: block !important;
        }
        .editor-content ol {
          list-style-type: decimal !important;
          margin: 1em 0 1em 2em !important;
          display: block !important;
        }
        .editor-content li {
          display: list-item !important;
          margin-bottom: 0.5em !important;
        }
        .editor-content table {
          border-collapse: collapse !important;
          width: 100% !important;
          margin: 1.5em 0 !important;
          border: 1px solid #e2e8f0 !important;
        }
        .editor-content td, .editor-content th {
          border: 1px solid #e2e8f0 !important;
          padding: 12px !important;
          min-width: 50px !important;
          vertical-align: top !important;
          word-break: break-word;
        }
        .editor-content img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 0.5rem !important;
          margin: 1.5em 0 !important;
          display: block !important;
        }
        .editor-content a {
          color: #2B7A6D !important;
          text-decoration: underline !important;
          cursor: pointer !important;
        }
        .editor-content h1, .editor-content h2, .editor-content h3 {
          margin-top: 1.5em !important;
          margin-bottom: 0.5em !important;
          font-weight: 800 !important;
          display: block !important;
        }
      `}</style>
    </div>
  );
};
