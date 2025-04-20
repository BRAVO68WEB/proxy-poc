import { Database } from "bun:sqlite"

const db = new Database("db.sqlite");

db.exec(
    `
    CREATE TABLE IF NOT EXISTS websites (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        domain TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        website_id TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        published_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (website_id) REFERENCES websites(id)
    );
    `
);

console.log("Database seeded!");

// Create 3 domains, e1.ec8.in, e2.ec8.in and e3.ec8.in
const websites = [
    {
        id: "1",
        name: "e1",
        domain: "e1.ec8.in",
    },
    {
        id: "2",
        name: "e2",
        domain: "e2.ec8.in",
    },
    {
        id: "3",
        name: "e3",
        domain: "e3.ec8.in",
    },
    {
        id: "4",
        name: "local1",
        domain: "localhost:5173",
    },
    {
        id: "5",
        name: "local2",
        domain: "localhost:5174",
    }
];
websites.forEach((website) => {
    db.run(
        `
        INSERT INTO websites (id, name, domain)
        VALUES (?, ?, ?)
        `,
        [website.id, website.name, website.domain]
    );
});

// Create 3 articles for each domain
for (let i = 1; i <= 5; i++) {
    for (let j = 1; j <= 5; j++) {
        db.run(
            `
            INSERT INTO articles (id, website_id, title, content, published_at)
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                `${i}-${j}`,
                `${i}`,
                `Article ${j} for website ${i}`,
                `This is the content of article ${j} for website ${i}`,
                new Date().toISOString(),
            ]
        );
    }
}

console.log("Articles seeded!");

db.close();