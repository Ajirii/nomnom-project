import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

export const getGoogleAuthToken = async (code: string) => {
  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    });
    return response.data;
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    throw new Error("Failed to exchange authorization code");
  }
};

export const getGoogleUserInfo = async (accessToken: string) => {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user info from Google:", error);
    throw new Error("Failed to fetch user info");
  }
};

export const saveGoogleUser = async (userInfo: any) => {
  const { email, name, picture, sub: googleId } = userInfo;

  try {
    let user = await prisma.user.findUnique({
      where: {
        googleId: googleId,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          googleId,
        },
      });
    }

    return user;
  } catch (error) {
    console.error("Error saving user data:", error);
    throw new Error("Failed to save user");
  }
};
