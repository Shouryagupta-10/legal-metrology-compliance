import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import './AccordionGallery.css';

export interface AccordionItem {
  image: string;
  label: string;
  link?: string;
  alt?: string;
  badge?: string;
  statusBadge?: string;
  statusColor?: string;
  category?: string;
  price?: string;
  sample?: any;
}

export interface AccordionGalleryProps {
  items?: AccordionItem[];
  defaultIndex?: number;
  accentColor?: string;
  overlayColor?: string;
  textColor?: string;
  height?: number;
  gap?: number;
  radius?: number;
  expandRatio?: number;
  orientation?: 'horizontal' | 'vertical';
  duration?: number;
  ease?: string;
  parallax?: number;
  tilt?: number;
  stagger?: number;
  trigger?: 'hover' | 'click';
  showLabels?: boolean;
  grayscale?: boolean;
  className?: string;
  onItemSelect?: (item: AccordionItem, index: number) => void;
}

const DEFAULT_ITEMS: AccordionItem[] = [
  { image: 'https://picsum.photos/id/1015/900/1200', label: 'Canyon', link: '#' },
  { image: 'https://picsum.photos/id/1018/900/1200', label: 'Ridgeline', link: '#' },
  { image: 'https://picsum.photos/id/1039/900/1200', label: 'Falls', link: '#' },
  { image: 'https://picsum.photos/id/1043/900/1200', label: 'Harbour', link: '#' },
  { image: 'https://picsum.photos/id/1044/900/1200', label: 'Skyline', link: '#' }
];

