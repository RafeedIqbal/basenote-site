import { ImageResponse } from "next/og";

export const alt = "Basenote Solutions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#030f26",
          gap: 40
        }}
      >
        <svg
          width="120"
          height="137"
          viewBox="0 0 3927 4492"
          fill="none"
        >
          <path
            d="M3709.28 2970.33L1963.19 0L0 3335.31L1963.19 4492L3926.37 3335.31L1963.19 2178.62L829.067 2846.81L1963.19 889.042M881.469 3335.31L1961.31 2655.9L3041.16 3335.31L1961.31 4014.73L881.469 3335.31Z"
            fill="white"
          />
        </svg>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12
          }}
        >
          <span
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: "white",
              letterSpacing: "0.04em",
              textTransform: "uppercase"
            }}
          >
            Basenote Solutions
          </span>
          <span
            style={{
              fontSize: 22,
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "0.02em"
            }}
          >
            Designing and launching fragrance brands through scent, craft, and
            strategy.
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
