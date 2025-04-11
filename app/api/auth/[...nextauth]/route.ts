import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";
import { Env } from "@/lib/env";



const JWT_SECRET = process.env.JWT_SECRET;

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: Env.GOOGLE_CLIENT_ID!,
      clientSecret: Env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ profile }: any) {
      try {
        await connectDB();

        let user = await User.findOne({ email: profile?.email });

        if (!user) {
          user = await User.create({
            google_id: profile?.sub,
            email: profile?.email,
            name: profile?.name,
            profile_picture: profile?.picture,
          });

          console.log(`Created new user: ${user}`);
        } else {
          console.log(`User already exists: ${user.email}`);
        }

        if (!JWT_SECRET) {
          throw new Error("JWT_SECRET is not defined in environment variables");
        }

        const customToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });

        const cookieStore = await cookies();
        cookieStore.set("token", customToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60,
        });

        let subscriber = await NewsletterSubscriber.findOne({
          email: user.email,
        });

        if (!subscriber) {
          const newSubscriber = new NewsletterSubscriber({
            email: user.email,
            status: "subscribed",
          });
          user.subscribed = true;
          await newSubscriber.save();
        }

        await user.save();

     console.info(`New subscriber added: ${user.email}`);

        return true;
      } catch (error) {
        console.error("Error saving user to DB:", error);
        return false;
      }
    },

    async jwt({ token, profile }) {
      if (profile?.email) {
        const user = await User.findOne({ email: profile.email });
        if (user) {
          token.userId = user._id?.toString();
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.userId) {
        session.user = token.userId;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
