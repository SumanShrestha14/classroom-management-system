import arcjet, { detectBot, shield, slidingWindow } from "@arcjet/node";
if(!process.env.ARCJET_KEY && process.env.NODE_ENV === "production") {
  throw new Error("ARCJET_KEY environment variable is not set");
}
const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        "CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
      ],
    }),
    slidingWindow({
      mode: "LIVE",
      interval : 2,
      max : 5
    }),
  ],
});

export default aj;