const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const dbPath = path.resolve(__dirname, "../db/database.sqlite");
const schemaPath = path.resolve(__dirname, "../db/schema.sql");

if (!fs.existsSync(dbPath)) {
	console.log("Creating SQLite DB...");
	const db = new Database(dbPath);
	const schema = fs.readFileSync(schemaPath, "utf-8");
	db.exec(schema);
	console.log("Database initialized.");
} else {
	console.log("Database already exists.");
}
