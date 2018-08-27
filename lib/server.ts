import { App } from "./app";

const PORT = process.env.PORT || 3000;
const application = new App();

application.express.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
    if (typeof application.onServerStarted === 'function') {
        application.onServerStarted();
    }
})