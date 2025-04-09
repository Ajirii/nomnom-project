import { Request, Response } from "express";
import * as googleAuthService from "../services/google.service";

export const googleCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { code } = req.query;

  if (!code) {
    res.status(400).send("Missing code from Google");
    return;
  }

  try {
    const tokens = await googleAuthService.getGoogleAuthToken(code as string);

    const userInfo = await googleAuthService.getGoogleUserInfo(
      tokens.access_token
    );

    const user = await googleAuthService.saveGoogleUser(userInfo);

    res.json({
      message: "Login successful",
      user,
      tokens,
    });
  } catch (error) {
    console.error("Error in Google login flow:", error);
    res.status(500).send("Authentication failed");
  }
};
