import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  variant?: 'up' | 'scale' | 'left' | 'right';
  delay?: 0 | 1 | 2 | 3 | 4;
  /** re-run every time the element scrolls into view instead of once */
  repeat?: boolean;
}

/**
 * Scroll-triggered reveal wrapper. Wrap any block in <Reveal> to have it
 * animate in (fade + motion) the moment it enters the viewport.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  as = 'div',
  className = '',
  variant = 'up',
  delay = 0,
  repeat = false
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setInView(true);
            if (!repeat) observer.unobserve(entry.target);
          } else if (repeat) {
            setInView(false);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [repeat]);

  const variantClass =
    variant === 'scale' ? 'reveal-scale' : variant === 'left' ? 'reveal-left' : variant === 'right' ? 'reveal-right' : 'reveal-up';

  const Tag = as as any;

  return (
    <Tag
      ref={ref}
      className={`${variantClass} ${delay ? `delay-${delay}` : ''} ${inView ? 'in-view' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
};
