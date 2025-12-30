import { Github, Linkedin, Mail, Globe, Heart, Coffee } from 'lucide-react';

const About = () => {
    const socialLinks = [
        { icon: Github, label: 'GitHub', url: 'https://github.com/H-arshal', color: '#333' },
        { icon: Linkedin, label: 'LinkedIn', url: 'https://linkedin.com/in/harshalmoon', color: '#0077b5' },
        { icon: Globe, label: 'Portfolio', url: 'https://harshalmoon.me', color: '#7c3aed' },
        { icon: Mail, label: 'Email', url: 'mailto:contact@harshalmoon.me', color: '#ea4335' },
    ];

    return (
        <div className="page about-page">
            <header className="page-header">
                <h2>About Markdeck</h2>
                <p>Learn more about the project, the mission, and the developer behind the code.</p>
            </header>

            <div className="about-container">
                <section className="about-section bio-card">
                    <div className="bio-content">
                        <div className="bio-text">
                            <h3>Project Mission</h3>
                            <p>
                                Markdeck was created to bridge the gap between simple Markdown editing and professional document production. 
                                Our goal is to provide a distraction-free environment where your ideas take center stage, backed by 
                                powerful tools to export them into beautiful, structured PDFs.
                            </p>
                            <p>
                                Whether you're writing a quick project README, a modern resume, or technical documentation, 
                                Markdeck ensures your output is consistent, professional, and ready for the world.
                            </p>
                        </div>
                        <div className="developer-tag">
                            <img 
                                src="https://github.com/H-arshal.png" 
                                alt="Harshal Moon" 
                                className="dev-avatar"
                            />
                            <div className="dev-info">
                                <strong>Harshal Moon</strong>
                                <span>Lead Developer</span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="about-grid">
                    <section className="about-section">
                        <h3>Tech Stack</h3>
                        <div className="tech-tags">
                            <span className="tech-tag">React 19</span>
                            <span className="tech-tag">Vite</span>
                            <span className="tech-tag">Lucide Icons</span>
                            <span className="tech-tag">html2pdf.js</span>
                            <span className="tech-tag">Marked.js</span>
                        </div>
                    </section>

                    <section className="about-section social-links-section">
                        <h3>Connect With Me</h3>
                        <div className="social-links-grid">
                            {socialLinks.map((link) => (
                                <a 
                                    key={link.label} 
                                    href={link.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="social-link-card"
                                >
                                    <link.icon size={24} />
                                    <span>{link.label}</span>
                                </a>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="about-footer">
                    <p>
                        Made with <Heart size={16} fill="#ef4444" color="#ef4444" /> and lots of <Coffee size={16} color="#92400e" /> by Harshal Moon.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
