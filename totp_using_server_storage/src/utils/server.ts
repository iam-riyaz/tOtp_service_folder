import express from 'express';

// this is intitialization of APP using Express
export const createServer=()=>{

    const app = express();

    app.use(express.json());

    return app;

}