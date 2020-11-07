export type AddonType = {
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
    isFetching?:boolean;
};