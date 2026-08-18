const mongoose = require("mongoose");
require("dotenv").config();

const LOCAL_URI = "mongodb://127.0.0.1:27017/rentx";
const REMOTE_URI = process.env.MONGODB_URI;

if (!REMOTE_URI || REMOTE_URI.includes("127.0.0.1") || REMOTE_URI.includes("localhost")) {
  console.error("Error: Please set MONGODB_URI to your remote Atlas connection string in Server/.env before migrating.");
  process.exit(1);
}

const collectionsToMigrate = [
  "users",
  "cars",
  "bookings",
  "purchases",
  "supporttickets",
  "otps"
];

async function runMigration() {
  console.log("=== MongoDB Local to Production Atlas Data Migration ===");
  console.log(`Local DB Source:  ${LOCAL_URI}`);
  console.log(`Remote DB Target: ${REMOTE_URI}`);
  console.log("-----------------------------------------------------");

  const dataDump = {};

  try {
    // 1. Connect to Local MongoDB
    console.log("Connecting to Local MongoDB...");
    await mongoose.connect(LOCAL_URI);
    console.log("Connected to Local MongoDB successfully!");

    const localDb = mongoose.connection.db;

    // 2. Fetch raw documents from all collections
    for (const collName of collectionsToMigrate) {
      console.log(`Reading local collection: "${collName}"...`);
      const docs = await localDb.collection(collName).find({}).toArray();
      dataDump[collName] = docs;
      console.log(`Fetched ${docs.length} documents from "${collName}".`);
    }

    // Disconnect from local
    await mongoose.disconnect();
    console.log("Disconnected from local MongoDB.");
    console.log("-----------------------------------------------------");

    // 3. Connect to Remote MongoDB Atlas
    console.log("Connecting to Remote MongoDB Atlas Cluster...");
    await mongoose.connect(REMOTE_URI, { dbName: "rentx" });
    console.log("Connected to Remote Atlas successfully!");

    const remoteDb = mongoose.connection.db;

    // 4. Overwrite collections in remote database
    for (const collName of collectionsToMigrate) {
      const docs = dataDump[collName];
      console.log(`Migrating collection: "${collName}"...`);

      // Clear remote collection
      await remoteDb.collection(collName).deleteMany({});
      console.log(`Cleared existing remote collection "${collName}".`);

      if (docs && docs.length > 0) {
        // Insert docs
        const result = await remoteDb.collection(collName).insertMany(docs);
        console.log(`Successfully migrated ${result.insertedCount} documents to remote "${collName}".`);
      } else {
        console.log(`No documents found in local "${collName}" to insert.`);
      }
    }

    // Disconnect from remote
    await mongoose.disconnect();
    console.log("-----------------------------------------------------");
    console.log("Migration completed successfully! All data has been pushed to Atlas production database.");
    process.exit(0);

  } catch (error) {
    console.error("Migration failed with error:", error);
    try {
      await mongoose.disconnect();
    } catch (_) {}
    process.exit(1);
  }
}

runMigration();
