"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
/**
 * Prisma config for Migrate and tooling.
 * Move connection URLs here instead of the `datasource` block in schema.prisma.
 *
 * Set your database URL in the environment variable `DATABASE_URL`.
 * For Prisma Accelerate, set `ACCELERATE_URL` and pass `accelerateUrl` to PrismaClient.
 *
 * See: https://pris.ly/d/config-datasource
 */
exports.default = {
    datasources: {
        db: {
            provider: 'postgresql',
            url: process.env.DATABASE_URL,
        },
    },
};
