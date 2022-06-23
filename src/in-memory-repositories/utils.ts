import { readFileSync } from "fs"
import { writeFile } from "fs/promises"
import path from "path"

export function readJson<T>(dbName: string): T[] {
  const dbPath = path.join(__dirname, "../../json-db-backup", dbName)
  const db: T[] = JSON.parse(readFileSync(dbPath, { encoding: "utf-8" }) || "[]")
  return db
}

export function saveJson<T>(dbName: string, entries: T[]): Promise<void> {
  const dbPath = path.join(__dirname, "../../json-db-backup", dbName)
  const json = JSON.stringify(entries, null, 2) + "\n"
  return writeFile(dbPath, json)
}
