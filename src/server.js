import { createServer } from "http";
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();
const users = [
    {
    id: uuidv4(),
    username: 'Yauheni',
    age: 20,
    hobbies: ['array of strings'],
    },
];

const parseBody = (request, callback) => {
    let body = '';
    request.on('data', function(chunk) {
        body += chunk.toString();
    });
    request.on('end', function() {
        callback(parse(body));
    });
};

// Function to send a response with the specified status code and body
const sendResponse = (response, statusCode, body) => {
    response.statusCode = statusCode;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(body));
};

// Function to send a 404 Not Found response
const sendNotFoundResponse = (response, message) => {
    sendResponse(response, 404, { message });
};

// Function to send a 400 Bad Request response
const sendBadRequestResponse = (response, message) => {
    sendResponse(response, 400, { message });
};

// Function to send a 500 Internal Server Error response
const sendInternalServerErrorResponse = (response, message) => {
    sendResponse(response, 500, { message });
};


// HTTP server
const server = createServer((request, response) => {
    const {pathname, search} = new URL(`http://${request.headers.host}${request.url}`);
try {
    if (pathname === '/api/users' && request.method === 'GET') {
        sendResponse(response, 200, users);
    } else if (pathname.startsWith('/api/users/') && request.method === 'GET') {
        const userId = pathname.split('/')[2];
        if (!uuid.validate(userId)) {
            // Invalid user ID
            sendBadRequestResponse(response, 'Invalid user ID');
            return;
        }
        if (!users[userId]) {
            // User not found
            sendNotFoundResponse(response, 'User not found');
            return;
        }
        sendResponse(response, 200, users[userId]);
    } else if (pathname === '/api/users' && request.method === 'POST') {
        const user = req.body;
        if (!user.username || !user.age || !user.hobbies) {
            sendBadRequestResponse(response, 'Required fields are missing');
        }
        user.id = uuidv4();
        users.push(user);
        sendResponse(response, 201, user);
    } else if (pathname.startsWith('/api/users/') && request.method === 'PUT') {

        const userId = pathname.split('/')[2];
        if (!uuid.validate(userId)) {
            // Invalid user ID
            sendBadRequestResponse(response, 'Invalid user ID');
            return;
        }
        if (!users[userId]) {
            // User not found
            sendNotFoundResponse(response, 'User not found');
            return;
        }
        parseBody(request, (body) => {
            // Update the user record
            users[userId] = {...users[userId], ...body};
            sendResponse(response, 200, users[userId]);
        });
    } else if (pathname.startsWith('/api/users/') && request.method === 'DELETE') {
        // DELETE /api/users/:userId
        // Delete an existing user record
        const userId = pathname.split('/')[2];
        if (!uuid.validate(userId)) {
            // Invalid user ID
            sendBadRequestResponse(response, 'Invalid user ID');
            return;
        }
        if (!users[userId]) {
            // User not found
            sendNotFoundResponse(response, 'User not found');
            return;
        }
        // Delete the user record
        delete users[userId];
        sendResponse(response, 204, null);
    } else {
        sendNotFoundResponse(response, 'Not found');
    }
} catch {
    sendInternalServerErrorResponse(response, 'Errors on the server...')
}
});


const port = process.env.PORT || 3000;

server.listen(port);