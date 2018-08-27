import 'reflect-metadata';
import * as express from "express";
import * as bodyParser from "body-parser";
import { TelegramBot } from './services/bot-telegram';
import { ViberBot } from './services/bot-viber';
import { EchoService } from "./services/echo-service";
import { ChatPlatformTypes } from "./models/chat.model";
import { AutoWired, Inject } from "typescript-ioc";

export class App {

    public express: express.Application;
    @Inject
    public telegramBot: TelegramBot;
    @Inject
    public viberBot: ViberBot;
    @Inject
    public echoService: EchoService;

    constructor(
        // public telegramBot: TelegramBot,
        // public viberBot: ViberBot
    ) {
        this.express = express();
        this.config();
        this.start();
    }

    public onServerStarted() {
    }

    private config(): void{
        this.viberBot.setupWebhook(this.express);
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.telegramBot.setupWebhook(this.express);
        // this.viberBot.setupWebhook(this.express);
    }


    private start() {
        this.viberBot.onMessage = (message, response) => {
            this.echoService.echoMessage({
                chatId: response.userProfile.id,
                chatPlatform: ChatPlatformTypes.Viber
            }, {
                name: response.userProfile.name,
                text: message.text
            })
        }
        
        this.telegramBot.onMessage = (message) => {
            if (message.from.isBot) return;

            this.echoService.echoMessage({
                chatId: message.chat.id,
                chatPlatform: ChatPlatformTypes.Telegram
            }, {
                name: message.from.first_name || message.from.username,
                text: message.text
            })
        }
    }



}