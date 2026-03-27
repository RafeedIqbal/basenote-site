import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0f1a",
          borderRadius: 40
        }}
      >
        <img
          src={`data:image/svg+xml;base64,${svgBase64}`}
          alt=""
          width={140}
          height={140}
        />
      </div>
    ),
    { ...size }
  );
}
