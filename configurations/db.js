const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI ;

const dbConnection = (collection, cb) => {
    MongoClient.connect(uri)
    .then(async (client) => {
        const db = client.db(process.env.MONGODB_DB).collection(collection);
        //work
        await cb(db);
        client.close();
    })
    .catch((err) => {
        return err.message;
    })
}

module.exports = dbConnection;