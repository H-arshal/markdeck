import { useNavigate } from 'react-router-dom';
import { Book, User, PenTool, Users, ArrowRight } from 'lucide-react';
import { templates } from '../data/templates';

const iconMap = {
    Book,
    User,
    PenTool,
    Users
};

const Templates = ({ onSelectTemplate }) => {
    const navigate = useNavigate();

    const handleSelect = (content) => {
        onSelectTemplate(content);
        navigate('/');
    };

    return (
        <div className="page templates-page">
            <header className="page-header">
                <h2>Template Gallery</h2>
                <p>Start your project faster with our hand-crafted Markdown templates.</p>
            </header>

            <div className="templates-grid">
                {templates.map((template) => {
                    const Icon = iconMap[template.icon] || Book;
                    return (
                        <div key={template.id} className="template-card">
                            <div className="template-card-icon">
                                <Icon size={32} />
                            </div>
                            <div className="template-card-content">
                                <h3>{template.title}</h3>
                                <p>{template.description}</p>
                            </div>
                            <button 
                                className="btn btn-primary template-btn"
                                onClick={() => handleSelect(template.content)}
                            >
                                Use Template
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Templates;
