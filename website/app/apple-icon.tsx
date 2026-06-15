import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "180px",
          height: "180px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          borderRadius: "42px",
          background: "#8C5368",
          color: "#FFFFFF",
          fontFamily: "Georgia",
          fontSize: "76px",
          fontWeight: 700
        }}
      >
        DK
        <span
          style={{
            position: "absolute",
            right: "20px",
            top: "20px",
            width: "25px",
            height: "25px",
            borderRadius: "999px",
            background: "#E5B84B",
            border: "5px solid #8C5368"
          }}
        />
      </div>
    ),
    size
  );
}
