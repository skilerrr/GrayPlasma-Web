import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { MONITORS_DATA } from "@/data/monitors";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug") || "";
    const format = searchParams.get("format") || "square";

    const monitor =
      MONITORS_DATA.find((m) => m.slug === slug || m.id === slug) ||
      MONITORS_DATA[0];

    const isSquare = format === "square";
    const width = isSquare ? 1080 : 1200;
    const height = isSquare ? 1080 : 630;

    const specPills = [
      monitor.specs.display.size,
      monitor.specs.display.resolution,
      `${monitor.specs.display.refreshRate}Hz`,
      monitor.specs.display.panelType,
      monitor.specs.display.contrastRatio || "1000:1",
    ];

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#0d0d11",
            color: "#ffffff",
            padding: "48px",
            fontFamily: "sans-serif",
            backgroundImage:
              "linear-gradient(to right, rgba(31, 32, 43, 0.7) 1px, transparent 1px), linear-gradient(to bottom, rgba(31, 32, 43, 0.7) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        >
          {/* Top Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "2px solid #27272a",
              paddingBottom: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  backgroundColor: "#ff5722",
                  color: "#000000",
                  fontWeight: 900,
                  fontSize: "14px",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}
              >
                GRAYPLASMA
              </div>
              <span style={{ fontSize: "14px", color: "#a1a1aa", fontWeight: 700 }}>
                DATA PENGUJIAN LAB GRAYPLASMA
              </span>
            </div>

            <div
              style={{
                backgroundColor: monitor.tier === "S-TIER" ? "#00e676" : "#ffb300",
                color: "#000000",
                fontWeight: 900,
                fontSize: "14px",
                padding: "6px 14px",
                borderRadius: "8px",
                textTransform: "uppercase",
              }}
            >
              {monitor.tier}
            </div>
          </div>

          {/* Center: Title & Specs Capsules */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "16px", color: "#00e676", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
                {monitor.brand} • REKOMENDASI MONITOR INDONESIA
              </span>
              <h1
                style={{
                  fontSize: isSquare ? "42px" : "36px",
                  fontWeight: 900,
                  color: "#ffffff",
                  lineHeight: 1.1,
                  margin: 0,
                  letterSpacing: "-1px",
                }}
              >
                {monitor.fullName}
              </h1>
            </div>

            {/* Spec Pills Row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {specPills.map((pill, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "#18181f",
                    border: "1px solid #3f3f46",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: 800,
                    padding: "8px 18px",
                    borderRadius: "9999px",
                    textTransform: "uppercase",
                  }}
                >
                  {pill}
                </div>
              ))}
            </div>

            {/* GrayPlasma Matrix Table Box */}
            <div
              style={{
                backgroundColor: "#12131a",
                border: "1px solid #27272a",
                borderRadius: "16px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#ff5722",
                  fontSize: "12px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                <span>DATA MATRIX LAB GTID (TOLERANSI 5 RGB)</span>
                <span>AKURASI & RESPON</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "11px", color: "#71717a" }}>RESPONSE TIME GtG</span>
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "#00e676" }}>
                    {monitor.responseTimeData?.toleranceNew || "5.2 ms (Optimal)"}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "11px", color: "#71717a" }}>COLOR GAMUT</span>
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "#00d2ff" }}>
                    {monitor.specs.display.colorGamut || "100% sRGB / 90% P3"}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "11px", color: "#71717a" }}>KONTRAS ASLI</span>
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff" }}>
                    {monitor.specs.display.contrastRatio || "1330:1 Black"}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "11px", color: "#71717a" }}>KECERAHAN (MAX)</span>
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "#ff2d55" }}>
                    ~270 Nits (SDR Mode)
                  </span>
                </div>
              </div>
            </div>

            {/* Verdict Quote */}
            <div
              style={{
                backgroundColor: "rgba(0, 230, 118, 0.08)",
                border: "1px solid rgba(0, 230, 118, 0.3)",
                borderRadius: "12px",
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "13px", color: "#d4d4d8", fontWeight: 600 }}>
                <strong>VERDICT //</strong> {monitor.expertVerdict}
              </span>
            </div>
          </div>

          {/* Bottom Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "2px solid #27272a",
              paddingTop: "20px",
            }}
          >
            <div style={{ display: "flex", gap: "20px", fontSize: "13px", color: "#a1a1aa", fontWeight: 700 }}>
              <span>TikTok: @GRAYPLASMA</span>
              <span>Discord: @GRAYPLASMA</span>
              <span>IG: @GRAYPLASMA</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#71717a", fontWeight: 600 }}>
              <span>GRAYPLASMA DIGITAL & KREATIF</span>
            </div>
          </div>
        </div>
      ),
      {
        width,
        height,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}
