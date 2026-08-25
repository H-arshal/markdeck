import { useState, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import useStatus from './useStatus';
import usePdfExport from './usePdfExport';
import useEditorShortcuts from './useEditorShortcuts';

const STORAGE_KEY = 'markdown-editor-content';
const AUTO_SAVE_DELAY = 1000; // 1 second debounce

const defaultSettings = {
    pageFormat: 'a4',
    orientation: 'portrait',
    margins: 10,
    editorFontSize: 16,
    includeTOC: true,
};

const useMarkdownEditor = () => {
    // 1. State Management
    const [markdown, setMarkdown] = useLocalStorage(STORAGE_KEY, '', AUTO_SAVE_DELAY);
    const [settings, setSettings] = useLocalStorage('markdeck-settings', defaultSettings);
    
    const [pdfFilename, setPdfFilename] = useState('markdown-document');
    const [isFullscreen, setIsFullscreen] = useState(false);

    // 2. Status Hook
    const { status, showStatus, clearStatus } = useStatus();

    // 3. Simple File Handlers
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
    }, [showStatus, setMarkdown]);

    const handleClear = useCallback(() => {
        if (markdown && window.confirm('Are you sure you want to clear all content?')) {
            setMarkdown('');
            window.localStorage.removeItem(STORAGE_KEY);
            showStatus('Content cleared!', 'success');
        }
    }, [markdown, showStatus, setMarkdown]);

    const handleCopyHTML = useCallback((previewElement) => {
        const html = previewElement?.innerHTML || '';
        navigator.clipboard.writeText(html).then(() => {
            showStatus('HTML copied to clipboard!', 'success');
        }).catch(() => {
            showStatus('Failed to copy HTML', 'error');
        });
    }, [showStatus]);

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

    const toggleFullscreen = useCallback(() => {
        setIsFullscreen(prev => !prev);
    }, []);

    // 4. Feature Hooks
    const { handleExportPDF } = usePdfExport({ 
        markdown, 
        settings, 
        pdfFilename, 
        showStatus 
    });

    const { handleKeyboardShortcut } = useEditorShortcuts({ 
        markdown, 
        setMarkdown, 
        handleDownloadMd 
    });

    // 5. Return Exact Original Interface
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
