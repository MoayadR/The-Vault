const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../../database.db');

createDB = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run("CREATE TABLE IF NOT EXISTS Master (password TEXT)");
            db.run("CREATE TABLE IF NOT EXISTS Vault (id integer primary key ,detail TEXT , desc TEXT , password TEXT)", (err) => {
                if (err) reject(err);
                resolve();
            });
        }, (err) => {
            if (err)
                throw err;
        });
    })
}


getMasterPassword = () => {
    return new Promise((resolve, reject) => {
        db.get("SELECT password FROM Master LIMIT 1", (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
}


createMasterPassword = (masterPassword) => {
    return new Promise(async (resolve, reject) => {
        // check if there is a master password or not

        const masterPasswordObj = await getMasterPassword();


        if (masterPasswordObj && Object.keys(masterPasswordObj).length !== 0) resolve(false);

        db.run("INSERT INTO Master VALUES (?)", [masterPassword], (err) => {
            if (err) {
                console.log(err);
                reject();
            }
            resolve(true);
        });

    })
}

createNewPassword = (dataObj) => {
    return new Promise(async (resolve, reject) => {
        db.run("INSERT INTO Vault VALUES (NULL,? , ? , ?)", [dataObj.detail, dataObj.email, dataObj.password], (err) => {
            if (err)
                reject();

            resolve(true);
        });
    });
}

deletePassword = (id) => {
    return new Promise(async (resolve, reject) => {
        db.run("DELETE FROM Vault WHERE id = (?)", id, (err) => {
            if (err)
                reject();

            resolve(true);
        });
    });
}

getAllPasswords = () => {
    return new Promise(async (resolve, reject) => {
        db.all("SELECT * FROM Vault", (err, rows) => {
            if (err)
                reject();

            resolve(rows);
        })
    });
}

closeDB = () => {
    db.close();
}

module.exports = {
    createDB: createDB,
    getMasterPassword: getMasterPassword,
    createMasterPassword: createMasterPassword,
    closeDB: closeDB,
    createNewPassword: createNewPassword,
    getAllPasswords: getAllPasswords,
    deletePassword: deletePassword,
}