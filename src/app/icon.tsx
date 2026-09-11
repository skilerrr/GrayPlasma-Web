import { ImageResponse } from "next/og";


export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 16,
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#00e676",
          borderRadius: "8px",
          border: "1.5px solid #3f3f46",
          fontWeight: 900,
          fontFamily: "sans-serif",
          letterSpacing: "-0.5px",
        }}
      >
        GP
      </div>
    ),
    {
      ...size,
    }
  );
}
