import { createServer, IncomingMessage, ServerResponse} from "http";
import {v4 as uuidv4} from 'uuid';
import {validate as uuidValidate} from 'uuid';
import * as dotenv from 'dotenv';

dotenv.config();
type User = {
    id: string,
    username: string,
    age: number,
    hobbies: string[],
};

const users: User[] = [];

// Function to send a response with the specified status code and body
const sendResponse = (response: ServerResponse & { req: IncomingMessage; }, statusCode: number, body: any) => {
    response.statusCode = statusCode;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(body));
};

// Function to send a 404 Not Found response
const sendNotFoundResponse = (response: ServerResponse & { req: IncomingMessage; }, message: string) => {
    sendResponse(response, 404, { message });
};

// Function to send a 400 Bad Request response
const sendBadRequestResponse = (response: ServerResponse & { req: IncomingMessage; }, message: string) => {
    sendResponse(response, 400, { message });
};

// Function to send a 500 Internal Server Error response
const sendInternalServerErrorResponse = (response: ServerResponse & { req: IncomingMessage; }, message: string) => {
    sendResponse(response, 500, { message });
};

const hasRequiredFields = (body: { username: string, age: number, hobbies: string[] }) => {
    return body.hasOwnProperty("username") && body.hasOwnProperty("age") && body.hasOwnProperty("hobbies");
};

// HTTP server
const server = createServer((request, response) => {
    const { url, method } = request;
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");

    response.setHeader("Content-Type", "application/json");
    const { pathname } = new URL(url!, `http://${request.headers.host}`);

    console.log('pathname', pathname);
    if (pathname === '/api/users' && method === 'GET') {
        sendResponse(response, 200, users);
    } else if (pathname.startsWith('/api/users/') && method === 'GET') {
        const userId = pathname.split('/')[3];
        const user = users.find((u) => u.id === userId);
        console.log(user);
        if (!uuidValidate(userId)) {
            // Invalid user ID
            sendBadRequestResponse(response, 'Invalid user ID');
            return;
        }
        if (!user) {
            sendNotFoundResponse(response, 'User not found');
            return;
        }
        sendResponse(response, 200, user);
    } else if (method === "POST" && pathname === "/api/users") {
        let body = "";
        request.on("data", (chunk) => {
            body += chunk.toString();
        });
        request.on("end", () => {
            try {
                const data = JSON.parse(body);
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
            } catch (error) {
                sendBadRequestResponse(response, "Invalid request body");
            }
        });
    } else if (pathname.startsWith('/api/users/') && method === 'PUT') {
        const userId = pathname.split('/')[3];
        if (!uuidValidate(userId)) {
            sendBadRequestResponse(response, "Invalid user ID");
        } else {
            const userIndex = users.findIndex((u) => u.id === userId);
            if (userIndex >= 0) {
                let body = "";
                request.on("data", (chunk) => {
                    body += chunk.toString();
                });
                request.on("end", () => {
                    try {
                        const data = JSON.parse(body);
                        const user = {
                            id: userId,
                            username: data.username,
                            age: data.age,
                            hobbies: data.hobbies,
                        };
                        users[userIndex] = user;
                        sendResponse(response, 200, user);
                    } catch (error) {
                        sendBadRequestResponse(response, "Invalid request body");
                    }
                });
            } else {
                sendNotFoundResponse(response, "User not found");
            }
        }
    } else if (pathname.startsWith('/api/users/') && method === 'DELETE') {
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
    } else {
        sendInternalServerErrorResponse(response, 'Not found');
    }
});


const port = process.env.PORT;
console.log(port);
server.listen(port);