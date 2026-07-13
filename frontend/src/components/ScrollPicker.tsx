import { useRef, useEffect, useMemo } from 'react';

interface ScrollPickerProps {
    value: number;
    onChange: (val: number) => void;
    min: number;
    max: number;
    step?: number;
}

export default function ScrollPicker({ value, onChange, min, max, step = 1 }: ScrollPickerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastEmittedValue = useRef(value);
    const isMounted = useRef(false);
    const itemHeight = 40;

    // Generate options
    const options = useMemo(() => {
        const opts: number[] = [];
        for (let i = min; i <= max; i += step) {
            opts.push(i);
        }
        return opts;
    }, [min, max, step]);

    const handleScroll = () => {
        if (!containerRef.current) return;

        const scrollTop = containerRef.current.scrollTop;
        const index = Math.round(scrollTop / itemHeight);

        const safeIndex = Math.max(0, Math.min(index, options.length - 1));
        const newValue = options[safeIndex];

        if (newValue !== value) {
            lastEmittedValue.current = newValue;
            onChange(newValue);
        }
    };

    // Sync scroll position only for external changes or initial mount
    useEffect(() => {
        if (containerRef.current) {
            const index = options.indexOf(value);
            if (index !== -1) {
                const expectedScrollTop = index * itemHeight;

                if (!isMounted.current) {
                    // Initial mount jump
                    containerRef.current.scrollTo({ top: expectedScrollTop, behavior: 'auto' });
                    isMounted.current = true;
                } else if (value !== lastEmittedValue.current) {
                    // External state change jump
                    containerRef.current.scrollTo({ top: expectedScrollTop, behavior: 'smooth' });
                }
            }
        }
        lastEmittedValue.current = value;
    }, [value, options]);

    return (
        <div className="scroll-picker-container">
            <div className="scroll-picker-overlay"></div>
            <div
                className="scroll-picker"
                ref={containerRef}
                onScroll={handleScroll}
            >
                <div style={{ height: "40px" }}></div>
                {options.map((opt) => (
                    <div
                        key={opt}
                        className={`scroll-picker-item ${opt === value ? 'active' : ''}`}
                        onClick={() => {
                            if (opt !== value) {
                                lastEmittedValue.current = opt;
                                onChange(opt);
                                if (containerRef.current) {
                                    const idx = options.indexOf(opt);
                                    containerRef.current.scrollTo({ top: idx * itemHeight, behavior: 'smooth' });
                                }
                            }
                        }}
                    >
                        {opt}
                    </div>
                ))}
                <div style={{ height: "40px" }}></div>
            </div>
        </div>
    );
}
