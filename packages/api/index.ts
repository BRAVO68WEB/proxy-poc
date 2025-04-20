import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

import { Database } from "bun:sqlite"
import { showRoutes } from "hono/dev";

const app = new Hono();
const db = new Database("db.sqlite");

app.use("*", logger());
app.use("*", cors({ origin: "*" }));

app.get("/", (c) => c.text("Hello Bun!"));

// CREATE TABLE IF NOT EXISTS websites (
//     id TEXT PRIMARY KEY,
//     name TEXT NOT NULL,
//     domain TEXT NOT NULL,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
// );

// CREATE TABLE IF NOT EXISTS articles (
//     id TEXT PRIMARY KEY,
//     website_id TEXT NOT NULL,
//     title TEXT NOT NULL,
//     content TEXT NOT NULL,
//     published_at DATETIME NOT NULL,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (website_id) REFERENCES websites(id)
// );

app.get("/introspect", async (c) => {
    // check the website which made the request
    const referer = c.req.header("referer")!;

    const url = new URL(referer);

    const host = url.host;

    console.log("Host", host);

    const websiteQ = db.query(
        `
        SELECT * FROM websites WHERE domain = ?
        `,
    );

    const data = websiteQ.all(host);

    if (data.length === 0) {
        return c.json({
            error: "Website not found",
        });
    }

    const website = data[0];

    return c.json({
        website,
    });
});

// get article by website id
app.get("/articles/:website_id", async (c) => {
    const id = c.req.param("website_id");

    const websiteQ = db.query(
        `
        SELECT * FROM articles WHERE website_id = ?
        `,
    );

    const data = websiteQ.all(id);

    if (data.length === 0) {
        return c.json({
            error: "Articles not found",
        });
    }

    const articles = data;

    return c.json({
        articles,
    });
});

showRoutes(app);

export default {
    port: 8181,
    fetch: app.fetch,
};