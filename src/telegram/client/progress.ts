import TelegramApiClient, { Message } from 'node-telegram-bot-api';
import { ClearKeyboard, WaitingMessage } from '../common';

export interface ProgressControls {
  start(): Promise<void>;
  refresh(messages: string[]): Promise<void>;
  finish(): Promise<void>;
}

interface ProgressSettings {
  messages: string[];
  chatId: number;
  messageId: number;
  interval: number;
}

interface MessagesControls {
  restart(newMessages: string[]): void;
  stop(): void;
}

const startProgress = (telegramClient: TelegramApiClient) => ({
  messages,
  chatId,
  messageId,
  interval,
}: ProgressSettings): MessagesControls => {
  let messagesList: string[] = messages.slice();
  let intervalTimeout: NodeJS.Timeout = null;

  const stopProgress = (): void => {
    clearTimeout(intervalTimeout);
    intervalTimeout = null;
  };

  const sendMessage = async (messageNumber: number) => {
    try {
      await telegramClient.editMessageText(
        `${messagesList[messageNumber]}...`,
        {
          chat_id: chatId,
          message_id: messageId,
        },
      );
  
      if (messageNumber < messagesList.length - 1) {
        intervalTimeout = setTimeout(
          () => sendMessage(messageNumber + 1),
          interval,
        );
      }
    } catch (e) {
      // Important: If editting failed (Deleted / Out-Of-Sync), the progress should be stopped
      stopProgress();
    }
  };

  if(messages.length > 1)
    intervalTimeout = setTimeout(
      () => sendMessage(1),
      interval,
    );

  return {
    restart(newMessages: string[]) {
      stopProgress();

      messagesList = newMessages;

      intervalTimeout = setTimeout(
        () => sendMessage(0),
        interval,
      );
    },
    stop() {
      stopProgress();
    }
  }
}

export const Progress = (telegramClient: TelegramApiClient) =>
  async (chatId: number, messages: string[], interval = 1000): Promise<ProgressControls> => {
    // MUST BE DIFFERENT FOR CLEARING
    let startMessage: Message;
    let progressMessage: Message;
    let controls: MessagesControls;

    return {
      async start() {
        startMessage = await telegramClient.sendMessage(
          chatId,
          WaitingMessage(),
          ClearKeyboard(),
        );

        progressMessage = await telegramClient.sendMessage(
          chatId,
          messages[0],
        );

        controls = startProgress(telegramClient)({
          messages,
          chatId,
          interval,
          messageId: progressMessage.message_id,
        });
      },
      async refresh(messages: string[]) {
        controls.restart(messages);
      },
      async finish() {
        controls.stop();

        await Promise.all([
          telegramClient.deleteMessage(chatId, String(startMessage.message_id)),
          telegramClient.deleteMessage(chatId, String(progressMessage.message_id))
        ]);
      }
    };
  };