import React, { useState, useEffect, useCallback } from 'react';

import Navbar from './Navbar/Navbar';
import Controls from './Controls/Controls';
import Addons from './Addons/Addons';
import Settings from './Settings/Settings';

import * as addonsApi from '../api/addonsApi';
import * as settingsApi from '../api/settingsApi';
import { getLocalId } from '../utils/utils';

import { AddonType } from '../../../addon';

export default function App() {

    const [activeTab, setActiveTab] = useState('my-addons');
    const [clientType, setClientType] = useState('retail');
    const [provider, setProvider] = useState('curse');
    const [searchTerm, setSearchTerm] = useState('');
    const [myAddons, setMyAddons] = useState<AddonType[]>([]);
    const [foundAddons, setFoundAddons] = useState<AddonType[]>([]);
    const [elvuiRetail, setElvuiRetail] = useState<AddonType[]>([]);
    const [elvuiClassic, setElvuiClassic] = useState<AddonType[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [wowFolderInput, setWowFolderInput] = useState('');
    const [wowFolder, setWowFolder] = useState('');

    const setMyAddonsWithSort = (addons: AddonType[] | ((addons: AddonType[]) => AddonType[])) => {
        if (Array.isArray(addons)) {
            addons.sort((a: AddonType, b: AddonType) => {
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();

                if (nameA < nameB) {
                    return -1;
                }

                if (nameA > nameB) {
                    return 1;
                }

                return 0;
            });
        }
        setMyAddons(addons);
    };

    const onSetActiveTab = useCallback((activeTab: string) => {
        setActiveTab(activeTab);
    }, [])

    const onProviderChange = useCallback((provider: string) => {
        setFoundAddons([]);
        setProvider(provider);
    }, []);

    const onSetSearchTerm = useCallback((term: string) => {
        setSearchTerm(term);
    }, []);

    const onClientTypeChange = useCallback((clientType: string) => {
        setFoundAddons([]);
        setClientType(clientType);
    }, []);

    const onWowFolderChange = useCallback((wowFolder: string) => {
        setWowFolderInput(wowFolder);
    }, []);

    const onWowFolderSetClick = useCallback(() => {
        const newPath = wowFolderInput.trim();
        const oldPath = wowFolder.trim();

        if (!newPath) {
            return;
        }

        if (newPath === oldPath) {
            return;
        }

        settingsApi.setWowFolder(newPath)
            .then(getSettings)
            .catch(err => {
                console.error(err);
            });

    }, [wowFolderInput, wowFolder]);

    const installAddon = useCallback((id: string | number) => {
        setInstallStart(id, provider, clientType);

        addonsApi.installAddon({ id, provider, clientType })
            .then(addon => setMyAddons(myAddons => myAddons.concat([addon])))
            .catch(err => console.error(err))
            .finally(() => setInstallFinish(id, provider, clientType));
    }, [provider, clientType]);

    const updateAddon = useCallback((addon: AddonType) => {
        if (addon.id == null) {
            return;
        }

        setUpdatingStart(addon);

        addonsApi.updateAddon(addon.id)
            .then(addon => {
                setMyAddons(myAddons => {
                    const index = myAddons.findIndex(({ id }) => id === addon.id);
                    if (index === -1) {
                        return myAddons;
                    }

                    return myAddons.slice(0, index)
                        .concat([addon])
                        .concat(myAddons.slice(index + 1, myAddons.length));
                });
            })
            .catch(err => console.error(err))
            .finally(() => setUpdatingFinish(addon));
    }, []);

    const removeAddon = useCallback((addon: AddonType) => {
        if (addon.id == null) {
            return;
        }

        addonsApi.removeAddon(addon.id)
            .then(() => setMyAddons(myAddons => myAddons.filter(({ id }) => id !== addon.id)))
            .catch(err => console.error(err));
    }, []);

    const fetchMyAddons = useCallback(() => {
        console.log('fetchMyAddons called');
        setIsRefreshing(true);
        addonsApi.getAddons(clientType)
            .then(addons => {
                setMyAddonsWithSort(addons);
                setIsRefreshing(false);
            })
            .catch(err => console.error(err))
        //.finally(() => setIsRefreshing(false));
    }, [clientType]);

    const getElvUi = () => {
        Promise.all([
            addonsApi.findAddons('', 'elvui', 'retail'),
            addonsApi.findAddons('', 'elvui', 'classic'),
        ])
            .then(addons => {
                setElvuiRetail(addons[0]);
                setElvuiClassic(addons[1]);
            })
            .catch(err => console.error(err));
    };

    const getSettings = () => {
        settingsApi.getSettings()
            .then(settings => {
                console.log(settings);
                setWowFolder(settings.wowFolder);
                setWowFolderInput(settings.wowFolder);
            })
            .catch(err => {
                console.error(err);
            })
    };

    useEffect(() => {
        getSettings();
        getElvUi();
    }, []);

    useEffect(() => {
        console.log('useEffect - fetchMyAddons');
        fetchMyAddons();
    }, [fetchMyAddons]);

    useEffect(() => {
        if (provider === 'curse') {
            console.log('findAddons run');
            addonsApi.findAddons(searchTerm, provider, clientType)
                .then(setFoundAddons)
                .catch(err => console.error(err));
        }
        else if (provider === 'elvui') {
            const addonsCache = clientType === 'retail' ? elvuiRetail : elvuiClassic;
            if (searchTerm === '~all') {
                setFoundAddons(addonsCache.slice());
            }
            else {
                const value = searchTerm.toUpperCase();
                setFoundAddons(addonsCache.filter(addon => addon.name.toUpperCase().indexOf(value) !== -1));
            }
        }
    }, [searchTerm, provider, clientType]);

    const setInstallStart = (id: string | number, provider: string, clientType: string) => {
        setLoadingStatus(getLocalId(id, provider, clientType), setFoundAddons, true);
    };

    const setInstallFinish = (id: string | number, provider: string, clientType: string) => {
        setLoadingStatus(getLocalId(id, provider, clientType), setFoundAddons, false);
    };

    const setUpdatingStart = (addon: AddonType) => {
        setLoadingStatus(getLocalId(addon), setMyAddons, true);
    };

    const setUpdatingFinish = (addon: AddonType) => {
        setLoadingStatus(getLocalId(addon), setMyAddons, false);
    };

    const setLoadingStatus = (localId: string, setFn: (fn: (addons: AddonType[]) => AddonType[]) => void, stausValue: boolean) => {
        setFn(addonList => {
            return addonList.map(fAddon => {
                if (getLocalId(fAddon) === localId) {
                    return { ...fAddon, isFetching: stausValue };
                }
                return fAddon;
            })
        });
    };

    if (activeTab === 'settings') {
        return (
            <>
                <Navbar setActiveTab={onSetActiveTab} setClientType={onClientTypeChange} />
                
                <section className="section">
                    <div className="container">
                        <Settings onWowFolderChange={onWowFolderChange} wowFolderInputValue={wowFolderInput} onWowFolderSetClick={onWowFolderSetClick}/>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <Navbar setActiveTab={onSetActiveTab} setClientType={onClientTypeChange} />

            <Controls onRefresh={fetchMyAddons} setProvider={onProviderChange} setSearchTerm={onSetSearchTerm} activeTab={activeTab} isRefreshing={isRefreshing} />

            <section className="section">
                <div className="container">
                    <Addons myAddons={myAddons} foundAddons={foundAddons} activeTab={activeTab} onInstall={installAddon} onUpdate={updateAddon} onRemove={removeAddon} />
                </div>
            </section>
        </>
    );
}