import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "64px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          borderRadius: "16px",
          background: "#8C5368",
          color: "#FFFFFF",
          fontFamily: "Georgia",
          fontSize: "28px",
          fontWeight: 700
        }}
      >
        DK
        <span
          style={{
            position: "absolute",
            right: "7px",
            top: "7px",
            width: "9px",
            height: "9px",
            borderRadius: "999px",
            background: "#E5B84B",
            border: "2px solid #8C5368"
          }}
        />
      </div>
    ),
    size
  );
}
