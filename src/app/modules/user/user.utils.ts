import jwt, { JwtPayload } from "jsonwebtoken";

type JwtPayloadCustom = {
  email: string;
  role: string;
};

export const createToken = (
  jwtPayload: JwtPayloadCustom,
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
