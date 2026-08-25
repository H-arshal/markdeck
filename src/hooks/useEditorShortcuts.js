import { useCallback } from 'react';

const useEditorShortcuts = ({ markdown, setMarkdown, handleDownloadMd }) => {
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
    }, [markdown, setMarkdown]);

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

    return { handleKeyboardShortcut };
};

export default useEditorShortcuts;
