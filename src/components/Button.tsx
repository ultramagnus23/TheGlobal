import Link from "next/link";
import { motion } from "framer-motion";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const MotionLink = motion.create(Link);

type Tier = "primary" | "secondary" | "tertiary";
type Size = "default" | "large";

const tierClasses: Record<Tier, string> = {
  primary:
    "bg-navy-800 text-white border border-navy-800 hover:bg-navy-700 hover:border-navy-700 disabled:bg-border disabled:border-border disabled:text-ink-tertiary",
  secondary:
    "bg-transparent text-navy-800 border-[1.5px] border-border-interactive hover:bg-navy-100 disabled:text-ink-tertiary disabled:border-border",
  tertiary:
    "bg-transparent text-navy-800 border border-transparent underline-offset-4 hover:underline disabled:text-ink-tertiary p-0 min-h-0",
};

const sizeClasses: Record<Size, string> = {
  default: "min-h-14 px-6 text-lg", // 56px
  large: "min-h-16 px-8 text-xl", // 64px, primary hero CTAs
};

const sharedClasses =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-150 disabled:cursor-not-allowed";

interface CommonProps {
  tier?: Tier;
  size?: Size;
  children: ReactNode;
  className?: string;
  chevron?: boolean;
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { tier = "primary", size = "default", children, className, chevron, ...rest } = props;

  const classes = cn(
    sharedClasses,
    tier === "tertiary" ? "" : sizeClasses[size],
    tierClasses[tier],
    className
  );

  const content = (
    <>
      {children}
      {chevron ? <span aria-hidden="true">›</span> : null}
    </>
  );

  // framer-motion's drag/animation event props conflict in type with the
  // native DOM ones of the same name — Button never uses either, so they're
  // stripped rather than reconciled.
  const CONFLICTING_KEYS = ["onDrag", "onDragStart", "onDragEnd", "onAnimationStart", "onAnimationEnd"] as const;
  function stripConflicting<T extends Record<string, unknown>>(obj: T) {
    const copy = { ...obj };
    CONFLICTING_KEYS.forEach((k) => delete copy[k]);
    return copy;
  }

  if ("href" in props && props.href) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <MotionLink
        href={props.href}
        className={classes}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        {...stripConflicting(anchorRest as Record<string, unknown>)}
      >
        {content}
      </MotionLink>
    );
  }

  return (
    <motion.button
      className={classes}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      {...stripConflicting(rest as Record<string, unknown>)}
    >
      {content}
    </motion.button>
  );
}
