import { useCallback } from 'react';
import { marked } from 'marked';

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

const usePdfExport = ({ markdown, settings, pdfFilename, showStatus }) => {
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

    return { handleExportPDF };
};

export default usePdfExport;
