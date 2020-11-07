import { get, post } from './methods';

const routes = {
    getSettings: './settings',
    setWowFolder: './wow-folder',
};

interface ISettings {
    wowFolder: string;
};

export function getSettings(): Promise<ISettings> {
    return get(routes.getSettings);
}

export function setWowFolder(wowFolder: string): Promise<void> {
    return post(routes.setWowFolder, { wowFolder });
}