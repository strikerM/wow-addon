import path from 'path';
import knex from 'knex';

export default {
    async up(dbConn: knex) {
        await dbConn.schema.createTable('addons', (table) => {
            table.increments('id');
            table.integer('addonId').notNullable();
            table.string('name').notNullable();
            table.string('provider').notNullable();
            table.string('clientType').notNullable();
            table.string('date').notNullable();
            table.string('upstreamDate').notNullable();
            table.string('ver').notNullable();
            table.string('upstreamVer').notNullable();
            table.string('downloadUrl').notNullable();
            table.string('website').notNullable();
            table.string('folders').notNullable();
            table.string('authors').notNullable();
            table.string('gameVers').notNullable();
            table.string('fileName').notNullable();
            table.integer('downloadCount').unsigned().notNullable();
            table.timestamps(true, true);
        });

        const { name } = path.parse(__filename);
        await dbConn.insert({ name: name }).into('migrations');
    },

    async down(dbConn: knex) {
        const { name } = path.parse(__filename);
        
        await Promise.all([
            dbConn.schema.dropTableIfExists('addons'),
            dbConn('migrations').where('name', name).del(),
        ]);
    }

};