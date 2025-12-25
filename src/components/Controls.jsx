import { useRef, useState } from 'react';
import { Upload, Trash2, Download, Copy, FileDown, FileText } from 'lucide-react';

const Controls = ({ 
    onFileUpload, 
    onClear, 
    onExportPDF, 
    onCopyHTML, 
    onDownloadMd,
    pdfFilename,
    onFilenameChange 
}) => {
    const fileInputRef = useRef(null);
    const [showFilenameInput, setShowFilenameInput] = useState(false);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onFileUpload(file);
            e.target.value = '';
        }
    };

    const handleExportClick = () => {
        if (showFilenameInput) {
            onExportPDF();
            setShowFilenameInput(false);
        } else {
            setShowFilenameInput(true);
        }
    };

    const handleFilenameKeyDown = (e) => {
        if (e.key === 'Enter') {
            onExportPDF();
            setShowFilenameInput(false);
        } else if (e.key === 'Escape') {
            setShowFilenameInput(false);
        }
    };

    return (
        <div className="controls">
            <div className="controls-left">
                <div className="file-input-wrapper">
                    <button className="btn btn-primary" onClick={handleUploadClick}>
                        <Upload size={18} />
                        <span>Upload .md</span>
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="file-input-hidden"
                        accept=".md,.markdown,.txt"
                        onChange={handleFileChange}
                    />
                </div>
                <button className="btn btn-secondary" onClick={onClear}>
                    <Trash2 size={18} />
                    <span>Clear</span>
                </button>
            </div>

            <div className="controls-right">
                {showFilenameInput && (
                    <div className="filename-input-wrapper">
                        <input
                            type="text"
                            className="filename-input"
                            value={pdfFilename}
                            onChange={(e) => onFilenameChange(e.target.value)}
                            onKeyDown={handleFilenameKeyDown}
                            placeholder="Enter filename"
                            autoFocus
                        />
                        <span className="filename-ext">.pdf</span>
                    </div>
                )}
                <button className="btn btn-primary" onClick={handleExportClick}>
                    <Download size={18} />
                    <span>{showFilenameInput ? 'Save PDF' : 'Export PDF'}</span>
                </button>
                <button className="btn btn-secondary" onClick={onDownloadMd} title="Download as Markdown file">
                    <FileDown size={18} />
                    <span>.md</span>
                </button>
                <button className="btn btn-secondary" onClick={onCopyHTML} title="Copy HTML to clipboard">
                    <Copy size={18} />
                    <span>HTML</span>
                </button>
            </div>
        </div>
    );
};

export default Controls;
