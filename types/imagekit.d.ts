export interface UploadAuthResponse {
  signature: string;
  expire: number;
  token: string;
  publicKey: string;
}
