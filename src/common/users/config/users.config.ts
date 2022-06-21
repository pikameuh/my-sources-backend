import { registerAs } from "@nestjs/config";

export default registerAs('users', () => ({
    role: 'role',
    token: 'token',
    dateManager: 'dateManager',
}));