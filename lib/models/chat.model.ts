export enum ChatPlatformTypes {
    Viber = 'viber',
    Telegram = 'telegram'
}

export class ChatModel {
    chatId: string;
    chatPlatform: ChatPlatformTypes;
}