# USER CRUD API

## Overview 🔍
🌐 Web service to work with users.

## 🏗️ Install & Run🏃
**Requirements:** Node.js 18.12.1

Download or copy repository:

```bash
git clone https://github.com/YauheniBeiduk/CRUD-API.git
git checkout develop
```

Install dependencies:
```bash
npm install
```

Run service:
Prod:
```bash
npm run start:prod
```
Dev:
```bash
npm run start:dev
```

## Run the tests(jest/supertest)
 npm run test


## API Doc 📚

Service allow to work with ``User`` entity.

### List of API endpoints (use Postman for example):

1. `/api/users (GET)` - retrieve all users;
2. `/api/users/:id (GET)` - retrieve user by id;
3. `/api/users (POST)` - create new user;
4. `/api/users/:id (PUT)` - update user info;
5. `/api/users/:id (DELETE)` - delete user;

### Some examples of usage

## REST API

The REST API to the example app is described below.

## Get all users

### Request

`GET /api/users`

### Response

   status code 200 and all users records

## Create a new user

### Request

`POST /api/users`

    body:
      username — user's name (string, required)
      age — user's age (number, required)
      hobbies — user's hobbies (array of strings or empty array, required)
      
   example -> {"username":"Name","age":20, hobbies: [""]}

## Get a specific user by id

### Request

`GET /api/users/${userId}`

    userId - valid uuid identifier


## Update a specific user by id(can update all or some fields)

### Request

`PUT /api/users/${userId}`

    userId - valid uuid identifier


## Delete a specific user by id

### Request

`DELETE /api/users/${userId}`

    userId - valid uuid identifier
