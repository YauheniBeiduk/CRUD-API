import { ServerResponse, IncomingMessage } from "http";
import { validate as uuidValidate } from "uuid";
import { sendBadRequestResponse, sendNotFoundResponse, sendResponse } from "../helpers";

export const getAllUsers = (response: ServerResponse & { req: IncomingMessage; }, users: any[]) => sendResponse(response, 200, users);


export const getUser = (pathname: string, users: any[], response: ServerResponse & { req: IncomingMessage; }) => {
    const userId = pathname.split('/')[3];
    const user = users.find((u) => u.id === userId);

    if (!uuidValidate(userId)) {
        sendBadRequestResponse(response, 'Invalid user ID');
        return;
    }
    if (!user) {
        sendNotFoundResponse(response, 'User not found');
        return;
    }
    sendResponse(response, 200, user);
};
