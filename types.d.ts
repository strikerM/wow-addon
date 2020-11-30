export interface IInstallAddon {
    id: string | number;
    provider: string;
    clientType: string;
}

export interface IFindAddons {
    searchFilter: string;
    provider: string;
    clientType: string;
}

export interface ISettings {
    wowFolder: string;
}

export interface IAddon {
    id: number | null;
    addonId: number | string;
    name: string;
    ver: string;
    date: string;
    folders: string;
    provider: string;
    upstreamVer: string;
    upstreamDate: string;
    downloadUrl: string;
    fileName: string;
    clientType: string;
    downloadCount: number | string;
    website: string;
    authors: string;
    gameVers: string;
    isFetching?: boolean;
}

export interface ICurseAutor {
    name?: string;
}

export interface ICurseFile {
    gameVersionFlavor?: string;
    releaseType?: number;
    displayName?: string;
    downloadUrl?: string;
    fileDate?: string;
    fileName?: string;
    gameVersion?: string[];
}

export interface ICurseAddon {
    authors?: ICurseAutor[];
    id?: number;
    name?: string;
    downloadCount?: number;
    websiteUrl?: string;
    latestFiles?: ICurseFile[];
}

export interface IElvUiAddon {
    lastupdate?: string;
    author?: string;
    patch?: string;
    id?: string | number;
    name?: string;
    version?: string;
    url?: string;
    downloads?: number | string;
    web_url?: string;
}