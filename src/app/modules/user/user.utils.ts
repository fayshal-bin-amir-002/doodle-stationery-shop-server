import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export const createToken = (
  jwtPayload: { email: string; role: string },
  secret: string,
  expiresIn: any
) => {
  const options: SignOptions = {
    expiresIn,
  };
  return jwt.sign(jwtPayload, secret, options);
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
