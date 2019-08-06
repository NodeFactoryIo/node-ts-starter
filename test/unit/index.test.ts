import {after, before} from "mocha";
import {App} from "../../src/App";
import logger from "../../src/Services/Logger";

export const app: App = new App();

before( () => {
    logger.silent = true;
    app.server = app.express.listen(0);
});

after( () => {
    app.server.close();
    logger.silent = false;
});
