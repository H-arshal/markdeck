import { useRef, useState } from 'react';
import { Toast, Controls, Editor, Preview } from '../components';

const Home = ({ editor }) => {
    const previewRef = useRef(null);
    const [mobileView, setMobileView] = useState('editor');

    const onExportPDF = () => {
        if (previewRef.current) {
            editor.handleExportPDF(previewRef.current);
        }
    };

    const onCopyHTML = () => {
        if (previewRef.current) {
            editor.handleCopyHTML(previewRef.current);
        }
    };

    return (
        <>
            {editor.fullscreenMode === 'none' && (
                <Controls
                    onFileUpload={editor.handleFileUpload}
                    onClear={editor.handleClear}
                    onExportPDF={onExportPDF}
                    onCopyHTML={onCopyHTML}
                    onDownloadMd={editor.handleDownloadMd}
                    pdfFilename={editor.pdfFilename}
                    onFilenameChange={editor.setPdfFilename}
                    includeTOC={editor.settings.includeTOC}
                    onToggleTOC={() => editor.setSettings(prev => ({ ...prev, includeTOC: !prev.includeTOC }))}
                />
            )}

            {editor.fullscreenMode === 'none' && (
                <div className="mobile-tabs">
                    <button 
                        className={`tab-btn ${mobileView === 'editor' ? 'active' : ''}`}
                        onClick={() => setMobileView('editor')}
                    >
                        Editor
                    </button>
                    <button 
                        className={`tab-btn ${mobileView === 'preview' ? 'active' : ''}`}
                        onClick={() => setMobileView('preview')}
                    >
                        Live Preview
                    </button>
                </div>
            )}

            <div className={`content-wrapper ${editor.fullscreenMode !== 'none' ? 'content-wrapper-fullscreen' : ''} mobile-view-${mobileView}`}>
                {editor.fullscreenMode !== 'preview' && (
                    <Editor
                        value={editor.markdown}
                        onChange={editor.setMarkdown}
                        onKeyboardShortcut={editor.handleKeyboardShortcut}
                        onFileDrop={editor.handleFileUpload}
                        isFullscreen={editor.fullscreenMode === 'editor'}
                        onToggleFullscreen={() => editor.toggleFullscreen('editor')}
                        fontSize={editor.settings.editorFontSize}
                    />
                )}
                {editor.fullscreenMode !== 'editor' && (
                    <Preview 
                        ref={previewRef} 
                        markdown={editor.markdown} 
                        isFullscreen={editor.fullscreenMode === 'preview'}
                        onToggleFullscreen={() => editor.toggleFullscreen('preview')}
                    />
                )}
            </div>
        </>
    );
};

export default Home;
