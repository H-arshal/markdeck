import { useRef } from 'react';
import { Header, Toast, Controls, Editor, Preview, Footer } from './components';
import { useMarkdownEditor, useTheme } from './hooks';
import './styles/components.css';
import './styles/preview.css';
import './styles/toast.css';

function App() {
    const previewRef = useRef(null);
    const { theme, toggleTheme, isDark } = useTheme();
    
    const {
        markdown,
        setMarkdown,
        status,
        clearStatus,
        pdfFilename,
        setPdfFilename,
        isFullscreen,
        toggleFullscreen,
        handleFileUpload,
        handleClear,
        handleExportPDF,
        handleCopyHTML,
        handleDownloadMd,
        handleKeyboardShortcut,
    } = useMarkdownEditor();

    const onExportPDF = () => {
        if (previewRef.current) {
            handleExportPDF(previewRef.current);
        }
    };

    const onCopyHTML = () => {
        if (previewRef.current) {
            handleCopyHTML(previewRef.current);
        }
    };

    return (
        <div className={`container ${isFullscreen ? 'container-fullscreen' : ''}`}>
            {!isFullscreen && (
                <Header isDark={isDark} onToggleTheme={toggleTheme} />
            )}
            
            {/* Toast Notifications */}
            {status.message && (
                <Toast 
                    message={status.message} 
                    type={status.type} 
                    onClose={clearStatus}
                />
            )}
            
            {!isFullscreen && (
                <Controls
                    onFileUpload={handleFileUpload}
                    onClear={handleClear}
                    onExportPDF={onExportPDF}
                    onCopyHTML={onCopyHTML}
                    onDownloadMd={handleDownloadMd}
                    pdfFilename={pdfFilename}
                    onFilenameChange={setPdfFilename}
                />
            )}
            
            <div className={`content-wrapper ${isFullscreen ? 'content-wrapper-fullscreen' : ''}`}>
                <Editor 
                    value={markdown} 
                    onChange={setMarkdown}
                    onKeyboardShortcut={handleKeyboardShortcut}
                    onFileDrop={handleFileUpload}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                />
                {!isFullscreen && (
                    <Preview ref={previewRef} markdown={markdown} />
                )}
            </div>

            {!isFullscreen && <Footer />}
        </div>
    );
}

export default App;
