/* eslint-disable react-hooks/exhaustive-deps */
import { usePathname } from "next/navigation";
import { useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  elementRef: React.RefObject<HTMLElement | null>;
};

export function useCloseOnInteraction({ isOpen, onClose, elementRef }: Props) {
  const pathname = usePathname();

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClick = (e: MouseEvent) => {
      if (
        elementRef.current &&
        !elementRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose, elementRef]);

  // Close on route change (any Link click)
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname]);
}
