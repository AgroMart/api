const request = require('supertest');

var user;
var jwt;
const mockUserData = {
    username: "userteste",
    email: "userteste@strapi.com",
    password: "1234userteste"
};

async function setupUser() {
    response = await request(strapi.server.httpServer)
            .post("/auth/local/register")
            .send({
                username: mockUserData.username,
                password: mockUserData.password,
                email: mockUserData.email,})
            .set("accept", "application/json")
            .set("Content-Type", "application/json");
    
    user = response.body.user
    jwt = response.body.jwt
}

function getUser(){
    return user
}

function getJWT(){
    return jwt
}

module.exports = { getUser, getJWT, setupUser };
