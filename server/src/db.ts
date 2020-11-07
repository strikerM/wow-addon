import knex from 'knex';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import initialMigration from './migrations/00000';
import { AddonType } from '../../addon';

const readdir = promisify(fs.readdir);

let conn: knex;

export function connect() {
    conn = knex({
        client: 'sqlite3',
        connection: {
            filename: './addons.db',
        }
    });

    return runMigrations();
}

async function runMigrations() {
    try {
        await initialMigration.up(conn);
    }
    catch (e) {
        await initialMigration.down(conn);
        console.error(e);
        return;
    }

    const dbMigrations = await conn.select('name').from('migrations');

    console.log('dbMigrations', dbMigrations);

    let migrationFiles = await readdir(path.join(__dirname, './migrations'));
    migrationFiles = migrationFiles.map(file => file.substr(0, file.length - 3));

    const dbMigrationsMap = dbMigrations.reduce((map, row) => {
        map[row.name] = true;
        return map;
    }, Object.create(null));

    const migrationsToRun = migrationFiles
        .filter(file => !dbMigrationsMap[file])
        .sort();

    console.log('migrationsToRun', migrationsToRun);

    for (const fileName of migrationsToRun) {
        const module = require('./migrations/' + fileName).default;
        try {
            await module.up(conn);
        }
        catch (e) {
            console.error(e);
            module.down(conn);
            return;
        }
    }
}

export function getConnection(): knex {
    return conn;
}

export function getAddons(): Promise<AddonType[]> {
    return conn.select('*').from('addons');
}

export function getAddonsBy(where: any): Promise<AddonType[]> {
    return conn.select('*').from('addons').where(where);
}

export async function getAddonById(id: number): Promise<AddonType> {
    const addon = await conn.select('*').from('addons').where({ id: Number(id) });
    return addon[0];
}

export async function insertAddon(addon: AddonType): Promise<AddonType> {
    const [id] = await conn('addons').insert(addon);
    return {... addon, id};
}

export async function updateAddonById(id: number, addon: AddonType): Promise<AddonType> {
    const obj: any = {...addon};
    delete obj.id;

    const rowsUpdated = await conn('addons')
        .where({ id: Number(id) })
        .update(obj);

    if (rowsUpdated === 0) {
        throw new Error('Failed to update addon ' + id + ' ' + addon.name);
    }

    return getAddonById(id);
}

export async function removeAddonById(id: number | string): Promise<number> {
    return conn('addons').where({ id: Number(id) }).del();
}