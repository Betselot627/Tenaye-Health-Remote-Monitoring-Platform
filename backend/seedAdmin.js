import mongoose from "mongoose";
import crypto from "crypto";
import "dotenv/config";
import User from "./src/models/User.js";

const email = process.env.ADMIN_EMAIL || "admin@rphms.com";
const full_name = process.env.ADMIN_NAME || "System Admin";
const password = process.env.ADMIN_PASSWORD || crypto.randomBytes(8).toString("hex");

async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing");
  }

  await mongoose.connect(process.env.MONGO_URI);

  let user = await User.findOne({ email });
  if (user) {
    user.full_name = full_name;
    user.role = "admin";
    user.password = password;
    await user.save();
    console.log("Admin updated");
  } else {
    user = await User.create({
      full_name,
      email,
      password,
      role: "admin",
    });
    console.log("Admin created");
  }

  console.log(JSON.stringify({
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    password,
  }, null, 2));

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
