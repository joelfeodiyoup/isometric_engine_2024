import sqlite3 from 'sqlite3';

/**
 * This is abandoned currently, as I'm pretty certain there are file system access issues when running this with node inside WSL.
 * I'll need to dig into this more.
 * The better solution is probably to run this inside docker.
 * But then I have to decide whether then the whole "back end" code runs inside docker, or if that instance of the db inside docker just exposes some endpoints.
 */
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