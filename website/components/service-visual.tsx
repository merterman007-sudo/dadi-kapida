import Image from "next/image";
import { getServiceVisual, type ServiceScene } from "../lib/service-visuals";
import { getServicePhoto } from "../lib/photo-bank";

type ServiceVisualProps = {
  slug: string;
  title: string;
  className?: string;
  compact?: boolean;
  framed?: boolean;
};

const palette = {
  rose: "#8C5368",
  roseDark: "#6D3D51",
  gold: "#B8860B",
  white: "#FFFFFF"
} as const;

function SceneArtwork({
  scene,
  variant,
  id
}: {
  scene: ServiceScene;
  variant: number;
  id: string;
}) {
  const v = variant;
  const offset = v * 10;
  const sparkX = 470 + v * 8;
  const sparkY = 95 + v * 4;

  return (
    <svg
      viewBox="0 0 720 480"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.rose} />
          <stop offset="60%" stopColor={palette.roseDark} />
          <stop offset="100%" stopColor="#442430" />
        </linearGradient>
        <linearGradient id={`${id}-soft`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.white} stopOpacity="0.28" />
          <stop offset="100%" stopColor={palette.white} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      <rect width="720" height="480" fill={`url(#${id}-bg)`} />
      <circle cx="560" cy="100" r={120 + v * 4} fill={palette.white} fillOpacity="0.06" />
      <circle cx="150" cy="360" r={130 + v * 3} fill={palette.gold} fillOpacity="0.08" />
      <path
        d={`M0 ${380 + v * 2}C120 ${340 + v * 2} 210 ${420 + v * 2} 330 ${390 + v * 2}C460 ${358 + v * 2} 540 ${336 + v * 2} 720 ${370 + v * 2}V480H0Z`}
        fill={`url(#${id}-soft)`}
      />

      {/* Soft framing grid */}
      <rect x="52" y="50" width="616" height="380" rx="34" fill={palette.white} fillOpacity="0.04" stroke={palette.white} strokeOpacity="0.08" />
      <rect x="78" y="76" width="66" height="66" rx="22" fill={palette.white} fillOpacity="0.08" />
      <rect x="576" y="76" width="66" height="66" rx="22" fill={palette.white} fillOpacity="0.08" />

      {scene === "care" ? (
        <g>
          <path d="M214 282L330 188L446 282V360H214Z" fill={palette.white} fillOpacity="0.12" stroke={palette.white} strokeOpacity="0.34" strokeWidth="4" />
          <path d="M258 282V232H402V282" stroke={palette.white} strokeOpacity="0.34" strokeWidth="4" fill="none" />
          <circle cx={325 + offset * 0.3} cy={270 - v * 3} r="40" fill={palette.white} fillOpacity="0.18" stroke={palette.white} strokeOpacity="0.25" strokeWidth="3" />
          <path d="M286 338c10-34 55-34 65 0" stroke={palette.white} strokeOpacity="0.35" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M404 220c18-26 51-20 61 7 8 22-3 46-23 60-17 12-27 24-27 24s-9-12-27-24c-20-14-31-38-23-60 5-14 17-21 39-7z" fill={palette.gold} fillOpacity="0.18" stroke={palette.gold} strokeOpacity="0.42" strokeWidth="3" />
        </g>
      ) : null}

      {scene === "elder" ? (
        <g>
          <rect x="204" y="214" width="186" height="138" rx="28" fill={palette.white} fillOpacity="0.12" stroke={palette.white} strokeOpacity="0.30" strokeWidth="4" />
          <path d="M234 350v-52c0-22 18-40 40-40h50c22 0 40 18 40 40v52" stroke={palette.white} strokeOpacity="0.36" strokeWidth="4" fill="none" />
          <path d="M258 272h80" stroke={palette.gold} strokeOpacity="0.5" strokeWidth="6" strokeLinecap="round" />
          <path d="M294 262c0-20 14-34 33-34" stroke={palette.white} strokeOpacity="0.32" strokeWidth="4" strokeLinecap="round" />
          <path d="M392 206c-10 18-29 26-49 26" stroke={palette.white} strokeOpacity="0.30" strokeWidth="4" strokeLinecap="round" fill="none" />
          <circle cx="405" cy="230" r="36" fill={palette.gold} fillOpacity="0.16" stroke={palette.gold} strokeOpacity="0.42" strokeWidth="3" />
          <path d="M392 230h26M405 217v26" stroke={palette.gold} strokeOpacity="0.72" strokeWidth="4" strokeLinecap="round" />
        </g>
      ) : null}

      {scene === "patient" ? (
        <g>
          <rect x="196" y="248" width="248" height="92" rx="26" fill={palette.white} fillOpacity="0.12" stroke={palette.white} strokeOpacity="0.3" strokeWidth="4" />
          <rect x="232" y="220" width="122" height="40" rx="18" fill={palette.white} fillOpacity="0.18" />
          <rect x="240" y="260" width="168" height="16" rx="8" fill={palette.gold} fillOpacity="0.22" />
          <path d="M246 342h228" stroke={palette.white} strokeOpacity="0.34" strokeWidth="4" strokeLinecap="round" />
          <circle cx="414" cy="210" r="40" fill={palette.white} fillOpacity="0.08" stroke={palette.white} strokeOpacity="0.24" strokeWidth="4" />
          <path d="M414 188v44M392 210h44" stroke={palette.gold} strokeOpacity="0.78" strokeWidth="5" strokeLinecap="round" />
          <path d="M180 276c20-18 34-18 48 0" stroke={palette.white} strokeOpacity="0.26" strokeWidth="4" strokeLinecap="round" fill="none" />
        </g>
      ) : null}

      {scene === "cleaning" ? (
        <g>
          <path d="M236 186h106l38 132h-182l38-132z" fill={palette.white} fillOpacity="0.12" stroke={palette.white} strokeOpacity="0.34" strokeWidth="4" />
          <path d="M268 196h42v18h-42z" fill={palette.gold} fillOpacity="0.22" />
          <path d="M284 210h14v54h-14z" fill={palette.white} fillOpacity="0.20" />
          <path d="M346 240c16 0 30 14 30 30v48H282v-48c0-16 14-30 30-30h34z" fill={palette.white} fillOpacity="0.08" stroke={palette.white} strokeOpacity="0.30" strokeWidth="4" />
          <path d="M394 292c18 0 26 12 26 28v30h-74v-18c0-22 18-40 40-40h8z" fill={palette.gold} fillOpacity="0.18" stroke={palette.gold} strokeOpacity="0.42" strokeWidth="3" />
          <path d="M154 226l12 0m-6-6v12" stroke={palette.white} strokeOpacity="0.4" strokeWidth="4" strokeLinecap="round" />
          <path d="M488 160l14 0m-7-7v14" stroke={palette.gold} strokeOpacity="0.55" strokeWidth="4" strokeLinecap="round" />
          <path d="M508 310l10 0m-5-5v10" stroke={palette.white} strokeOpacity="0.34" strokeWidth="4" strokeLinecap="round" />
        </g>
      ) : null}

      {scene === "driver" ? (
        <g>
          <path d="M182 316c38-64 114-96 196-96 92 0 170 42 212 112" stroke={palette.white} strokeOpacity="0.22" strokeWidth="14" strokeLinecap="round" fill="none" />
          <path d="M212 270h236c20 0 38 16 42 36l8 40H186l10-34c6-24 18-42 16-42z" fill={palette.white} fillOpacity="0.12" stroke={palette.white} strokeOpacity="0.32" strokeWidth="4" strokeLinejoin="round" />
          <rect x="252" y="236" width="108" height="38" rx="18" fill={palette.gold} fillOpacity="0.16" />
          <path d="M268 272h104" stroke={palette.gold} strokeOpacity="0.44" strokeWidth="4" strokeLinecap="round" />
          <circle cx="242" cy="342" r="34" fill={palette.roseDark} fillOpacity="0.85" stroke={palette.white} strokeOpacity="0.22" strokeWidth="4" />
          <circle cx="400" cy="342" r="34" fill={palette.roseDark} fillOpacity="0.85" stroke={palette.white} strokeOpacity="0.22" strokeWidth="4" />
          <circle cx="242" cy="342" r="14" fill={palette.white} fillOpacity="0.24" />
          <circle cx="400" cy="342" r="14" fill={palette.white} fillOpacity="0.24" />
          <path d="M170 206h88M480 206h48" stroke={palette.gold} strokeOpacity="0.4" strokeWidth="5" strokeLinecap="round" />
        </g>
      ) : null}

      {scene === "chef" ? (
        <g>
          <path d="M264 210c0-34 28-60 62-60 28 0 51 18 58 43 4 2 8 4 11 7 12 9 19 24 19 40 0 26-21 47-47 47H293c-31 0-57-25-57-57 0-9 2-18 5-26 7-2 15-1 23 6z" fill={palette.white} fillOpacity="0.12" stroke={palette.white} strokeOpacity="0.34" strokeWidth="4" strokeLinejoin="round" />
          <path d="M286 286h152v34H286z" fill={palette.gold} fillOpacity="0.18" stroke={palette.gold} strokeOpacity="0.38" strokeWidth="3" />
          <circle cx="350" cy="328" r="52" fill={palette.white} fillOpacity="0.08" stroke={palette.white} strokeOpacity="0.24" strokeWidth="4" />
          <circle cx="350" cy="328" r="22" fill={palette.gold} fillOpacity="0.2" />
          <path d="M350 270v-30M390 276l22-18M310 276l-22-18" stroke={palette.white} strokeOpacity="0.34" strokeWidth="4" strokeLinecap="round" />
          <path d="M498 174c10 8 18 18 22 30" stroke={palette.gold} strokeOpacity="0.55" strokeWidth="4" strokeLinecap="round" />
          <path d="M522 204l6 18m-14-9h18" stroke={palette.gold} strokeOpacity="0.55" strokeWidth="4" strokeLinecap="round" />
        </g>
      ) : null}

      {scene === "house" ? (
        <g>
          <rect x="196" y="182" width="156" height="180" rx="30" fill={palette.white} fillOpacity="0.12" stroke={palette.white} strokeOpacity="0.34" strokeWidth="4" />
          <path d="M230 214h88M230 250h88M230 286h88M230 322h62" stroke={palette.white} strokeOpacity="0.34" strokeWidth="5" strokeLinecap="round" />
          <circle cx="406" cy="224" r="54" fill={palette.gold} fillOpacity="0.16" stroke={palette.gold} strokeOpacity="0.42" strokeWidth="3" />
          <path d="M384 226h44M406 204v44" stroke={palette.gold} strokeOpacity="0.72" strokeWidth="5" strokeLinecap="round" />
          <path d="M394 310c10-20 30-30 58-30" stroke={palette.white} strokeOpacity="0.32" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M496 330l34-34 34 34v38h-68z" fill={palette.white} fillOpacity="0.12" stroke={palette.white} strokeOpacity="0.34" strokeWidth="4" />
        </g>
      ) : null}

      {scene === "laundry" ? (
        <g>
          <path d="M236 188l64-30 64 30v110l-64 34-64-34z" fill={palette.white} fillOpacity="0.12" stroke={palette.white} strokeOpacity="0.34" strokeWidth="4" strokeLinejoin="round" />
          <path d="M268 214c24 20 30 40 32 60M368 214c-24 20-30 40-32 60" stroke={palette.white} strokeOpacity="0.32" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M430 224h88l-12 112h-64z" fill={palette.gold} fillOpacity="0.18" stroke={palette.gold} strokeOpacity="0.42" strokeWidth="3" />
          <path d="M452 256h42M447 282h50" stroke={palette.white} strokeOpacity="0.36" strokeWidth="5" strokeLinecap="round" />
          <circle cx="192" cy="336" r="30" fill={palette.white} fillOpacity="0.08" stroke={palette.white} strokeOpacity="0.25" strokeWidth="4" />
          <path d="M180 336h24" stroke={palette.gold} strokeOpacity="0.72" strokeWidth="4" strokeLinecap="round" />
          <path d="M180 326l12 12 12-12" stroke={palette.gold} strokeOpacity="0.72" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : null}

      {scene === "consultation" ? (
        <g>
          <path d="M212 208c0-24 20-44 44-44h176c24 0 44 20 44 44v92c0 24-20 44-44 44H278l-56 38v-38h-6c-24 0-44-20-44-44z" fill={palette.white} fillOpacity="0.10" stroke={palette.white} strokeOpacity="0.34" strokeWidth="4" strokeLinejoin="round" />
          <circle cx="280" cy="246" r="34" fill={palette.white} fillOpacity="0.16" />
          <circle cx="390" cy="246" r="34" fill={palette.gold} fillOpacity="0.18" />
          <path d="M244 332c12-26 32-38 60-38s48 12 60 38" stroke={palette.white} strokeOpacity="0.34" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M354 332c12-26 32-38 60-38s48 12 60 38" stroke={palette.white} strokeOpacity="0.34" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M470 178h54l-12 20h-42z" fill={palette.gold} fillOpacity="0.16" />
          <path d="M494 186h14" stroke={palette.gold} strokeOpacity="0.72" strokeWidth="4" strokeLinecap="round" />
        </g>
      ) : null}

      {/* Decorative sparkles */}
      <g opacity="0.9">
        <path d={`M${sparkX} ${sparkY - 14}l4 10 10 4-10 4-4 10-4-10-10-4 10-4z`} fill={palette.gold} fillOpacity="0.65" />
        <path d={`M${110 + offset} ${120 + v * 6}l3 8 8 3-8 3-3 8-3-8-8-3 8-3z`} fill={palette.white} fillOpacity="0.75" />
        <path d={`M${610 - offset} ${342 - v * 4}l3 8 8 3-8 3-3 8-3-8-8-3 8-3z`} fill={palette.white} fillOpacity="0.55" />
      </g>
    </svg>
  );
}

