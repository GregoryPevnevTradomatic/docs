export interface TelegramUser {
  id?: number;
  first_name?: string;
  last_name?: string;
}

export interface TelegramFile {
  file_id: string;
  file_name?: string;
  mime_type?: string;
}
