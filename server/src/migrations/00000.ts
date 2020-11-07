import path from 'path';
import knex from 'knex';

export default {
    async up(dbConn: knex) {
        const hasMigrations = await dbConn.schema.hasTable('migrations');

        if (hasMigrations) {
            return true;
        }

        await dbConn.schema.createTable('migrations', (table) => {
            table.increments('id');
            table.string('name').notNullable();
            table.timestamps(true, true);
        });

        const { name } = path.parse(__filename);
        await dbConn.insert({ name }).into('migrations');

        return true;
    },

    down(dbConn: knex) {
        return dbConn.schema.dropTableIfExists('migrations');
    }
};