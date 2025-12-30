import { Navbar, Footer, Toast } from '../components';

const Layout = ({ children, isDark, onToggleTheme, status, clearStatus, isFullscreen }) => {
    return (
        <div className={`app-layout ${isFullscreen ? 'layout-fullscreen' : ''}`}>
            {!isFullscreen && (
                <Navbar isDark={isDark} onToggleTheme={onToggleTheme} />
            )}
            
            {status.message && (
                <Toast 
                    message={status.message} 
                    type={status.type} 
                    onClose={clearStatus}
                />
            )}
            
            <main className={`container ${isFullscreen ? 'container-fullscreen' : ''}`}>
                {children}
            </main>

            {!isFullscreen && <Footer />}
        </div>
    );
};

export default Layout;
