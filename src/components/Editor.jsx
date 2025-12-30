import { useMemo, useCallback, useState } from 'react';
import { PenLine, LetterText, Hash, AlignLeft, Maximize2, Minimize2, Save } from 'lucide-react';

const Editor = ({ 
    value, 
    onChange, 
    onKeyboardShortcut, 
    onFileDrop,
    isFullscreen,
    onToggleFullscreen,
    fontSize
}) => {
    const [isDragOver, setIsDragOver] = useState(false);

    // Calculate stats
    const stats = useMemo(() => {
        const text = value || '';
        return {
            chars: text.length,
            words: text.split(/\s+/).filter(w => w.length > 0).length,
            lines: text.split('\n').length
        };
    }, [value]);

    // Handle keyboard shortcuts
    const handleKeyDown = useCallback((e) => {
        if (onKeyboardShortcut) {
            onKeyboardShortcut(e, e.target);
        }
    }, [onKeyboardShortcut]);

    // Drag and drop handlers
    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.name.match(/\.(md|markdown|txt)$/i)) {
                onFileDrop(file);
            }
        }
    }, [onFileDrop]);

    return (
        <div 
            className={`panel ${isFullscreen ? 'panel-fullscreen' : ''} ${isDragOver ? 'panel-drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="panel-header">
                <div className="panel-header-left">
                    <PenLine size={20} />
                    Markdown Input
                </div>
                <div className="panel-header-actions">
                    <span className="keyboard-hint" title="Keyboard shortcuts available">
                        <Save size={14} />
                        Ctrl+S
                    </span>
                    <button 
                        className="panel-action-btn"
                        onClick={onToggleFullscreen}
                        title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                    >
                        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                </div>
            </div>
            <div className="panel-body">
                {isDragOver && (
                    <div className="drop-overlay">
                        <div className="drop-message">
                            Drop your .md file here
                        </div>
                    </div>
                )}
                <textarea
                    className="markdown-input"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{ fontSize: `${fontSize}px` }}
                    placeholder={`Start writing your markdown here...

# Heading 1
## Heading 2

**Bold text** and *italic text*

- List item 1
- List item 2

[Link text](https://example.com)

\`inline code\`

> Blockquote

---

Keyboard Shortcuts:
• Ctrl+B → Bold
• Ctrl+I → Italic
• Ctrl+K → Link
• Ctrl+\` → Code
• Ctrl+S → Save as .md

Or drag & drop a .md file here!`}
                />
            </div>
            <div className="panel-footer">
                <div className="stats">
                    <div className="stat">
                        <LetterText size={14} />
                        Characters: <span>{stats.chars.toLocaleString()}</span>
                    </div>
                    <div className="stat">
                        <AlignLeft size={14} />
                        Words: <span>{stats.words.toLocaleString()}</span>
                    </div>
                    <div className="stat">
                        <Hash size={14} />
                        Lines: <span>{stats.lines.toLocaleString()}</span>
                    </div>
                </div>
                <div className="auto-save-indicator">
                    Auto-saved
                </div>
            </div>
        </div>
    );
};

export default Editor;
