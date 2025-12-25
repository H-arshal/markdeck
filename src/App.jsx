import { useRef } from 'react';
import { Header, StatusMessage, Controls, Editor, Preview } from './components';
import { useMarkdownEditor, useTheme } from './hooks';
import './styles/components.css';
import './styles/preview.css';

function App() {
    const previewRef = useRef(null);
    const { theme, toggleTheme, isDark } = useTheme();
    
    const {
        markdown,
        setMarkdown,
        status,
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
            
            <StatusMessage message={status.message} type={status.type} />
            
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
        </div>
    );
}

export default App;
