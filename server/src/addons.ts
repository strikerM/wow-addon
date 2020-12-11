import path from 'path';1
import fs from 'fs-extra';
import os from 'os';

import * as Addon from './Addon';
import { AddonType } from '../../addon';
import * as ajax from './ajax';
import { unzip, rmdirRecursive } from './unzip';
import * as db from './db';
import { ICurseAddon } from './curseAddon';
import { IElvUiAddon } from './elvUiAddon';

const fsMove = fs.move;

// https://addons-ecs.forgesvc.net/api/v2/addon/61284 details


/*
curse
https://github.com/jliddev/WowUp/blob/master/WowUp.WPF/AddonProviders/CurseAddonProvider.cs1
 var url = $"{ApiUrl}/addon/featured";

            try
            {
                var body = new
                {
                    GameId = 1,
                    featuredCount = 6,
                    popularCount = 50,
                    updatedCount = 0
                };

*/

db.connect()
    .catch(err => {
        console.error(err);
        process.exit(2);
    });

const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

let elvuiAddons: AddonType[] = [];
getElvUiAddons('retail')
    .catch(err => console.error(err));

function getAddonDetails(addon: AddonType) {
    if (addon.provider === 'curse') {
        return getAddonDetailsFromCurse(addon);
    }

    if (addon.provider === 'elvui') {
        return getAddonDetailsFromElvui(addon);
    }

    throw new Error(`Unknown prover ${addon.provider} for addon ${addon.addonId} ${addon.clientType} ${addon.name}`);
}

/*
async function getAddonDetailsFromElvui_old(addon: AddonType) {
    const url = new URL(`${config.elvui.apiUrl}`);
    const { clientType, addonId } = addon;

    if (clientType === 'retail') {
        if (Number(addonId) === -2) {
            url.searchParams.append('ui', 'elvui');
        }
        else if (Number(addonId) === -1) {
            url.searchParams.append('ui', 'tukui');
        }
        else {
            url.searchParams.append('addon', String(addonId));
        }
    }
    else {
        url.searchParams.append('classic-addon', String(addonId));
    }

    const addonDetails = await ajax.getJson(url);
    return Addon.fromElvUi(addonDetails, clientType);
}
*/

async function getAddonDetailsFromElvui(addon: AddonType) {
    const { clientType, addonId } = addon;
    const elvUiAddons = await getElvUiAddons(clientType);
    return elvUiAddons.find(elvUiAddon =>  String(elvUiAddon.addonId) === String(addonId));
}

async function getElvUiAddons(clientType: string): Promise<AddonType[]> {
    if (elvuiAddons && elvuiAddons.length) {
        return elvuiAddons;
    }

    const url = new URL(`${config.elvui.apiUrl}`);
    const key = clientType === 'retail' ? 'addons' : 'classic-addons';
    url.searchParams.append(key, 'all');

    let addons: IElvUiAddon[] = [];
    if (clientType === 'retail') {
        //for retail elvui and tukui addons are missing with the "all" value, in classic they are returned

        const elvUiUrl = new URL(`${config.elvui.apiUrl}`);
        elvUiUrl.searchParams.append('ui', 'elvui');

        const tukUiUrl = new URL(`${config.elvui.apiUrl}`);
        tukUiUrl.searchParams.append('ui', 'tukui');

        const values = await Promise.all([
            ajax.getJson(elvUiUrl),
            ajax.getJson(tukUiUrl),
            ajax.getJson(url),
        ]);

        addons = [values[0], values[1]].concat(values[2]);
        console.log('elvui res', values[0]);
    }
    else {
        addons = await ajax.getJson(url);
    }

    elvuiAddons = addons.map(addon => Addon.fromElvUi(addon, clientType)).filter(isNotNull);
    console.log('elvuiAddons', elvuiAddons.slice(0, 3));
    return elvuiAddons;
}

async function getAddonDetailsFromCurse(addon: AddonType) {
    const url = new URL(`${config.curse.apiUrl}/addon/${addon.addonId}`);
    const addonDetails = await ajax.getJson(url);
    return Addon.fromCurse(addonDetails, addon.clientType);
}

async function downloadAddon(addon: AddonType) {
    const filePath = path.join(os.tmpdir(), addon.fileName);
    await ajax.download(addon.downloadUrl, filePath);

    const addonsFolder = getAddonsFolder(addon.clientType);
    const addonFiles = await unzip(filePath, addonsFolder);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(err);
        }
    });

    addon.folders = addonFiles.join(',');
    return addonFiles;
}

function removeAddons(addons: AddonType[]) {
    const foldersToRemove = addons.reduce((acc: string[], addon) => {
        const addonsFolder = getAddonsFolder(addon.clientType);
        const folders = addon.folders.split(',').map(folder => path.join(addonsFolder, folder));
        acc = acc.concat(folders);
        return acc;
    }, []);

    return Promise.all(foldersToRemove.map(folder => rmdirRecursive(folder)));
}

