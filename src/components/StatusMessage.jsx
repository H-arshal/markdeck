import { CheckCircle, AlertCircle } from 'lucide-react';

const StatusMessage = ({ message, type }) => {
    if (!message) return null;

    const Icon = type === 'success' ? CheckCircle : AlertCircle;

    return (
        <div className={`status-message ${type}`}>
            <Icon size={18} />
            {message}
        </div>
    );
};

export default StatusMessage;
