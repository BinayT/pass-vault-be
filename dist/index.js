"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("@routes/userRoutes"));
const vaultEntryRoutes_1 = __importDefault(require("@routes/vaultEntryRoutes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
// Routes
app.use('/api/users', userRoutes_1.default);
app.use('/api/vaults', vaultEntryRoutes_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
