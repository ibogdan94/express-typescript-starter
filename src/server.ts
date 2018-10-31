import express, {Router, Request, Response, NextFunction} from 'express'
import bodyParser from "body-parser";
import cors from 'cors'
import * as Promise from "bluebird";
global.Promise = Promise.noConflict();
require('dotenv').config();
const expressValidator = require("express-validator");
import {router as authRoutes} from "./routes/auth.router";
import jwtMiddleware from "./middlewares/jwt.middleware";

const server = express();

server.use(bodyParser.json());
server.use(cors());
server.use(expressValidator());
server.use(bodyParser.urlencoded({extended: true}));

//public
server.use('/', authRoutes);

//protected urls /api
jwtMiddleware(server);

server.get('/api/world', (req: Request, res:Response) => {
    return res.json({canSeeMe: true})
});

interface Error {
    status?: number;
    message?: string;
}

server.use((err: Error, req: Request, res:Response, next:NextFunction) => {
    res.status(err.status || 500);
    res.json({message: err.message});
});


server.listen(3000, function () {
    console.log(`App listening on port 3000 in ${process.env.NODE_ENV} mode!`)
});