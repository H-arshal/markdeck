import { FileType, Maximize, Minus, Plus, Settings as SettingsIcon, Layout } from 'lucide-react';

const Settings = ({ settings, setSettings }) => {
    const handleUpdate = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="page settings-page">
            <header className="page-header">
                <h2>Settings</h2>
                <p>Customize your Markdeck experience and PDF export preferences.</p>
            </header>

            <div className="settings-container">
                {/* PDF Export Settings */}
                <section className="settings-section">
                    <div className="section-header">
                        <FileType size={20} />
                        <h3>PDF Export Options</h3>
                    </div>
                    
                    <div className="settings-grid">
                        <div className="setting-item">
                            <label>Page Format</label>
                            <select 
                                value={settings.pageFormat}
                                onChange={(e) => handleUpdate('pageFormat', e.target.value)}
                            >
                                <option value="a4">A4 (Standard)</option>
                                <option value="letter">Letter</option>
                                <option value="legal">Legal</option>
                                <option value="a3">A3</option>
                            </select>
                        </div>

                        <div className="setting-item">
                            <label>Orientation</label>
                            <div className="radio-group">
                                <button 
                                    className={settings.orientation === 'portrait' ? 'active' : ''}
                                    onClick={() => handleUpdate('orientation', 'portrait')}
                                >
                                    Portrait
                                </button>
                                <button 
                                    className={settings.orientation === 'landscape' ? 'active' : ''}
                                    onClick={() => handleUpdate('orientation', 'landscape')}
                                >
                                    Landscape
                                </button>
                            </div>
                        </div>

                        <div className="setting-item">
                            <label>Margins (mm)</label>
                            <div className="number-input">
                                <button onClick={() => handleUpdate('margins', Math.max(0, settings.margins - 5))}>
                                    <Minus size={16} />
                                </button>
                                <span>{settings.margins}mm</span>
                                <button onClick={() => handleUpdate('margins', settings.margins + 5)}>
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Editor Settings */}
                <section className="settings-section">
                    <div className="section-header">
                        <Maximize size={20} />
                        <h3>Editor Preferences</h3>
                    </div>

                    <div className="settings-grid">
                        <div className="setting-item">
                            <label>Editor Font Size</label>
                            <div className="number-input">
                                <button onClick={() => handleUpdate('editorFontSize', Math.max(12, settings.editorFontSize - 1))}>
                                    <Minus size={16} />
                                </button>
                                <span>{settings.editorFontSize}px</span>
                                <button onClick={() => handleUpdate('editorFontSize', Math.min(24, settings.editorFontSize + 1))}>
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;
