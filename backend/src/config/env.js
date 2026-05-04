import "dotenv/config";

export const JWT_SECRET = process.env.JWT_SECRET || "rphms_super_secret_key_change_in_production";

export default {
  JWT_SECRET,
};