export function ServiceVisual({ slug, title, className = "", compact = false, framed = true }: ServiceVisualProps) {
  const visual = getServiceVisual(slug);
  const photoSrc = getServicePhoto(slug);
  const safeId = slug.replace(/[^a-z0-9]+/gi, "-");
  const wrapperClassName = compact ? "min-h-[220px]" : "min-h-[280px]";
  const paddingClass = compact ? "p-4" : "p-5";
  const frameClassName = framed ? "border border-line bg-white shadow-soft" : "";
  const radiusClassName = framed ? "rounded-[28px]" : "rounded-none";

  return (
    <figure
      className={`relative overflow-hidden ${radiusClassName} ${frameClassName} ${wrapperClassName} ${className}`}
      aria-label={`${title} için premium görsel`}
    >
      {photoSrc ? (
        <>
          <Image
            src={photoSrc}
            alt={title}
            fill
            sizes={compact ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 100vw, 40vw"}
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(49,23,32,0.08)_0%,rgba(49,23,32,0.42)_68%,rgba(49,23,32,0.72)_100%)]" />
        </>
      ) : (
        <>
          <SceneArtwork scene={visual.scene} variant={visual.variant} id={safeId} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,16,21,0.04)_0%,rgba(28,16,21,0.18)_100%)]" />
        </>
      )}
      <div className={`relative z-10 flex h-full flex-col justify-between ${paddingClass}`}>
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
            {visual.badge}
          </span>
          <span className="rounded-full bg-white/12 px-3 py-1 text-[10px] font-medium text-white/70 backdrop-blur-sm">
            Dadı Kapıda
          </span>
        </div>

        <div className="mt-auto max-w-[18rem]">
          <p className="font-heading text-[1.2rem] font-semibold leading-tight text-white sm:text-[1.45rem]">
            {title}
          </p>
          <p className="mt-2 text-xs leading-6 text-white/75">
            {visual.note}
          </p>
        </div>
      </div>

      <span className="sr-only">Bu görsel {title} hizmetini temsil eder.</span>
    </figure>
  );
}
