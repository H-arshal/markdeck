import { useState, useCallback, useEffect, useRef } from 'react';
import { marked } from 'marked';

const STORAGE_KEY = 'markdown-editor-content';
const AUTO_SAVE_DELAY = 1000; // 1 second debounce

// Internal TOC Generator Helper
const generateTOC = (markdown) => {
    const tokens = marked.lexer(markdown);
    let toc = '<div class="pdf-toc"><h2>Table of Contents</h2><ul>';
    let hasHeadings = false;

    tokens.forEach(token => {
        if (token.type === 'heading') {
            hasHeadings = true;
            const slug = token.text.toLowerCase().replace(/[^\w]+/g, '-');
            toc += `
                <li class="toc-level-${token.depth}">
                    <a href="#${slug}">
                        ${token.text}
                    </a>
                </li>`;
        }
    });

    toc += '</ul></div>';
    return hasHeadings ? toc : '';
};

const useMarkdownEditor = () => {
    // Load from localStorage on initial render
    const [markdown, setMarkdown] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved || '';
    });
    const [status, setStatus] = useState({ message: '', type: '' });
    const [pdfFilename, setPdfFilename] = useState('markdown-document');
    const [isFullscreen, setIsFullscreen] = useState(false);

    // PDF & Editor Settings
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('markdeck-settings');
        return saved ? JSON.parse(saved) : {
            pageFormat: 'a4',
            orientation: 'portrait',
            margins: 10,
            editorFontSize: 16,
            includeTOC: true,
        };
    });

    const autoSaveTimeoutRef = useRef(null);

    // Save settings to localStorage
    useEffect(() => {
        localStorage.setItem('markdeck-settings', JSON.stringify(settings));
    }, [settings]);

    // Auto-save to localStorage with debounce
    useEffect(() => {
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
        }

        autoSaveTimeoutRef.current = setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, markdown);
        }, AUTO_SAVE_DELAY);

        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, [markdown]);

    // Show status message (Toast component handles auto-hide)
    const showStatus = useCallback((message, type) => {
        setStatus({ message, type });
    }, []);

    // Clear status (for manual dismiss)
    const clearStatus = useCallback(() => {
        setStatus({ message: '', type: '' });
    }, []);

    // Handle file upload
    const handleFileUpload = useCallback((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            setMarkdown(event.target.result);
            showStatus(`File "${file.name}" loaded successfully!`, 'success');
        };
        reader.onerror = () => {
            showStatus('Error reading file. Please try again.', 'error');
        };
        reader.readAsText(file);
    }, [showStatus]);

    // Clear all content
    const handleClear = useCallback(() => {
        if (markdown && window.confirm('Are you sure you want to clear all content?')) {
            setMarkdown('');
            localStorage.removeItem(STORAGE_KEY);
            showStatus('Content cleared!', 'success');
        }
    }, [markdown, showStatus]);

    // Export to PDF
    const handleExportPDF = useCallback(async (previewElement) => {
        if (!markdown.trim()) {
            showStatus('Please enter some markdown content first!', 'error');
            return;
        }

        showStatus('Generating PDF...', 'info');

        try {
            const tocHTML = settings.includeTOC ? generateTOC(markdown) : '';
            const contentHTML = previewElement.innerHTML;

            // Combine TOC and content for professional PDF
            const fullHTML = `
                <div class="pdf-wrapper">
                    <style>
                        .pdf-wrapper { font-family: sans-serif; padding: 20px; color: #0f172a; background: white; }
                        .pdf-toc { margin-bottom: 40px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; }
                        .pdf-toc ul { list-style: none; padding: 0; }
                        .pdf-toc li { margin-bottom: 8px; }
                        .pdf-toc a { color: #2563eb; text-decoration: none; }
                        .toc-level-1 { font-weight: bold; font-size: 1.2em; }
                        .toc-level-2 { margin-left: 20px; }
                        .toc-level-3 { margin-left: 40px; }
                        h1, h2, h3, h4, h5, h6 { color: #1e293b; margin-top: 1.5em; }
                        pre { background: #f1f5f9; padding: 12px; border-radius: 6px; overflow-x: auto; }
                        code { font-family: monospace; }
                        img { max-width: 100%; height: auto; }
                    </style>
                    ${tocHTML}
                    <div class="pdf-content">
                        ${contentHTML}
                    </div>
                </div>
            `;

            const response = await fetch('/api/generate-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    html: fullHTML,
                    settings: {
                        pageFormat: settings.pageFormat,
                        orientation: settings.orientation,
                        margins: settings.margins
                    },
                    filename: pdfFilename
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate PDF');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${pdfFilename}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            showStatus('PDF exported successfully!', 'success');
        } catch (error) {
            console.error('PDF Export Error:', error);
            showStatus(`Error: ${error.message}`, 'error');
        }
    }, [markdown, pdfFilename, showStatus, settings]);

    // Copy HTML to clipboard
    const handleCopyHTML = useCallback((previewElement) => {
        const html = previewElement?.innerHTML || '';
        navigator.clipboard.writeText(html).then(() => {
            showStatus('HTML copied to clipboard!', 'success');
        }).catch(() => {
            showStatus('Failed to copy HTML', 'error');
        });
    }, [showStatus]);

    // Download as .md file
    const handleDownloadMd = useCallback(() => {
        if (!markdown.trim()) {
            showStatus('Please enter some markdown content first!', 'error');
            return;
        }

        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${pdfFilename}.md`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showStatus('Markdown file downloaded!', 'success');
    }, [markdown, pdfFilename, showStatus]);

    // Toggle fullscreen
    const toggleFullscreen = useCallback(() => {
        setIsFullscreen(prev => !prev);
    }, []);

    // Keyboard shortcut handler - insert formatting
    const insertFormatting = useCallback((textarea, prefix, suffix = prefix) => {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = markdown.substring(start, end);
        const beforeText = markdown.substring(0, start);
        const afterText = markdown.substring(end);

        const newText = `${beforeText}${prefix}${selectedText}${suffix}${afterText}`;
        setMarkdown(newText);

        // Restore cursor position
        setTimeout(() => {
            textarea.focus();
            if (selectedText) {
                textarea.setSelectionRange(start + prefix.length, end + prefix.length);
            } else {
                textarea.setSelectionRange(start + prefix.length, start + prefix.length);
            }
        }, 0);
    }, [markdown]);

    // Handle keyboard shortcuts
    const handleKeyboardShortcut = useCallback((e, textarea) => {
        if (!e.ctrlKey && !e.metaKey) return false;

        switch (e.key.toLowerCase()) {
            case 'b': // Bold
                e.preventDefault();
                insertFormatting(textarea, '**');
                return true;
            case 'i': // Italic
                e.preventDefault();
                insertFormatting(textarea, '*');
                return true;
            case 'k': // Link
                e.preventDefault();
                insertFormatting(textarea, '[', '](url)');
                return true;
            case '`': // Code
                e.preventDefault();
                insertFormatting(textarea, '`');
                return true;
            case 's': // Save (download md)
                e.preventDefault();
                handleDownloadMd();
                return true;
            default:
                return false;
        }
    }, [insertFormatting, handleDownloadMd]);

    return {
        markdown,
        setMarkdown,
        status,
        clearStatus,
        pdfFilename,
        setPdfFilename,
        isFullscreen,
        toggleFullscreen,
        settings,
        setSettings,
        handleFileUpload,
        handleClear,
        handleExportPDF,
        handleCopyHTML,
        handleDownloadMd,
        handleKeyboardShortcut,
    };
};

export default useMarkdownEditor;
