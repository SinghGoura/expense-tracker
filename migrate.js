const { MongoClient } = require("mongodb");

// Define source and target MongoDB URIs
const sourceUri = "mongodb://localhost:27017/expense";
const targetUri = "mongodb+srv://gauravsinghbhu211:E2FgqwHmHAATKtu3@cluster0.z92i4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/expense-tracker";


// Function to migrate collections
const migrateCollection = async (sourceDb, targetDb, collectionName) => {
  const sourceCollection = sourceDb.collection(collectionName);
  const targetCollection = targetDb.collection(collectionName);

  const documents = await sourceCollection.find({}).toArray(); // Fetch all documents
  if (documents.length === 0) {
    console.log(`No documents found in ${collectionName}, skipping...`);
    return;
  }

  console.log(
    `Migrating ${documents.length} documents from ${collectionName}...`
  );

  await targetCollection.insertMany(documents); // Insert into target
  console.log(`Migrated ${documents.length} documents from ${collectionName}`);
};

// Main migration function
const migrateMongoDB = async () => {
  const sourceClient = new MongoClient(sourceUri);
  const targetClient = new MongoClient(targetUri);

  try {
    // Connect to both source and target databases
    await sourceClient.connect();
    await targetClient.connect();

    console.log("Connected to both source and target MongoDB instances.");

    const sourceDb = sourceClient.db(); // Automatically uses the DB from the URI
    const targetDb = targetClient.db("expense-tracker"); // Specify target DB name

    // Get the list of collections from the source database
    const collections = await sourceDb.collections();
    for (const collection of collections) {
      const collectionName = collection.collectionName;
      await migrateCollection(sourceDb, targetDb, collectionName); // Migrate each collection
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    // Close connections
    await sourceClient.close();
    await targetClient.close();
  }
};

migrateMongoDB();