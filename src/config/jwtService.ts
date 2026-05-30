import jwt from "jsonwebtoken";

export default function generateToken(payload: object) {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
  return { accessToken, refreshToken };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!);
}