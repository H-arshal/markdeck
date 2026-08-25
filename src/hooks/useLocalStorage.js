import { useState, useEffect, useRef } from 'react';

const useLocalStorage = (key, initialValue, debounceDelay = 0) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item === null) return initialValue;
            
            // Try to parse it as JSON, if it fails, it might just be a string (like the raw markdown)
            try {
                return JSON.parse(item);
            } catch {
                return item;
            }
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const timeoutRef = useRef(null);

    useEffect(() => {
        const valueToStore = typeof storedValue === 'string' ? storedValue : JSON.stringify(storedValue);
        
        if (debounceDelay > 0) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                try {
                    window.localStorage.setItem(key, valueToStore);
                } catch (error) {
                    console.warn(`Error setting localStorage key "${key}":`, error);
                }
            }, debounceDelay);
            
            return () => clearTimeout(timeoutRef.current);
        } else {
            try {
                window.localStorage.setItem(key, valueToStore);
            } catch (error) {
                console.warn(`Error setting localStorage key "${key}":`, error);
            }
        }
    }, [key, storedValue, debounceDelay]);

    return [storedValue, setStoredValue];
};

export default useLocalStorage;
