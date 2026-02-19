/* eslint-disable react-hooks/exhaustive-deps */
import { usePathname } from "next/navigation";
import { useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  elementRef: React.RefObject<HTMLElement | null>;
  ignoreRefs?: React.RefObject<HTMLElement | null>[]; // 👈 أضفناها
};

export function useCloseOnInteraction({
  isOpen,
  onClose,
  elementRef,
  ignoreRefs = [],
}: Props) {
  const pathname = usePathname();

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;

      if (elementRef.current?.contains(target)) return;

      for (const ref of ignoreRefs) {
        if (ref.current?.contains(target)) return;
      }

      onClose();
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose, elementRef, ...ignoreRefs]);

  // Close on route change
  useEffect(() => {
    if (isOpen) onClose();
  }, [pathname]);
}
