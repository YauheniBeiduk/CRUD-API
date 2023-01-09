import { IncomingMessage, ServerResponse } from "http";
import { validate as uuidValidate } from "uuid";
import { parseData, sendBadRequestResponse, sendNotFoundResponse, sendResponse } from "../helpers";

export const updateUser = (request: IncomingMessage, response: ServerResponse, pathname: string, users: any[]) => {
    const userId = pathname.split('/')[3];
    if (!uuidValidate(userId)) {
        sendBadRequestResponse(response, "Invalid user ID");
    } else if (uuidValidate(userId)){
        const userIndex = users.findIndex((u) => u.id === userId);
        const callback = (data: { username: string; age: number; hobbies: any; }) => {
            if (userIndex >= 0) {
                const user = {
                    id: userId,
                    username: data.username,
                    age: data.age,
                    hobbies: data.hobbies,
                };
                users[userIndex] = user;
                sendResponse(response, 200, user);
            }
        }
        parseData(request, response, (data) => callback(data), "Invalid request body");
    } else {
        sendNotFoundResponse(response, "User not found");
    }
};
