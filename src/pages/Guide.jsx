import { useState } from 'react';
import { Search, ChevronRight, Copy, Check } from 'lucide-react';
import { guideContent } from '../data/guide';

const Guide = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedIndex, setCopiedIndex] = useState(null);

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const filteredContent = guideContent.map(category => ({
        ...category,
        items: category.items.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.items.length > 0);

    return (
        <div className="page guide-page">
            <header className="page-header">
                <h2>Markdown Guide</h2>
                <p>Master the art of Markdown with this comprehensive syntax reference.</p>
                
                <div className="search-container">
                    <Search className="search-icon" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search syntax (e.g., 'table', 'link')..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </header>

            <div className="guide-categories">
                {filteredContent.map((cat, catIdx) => (
                    <section key={cat.category} className="guide-section">
                        <h3 className="category-title">{cat.category}</h3>
                        <div className="guide-grid">
                            {cat.items.map((item, itemIdx) => {
                                const uniqueIdx = `${catIdx}-${itemIdx}`;
                                return (
                                    <div key={item.name} className="guide-card">
                                        <div className="guide-card-header">
                                            <h4>{item.name}</h4>
                                            <button 
                                                className="copy-btn"
                                                onClick={() => handleCopy(item.syntax, uniqueIdx)}
                                                title="Copy syntax"
                                            >
                                                {copiedIndex === uniqueIdx ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                                            </button>
                                        </div>
                                        <div className="syntax-block">
                                            <code>{item.syntax}</code>
                                        </div>
                                        <div className="preview-label">Result:</div>
                                        <div 
                                            className="guide-preview"
                                            dangerouslySetInnerHTML={{ __html: item.result }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>

            {filteredContent.length === 0 && (
                <div className="no-results">
                    <p>No matches found for "{searchQuery}"</p>
                </div>
            )}
        </div>
    );
};

export default Guide;
