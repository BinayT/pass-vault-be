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
exports.loginUser = exports.registerUser = exports.getAllUsers = void 0;
const db_1 = __importDefault(require("../../config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
// Function to register a new user
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield db_1.default
        .from('users')
        .select('*')
        .single();
    res.status(201).json({ data: data });
});
exports.getAllUsers = getAllUsers;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password } = req.body;
    // Check if the user already exists
    const { data, error: userError } = yield db_1.default
        .from('users')
        .select('*')
        .eq('email', email);
    if (userError) {
        res.status(400).json({ message: 'User already exists or error checking user', error: userError });
        return;
    }
    // Hash the password
    const hashedPassword = yield bcrypt_1.default.hash(password, 10); // 10 is the salt rounds
    // Create a new user object
    const newUser = {
        id: (0, uuid_1.v4)(),
        email,
        username,
        password: hashedPassword,
        created_at: new Date(),
    };
    // Save the new user to the database
    const { error } = yield db_1.default.from('users').insert(newUser);
    if (error) {
        res.status(500).json({ message: 'Error creating user', error });
        return;
    }
    res.status(201).json({ message: 'User registered successfully' });
});
exports.registerUser = registerUser;
// Function to log in a user
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { emailOrUsername, password } = req.body;
    // Check if the user exists
    const { data: user, error } = yield db_1.default
        .from('users')
        .select('*')
        .or(`email.eq.${emailOrUsername},username.eq.${emailOrUsername}`)
        .single();
    if (!user || error) {
        res.status(401).json({ message: 'Invalid email/username or password' });
        return;
    }
    // Compare the password
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid email/username or password' });
        return;
    }
    // Fetch the vaults of the user after successful login
    const { data: vaults, error: vaultsError } = yield db_1.default
        .from('vaults')
        .select('*')
        .eq('user_email', user.email);
    if (vaultsError) {
        res.status(500).json({ message: 'Error fetching vaults', error: vaultsError });
        return;
    }
    // If login is successful, we return the user data + the vaults of the user
    res.status(200).json({
        message: 'Login successful',
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
        },
        vaults,
    });
});
exports.loginUser = loginUser;
