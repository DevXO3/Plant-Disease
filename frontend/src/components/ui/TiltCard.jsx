import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const TiltCard = ({ children, className }) => {
    const ref = useRef(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        // Max rotation in degrees
        const ROTATION_RANGE = 20;

        setRotation({
            x: -yPct * ROTATION_RANGE, // Rotate X based on Y position (tilt up/down)
            y: xPct * ROTATION_RANGE,  // Rotate Y based on X position (tilt left/right)
        });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transformStyle: 'preserve-3d',
            }}
            animate={{
                rotateX: rotation.x,
                rotateY: rotation.y,
            }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
            }}
            className={cn("relative transition-all duration-200 ease-out", className)}
        >
            {children}
        </motion.div>
    );
};
