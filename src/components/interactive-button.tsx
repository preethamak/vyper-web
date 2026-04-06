"use client";

import Link from "next/link";
import { type CSSProperties, type ReactNode, useMemo, useState } from "react";

type Tone = "light" | "accent" | "dark";
type Size = "sm" | "md" | "lg";

type BaseProps = {
  children: ReactNode;
  className?: string;
  tone?: Tone;
  size?: Size;
  fullWidth?: boolean;
  onClick?: () => void;
};

type LinkVariant = BaseProps & {
  href: string;
  target?: string;
  rel?: string;
};

type ButtonVariant = Omit<BaseProps, "onClick"> & {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

type Props = LinkVariant | ButtonVariant;

function isLinkVariant(props: Props): props is LinkVariant {
  return "href" in props;
}

const toneClass: Record<Tone, string> = {
  light: "border-slate-900 bg-white text-slate-900",
  accent: "border-cyan-700 bg-cyan-50 text-cyan-900",
  dark: "border-slate-900 bg-slate-900 text-white",
};

const sizeClass: Record<Size, string> = {
  sm: "min-h-10 px-3.5 py-2 text-sm",
  md: "min-h-11 px-4.5 py-2.5 text-sm",
  lg: "min-h-12 px-5 py-3 text-base",
};

export function InteractiveButton(props: Props) {
  const [mouseX, setMouseX] = useState(50);
  const [mouseY, setMouseY] = useState(50);

  const tone = props.tone ?? "light";
  const size = props.size ?? "md";
  const fullWidth = props.fullWidth ?? false;

  const spotlight = useMemo(
    () => `radial-gradient(140px circle at ${mouseX}% ${mouseY}%, rgba(255,255,255,0.7), rgba(255,255,255,0))`,
    [mouseX, mouseY],
  );

  const className = [
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border-2 font-semibold shadow-[3px_3px_0_#1f2937] transition duration-150 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#1f2937] hover:-translate-y-0.5",
    toneClass[tone],
    sizeClass[size],
    fullWidth ? "w-full" : "w-auto",
    props.className ?? "",
  ]
    .join(" ")
    .trim();

  const style = {
    backgroundImage: spotlight,
  } as CSSProperties;

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setMouseX(Math.max(0, Math.min(100, x)));
    setMouseY(Math.max(0, Math.min(100, y)));
  };

  const content = (
    <>
      <span className="absolute inset-0 opacity-0 transition group-hover:opacity-100" style={style} />
      <span className="relative">{props.children}</span>
    </>
  );

  if (isLinkVariant(props)) {
    return (
      <Link
        href={props.href}
        target={props.target}
        rel={props.rel}
        className={className}
        onPointerMove={onPointerMove}
        onClick={props.onClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      className={className}
      onPointerMove={onPointerMove}
    >
      {content}
    </button>
  );
}
