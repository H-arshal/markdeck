import { Github, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <span className="footer-text">
                    Created with <Heart size={14} className="footer-heart" /> by{' '}
                    <strong>Harshal Moon</strong>
                </span>
                <a 
                    href="https://github.com/H-arshal/markdeck" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="footer-link"
                >
                    <Github size={18} />
                    <span>GitHub</span>
                </a>
            </div>
        </footer>
    );
};

export default Footer;
