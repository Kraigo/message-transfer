import { ChatModel } from "models/chat.model";

export class RoomModel {
    isEnable: boolean;
    chats: ChatModel[] = [];
}