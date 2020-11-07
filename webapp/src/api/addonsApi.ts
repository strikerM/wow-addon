import { get, post, put, remove } from './methods';
import { AddonType } from '../../../addon';

const routes = {
    getAddons: './addons/',
    findAddons: './find-addons?',
    installAddon: './addons/',
    updateAddon: './addons',
    removeAddon: './addons?',
};

export function getAddons(clientType: string): Promise<AddonType[]> {
    return get(routes.getAddons + clientType);
}

export function findAddons(searchFilter: string, provider: string, clientType: string): Promise<AddonType[]> {
    const params = new URLSearchParams();
    params.append('searchFilter', searchFilter);
    params.append('provider', provider);
    params.append('clientType', clientType);

    return get(routes.findAddons + params.toString());
}

interface IInstallAddon {
    id: string | number;
    provider: string;
    clientType: string;
}

export function installAddon(addonDetails: IInstallAddon): Promise<AddonType> {
    return post(routes.installAddon, addonDetails);
}

export function updateAddon(id: number): Promise<AddonType> {
    return put(routes.updateAddon, { id });
}

export function removeAddon(id: number) {
    const params = new URLSearchParams();
    params.append('id', String(id));

    return remove(routes.removeAddon + params.toString());
}

