const mongodb = require("mongodb")

exports.listDatabases = async function (client) {
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

exports.createTask = async function (client, db, collection, newTask) {
    const result = await client.db(db).collection(collection).insertOne(newTask);
    console.log(`New task created with the following id: ${result.insertedId}`);
};

exports.findAllTasksByListName = async function (client, db, collection, listName) {
    let result = await client.db(db).collection(collection).find({ listName: listName }).toArray();
    return result
};

exports.deleteTaskByID = async function (client, db, collection, id) {
    const result = await client.db(db).collection(collection).deleteOne({ _id: new mongodb.ObjectID(id) });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}