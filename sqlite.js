const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

createDB = () => {
    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS Master (password TEXT)");
        db.run("CREATE TABLE IF NOT EXISTS Vault (Detail TEXT , Desc TEXT , password TEXT)");
    });
}


getMasterPassword = () => {
    return db.get("SELECT password FROM Master LIMIT 1");
}


createMasterPassword = (masterPassword) => {
    // check if there is a master password or not
    const masterPasswordObj = getMasterPassword();
    if (Object.keys(masterPasswordObj).length !== 0) return false;

    db.run("INSERT INTO Master VALUES (?)", [masterPassword]);
    return true;
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