import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

// Homepage collection schema
const homepageCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/homepage" }),
  schema: z.object({
    banner: z
      .object({
        title: z.string().optional(),
        content: z.string().optional(),
        subtitle: z.string().optional(),
        note: z.string().optional(),
        rotating_phrases: z.array(z.string()).optional(),
        image: z.string().optional(),
        button: z
          .object({
            label: z.string(),
            link: z.string().default("/contact"),
            enable: z.boolean().default(true),
          })
          .optional(),
      })
      .optional(),
    audience_tabs: z
      .object({
        items: z.array(
          z.object({
            name: z.string(),
            title: z.string(),
            content: z.string(),
            emphasis: z.string().optional(),
            note: z.string().optional(),
            button: z
              .object({
                label: z.string(),
                link: z.string().default("/contact"),
                enable: z.boolean().default(true),
              })
              .optional(),
          }),
        ),
      })
      .optional(),
    how_it_works: z
      .object({
        eyebrow: z.string().optional(),
        title: z.string(),
        description: z.string().optional(),
        image: z.string().optional(),
        images: z.array(z.string()).optional(),
        steps: z.array(
          z.object({
            title: z.string(),
            content: z.string(),
          }),
        ),
        note: z.string().optional(),
        button: z
          .object({
            label: z.string(),
            link: z.string().default("/contact"),
            enable: z.boolean().default(true),
          })
          .optional(),
      })
      .optional(),
    profile_highlights: z
      .object({
        title: z.string(),
        description: z.string().optional(),
        image: z.string().optional(),
        images: z.array(z.string()).optional(),
        items: z.array(
          z.object({
            title: z.string(),
            content: z.string(),
          }),
        ),
        button: z
          .object({
            label: z.string(),
            link: z.string().default("/contact"),
            enable: z.boolean().default(true),
          })
          .optional(),
      })
      .optional(),
    testimonial: z
      .object({
        title: z.string().optional(),
        quote: z.string(),
        author: z.string(),
        role: z.string().optional(),
        image: z.string().optional(),
      })
      .optional(),
    feature: z
      .object({
        title: z.string(),
        features: z.array(
          z.object({
            name: z.string(),
            icon: z.string().optional(),
            content: z.string().optional(),
          }),
        ),
      })
      .optional(),
    services: z
      .array(
        z.object({
          title: z.string().optional(),
          content: z.string().optional(),
          images: z.array(z.string()).optional(),
          button: z
            .object({
              label: z.string(),
              link: z.string().default("/contact"),
              enable: z.boolean().default(true),
            })
            .optional(),
        }),
      )
      .optional(),
    workflow: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
        image: z.string(),
      })
      .optional(),
    call_to_action: z
      .object({
        title: z.string().optional(),
        content: z.string().optional(),
        image: z.string().optional(),
        button: z
          .object({
            label: z.string(),
            link: z.string().default("/contact"),
            enable: z.boolean().default(true),
          })
          .optional(),
      })
      .optional(),
  }),
});

//Contact collection schema
const contactCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/contact" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    draft: z.boolean(),
    info: z.object({
      title: z.string(),
      description: z.string(),
      contacts: z.array(z.string()),
    }),
  }),
});

//pricing collection schema
const pricingCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/pricing" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    draft: z.boolean(),
    plans: z
      .array(
        z.object({
          title: z.string(),
          subtitle: z.string().optional(),
          price: z.number(),
          type: z.string(),
          recommended: z.boolean().optional(),
          features: z.array(z.string()),
          button: z.object({
            label: z.string(),
            link: z.string().default("/contact"),
          }),
        }),
      )
      .optional(),

    call_to_action: z
      .object({
        title: z.string(),
        content: z.string(),
        image: z.string(),
        button: z
          .object({
            enable: z.boolean().default(true),
            label: z.string(),
            link: z.string().default("/contact"),
          })
          .optional(),
      })
      .optional(),
  }),
});

// FAQ collection schema
const faqCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/faq" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    draft: z.boolean(),
    faqs: z.array(
      z.object({
        title: z.string(),
        answer: z.string(),
      }),
    ),
  }),
});

// Blog collection schema
const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/blog" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    image: z.string().optional(),
    authors: z.array(z.string()).default(() => ["admin"]),
    categories: z.array(z.string()).default(() => ["others"]),
    tags: z.array(z.string()).default(() => ["others"]),
    draft: z.boolean().optional(),
  }),
});

// Pages collection schema
const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/pages" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    draft: z.boolean().optional(),
    template: z.enum(["audience"]).optional(),
    intro: z.string().optional(),
    hero: z
      .object({
        title: z.string(),
        content: z.string(),
        image: z.string().optional(),
        button: z
          .object({
            label: z.string(),
            link: z.string().default("/contact"),
            enable: z.boolean().default(true),
          })
          .optional(),
      })
      .optional(),
    detail_section: z
      .object({
        title: z.string(),
        content: z.string().optional(),
        image: z.string().optional(),
        bullets: z.array(z.string()).optional(),
      })
      .optional(),
    feature_cards: z
      .array(
        z.object({
          title: z.string(),
          content: z.string(),
        }),
      )
      .optional(),
    testimonial: z
      .object({
        title: z.string().optional(),
        quote: z.string(),
        author: z.string(),
        role: z.string().optional(),
        image: z.string().optional(),
      })
      .optional(),
    call_to_action: z
      .object({
        title: z.string(),
        content: z.string().optional(),
        note: z.string().optional(),
        button: z
          .object({
            label: z.string(),
            link: z.string().default("/contact"),
            enable: z.boolean().default(true),
          })
          .optional(),
      })
      .optional(),
  }),
});

// Export collections
export const collections = {
  homepage: homepageCollection,
  blog: blogCollection,
  pages: pagesCollection,
  contact: contactCollection,
  pricing: pricingCollection,
  faq: faqCollection,
};
