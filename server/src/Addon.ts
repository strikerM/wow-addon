import { AddonType } from '../../addon';
import { ICurseAddon } from './curseAddon';
import { IElvUiAddon } from './elvUiAddon';

export enum curseReleaseTypes {
    STABLE = 1,
    BETA = 2,
    ALPHA = 3,
};

export function getLocalId(id: AddonType | string | number, provider?: string, clientType?: string) {
    if (id && typeof id === 'object' && id.addonId && id.provider && id.clientType) {
        return `${id.addonId}-${id.provider}-${id.clientType}`;
    }

    if (!id) {
        throw new Error('Addon getLocalId - missing id');
    }

    if (!provider) {
        throw new Error('Addon getLocalId - missing provider');
    }

    if (!clientType) {
        throw new Error('Addon getLocalId - missing clientType');
    }

    return `${id}-${provider}-${clientType}`;
}

export function fromCurse(addonDetails: ICurseAddon, clientType: string) {
    if (!addonDetails.id) {
        return;
    }

    if (!addonDetails.name) {
        return;
    }

    if (!Array.isArray(addonDetails.latestFiles)) {
        //console.log(fromCurse - invalid latestFiles prop for addon', addonDetails.id);
        return;
    }

    const latestFile = addonDetails.latestFiles.find(file => file.gameVersionFlavor === clientTypeCurse(clientType) && file.releaseType === curseReleaseTypes.STABLE);
    if (!latestFile) {
        //console.log('fromCurse - no latest file found for addon', addonDetails.id, addonDetails.name, clientType);
        return;
    }

    if (!latestFile.displayName) {
        return;
    }

    if (!latestFile.fileDate) {
        return;
    }

    if (!latestFile.downloadUrl) {
        return;
    }

    if (!latestFile.fileName) {
        return;
    }

    const authors = Array.isArray(addonDetails.authors) && addonDetails.authors.length ? addonDetails.authors.map(author => author.name).filter(name => name).join(', ') : 'n/a';
    const gameVers = Array.isArray(latestFile.gameVersion) && latestFile.gameVersion.length ? latestFile.gameVersion.join(' ') : 'n/a';

    const addon: AddonType = {
        id: null,
        addonId: addonDetails.id,
        name: addonDetails.name,
        ver: latestFile.displayName,
        date: latestFile.fileDate,
        folders: '',
        provider: 'curse',
        upstreamVer: latestFile.displayName,
        upstreamDate: latestFile.fileDate,
        downloadUrl: latestFile.downloadUrl,
        fileName: latestFile.fileName,
        clientType,
        downloadCount: addonDetails.downloadCount || 0,
        website: addonDetails.websiteUrl || '',
        authors,
        gameVers
    };

    return addon;
}

export function fromElvUi(addonDetails: IElvUiAddon, clientType: string) {
    if (!addonDetails.id) {
        return;
    }

    if (!addonDetails.name) {
        return;
    }

    if (!addonDetails.version) {
        return;
    }

    if (!addonDetails.lastupdate) {
        return;
    }

    if (!addonDetails.url) {
        return;
    }

    const date = new Date(addonDetails.lastupdate).toISOString();

    const addon: AddonType = {
        id: null,
        addonId: addonDetails.id,
        name: addonDetails.name,
        ver: addonDetails.version,
        date,
        folders: '',
        provider: 'elvui',
        upstreamVer: addonDetails.version,
        upstreamDate: date,
        downloadUrl: addonDetails.url,
        fileName: addonDetails.name,
        clientType,
        downloadCount: Number(addonDetails.downloads) || 0,
        website: addonDetails.web_url || '',
        authors: addonDetails.author || 'n/a',
        gameVers: addonDetails.patch || 'n/a',
    };

    return addon;
}

function clientTypeCurse(clientType: string) {
    if (clientType === 'retail') {
        return 'wow_retail';
    }

    if (clientType === 'classic') {
        return 'wow_classic';
    }

    throw new Error('clientTypeCurse - Unknown clientType ' + clientType);
}