import 'dotenv/config';
/**
 * Prisma config for Migrate and tooling.
 * Move connection URLs here instead of the `datasource` block in schema.prisma.
 *
 * Set your database URL in the environment variable `DATABASE_URL`.
 * For Prisma Accelerate, set `ACCELERATE_URL` and pass `accelerateUrl` to PrismaClient.
 *
 * See: https://pris.ly/d/config-datasource
 */
declare const _default: {
    datasources: {
        db: {
            provider: string;
            url: string | undefined;
        };
    };
};
export default _default;
//# sourceMappingURL=prisma.config.d.ts.map