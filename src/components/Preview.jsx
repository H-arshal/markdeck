import { useMemo, forwardRef } from 'react';
import { marked } from 'marked';
import { Eye, FileText } from 'lucide-react';

// Configure marked options
marked.setOptions({
    breaks: true,
    gfm: true,
});

const Preview = forwardRef(({ markdown }, ref) => {
    const html = useMemo(() => {
        if (!markdown || !markdown.trim()) {
            return null;
        }
        try {
            return marked.parse(markdown);
        } catch (error) {
            return `<div class="preview-error">Error parsing markdown: ${error.message}</div>`;
        }
    }, [markdown]);

    return (
        <div className="panel">
            <div className="panel-header">
                <Eye size={20} />
                Live Preview
            </div>
            <div className="panel-body">
                {html ? (
                    <div
                        ref={ref}
                        className="preview-content"
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                ) : (
                    <div ref={ref} className="preview-placeholder">
                        <FileText size={48} />
                        <p>Start typing markdown to see the preview...</p>
                    </div>
                )}
            </div>
        </div>
    );
});

Preview.displayName = 'Preview';

export default Preview;
