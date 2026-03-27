import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const alt = "Basenote Solutions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  const svgBuffer = readFileSync(
    join(process.cwd(), "public/assets/logo-icon-3d.svg")
  );
  const svgBase64 = svgBuffer.toString("base64");

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
        <img
          src={`data:image/svg+xml;base64,${svgBase64}`}
          alt=""
          width={160}
          height={160}
        />
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
