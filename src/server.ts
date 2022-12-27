import { createServer } from "http";
import * as dotenv from 'dotenv';
import { sendInternalServerErrorResponse } from "./helpers";
import { getAllUsers, getUser, createUser, updateUser, deleteUser } from "./api";


dotenv.config();

type User = {
    id: string,
    username: string,
    age: number,
    hobbies: string[],
};

const users: any[] = [];

const server = createServer((request, response) => {
    const { url, method } = request;
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.setHeader("Content-Type", "application/json");

    const { pathname } = new URL(url!, `http://${request.headers.host}`);

    if (pathname === '/api/users' && method === 'GET') {
        getAllUsers(response, users)
    } else if (pathname.startsWith('/api/users/') && method === 'GET') {
        getUser(pathname, users, response);
    } else if (pathname === "/api/users" && method === "POST") {
        createUser(request, response, users);
    } else if (pathname.startsWith('/api/users/') && method === 'PUT') {
        updateUser(request, response, pathname, users);
        } else if (pathname.startsWith('/api/users/') && method === 'DELETE') {
        deleteUser(response, pathname, users);
    } else {
        sendInternalServerErrorResponse(response, 'Not found');
    }
});


const port = process.env.PORT;
console.log(port);
server.listen(port);

export default server;