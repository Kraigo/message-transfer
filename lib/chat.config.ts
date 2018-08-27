import { RoomModel } from "./models/room.model";
import { ChatModel, ChatPlatformTypes } from "./models/chat.model";

export class ChatConfig {

    rooms: any[] = [];
    constructor() {
        this.rooms = [
            {
                isEnable: true,
                chats: [
                    {
                        chatPlatform: ChatPlatformTypes.Telegram,
                        chatId: '',
                    },
                    {
                        chatPlatform: ChatPlatformTypes.Viber,
                        chatId: '', 
                    }
                ]
            },
            {
                isEnable: true,
                chats: [
                    {
                        chatPlatform: ChatPlatformTypes.Telegram,
                        chatId: '',
                    }
                ]
            }
        ];
    }
}