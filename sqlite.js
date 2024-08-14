const sqlite3 = require('sqlite3').verbose();

createDB = () => {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./database.db');
        db.serialize(() => {
            db.run("CREATE TABLE IF NOT EXISTS Master (password TEXT)");
            db.run("CREATE TABLE IF NOT EXISTS Vault (id integer primary key ,detail TEXT , desc TEXT , password TEXT)", (err) => {
                db.close();
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
        const db = new sqlite3.Database('./database.db');
        db.get("SELECT password FROM Master LIMIT 1", (err, row) => {
            db.close();

            if (err) reject(err);
            resolve(row);
        });
    });
}


createMasterPassword = (masterPassword) => {
    return new Promise(async (resolve, reject) => {
        // check if there is a master password or not
        const db = new sqlite3.Database('./database.db');

        const masterPasswordObj = await getMasterPassword();


        if (masterPasswordObj && Object.keys(masterPasswordObj).length !== 0) resolve(false);

        db.run("INSERT INTO Master VALUES (?)", [masterPassword], (err) => {
            db.close();
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
        const db = new sqlite3.Database('./database.db');
        db.run("INSERT INTO Vault VALUES (NULL,? , ? , ?)", [dataObj.detail, dataObj.email, dataObj.password], (err) => {
            db.close();
            if (err)
                reject();

            resolve(true);
        });
    });
}

deletePassword = (id) => {
    return new Promise(async (resolve, reject) => {
        const db = new sqlite3.Database('./database.db');
        db.run("DELETE FROM Vault WHERE id = (?)", id, (err) => {
            db.close();
            if (err)
                reject();

            resolve(true);
        });
    });
}

editPassword = (passwordObj) => {
    return new Promise(async (resolve, reject) => {
        const db = new sqlite3.Database('./database.db');
        db.run("UPDATE Vault SET detail = ?, desc = ?, password = ? WHERE id = ?;", [passwordObj.detail, passwordObj.desc, passwordObj.password, passwordObj.id], (err) => {
            db.close();

            if (err)
                reject();

            resolve(true);
        });
    });
}

getAllPasswords = () => {
    return new Promise(async (resolve, reject) => {
        const db = new sqlite3.Database('./database.db');
        db.all("SELECT * FROM Vault", (err, rows) => {
            db.close();

            if (err)
                reject();

            resolve(rows);
        })
    });
}

module.exports = {
    createDB: createDB,
    getMasterPassword: getMasterPassword,
    createMasterPassword: createMasterPassword,
    createNewPassword: createNewPassword,
    getAllPasswords: getAllPasswords,
    deletePassword: deletePassword,
    editPassword: editPassword,
}