import { useMemo, forwardRef } from 'react';
import { marked } from 'marked';
import { Eye, FileText, Maximize2, Minimize2 } from 'lucide-react';

// Configure marked options
const renderer = new marked.Renderer();

renderer.heading = ({ text, depth }) => {
    const slug = text.toLowerCase().replace(/[^\w]+/g, '-');
    return `<h${depth} id="${slug}">${text}</h${depth}>`;
};

marked.setOptions({
    renderer,
    breaks: true,
    gfm: true,
});

const Preview = forwardRef(({ markdown, isFullscreen, onToggleFullscreen }, ref) => {
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
        <div className={`panel ${isFullscreen ? 'panel-fullscreen' : ''}`}>
            <div className="panel-header">
                <div className="panel-header-left">
                    <Eye size={20} />
                    Live Preview
                </div>
                <div className="panel-header-actions">
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
