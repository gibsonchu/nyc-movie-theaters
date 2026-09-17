import styles from "./ImagePlaceholder.module.css";

/** A clearly-marked stand-in for an image the author will drop in later. */
export function ImagePlaceholder({
  label,
  aspectRatio = "16 / 10",
  className,
}: {
  label: string;
  aspectRatio?: string;
  className?: string;
}) {
  return (
    <div className={`${styles.placeholder} ${className ?? ""}`} style={{ aspectRatio }}>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
