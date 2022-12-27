import {IncomingMessage, ServerResponse} from "http";
import {v4 as uuidv4} from "uuid";

export const sendResponse = (response: ServerResponse & { req: IncomingMessage; }, statusCode: number, body: any) => {
    response.statusCode = statusCode;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(body));
};

export const sendNotFoundResponse = (response: ServerResponse & { req: IncomingMessage; }, message: string) => {
    sendResponse(response, 404, { message });
};

export const sendBadRequestResponse = (response: ServerResponse & { req: IncomingMessage; }, message: string) => {
    sendResponse(response, 400, { message });
};

// Function to send a 500 Internal Server Error response
export const sendInternalServerErrorResponse = (response: ServerResponse & { req: IncomingMessage; }, message: string) => {
    sendResponse(response, 500, { message });
};

export const hasRequiredFields = (body: { username: string, age: number, hobbies: string[] }) => {
    return body.hasOwnProperty("username") && body.hasOwnProperty("age") && body.hasOwnProperty("hobbies");
};

export const parseData = (request: IncomingMessage, response: ServerResponse, callback: (data: any) => void, errMsg: string) => {
    let body = "";
    request.on("data", (chunk) => {
        body += chunk.toString();
    });
    request.on("end", () => {
        try {
            const data = JSON.parse(body);

            callback(data);

            } catch (error) {
            sendBadRequestResponse(response, errMsg);
        }
    });
};
