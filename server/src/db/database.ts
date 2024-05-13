import sqlite3 from 'sqlite3';
export class DB {
  private db: sqlite3.Database;
  constructor() {
    this.initialise();
  }
  initialise() {
    const db = new sqlite3.Database(':memory:');
    db.run("CREATE TABLE lorem (info TEXT)"); 

    const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    for (let i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
    }
    stmt.finalize();

    // this.db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
    //   // ... note sure how I could get typescript to type this. Would be nice.
    //   // @ts-ignore
    //   console.log(row.id + ": " + row.info);
    // });

    db.close();
  }
}