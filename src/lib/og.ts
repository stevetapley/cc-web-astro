import fs from "node:fs/promises";
import path from "node:path";
import type { ReactNode } from "react";
import sharp from "sharp";
import satori from "satori";
import { html } from "satori-html";
import config from "../config/config.json";
import { plainify } from "./utils/textConverter";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

const REGULAR_FONT_CANDIDATES = [
  path.join(process.env.SystemRoot ?? "C:/Windows", "Fonts", "arial.ttf"),
  path.join(process.env.SystemRoot ?? "C:/Windows", "Fonts", "segoeui.ttf"),
  "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
  "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
  "/System/Library/Fonts/Supplemental/Arial.ttf",
];

const BOLD_FONT_CANDIDATES = [
  path.join(process.env.SystemRoot ?? "C:/Windows", "Fonts", "arialbd.ttf"),
  path.join(process.env.SystemRoot ?? "C:/Windows", "Fonts", "segoeuib.ttf"),
  "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
  "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf",
  "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
];

export interface OgImageOptions extends Record<string, unknown> {
  title?: string;
  description?: string;
  eyebrow?: string;
  ctaLabel?: string;
}

const decodeHtmlEntities = (value: string) => {
  let decoded = value;
  let previous = "";

  while (decoded !== previous) {
    previous = decoded;
    decoded = decoded
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }

  return decoded;
};

const escapeHtml = (value: string) =>
  decodeHtmlEntities(value)
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const clipText = (value: string, maxLength: number) =>
  value.length > maxLength ? `${value.slice(0, maxLength - 1).trimEnd()}…` : value;

const cleanOgTitle = (value: string) => {
  const cleaned = decodeHtmlEntities(
    plainify(value)
      .replace(/^Career Clarity\s*\|\s*/i, "")
      .replace(/\s*\|\s*Career Clarity$/i, ""),
  ).trim();

  return cleaned || config.site.title;
};

const cleanOgText = (value: string) => decodeHtmlEntities(plainify(value)).trim();

const toArrayBuffer = (buffer: Buffer) => Uint8Array.from(buffer).buffer;

const readFirstAvailableFile = async (candidates: string[]) => {
  for (const candidate of candidates) {
    try {
      return await fs.readFile(candidate);
    } catch {
      // Try the next candidate.
    }
  }

  throw new Error(
    `No usable font file was found. Checked: ${candidates.join(", ")}`,
  );
};

type LoadedOgAssets = {
  logoDataUri: string;
  fonts: {
    name: string;
    data: ArrayBuffer;
    weight: 400 | 700;
    style: "normal";
  }[];
};

let assetPromise: Promise<LoadedOgAssets> | null = null;

const loadAssets = async () => {
  if (!assetPromise) {
    assetPromise = (async () => {
      const logoPath = path.resolve(process.cwd(), "public/images/logo-only.png");
      const [logoBuffer, regularFont, boldFont] = await Promise.all([
        fs.readFile(logoPath),
        readFirstAvailableFile(REGULAR_FONT_CANDIDATES),
        readFirstAvailableFile(BOLD_FONT_CANDIDATES),
      ]);

      return {
        logoDataUri: `data:image/png;base64,${logoBuffer.toString("base64")}`,
        fonts: [
          {
            name: "OG Sans",
            data: toArrayBuffer(regularFont),
            weight: 400,
            style: "normal",
          },
          {
            name: "OG Sans",
            data: toArrayBuffer(boldFont),
            weight: 700,
            style: "normal",
          },
          {
            name: "OG Display",
            data: toArrayBuffer(boldFont),
            weight: 700,
            style: "normal",
          },
        ],
      };
    })();
  }

  return assetPromise!;
};

