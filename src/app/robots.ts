import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/*",
          "/admin/*",
          "/auth/*",
          "/_next/*",
          "/slice-simulator",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/*",
          "/admin/*",
          "/auth/*",
          "/_next/*",
          "/slice-simulator",
        ],
      },
    ],
    sitemap: "https://www.orubronegronews.com/sitemap.xml",
    host: "https://www.orubronegronews.com",
  };
}
