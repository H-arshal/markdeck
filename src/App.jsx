import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components';
import { Home, Templates, Guide, Settings, About } from './pages';
import { useMarkdownEditor, useTheme } from './hooks';
import './styles/components.css';
import './styles/preview.css';
import './styles/toast.css';

function App() {
    const { isDark, toggleTheme } = useTheme();
    const editor = useMarkdownEditor();

    return (
        <Router>
            <Layout 
                isDark={isDark} 
                onToggleTheme={toggleTheme}
                status={editor.status}
                clearStatus={editor.clearStatus}
                isFullscreen={editor.isFullscreen}
            >
                <Routes>
                    <Route path="/" element={<Home editor={editor} />} />
                    <Route 
                        path="/templates" 
                        element={<Templates onSelectTemplate={editor.setMarkdown} />} 
                    />
                    <Route path="/guide" element={<Guide />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
