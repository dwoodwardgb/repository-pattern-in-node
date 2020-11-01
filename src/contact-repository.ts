import { strict as assert } from "assert";
import {
  Contact,
  ExistingContact,
  createTimestamps,
  ContactUpdate,
} from "./contact-entity";
import { Database, idFromDb, idToDb, entityFromDb } from "./database";

function contactFromDb(input: any) {
  return entityFromDb(ExistingContact.parseAsync, input);
}

export class ContactRepository {
  static readonly CONTACTS = "contacts";
  constructor(private database: Database) {}

  async create(contact: Contact) {
    const toCreate = {
      ...contact,
      ...createTimestamps(),
    };
    const contacts = await this.contacts();
    const { insertedCount, insertedId } = await contacts.insertOne(toCreate);
    assert.equal(insertedCount, 1);
    return idFromDb(insertedId);
  }

  async read(): Promise<ExistingContact[]> {
    const contacts = await this.contacts();
    return await Promise.all(
      (await contacts.find({}).toArray()).map(contactFromDb)
    );
  }

  async update(id: string, rest: ContactUpdate) {
    const contacts = await this.contacts();
    const { modifiedCount } = await contacts.updateOne(
      { _id: idToDb(id) },
      rest,
      {
        upsert: false,
      }
    );
    assert.equal(modifiedCount, 1);
  }

  private async contacts() {
    return (await this.database.db()).collection(ContactRepository.CONTACTS);
  }
}
