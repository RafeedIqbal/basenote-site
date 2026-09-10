import styles from "./ArrowIcon.module.css";

const paths = {
  "up-right": "M3 13 13 3M3 3h10v10",
  horizontal: "M2 8h12M6 4 2 8l4 4m4-8 4 4-4 4",
};

// SVG paths avoid the emoji font fallback used for Unicode arrows on iOS.
export default function ArrowIcon({
  direction = "up-right",
}: {
  direction?: keyof typeof paths;
}) {
  return (
    <span className={styles.icon} aria-hidden="true">
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
      >
        <path d={paths[direction]} />
      </svg>
    </span>
  );
}
