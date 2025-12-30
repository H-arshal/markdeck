import { Link, useLocation } from 'react-router-dom';
import { FileEdit, LayoutTemplate, BookOpen, Settings, Info, Sun, Moon } from 'lucide-react';

const Navbar = ({ isDark, onToggleTheme }) => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Editor', icon: FileEdit },
        { path: '/templates', label: 'Templates', icon: LayoutTemplate },
        { path: '/guide', label: 'Guide', icon: BookOpen },
        { path: '/settings', label: 'Settings', icon: Settings },
        { path: '/about', label: 'About', icon: Info },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="navbar-logo">
                    <FileEdit size={24} />
                    <span>Markdeck</span>
                </Link>
            </div>
            
            <div className="navbar-links">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <item.icon size={18} />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </div>

            <div className="navbar-actions">
                <button 
                    className="theme-toggle" 
                    onClick={onToggleTheme}
                    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
