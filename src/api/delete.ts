import { ServerResponse, IncomingMessage } from "http";
import {validate as uuidValidate} from "uuid";
import {sendBadRequestResponse, sendNotFoundResponse, sendResponse} from "../helpers";

export const deleteUser = (response: ServerResponse & { req: IncomingMessage; }, pathname: string, users: any[]) => {
    const userId = pathname.split("/")[3];
    if (!uuidValidate(userId)) {
        sendBadRequestResponse(response, "Invalid user ID");
    } else {
        const userIndex = users.findIndex((u) => u.id === userId);
        if (userIndex >= 0) {
            users.splice(userIndex, 1);
            sendResponse(response, 204, 'User delete');
        } else {
            sendNotFoundResponse(response, 'User not found');
        }
    }
}