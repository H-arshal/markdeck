import { useState, useCallback, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';

const STORAGE_KEY = 'markdown-editor-content';
const AUTO_SAVE_DELAY = 1000; // 1 second debounce

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
    const handleExportPDF = useCallback((previewElement) => {
        if (!markdown.trim()) {
            showStatus('Please enter some markdown content first!', 'error');
            return;
        }

        const element = document.createElement('div');
        element.innerHTML = previewElement.innerHTML;
        element.style.padding = '20px';
        element.style.fontSize = `${settings.editorFontSize}px`;
        element.style.lineHeight = '1.6';
        element.style.color = '#0f172a'; // Force dark text for PDF
        element.style.backgroundColor = '#ffffff';

        const opt = {
            margin: [settings.margins, settings.margins, settings.margins, settings.margins],
            filename: `${pdfFilename}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, backgroundColor: '#ffffff' },
            jsPDF: { unit: 'mm', format: settings.pageFormat, orientation: settings.orientation }
        };

        html2pdf().set(opt).from(element).save();
        showStatus('PDF exported successfully!', 'success');
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
