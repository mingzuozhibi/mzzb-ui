import md5 from "md5";

const SALT1 = "mingzuozhibi.com/1";
const SALT2 = "mingzuozhibi.com/2";
const SALT3 = "mingzuozhibi.com/3";

export function encodePasswd(username: string, password: string) {
  return md5(md5(username + SALT1) + md5(password + SALT2) + SALT3)
}
