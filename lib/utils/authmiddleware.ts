import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

export const getUserFromToken = async (req: NextRequest): Promise<{ _id: string } | null> => {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      console.warn("No token found in cookies");
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    const user : any = await User.findById(decoded.userId).select("-password");


    return (user);
  } catch (error) {
    console.error("Invalid or expired token:", error);
    return null;
  }
};
