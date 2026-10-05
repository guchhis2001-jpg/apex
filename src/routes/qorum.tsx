import { createFileRoute } from "@tanstack/react-router";
import { QorumLanding } from "@/components/qorum/QorumLanding";

export const Route = createFileRoute("/qorum")({
  head: () => ({
    meta: [
      { title: "Qorum — Kronos Chronograph" },
      {
        name: "description",
        content:
          "Qorum Kronos: a chronograph designed in India and made to global standards. Luxury doesn't always come at a cost.",
      },
      { property: "og:title", content: "Qorum — Kronos Chronograph" },
      {
        property: "og:description",
        content: "Luxury doesn't always come at a cost.",
      },
      { property: "og:image", content: "/qorum/stills/kronos.webp" },
      { name: "theme-color", content: "#07080a" },
    ],
    links: [
      { rel: "preload", as: "image", href: "/qorum/frames/f_001.webp" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  component: QorumLanding,
});
