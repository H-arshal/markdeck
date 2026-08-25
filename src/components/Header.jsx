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
        </div>
    );
};

export default Header;
