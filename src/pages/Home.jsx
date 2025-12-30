import { useRef } from 'react';
import { Header, Toast, Controls, Editor, Preview } from '../components';

const Home = ({ editor }) => {
    const previewRef = useRef(null);

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
            {!editor.isFullscreen && (
                <Header />
            )}
            
            {!editor.isFullscreen && (
                <Controls
                    onFileUpload={editor.handleFileUpload}
                    onClear={editor.handleClear}
                    onExportPDF={onExportPDF}
                    onCopyHTML={onCopyHTML}
                    onDownloadMd={editor.handleDownloadMd}
                    pdfFilename={editor.pdfFilename}
                    onFilenameChange={editor.setPdfFilename}
                />
            )}
            
            <div className={`content-wrapper ${editor.isFullscreen ? 'content-wrapper-fullscreen' : ''}`}>
                <Editor 
                    value={editor.markdown} 
                    onChange={editor.setMarkdown}
                    onKeyboardShortcut={editor.handleKeyboardShortcut}
                    onFileDrop={editor.handleFileUpload}
                    isFullscreen={editor.isFullscreen}
                    onToggleFullscreen={editor.toggleFullscreen}
                    fontSize={editor.settings.editorFontSize}
                />
                {!editor.isFullscreen && (
                    <Preview ref={previewRef} markdown={editor.markdown} />
                )}
            </div>
        </>
    );
};

export default Home;
