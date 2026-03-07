import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const MONGO_URI =
  "mongodb+srv://subhanalitahirdev_db_user:xvp2TUG19Fb9N8qL@cluster0.pwxlkyd.mongodb.net/";

const ADMIN = {
  name: "Admin",
  email: "admin@reinventover50.com",
  password: "Admin@1234",
  role: "admin",
  isVerified: true,
  avatar: "",
};

const client = new MongoClient(MONGO_URI);

try {
  await client.connect();
  const db = client.db("reinventdb");
  const users = db.collection("users");

  const existing = await users.findOne({ email: ADMIN.email });
  if (existing) {
    console.log("⚠️  Admin already exists — updating role & password…");
    const hash = await bcrypt.hash(ADMIN.password, 12);
    await users.updateOne(
      { email: ADMIN.email },
      { $set: { role: "admin", password: hash, isVerified: true } },
    );
    console.log("✅ Admin updated.");
  } else {
    const hash = await bcrypt.hash(ADMIN.password, 12);
    await users.insertOne({
      ...ADMIN,
      password: hash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("✅ Admin user created.");
  }

  console.log("\n──────────────────────────────");
  console.log("  Email   :", ADMIN.email);
  console.log("  Password:", ADMIN.password);
  console.log("──────────────────────────────\n");
} finally {
  await client.close();
}
