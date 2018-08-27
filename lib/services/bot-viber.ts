import { Bot, Events, Message } from "viber-bot";
import * as express from "express";
import { EchoMessage } from "../services/echo-service";

const TOKEN = process.env.VIBER_TOKEN;
const APP_URL = process.env.APP_URL;

export class ViberBot {
    public bot: Bot;
    public onMessage: (message, mesponse) => void;

    constructor() {
        console.log('Viber bot');
        const options = {
            authToken: TOKEN,
            name: "Echo Chat",
            avatar: "https://share.cdn.viber.com/pg_download?id=0-04-04-c3c7826713e9fa4c70119548c141bee55b1d67101f4c129975bdf742b14854b8&filetype=jpg&type=icon"
        }
        this.bot = new Bot(options);

        this.setupActions();
    }
    
    setupWebhook(express: express.Application) {
        this.bot.setWebhook(`${APP_URL}/bot/viber/${TOKEN}`);
        express.use(`/bot/viber/${TOKEN}`, this.bot.middleware());
        // this.bot.setWebhook(APP_URL);
        // express.use("viber/webhook", this.bot.middleware());
    }
    
    sendToChat(chatId: string, message: EchoMessage) {
        let messageText = `*${message.name}*\n${message.text}`;
        this.bot.sendMessage({id: chatId}, [new Message.Text(messageText)]);
    }

    private setupActions() {
        this.sayChatId();

        this.bot.onSubscribe(response => {
            this.say(response, `Hi there ${response.userProfile.name}. I am ${this.bot.name}!`);
        });

        this.bot.on(Events.MESSAGE_RECEIVED, (message, response) => {
            if (typeof this.onMessage === 'function') {
                this.onMessage(message, response)
            }
        })
    }

    private sayChatId() {
        this.bot.onTextMessage(/\/echo/i, (message, response) => {
            this.bot.getUserDetails(response.userProfile)
                .then(userDetails => {
                    let chatId = userDetails.id;
                    this.say(response, `Hello\nYour chatId is:\n${chatId}`);
                });
        })
    }

    private say(response, message: string) {
        response.send(new Message.Text(message))
    }
}