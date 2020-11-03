import { ContactRepository } from "./contact-repository";
import { Database } from "./database";

async function main() {
  const db = new Database();
  try {
    const repo = new ContactRepository(db);
    const result = await repo.read();
    console.log(result);
  } catch (e) {
    console.error(e);
  } finally {
    db.cleanup();
  }
}

main();
