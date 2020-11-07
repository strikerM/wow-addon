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
};

export interface ICurseAddon {
    authors?: ICurseAutor[];
    id?: number;
    name?: string;
    downloadCount?: number;
    websiteUrl?: string;
    latestFiles?: ICurseFile[];
};