

export type UserName = string;
export type User = {
  uuid: Uuid;
  email?: Email;
  password?: Password;
  token: UserToken;
};