/*
api.post('auth/local/register', {
        username,
        password,
        email,
      })
*/ 

const request = require('supertest');

describe('Teste para lidar com registro de usuário', () => {
    const path = "/auth/local/register";
    const mockUserData = {
      username: "userregister",
      email: "userregister@strapi.com",
      password: "1234userregister"
    };
  
    it("Registro", async () => {
        await request(strapi.server.httpServer)
            .post(path)
            .send({
                username: mockUserData.username,
                password: mockUserData.password,
                email: mockUserData.email,})
            .set("accept", "application/json")
            .set("Content-Type", "application/json")
            .expect(200)
            .then((data) => {
                expect(data.body).toBeDefined();
                expect(data.body.jwt).toBeDefined();
                expect(data.body.user).toBeDefined();
            });
    })

    it("Registro com senha fora dos padroes", async () => {
        await request(strapi.server.httpServer)
            .post(path)
            .send({
                username: 'username',
                password: 'a',
                email: 'username@gmail.com',})
            .set("accept", "application/json")
            .set("Content-Type", "application/json")
            .expect(400)
            .then((data) => {
                expect(data.body).toBeDefined();
                expect(data.body.error.name).toBe('ValidationError');
                expect(data.body.error.message).toBe('password must be at least 6 characters');
            });
    })

    it("Registro sem senha fora dos padroes", async () => {
        await request(strapi.server.httpServer)
            .post(path)
            .send({
                username: 'username',
                password: '',
                email: 'username@gmail.com',})
            .set("accept", "application/json")
            .set("Content-Type", "application/json")
            .expect(400)
            .then((data) => {
                expect(data.body).toBeDefined();
                expect(data.body.error.name).toBe('ValidationError');
                expect(data.body.error.message).toBe('password is a required field');
            });
    })


    it("Registro usuario já existente", async () => {
        await request(strapi.server.httpServer)
            .post(path)
            .send({
                username: mockUserData.username,
                password: 'foradospadroes',
                email: mockUserData.email,})
            .set("accept", "application/json")
            .set("Content-Type", "application/json")
            .expect(400)
            .then((data) => {
                expect(data.body).toBeDefined();
                expect(data.body.error.name).toBe('ApplicationError');
                expect(data.body.error.message).toBe('Email or Username are already taken');
            });
    })
});
  