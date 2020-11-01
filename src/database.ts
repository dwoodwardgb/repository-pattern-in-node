import { MongoClient, Db, ObjectId } from "mongodb";

export function idToDb(s: string) {
  return ObjectId.createFromHexString(s);
}

export function idFromDb(id: ObjectId) {
  return id.toHexString();
}

type EntityResult = {
  _id: ObjectId;
};

export function entityFromDb<E, I extends EntityResult>(
  parser: (x: unknown) => E,
  { _id, ...rest }: I
): E {
  return parser({ id: idFromDb(_id), ...rest });
}

export class Database {
  private client;
  private _db: Db | undefined;
  private clientReadyPromise: Promise<void>;

  constructor() {
    const url = "mongodb://localhost:9001";
    const dbName = "contacts";

    this.client = new MongoClient(url, { useUnifiedTopology: false });
    this.clientReadyPromise = new Promise((resolve, reject) => {
      this.client.connect((err) => {
        if (err) {
          reject(err);
        } else {
          this._db = this.client.db(dbName);
          resolve();
        }
      });
    });
  }

  cleanup() {
    this.client.close();
  }

  async db() {
    await this.clientReadyPromise;
    return <Db>this._db;
  }
}
