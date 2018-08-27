import * as Bot from 'node-telegram-bot-api';
import * as express from "express";
import { EchoMessage } from '../services/echo-service';

const TOKEN = process.env.TELEGRAM_TOKEN;
const APP_URL = process.env.APP_URL;

export class TelegramBot {
    public bot: Bot;
    public onMessage: (message) => void;

    constructor() {
        console.log('Telegram bot');
        let options = {
            webHook: {
                port: process.env.PORT,
                // port: parseInt(process.env.PORT, 10),                
                // key: '',
                // cert: '',
                // pfx: ''
            }
        }
        this.bot = new Bot(TOKEN, options as any);

        this.setupActions();
    }

    setupWebhook(express: express.Application) {
        this.bot.setWebHook(`${APP_URL}/bot/telegram/${TOKEN}`);
        express.post(`/bot/telegram/${TOKEN}`, (req, res) => {
            this.bot.processUpdate(req.body);
            res.sendStatus(200);
        });
    }

    sendToChat(chatId: string, message: EchoMessage) {
        let messageText = `*${message.name}*\n${message.text}`;
        this.bot.sendMessage(chatId, messageText, {parse_mode: 'Markdown'});
    }

    private setupActions() {
        this.sayChatId();

        this.bot.on("message", (message) => {
            if (typeof this.onMessage === 'function') {
                this.onMessage(message)
            }
        })
    }

    private sayChatId() {
        this.bot.onText(/\/echo/, (msg) => {
            var chatId = msg.chat.id;
            this.bot.sendMessage(chatId, `Hello\nYour chatId is:\n${chatId}`);
        })
    }
}