export const getOgImagePath = (pathname: string) => {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const slug = normalizedPath === "/" ? "index" : normalizedPath.replace(/^\//, "");
  return `/og/${slug}.png`;
};

export const createOgImage = async (options: OgImageOptions = {}) => {
  const { logoDataUri, fonts } = await loadAssets();

  const title = clipText(
    cleanOgTitle(options.title ?? config.site.title),
    62,
  );
  const description = clipText(
    cleanOgText(options.description ?? config.metadata.meta_description),
    155,
  );
  const eyebrow = clipText(
    cleanOgText(options.eyebrow ?? config.site.title),
    32,
  );
  const ctaLabel = clipText(
    cleanOgText(options.ctaLabel ?? "Get my profile"),
    22,
  );

  const titleSize = title.length > 44 ? 56 : title.length > 30 ? 62 : 68;
  const descriptionSize = description.length > 120 ? 21 : 23;

  const markup = html(`
    <div
      style="
        position: relative;
        display: flex;
        width: ${OG_WIDTH}px;
        height: ${OG_HEIGHT}px;
        overflow: hidden;
        background: #082b5c;
        color: #ffffff;
      "
    >
      <div
        style="
          position: absolute;
          inset: 0;
          display: flex;
          background:
            radial-gradient(circle at top left, rgba(76, 141, 246, 0.24), transparent 0, transparent 38%),
            radial-gradient(circle at bottom right, rgba(255, 122, 47, 0.18), transparent 0, transparent 28%);
        "
      ></div>

      <div
        style="
          position: absolute;
          inset: 16px;
          display: flex;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
        "
      ></div>

      <div
        style="
          position: relative;
          display: flex;
          justify-content: space-between;
          gap: 36px;
          width: 100%;
          padding: 42px 48px;
        "
      >
        <div
          style="
            display: flex;
            width: 62%;
            flex-direction: column;
            justify-content: space-between;
          "
        >
          <div style="display: flex; align-items: center; gap: 18px;">
            <img
              src="${logoDataUri}"
              style="
                display: flex;
                width: 88px;
                height: 88px;
                border-radius: 999px;
                background: rgba(255,255,255,0.95);
              "
            />
            <div
              style="
                display: flex;
                flex-direction: column;
                font-family: OG Sans;
                font-size: 34px;
                font-weight: 700;
                line-height: 1;
              "
            >
              <span>Career</span>
              <span>Clarity</span>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 6px;">
            <div
              style="
                font-family: OG Sans;
                font-size: 17px;
                font-weight: 700;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                color: #9dc5ff;
                display: flex;
              "
            >
              ${escapeHtml(eyebrow)}
            </div>

            <div
              style="
                display: flex;
                max-width: 560px;
                font-family: OG Display;
                font-size: ${titleSize}px;
                font-weight: 700;
                line-height: 1.04;
              "
            >
              ${escapeHtml(title)}
            </div>

            <div
              style="
                display: flex;
                max-width: 575px;
                font-family: OG Sans;
                font-size: ${descriptionSize}px;
                line-height: 1.32;
                color: rgba(255, 255, 255, 0.9);
              "
            >
              ${escapeHtml(description)}
            </div>
          </div>

          <div
            style="
              display: flex;
              align-self: flex-start;
              align-items: center;
              justify-content: center;
              border-radius: 999px;
              padding: 16px 28px;
              background: #ff7a2f;
              font-family: OG Sans;
              font-size: 26px;
              font-weight: 700;
              box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22);
            "
          >
            ${escapeHtml(ctaLabel)}
          </div>
        </div>

        <div
          style="
            display: flex;
            width: 38%;
            align-items: center;
            justify-content: center;
          "
        >
          <div
            style="
              display: flex;
              height: 82%;
              width: 100%;
              flex-direction: column;
              gap: 14px;
              border-radius: 24px;
              background: rgba(255, 255, 255, 0.96);
              padding: 24px 22px;
              box-shadow: 0 26px 60px rgba(0, 0, 0, 0.2);
            "
          >
            <div style="display: flex; height: 15px; width: 46%; border-radius: 999px; background: #d4d4d8;"></div>
            <div style="display: flex; height: 15px; width: 88%; border-radius: 999px; background: #e5e7eb;"></div>
            <div style="display: flex; height: 14px; width: 52%; border-radius: 999px; background: #e5e7eb;"></div>
            <div style="display: flex; height: 14px; width: 34%; border-radius: 999px; background: #e5e7eb;"></div>
            <div style="display: flex; height: 15px; width: 86%; border-radius: 999px; background: #e5e7eb; margin-top: 8px;"></div>
            <div style="display: flex; height: 15px; width: 66%; border-radius: 999px; background: #e5e7eb;"></div>
            <div style="display: flex; height: 15px; width: 86%; border-radius: 999px; background: #e5e7eb; margin-top: 10px;"></div>

            <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 10px;">
              <div style="display: flex; align-items: center; gap: 14px;">
                <div style="display: flex; width: 16px; height: 16px; border-radius: 999px; background: #ff7a2f;"></div>
                <div style="display: flex; width: 42%; height: 14px; border-radius: 999px; background: #e5e7eb;"></div>
              </div>
              <div style="display: flex; align-items: center; gap: 14px;">
                <div style="display: flex; width: 16px; height: 16px; border-radius: 999px; background: #ff7a2f;"></div>
                <div style="display: flex; width: 30%; height: 14px; border-radius: 999px; background: #e5e7eb;"></div>
              </div>
              <div style="display: flex; align-items: center; gap: 14px; margin-top: 8px;">
                <div style="display: flex; width: 16px; height: 16px; border-radius: 999px; background: #4c8df6;"></div>
                <div style="display: flex; width: 42%; height: 14px; border-radius: 999px; background: #e5e7eb;"></div>
              </div>
              <div style="display: flex; align-items: center; gap: 14px;">
                <div style="display: flex; width: 16px; height: 16px; border-radius: 999px; background: #4c8df6;"></div>
                <div style="display: flex; width: 42%; height: 14px; border-radius: 999px; background: #e5e7eb;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style="
          position: absolute;
          right: 34px;
          bottom: 28px;
          display: flex;
          width: 18px;
          height: 18px;
          transform: rotate(45deg);
          border: 2px solid rgba(255, 255, 255, 0.72);
          border-radius: 2px;
        "
      ></div>
    </div>
  `);

  const svg = await satori(markup as ReactNode, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts,
  });

  return sharp(Buffer.from(svg)).png().toBuffer();
};
