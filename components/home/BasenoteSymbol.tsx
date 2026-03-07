import type { ComponentProps } from "react";

type BasenoteSymbolProps = ComponentProps<"svg">;

export default function BasenoteSymbol(props: BasenoteSymbolProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M50 9L85 56L67.5 51.2L50 28.3L32.5 51.2L15 56L50 9Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M50 59L84 78L50 99L16 78L50 59ZM50 72L64.5 79.2L50 87.5L35.5 79.2L50 72Z"
        fill="currentColor"
      />
    </svg>
  );
}
