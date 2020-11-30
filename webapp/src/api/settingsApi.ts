import { get, post } from './methods';

import { ISettings } from '../../../types';

const routes = {
    getSettings: './settings',
    setWowFolder: './wow-folder',
};

export function getSettings(): Promise<ISettings> {
    return get(routes.getSettings);
}

export function setWowFolder(wowFolder: string): Promise<void> {
    return post(routes.setWowFolder, { wowFolder });
}