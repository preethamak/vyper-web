"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  className?: string;
  minHeight?: number;
  children: (size: { width: number; height: number }) => React.ReactNode;
};

export function ChartFrame({ className = "", minHeight = 280, children }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const updateSize = () => {
      const nextWidth = Math.floor(node.clientWidth);
      const nextHeight = Math.max(Math.floor(node.clientHeight), minHeight);
      if (nextWidth > 0 && nextHeight > 0) {
        setSize((prev) => {
          if (prev.width === nextWidth && prev.height === nextHeight) return prev;
          return { width: nextWidth, height: nextHeight };
        });
      }
    };

    updateSize();

    const observer = new ResizeObserver(() => updateSize());
    observer.observe(node);

    return () => observer.disconnect();
  }, [minHeight]);

  return (
    <div ref={ref} className={className}>
      {size.width > 0 ? (
        children(size)
      ) : (
        <div className="h-full w-full animate-pulse rounded-2xl bg-slate-200/60" />
      )}
    </div>
  );
}
