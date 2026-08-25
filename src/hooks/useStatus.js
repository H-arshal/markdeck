import { useState, useCallback } from 'react';

const useStatus = () => {
    const [status, setStatus] = useState({ message: '', type: '' });

    const showStatus = useCallback((message, type) => {
        setStatus({ message, type });
    }, []);

    const clearStatus = useCallback(() => {
        setStatus({ message: '', type: '' });
    }, []);

    return { status, showStatus, clearStatus };
};

export default useStatus;
