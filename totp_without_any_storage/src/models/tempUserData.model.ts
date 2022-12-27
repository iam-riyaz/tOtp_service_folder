export interface ITempUserData {
  email: string;
  phone: number;
  secretKey?: string;
  expireAt?: Date;
  createdAt?: Date;
  flag?: boolean;
  otpauth_url?: string;
}
