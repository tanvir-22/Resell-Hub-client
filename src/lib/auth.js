import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db();

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "buyer",
        input: true,
        returned: true,
      },
      phone: {
        type: "string",
        required: false,
        defaultValue: "",
        input: true,
        returned: true,
      },
      address: {
        type: "string",
        required: false,
        defaultValue: "",
        input: true,
        returned: true,
      },
      location: {
        type: "string",
        required: false,
        defaultValue: "",
        input: true,
        returned: true,
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "active",
        input: true,
        returned: true,
      },
    },
  },
  plugins: [
    jwt({
      jwt: {
        expirationTime: "1h",
        definePayload: async ({ user }) => ({
          id:    user.id,
          email: user.email,
          name:  user.name,
          role:  user.role ?? "buyer",
        }),
      },
    }),
  ],
  database: mongodbAdapter(db, { client }),
});
