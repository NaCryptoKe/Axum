const userController = require("./userController");
const express = require("express");
const Router = express.Router();

Router.post("/login", userController.login);
Router.post("/register", userController.register);

module.exports = Router;