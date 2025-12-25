import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Auto-dismiss after 3 seconds
        const timer = setTimeout(() => {
            handleClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose?.();
        }, 300); // Match animation duration
    };

    if (!message) return null;

    const Icon = type === 'success' ? CheckCircle : AlertCircle;

    return (
        <div className={`toast-container`}>
            <div className={`toast toast-${type} ${isExiting ? 'toast-exit' : ''}`}>
                <div className="toast-icon">
                    <Icon size={20} />
                </div>
                <div className="toast-content">
                    <p className="toast-message">{message}</p>
                </div>
                <button className="toast-close" onClick={handleClose}>
                    <X size={16} />
                </button>
                <div className="toast-progress">
                    <div className="toast-progress-bar" />
                </div>
            </div>
        </div>
    );
};

export default Toast;
