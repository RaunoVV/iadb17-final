import "source-map-support/register.js";
import express from "express";
import cors from "cors";

import { hardwareRouter } from "./routes/hardware";
import { templateRouter } from "./routes/template";
import { workflowRouter } from "./routes/workflow.ts";

const index = express();

export const responseMessage = (code: number | undefined, message: string) => {
    return { status: code, message: message };
};

index.use(cors());
index.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Expose-Headers", "X-Total-Count, Content-Range");
    next();
});
index.use(
    express.urlencoded({
        extended: true,
    }),
);
index.use(express.json());

index.use(hardwareRouter);
index.use(templateRouter);
index.use(workflowRouter);

const PORT = process.env.PORT || 8060;
index.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
