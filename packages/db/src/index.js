"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClient = void 0;
const prisma_1 = require("./generated/prisma");
/**
 * Prisma v7: pass adapter or accelerateUrl to PrismaClient constructor.
 * Connection URL is read from `process.env.DATABASE_URL` and used here for runtime.
 */
exports.prismaClient = new prisma_1.PrismaClient({ adapter: process.env.DATABASE_URL ? { url: process.env.DATABASE_URL } : undefined });
