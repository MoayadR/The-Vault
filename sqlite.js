const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

createDB = () => {
    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS Master (password TEXT)");
        db.run("CREATE TABLE IF NOT EXISTS Vault (Detail TEXT , Desc TEXT , password TEXT)");
    });
}

createMasterPassword = (masterPassword) => {
    // check if there is a master password or not
    const masterPassword = this.getMasterPassword();
    if (Object.keys(masterPassword).length !== 0) return false;

    db.run("INSERT INTO Master VALUES (?)", [masterPassword]);
    return true;
}

getMasterPassword = () => {
    return db.get("SELECT password FROM Master LIMIT 1");
}

closeDB = () => {
    db.close();
}

module.exports = {
    createDB: createDB,
    getMasterPassword: getMasterPassword,
    createMasterPassword: createMasterPassword,
    closeDB: closeDB
}