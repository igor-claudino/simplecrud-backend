const express = require('express');

const routes = express.Router();


const UserService = require('./services/UserService');

routes.post("/api/login", UserService.authenticate);
routes.post("/api/users", UserService.store);
routes.put("/api/users/:id", UserService.update);
routes.delete("/api/users/:id", UserService.delete);
routes.get("/api/users", UserService.getAll)

module.exports = routes;