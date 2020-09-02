import TelegramApiClient, { Message } from 'node-telegram-bot-api';
import { clearKeyboard } from '../common';

export interface ProgressControls {
  start(): Promise<void>;
  finish(): Promise<void>;
}

interface ProgressSettings {
  messages: string[];
  chatId: number;
  messageId: number;
  interval: number;
}

interface StopProgress {
  (): void;
}

const startProgress = (telegramClient: TelegramApiClient) => ({
  messages,
  chatId,
  messageId,
  interval,
}: ProgressSettings): StopProgress => {
  let intervalTimeout: NodeJS.Timeout = null;

  const sendMessage = async (messageNumber: number) => {
    await telegramClient.editMessageText(
      `${messages[messageNumber]}...`,
      {
        chat_id: chatId,
        message_id: messageId,
      },
    );

    if (messageNumber < messages.length - 1) {
      intervalTimeout = setTimeout(
        () => sendMessage(messageNumber + 1),
        interval,
      );
    }
  };

  sendMessage(0);

  return () => {
    clearTimeout(intervalTimeout)
  };
}

export const Progress = (telegramClient: TelegramApiClient) =>
  async (chatId: number, messages: string[], interval = 1000): Promise<ProgressControls> => {
    // MUST BE DIFFERENT FOR CLEARING
    let startMessage: Message;
    let progressMessage: Message;
    let stopper: StopProgress;

    return {
      async start() {
        startMessage = await telegramClient.sendMessage(
          chatId,
          'Processing started',
          clearKeyboard(),
        );

        progressMessage = await telegramClient.sendMessage(
          chatId,
          'Wait...'
        );

        stopper = startProgress(telegramClient)({
          messages,
          chatId,
          interval,
          messageId: progressMessage.message_id,
        });
      },
      async finish() {
        stopper();

        await Promise.all([
          telegramClient.deleteMessage(chatId, String(startMessage.message_id)),
          telegramClient.deleteMessage(chatId, String(progressMessage.message_id))
        ]);
      }
    };
  };