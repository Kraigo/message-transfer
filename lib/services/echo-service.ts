import { ChatConfig } from "../chat.config";
import { ViberBot } from "../services/bot-viber";
import { TelegramBot } from "../services/bot-telegram";
import { App } from "app";
import { ChatPlatformTypes, ChatModel } from "../models/chat.model";
import { RoomModel } from "models/room.model";
import { Inject } from "typescript-ioc";

export class EchoMessage {
    name: string;
    text: string;
}

export class EchoService {
    private chatConfig = new ChatConfig();
    @Inject
    public telegramBot: TelegramBot;
    @Inject
    public viberBot: ViberBot;

    constructor(
    ) {}



    echoMessage(chat: ChatModel, message: EchoMessage) {
        console.log("echo from:", chat.chatPlatform, chat.chatId);
        let room: RoomModel = this.chatConfig.rooms
            .filter((r: RoomModel) => r.isEnable)
            .find((r: RoomModel) => 
                r.chats.some((c: ChatModel) => c.chatId === String(chat.chatId)));

        if (room) {
            room.chats
                .filter((c: ChatModel) => c.chatId !== String(chat.chatId))
                .forEach((c: ChatModel) => {
                    this.send(c, message);
                });
        }
    }

    private send(chat: ChatModel, message: EchoMessage) {
        switch (chat.chatPlatform) {
            case ChatPlatformTypes.Viber: {
                this.viberBot.sendToChat(chat.chatId, message);
                break;
            }
            case ChatPlatformTypes.Telegram: {
                this.telegramBot.sendToChat(chat.chatId, message);
                break;
            }
        }
    }
}