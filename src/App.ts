import bodyParser from "body-parser";
import express = require("express");
import {Express, Request, Response, Router} from "express";
import helmet from "helmet";
import http from "http";
import morgan from "morgan";

import config from "./Config/Config";
import {HelpController} from "./Controller/Api/HelpController";
import {createApiRoutes} from "./Routes/Api";
import {IService} from "./Services/interface";
import logger, {morganLogger} from "./Services/Logger";

export class App implements IService {

    public express: Express;
    public server: http.Server;

    private helpController: HelpController;

    constructor() {
        this.express = express();
        // add before route middleware's here
        this.express.use(morgan("short", { stream: morganLogger }));
        this.express.use(bodyParser.json());
        this.express.use(helmet());
        // add after route middleware's here
        this.addInitialRoutes();
    }

    public async start(): Promise<void> {
        try {
            this.server = this.express.listen(config.port);
            logger.info(`Server is listening on ${config.port}`);
            this.initControllers();
            this.addApiRoutes();
        } catch (e) {
            logger.error(`App failed to start. Reason: ${e.message}`);
        }
    }

    public async stop(): Promise<void> {
        logger.info("Server shutting down");
        await this.server.close();
    }

    private initControllers() {
        this.helpController = new HelpController();
    }

    private addInitialRoutes(): void {
        const router = Router();
        router.get("/", (req: Request, res: Response) => {
            res.json({
                message: "Welcome stranger!",
            });
        });
        router.get("/health", (req: Request, res: Response) => {
            return res.json({
                status: "OK",
            });
        });
        this.express.use("/", router);
    }

    private addApiRoutes() {
        this.express.use("/api", createApiRoutes(
            this.helpController,
        ));
    }
}
