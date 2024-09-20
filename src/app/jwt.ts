import * as jwt from "jsonwebtoken";

export function signJwt(
  username: string,
  expireTimeInMillis: number,
  serverSecret: string,
): string {
  const issueTime = Math.floor(Date.now() / 1000);
  const expireTime = issueTime + expireTimeInMillis;

  return jwt.sign(
    {
      username,
      iat: issueTime,
      nbf: issueTime,
      exp: expireTime,
    },
    serverSecret,
    { algorithm: "HS256" },
  );
}

export function verifyJwt(
  token: string,
  serverSecret: string,
): boolean {
  try {
    jwt.verify(
      token,
      serverSecret,
      { algorithms: ["HS256"] },
    );

    return true;
  }
  catch {
    return false;
  }
}