export const AccordionGallery: React.FC<AccordionGalleryProps> = ({
  items = DEFAULT_ITEMS,
  defaultIndex = 2,
  accentColor = '#ffffff',
  overlayColor = '#060010',
  textColor = '#ffffff',
  height = 460,
  gap = 10,
  radius = 16,
  expandRatio = 0.52,
  orientation = 'horizontal',
  duration = 0.6,
  ease = 'power3.out',
  parallax = 0.5,
  tilt = 8,
  stagger = 0.06,
  trigger = 'hover',
  showLabels = true,
  grayscale = true,
  className = '',
  onItemSelect
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLElement | null)[]>([]);
  const barRefs = useRef<(HTMLElement | null)[]>([]);
  const textRefs = useRef<(HTMLElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(320);

  const vertical = orientation === 'vertical';
  const count = items.length;
  const [active, setActive] = useState(Math.min(Math.max(defaultIndex, 0), count - 1));

  const prefersReduced =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const applyLayout = useCallback(
    (animate: boolean) => {
      const panels = panelRefs.current;
      if (!panels.length) return;

      const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
      const mediaSize = mediaSizeRef.current;

      tlRef.current?.kill();
      const dur = animate && !prefersReduced ? duration : 0;
      const tl = gsap.timeline();

      panels.forEach((panel, i) => {
        if (!panel) return;
        const isActive = i === active;
        const media = mediaRefs.current[i];
        const bar = barRefs.current[i];
        const text = textRefs.current[i];

        const rot = isActive ? 0 : i < active ? tilt : -tilt;
        const rotProp = vertical ? { rotateX: -rot } : { rotateY: rot };

        tl.to(panel, { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease }, 0);

        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, active - i));
          const shift = drift * parallax * mediaSize * 0.06;
          const gray = grayscale ? (isActive ? 0 : 1) : 0;
          tl.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: vertical ? 0 : isActive ? 0 : shift,
              y: vertical ? (isActive ? 0 : shift) : 0,
              '--ag-gray': gray,
              '--ag-dim': isActive ? 0 : 0.35,
              duration: dur,
              ease
            },
            0
          );
        }

        if (showLabels && bar && text) {
          if (isActive) {
            tl.to([bar, text], { opacity: 1, x: 0, duration: dur, ease, stagger: prefersReduced ? 0 : stagger }, 0);
          } else {
            tl.to([bar, text], { opacity: 0, x: -14, duration: dur * 0.6, ease }, 0);
          }
        }
      });

      tlRef.current = tl;
    },
    [
      active,
      count,
      expandRatio,
      duration,
      ease,
      vertical,
      tilt,
      parallax,
      grayscale,
      showLabels,
      stagger,
      prefersReduced
    ]
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const total = vertical ? rect.height : rect.width;
      const usable = Math.max(total - gap * (count - 1), 120);
      const size = Math.max(140, usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22);
      mediaSizeRef.current = size;
      el.style.setProperty('--ag-media-size', `${size}px`);
      applyLayout(!firstRunRef.current);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [applyLayout, gap, count, expandRatio, vertical]);

  useEffect(() => {
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [applyLayout]);

  useEffect(
    () => () => {
      tlRef.current?.kill();
    },
    []
  );

  const handleEnter = (i: number) => {
    if (trigger === 'hover') setActive(i);
  };

  const handleClick = (i: number, e: React.MouseEvent) => {
    e.preventDefault();
    setActive(i);
    if (onItemSelect && items[i]) {
      onItemSelect(items[i], i);
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (i + 1) % count;
      setActive(next);
      if (onItemSelect && items[next]) {
        onItemSelect(items[next], next);
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (i - 1 + count) % count;
      setActive(prev);
      if (onItemSelect && items[prev]) {
        onItemSelect(items[prev], prev);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (onItemSelect && items[i]) {
        onItemSelect(items[i], i);
      }
    }
  };

  return (
    <div
      ref={rootRef}
      className={`accordion-gallery${vertical ? ' accordion-gallery--vertical' : ''}${className ? ` ${className}` : ''}`}
      style={
        {
          '--ag-accent': accentColor,
          '--ag-overlay': overlayColor,
          '--ag-text': textColor,
          '--ag-gap': `${gap}px`,
          '--ag-radius': `${radius}px`,
          height: vertical ? `${Math.round(height * 1.6)}px` : `${height}px`
        } as React.CSSProperties
      }
      role="list"
      aria-label="Image accordion gallery"
    >
      {items.map((item, i) => {
        const isActive = i === active;
        const Tag = item.link ? 'a' : 'div';
        return (
          <Tag
            key={i}
            ref={el => {
              panelRefs.current[i] = el;
            }}
            className={`ag-panel${isActive ? ' ag-panel--active' : ''}`}
            style={{ borderRadius: `${radius}px` }}
            href={item.link || undefined}
            onClick={e => handleClick(i, e)}
            onMouseEnter={() => handleEnter(i)}
            onFocus={() => setActive(i)}
            onKeyDown={e => handleKeyDown(i, e)}
            role="listitem"
            tabIndex={0}
            aria-current={isActive ? 'true' : undefined}
            aria-label={item.label}
          >
            {/* Top Badges for Commercial Benchmarks */}
            <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between gap-1 pointer-events-none">
              <span className="text-[10px] font-mono font-bold bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-md text-white/90 border border-white/15">
                SPECIMEN // 0{i + 1}
              </span>
              {item.statusBadge && (
                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider backdrop-blur-md border ${
                    item.statusBadge.includes('PASS') || item.statusBadge.includes('COMPLIANT')
                      ? 'bg-emerald-950/85 text-emerald-400 border-emerald-500/40'
                      : item.statusBadge.includes('TAMPER')
                      ? 'bg-fuchsia-950/85 text-fuchsia-300 border-fuchsia-500/40'
                      : 'bg-rose-950/85 text-rose-300 border-rose-500/40'
                  }`}
                >
                  {item.statusBadge}
                </span>
              )}
            </div>

            {/* Price Tag pill */}
            {item.price && (
              <div className="absolute top-11 left-3 z-20 pointer-events-none">
                <span className="text-[10px] font-mono font-bold bg-slate-900/85 backdrop-blur-md px-2 py-0.5 rounded text-sky-300 border border-slate-700">
                  {item.price}
                </span>
              </div>
            )}

            <span className="ag-panel__frame">
              <span
                className="ag-panel__media"
                ref={el => {
                  mediaRefs.current[i] = el;
                }}
              >
                <img src={item.image} alt={item.alt || item.label || ''} draggable="false" />
              </span>
              <span className="ag-panel__overlay" aria-hidden="true" />
            </span>

            {showLabels && (
              <span className="ag-panel__label" aria-hidden="true">
                <div className="ag-panel__info">
                  <span
                    className="ag-panel__bar"
                    ref={el => {
                      barRefs.current[i] = el;
                    }}
                  />
                  <div className="min-w-0">
                    <span
                      className="ag-panel__text block truncate"
                      ref={el => {
                        textRefs.current[i] = el;
                      }}
                    >
                      {item.label}
                    </span>
                    {item.category && (
                      <span className="text-[10px] font-mono text-purple-300 uppercase tracking-wider block opacity-90 mt-0.5">
                        {item.category}
                      </span>
                    )}
                  </div>
                </div>

                {isActive && (
                  <span className="bg-purple-600/90 text-white text-[10px] font-bold font-mono px-2.5 py-1 rounded-full border border-purple-400/40 shrink-0 shadow-md">
                    Inspect &rarr;
                  </span>
                )}
              </span>
            )}
          </Tag>
        );
      })}
    </div>
  );
};

export default AccordionGallery;
