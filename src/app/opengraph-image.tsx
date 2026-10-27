import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Z Andrie | Creative Developer & Full-Stack Technologist";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "54px 70px",
          backgroundColor: "#070707",
          backgroundImage:
            "radial-gradient(ellipse at 50% 0%, rgba(244, 221, 184, 0.22) 0%, rgba(244, 221, 184, 0.04) 50%, rgba(7, 7, 7, 0.98) 80%)",
          color: "#e7e5df",
          border: "2px solid #232220",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {/* Top Header HUD */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            borderBottom: "1px solid #232220",
            paddingBottom: "24px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "26px",
                fontWeight: 900,
                letterSpacing: "3px",
                color: "#e7e5df",
                textTransform: "uppercase",
              }}
            >
              Z ANDRIE
            </span>
            <span
              style={{
                fontSize: "13px",
                letterSpacing: "2px",
                color: "#a8a59d",
                textTransform: "uppercase",
                fontFamily: "monospace",
              }}
            >
              Creative Developer · Philippines
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "6px 16px",
              borderRadius: "4px",
              border: "1px solid #2e2e2e",
              backgroundColor: "#121212",
              fontSize: "12px",
              letterSpacing: "2px",
              color: "#f4ddb8",
              fontFamily: "monospace",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#52ff40",
              }}
            />
            AVAILABLE FOR CONTRACTS
          </div>
        </div>

        {/* Center Theatrical Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "auto", marginBottom: "auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "13px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#d36b54",
              fontFamily: "monospace",
              fontWeight: "bold",
            }}
          >
            <span>[ STAGE : PENUMBRA ]</span>
            <span>•</span>
            <span>WEBGL 3D · GSAP TIMELINES · REACT 19</span>
          </div>

          <h1
            style={{
              fontSize: "66px",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#e7e5df",
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            Architecting Theatrical Web Experiences &amp; Next-Gen Interfaces
          </h1>

          <p
            style={{
              fontSize: "20px",
              color: "#a8a59d",
              margin: 0,
              lineHeight: 1.4,
              maxWidth: "920px",
            }}
          >
            Immersive WebGL room with aiming spotlight physics, vertical scrub showcase,
            dynamic odometer rolls, and high-velocity systems.
          </p>
        </div>

        {/* Bottom Telemetry HUD */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            borderTop: "1px solid #232220",
            paddingTop: "20px",
            fontFamily: "monospace",
            fontSize: "12px",
            color: "#666",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex", gap: "28px", color: "#888" }}>
            <span>PORTFOLIO 2026</span>
            <span style={{ color: "#d36b54" }}>Z-ANDRIE.VERCEL.APP</span>
          </div>

          <div style={{ display: "flex", gap: "20px", color: "#888" }}>
            <span>FOCUS: 100%</span>
            <span>LAMPLIGHT: 2700K</span>
            <span style={{ color: "#f4ddb8" }}>PROJECTING: ACTIVE</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}