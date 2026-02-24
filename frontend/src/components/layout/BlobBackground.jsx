import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const BlobBackground = () => {
    // Generate random animation parameters for organic feel
    const blobs = useMemo(() => {
        return [
            {
                // Emerald - Base Hue ~160. range [0, 40] -> Shifts nicely to Teal but stays away from Blue.
                color: "bg-emerald-500/30",
                initialX: -10, initialY: -10,
                duration: 25,
                delay: 0,
                scaleRange: [1, 1.3, 0.9, 1.2, 1],
                hueRotate: [0, 30, 0, -10, 0] // Constrained range
            },
            {
                // Blue - Base Hue ~215. Range constrained to avoid Purple or Emerald overlap.
                color: "bg-blue-500/30",
                initialX: 90, initialY: -20,
                duration: 35,
                delay: -5,
                scaleRange: [1, 1.1, 0.8, 1.2, 1],
                hueRotate: [0, -20, 0, 20, 0] // Stays distinct blue
            },
            {
                // Purple - Base Hue ~270. 
                color: "bg-purple-500/30",
                initialX: 60, initialY: 80,
                duration: 30,
                delay: -10,
                scaleRange: [1.1, 0.9, 1.2, 0.9, 1.1],
                hueRotate: [0, 40, 0, 10, 0] // Shifts towards Pink/Red, away from Blue
            }
        ];
    }, []);

    const generateRandomPath = () => {
        // Generate 6 random points for a complex path
        return Array.from({ length: 6 }, () => Math.random() * 300 - 150); // +/- 150px movement
    };

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {blobs.map((blob, i) => (
                <motion.div
                    key={i}
                    className={`absolute w-[400px] h-[400px] rounded-full mix-blend-screen filter blur-[100px] opacity-70 ${blob.color}`}
                    style={{
                        left: `${blob.initialX}%`,
                        top: `${blob.initialY}%`,
                    }}
                    animate={{
                        x: generateRandomPath(),
                        y: generateRandomPath(),
                        scale: blob.scaleRange,
                        rotate: [0, 360], // Slow rotation
                        filter: blob.hueRotate.map(h => `blur(100px) hue-rotate(${h}deg)`)
                    }}
                    transition={{
                        duration: blob.duration,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                        delay: blob.delay,
                    }}
                />
            ))}
        </div>
    );
};
