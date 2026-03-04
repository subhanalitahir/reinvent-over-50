// MongoDB initialization script
// Runs on first container startup to create the app database and user

db = db.getSiblingDB("reinventdb");

// Create application user with readWrite access
db.createUser({
  user: "reinventapp",
  pwd: "reinventpass",
  roles: [{ role: "readWrite", db: "reinventdb" }],
});

// Create collections
db.createCollection("users");
db.createCollection("members");
db.createCollection("bookings");
db.createCollection("contacts");
db.createCollection("events");
db.createCollection("products");
db.createCollection("orders");
db.createCollection("emailsubscribers");
db.createCollection("banners");

// Indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.members.createIndex({ user: 1 }, { unique: true });
db.bookings.createIndex({ guestEmail: 1 });
db.bookings.createIndex({ scheduledAt: 1 });
db.contacts.createIndex({ createdAt: -1 });
db.events.createIndex({ startDate: 1 });
db.events.createIndex({ type: 1, status: 1 });
db.products.createIndex({ slug: 1 }, { unique: true });
db.products.createIndex({ type: 1, status: 1 });
db.orders.createIndex({ guestEmail: 1 });
db.orders.createIndex({ user: 1 });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ stripeSessionId: 1 });
db.emailsubscribers.createIndex({ email: 1 }, { unique: true });
db.emailsubscribers.createIndex({ status: 1 });
db.banners.createIndex({ placement: 1, status: 1 });

print("✅ reinventdb initialized successfully");
