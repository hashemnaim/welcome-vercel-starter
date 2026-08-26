import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";

type Variant = "up" | "fade" | "scale" | "left" | "right" | "blur";

interface RevealProps {
  children: ReactNode;
  variant?: Variant;
  delay?: number; // ms
  className?: string;
  as?: "div" | "section" | "span";
  once?: boolean;
  stagger?: boolean;
}

/**
 * Lightweight scroll-reveal wrapper using IntersectionObserver.
 * Respects prefers-reduced-motion (renders visible immediately).
 */
export const Reveal = ({
  children,
  variant = "up",
  delay = 0,
  className = "",
  as: Tag = "div",
  once = true,
  stagger = false,
}: RevealProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  const style: CSSProperties = { transitionDelay: `${delay}ms` };

  return (
    <Tag
      ref={ref as never}
      data-reveal={variant}
      data-in={inView ? "true" : "false"}
      data-stagger={stagger ? "true" : undefined}
      className={`reveal ${className}`}
      style={style}
    >
      {children}
    </Tag>
  );
};
