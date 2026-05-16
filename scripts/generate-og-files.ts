import fs from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";
import config from "../src/config/config.json";
import { createOgImage } from "../src/lib/og";

type Frontmatter = {
  title?: string;
  meta_title?: string;
  description?: string;
  image?: string;
  draft?: boolean;
  banner?: { button?: { label?: string } };
  hero?: { button?: { label?: string } };
  call_to_action?: { button?: { label?: string } };
};

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "src", "content");
const OG_PREFIX = "/images/og/";
const MARKDOWN_EXTENSIONS = new Set([".md", ".mdx"]);

const getAllContentFiles = async (directory: string): Promise<string[]> => {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === "blog") {
          return [];
        }

        return getAllContentFiles(fullPath);
      }

      return MARKDOWN_EXTENSIONS.has(path.extname(entry.name)) ? [fullPath] : [];
    }),
  );

  return files.flat();
};

const parseFrontmatter = (source: string): Frontmatter | null => {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return null;
  }

  return (YAML.parse(match[1]) ?? {}) as Frontmatter;
};

const getEyebrow = (filePath: string) => {
  if (filePath.includes(`${path.sep}contact${path.sep}`)) {
    return "Get in touch";
  }

  if (filePath.includes(`${path.sep}pages${path.sep}`)) {
    return "Kanso";
  }

  return config.site.title;
};

const getCtaLabel = (frontmatter: Frontmatter) =>
  frontmatter.banner?.button?.label ??
  frontmatter.hero?.button?.label ??
  frontmatter.call_to_action?.button?.label ??
  "Get my profile";

const main = async () => {
  const files = await getAllContentFiles(CONTENT_DIR);
  let generatedCount = 0;

  for (const filePath of files) {
    const source = await fs.readFile(filePath, "utf8");
    const frontmatter = parseFrontmatter(source);

    if (!frontmatter || frontmatter.draft === true) {
      continue;
    }

    if (!frontmatter.image || !frontmatter.image.startsWith(OG_PREFIX)) {
      continue;
    }

    const outputPath = path.join(ROOT, "public", frontmatter.image.replace(/^\//, ""));

    const imageBuffer = await createOgImage({
      eyebrow: getEyebrow(filePath),
      title: frontmatter.meta_title ?? frontmatter.title ?? config.site.title,
      description: frontmatter.description ?? config.metadata.meta_description,
      ctaLabel: getCtaLabel(frontmatter),
    });

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, imageBuffer);

    generatedCount += 1;
    console.log(`Generated ${path.relative(ROOT, outputPath)}`);
  }

  console.log(`\nDone. Generated ${generatedCount} OG image${generatedCount === 1 ? "" : "s"}.`);
};

main().catch((error) => {
  console.error("Failed to generate OG images.");
  console.error(error);
  process.exit(1);
});
