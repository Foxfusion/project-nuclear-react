import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
    // Where your schema is
    schema: 'prisma/schema.prisma',

    // Where migrations will go (optional but recommended)
    migrations: {
        path: 'prisma/migrations',
    },

    // 👇 This is the important Prisma 7 bit
    datasource: {
        url: env('DATABASE_URL'),
    },
});
