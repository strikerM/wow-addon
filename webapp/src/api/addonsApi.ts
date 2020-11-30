import { get, post, put, remove } from './methods';
import { IAddon, IFindAddons, IInstallAddon } from '../../../types';

const routes = {
    getAddons: './addons/',
    findAddons: './find-addons?',
    installAddon: './addons/',
    updateAddon: './addons',
    removeAddon: './addons?',
};

export function getAddons(clientType: string): Promise<IAddon[]> {
    return get(routes.getAddons + clientType);
}

export function findAddons({ searchFilter, provider, clientType }: IFindAddons): Promise<IAddon[]> {
    const params = new URLSearchParams();
    params.append('searchFilter', searchFilter);
    params.append('provider', provider);
    params.append('clientType', clientType);

    return get(routes.findAddons + params.toString());
}

export function installAddon(addonDetails: IInstallAddon): Promise<IAddon> {
    return post(routes.installAddon, addonDetails);
}

export function updateAddon(id: number): Promise<IAddon> {
    return put(routes.updateAddon, { id });
}

export function removeAddon(id: number) {
    const params = new URLSearchParams();
    params.append('id', String(id));

    return remove(routes.removeAddon + params.toString());
}

