import { FileEdit, Sun, Moon } from 'lucide-react';

const Header = ({ isDark, onToggleTheme }) => {
    return (
        <div className="header">
            <div className="header-content">
                <h1>
                    <FileEdit size={28} />
                    Markdeck
                </h1>
                <p>Write markdown, preview in real-time, and export to PDF instantly</p>
            </div>
            <div className="header-actions">
                <button 
                    className="theme-toggle" 
                    onClick={onToggleTheme}
                    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </div>
    );
};

export default Header;
