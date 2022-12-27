import {hasRequiredFields, parseData, sendBadRequestResponse, sendResponse} from "../helpers";
import {v4 as uuidv4} from "uuid";
import { IncomingMessage, ServerResponse } from "http";

export const createUser = (request: IncomingMessage, response: ServerResponse, users: { id: string; username: string; age: number; hobbies: any; }[]) => {
    const callback = (data: { username: string; age: number; hobbies: any; }) => {
        if (hasRequiredFields(data)) {
            const user = {
                id: uuidv4(),
                username: data.username,
                age: data.age,
                hobbies: data.hobbies,
            };
            users.push(user);
            sendResponse(response, 201, JSON.stringify(user));
        } else {
            sendBadRequestResponse(response, "Missing required fields");
        }
    }

    parseData(request, response, (data) => callback(data), "Invalid request body");
};