async function moveAddons(src: string, dest: string, options = { overwrite: true }) {
    const srcRetailPath = getAddonsFolder('retail', src);
    const srcClassicPath = getAddonsFolder('classic', src);
    
    const destRetailPath = getAddonsFolder('retail', dest);
    const destClassicPath = getAddonsFolder('classic', dest);

    await Promise.all([
        fsMove(srcRetailPath, destRetailPath, options),
        fsMove(srcClassicPath, destClassicPath, options),
    ]);
}

function getAddonsFolder(clientType: string, wowFolder = config.wowFolder) {
    if (!clientType) {
        throw new Error('getAddonsFolder - missing clientType');
    }
    const clientFolder = clientType === 'retail' ? '_retail_' : '_classic_';
    return path.join(wowFolder, clientFolder, 'Interface', 'AddOns');
}

export async function getAddons(clientType: string) {
    const installedAddons = await db.getAddonsBy({ clientType });

    const promises = installedAddons.map(addon => getAddonDetails(addon)).filter(isNotNull);

    const upstreamAddons = await Promise.all(promises);

    const upstreamAddonsMap = upstreamAddons.reduce((acc, addon) => {
        if (addon) {
            acc[Addon.getLocalId(addon)] = addon;
        }
        return acc;
    }, Object.create(null));

    installedAddons.forEach(addon => {
        const upstreamAddon = upstreamAddonsMap[Addon.getLocalId(addon)];
        addon.upstreamVer = upstreamAddon.ver;
        addon.upstreamDate = upstreamAddon.date;
    });

    return installedAddons;
}

export async function updateAddon(id: number): Promise<AddonType> {
    const addon = await db.getAddonById(id);
    if (!addon) {
        throw new Error('Could not find addon ' + id);
    }

    const addonDetails = await getAddonDetails(addon);
    if (!addonDetails) {
        throw new Error('No addon found upstream for localId: ' + Addon.getLocalId(addon));
    }

    await removeAddons([addon]);
    await downloadAddon(addonDetails);

    return db.updateAddonById(id, addonDetails);
}

export async function removeAddon(id: number) {
    const addon = await db.getAddonById(id);
    if (!addon) {
        return 0;
    }
    await removeAddons([addon]);
    return db.removeAddonById(id);
}

export async function findAddons(searchFilter: string, provider: string, clientType: string): Promise<AddonType[]> {
    if (provider === 'curse') {
        const url = new URL(`${config.curse.apiUrl}/addon/search?gameid=1`);
        url.searchParams.append('searchFilter', searchFilter);

        const addons: ICurseAddon[] = await ajax.getJson(url);

        return addons.map(addon => Addon.fromCurse(addon, clientType)).filter(isNotNull);
    }

    if (provider === 'elvui') {
        return getElvUiAddons(clientType);
    }

    console.error('Unknown provider');
    return [];
}

export async function installAddon(addonId: string | number, provider: string, clientType: string): Promise<AddonType> {
    const dummyAddon = { addonId, provider, clientType };
    const localId = Addon.getLocalId(dummyAddon as AddonType);

    const installedAddons = await db.getAddonsBy(dummyAddon);

    const index = installedAddons.findIndex(addon => Addon.getLocalId(addon) === localId);
    if (index !== -1) {
        throw new Error('Addon allready installed ' + addonId);
    }

    const addonDetails = await getAddonDetails(dummyAddon as AddonType);
    if (!addonDetails) {
        throw new Error('No addon found upstream for localId: ' + localId);
    }

    await downloadAddon(addonDetails);
    return db.insertAddon(addonDetails);
}

export async function getSettings() {
    const settings = {
        wowFolder: config.wowFolder,
    };

    return settings;
}

export async function setWowFolder(wowFolder: string) {
    if (!wowFolder) {
        return;
    }
    
    wowFolder = wowFolder.trim();
    const oldWowFolder = config.wowFolder;

    if (path.resolve(oldWowFolder) === path.resolve(wowFolder)) {
        return;
    }

    const [wowFolderValid, oldWowFolderValid] = await Promise.all([
        isValidWowFolder(wowFolder),
        isValidWowFolder(oldWowFolder),
    ]);

    if (!wowFolderValid) {
        throw new Error('Invalid wow folder provided: ' + wowFolder);
    }

    if (oldWowFolderValid) {
        await moveAddons(oldWowFolder, wowFolder, { overwrite: true });
    }

    config.wowFolder = wowFolder;
    try {
        await fs.writeFile('./config.json', JSON.stringify(config));
    }
    catch (err) {
        console.error(err);
        config.wowFolder = oldWowFolder;
        throw new Error('Failed to save config file');
    }

}

function isNotNull<T>(it: T): it is NonNullable<T> {
    return it != null;
}

async function isValidDirectoryPath(src: string) {
    try {
        const stats = await fs.stat(src);
        return stats.isDirectory();
    }
    catch (err) {
        return false;
    }
}

async function isValidWowFolder(src: string) {
    if (!src || typeof src !== 'string') {
        return false;
    }

    const retailPath = getAddonsFolder('retail', src);
    const classicPath = getAddonsFolder('classic', src);

    const [isValidRetail, isValidClassic] = await Promise.all([
        isValidDirectoryPath(retailPath),
        isValidDirectoryPath(classicPath),
    ]);

    return isValidRetail && isValidClassic;
}