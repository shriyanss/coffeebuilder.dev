import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://coffeebuilder.dev";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    // We could add dynamic routes here if we had individual recipe pages
    // e.g. /recipe/espresso, /recipe/latte
  ];
}
