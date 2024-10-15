"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const db_1 = __importDefault(require("@config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateJWTToken_1 = require("@utils/generateJWTToken");
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { emailOrUsername, password } = req.body;
    const { data: user, error } = yield db_1.default
        .from('users')
        .select('*')
        .or(`email.eq.${emailOrUsername},username.eq.${emailOrUsername}`)
        .single();
    if (!user || error) {
        res.status(401).json({ message: 'Invalid email/username or password' });
        return;
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid email/username or password' });
        return;
    }
    const jwtToken = (0, generateJWTToken_1.generateToken)(user.id);
    res.status(200).json({
        message: 'Login successful',
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
        },
        jwtToken
    });
});
exports.loginUser = loginUser;
