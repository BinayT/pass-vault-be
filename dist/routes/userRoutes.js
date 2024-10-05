"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../controllers/User/UserController");
const router = express_1.default.Router();
// Route for user registration
router.get('/getallusers', UserController_1.getAllUsers);
router.post('/register', UserController_1.registerUser);
// Route for user login
router.post('/login', UserController_1.loginUser);
exports.default = router;
