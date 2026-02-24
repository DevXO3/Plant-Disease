import { useState, useEffect } from 'react';

export function useTypewriter(text, speed = 1) {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText('');
        let i = 0;

        // Turbo speed: 5 characters per tick for immediate feel
        const charsPerTick = 5;

        const intervalId = setInterval(() => {
            if (i < text.length) {
                setDisplayedText((prev) => prev + text.slice(i, i + charsPerTick));
                i += charsPerTick;
            } else {
                clearInterval(intervalId);
            }
        }, speed);

        return () => clearInterval(intervalId);
    }, [text, speed]);

    return displayedText;
}
