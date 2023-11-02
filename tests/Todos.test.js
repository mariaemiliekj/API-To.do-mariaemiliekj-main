const request = require('supertest');
const app = require('../app');

const testUser = {
    email: 'testUser@gmail.com',
    password: '0000'
};

let token;

describe("testing-authorization-routes", () => {


    //Logging in with a valid account.
    test("POST /login - success", async () => {
        const credentials = {
            email: testUser.email,
            password: testUser.password,
        };
        const response = await request(app).post("/login").send(credentials);
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("data");
        expect(response.body.data).toHaveProperty("token");

        token = response.body.data.token;
    });


    //Using the token from 1. to get all the users Todos.
    test("GET /todos - success", async () => {
        const response = await request(app)
            .get("/todos") 
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toEqual("success"); 
        expect(response.body).toHaveProperty("data"); 
        expect(Array.isArray(response.body.data.todos)).toBeTruthy(); 
    });


    //Using the token from 1. and add a new Todo item.
    test("POST /todos - create a new todo item", async () => {
        const newTodo = {
            name: 'Hello test',
            description: 'Test for todo',
            categoryId: 2,
            statusId: 2,
        };

        const response = await request(app)
            .post('/todos') 
            .set('Authorization', `Bearer ${token}`) 
            .send(newTodo);

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toEqual("success"); 
        expect(response.body).toHaveProperty("data"); 
        expect(response.body.data).toHaveProperty("todo");
        expect(response.body.data.todo.name).toEqual(newTodo.name);
        expect(response.body.data.todo.description).toEqual(newTodo.description);
        createdTodoId = response.body.data.todo.id;
    });


    //Deleting the created Todo item from number 3.
    test("DELETE /todos/:id - delete a todo item", async () => {
        const response = await request(app)
            .delete(`/todos/${createdTodoId}`)
            .set("Authorization", "Bearer " + token);
    
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toEqual("success");
    });


    //Trying to get Todos without sending JWT token in the header.
    test("GET /todos - fail without token", async () => {
        const response = await request(app)
            .get("/todos")
    
        expect(response.statusCode).toBe(403);
        expect(response.body).toHaveProperty("status");
        expect(response.body.status).toEqual("error");
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toEqual("Forbidden - No token provided");
    });

    
    //Trying to get Todos by sending an invalid JWT token.
    test("GET /todos - fail with invalid token", async () => {
        const response = await request(app)
            .get("/todos") 
            .set('Authorization', `Bearer INVALID_TOKEN_HERE`);
    
        expect(response.statusCode).toBe(403);
        expect(response.body).toHaveProperty("status");
        expect(response.body.status).toEqual("error"); 
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toEqual("Forbidden - Invalid token"); 
    });
});
