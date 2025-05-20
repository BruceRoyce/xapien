import Database from "better-sqlite3";
import path from "path";

export const db = new Database(path.resolve("./db/database.sqlite"));
