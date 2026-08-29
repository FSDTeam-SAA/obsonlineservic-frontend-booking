export interface SubscribeNewsletterDto {
  email: string;
}

export interface SubscribeResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: null;
  responseTime: string;
}
