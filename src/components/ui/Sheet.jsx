import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import IconButton from "./IconButton";

/**
 * Modal surface used for the mobile navigation drawer, reading options and
 * other secondary panels. Closes on Escape and on backdrop click, locks
 * background scroll, and moves focus into the panel when opened.
 */
export default function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
  variant = "sheet",
  labelledBy,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose?.();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const isDrawer = variant === "drawer";

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        className={isDrawer ? "drawer" : "sheet"}
        role="dialog"
        aria-modal="true"
        aria-label={labelledBy ? undefined : title}
        aria-labelledby={labelledBy}
        tabIndex={-1}
      >
        <div className={isDrawer ? "drawer__head" : "sheet__head"}>
          <h2 className={isDrawer ? "card__title" : "sheet__title"} id={labelledBy}>
            {title}
          </h2>
          <IconButton
            icon={X}
            label={`Close ${title ?? "panel"}`}
            size={18}
            onClick={onClose}
          />
        </div>
        <div className={isDrawer ? "drawer__body" : ""}>{children}</div>
        {footer ? <div className={isDrawer ? "drawer__foot" : ""}>{footer}</div> : null}
      </div>
    </>
  );
}
