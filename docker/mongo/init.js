// MongoDB initialization script
// Runs on first container startup to create the app database and user

db = db.getSiblingDB("reinventdb");

// Create application user with readWrite access
db.createUser({
  user: "reinventapp",
  pwd: "reinventpass",
  roles: [{ role: "readWrite", db: "reinventdb" }],
});

// Create collections with schema validation
db.createCollection("users");
db.createCollection("members");
db.createCollection("bookings");
db.createCollection("contacts");
db.createCollection("events");

// Indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.members.createIndex({ userId: 1 }, { unique: true });
db.bookings.createIndex({ userId: 1 });
db.bookings.createIndex({ scheduledAt: 1 });
db.contacts.createIndex({ createdAt: -1 });
db.events.createIndex({ startDate: 1 });
db.events.createIndex({ eventType: 1 });

print("✅ reinventdb initialized successfully");
