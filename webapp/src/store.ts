import { configureStore, createSlice, createAsyncThunk, SerializedError, PayloadAction } from '@reduxjs/toolkit';
import * as addonsApi from './api/addonsApi';
import * as settingsApi from './api/settingsApi';

import { IAddon, IFindAddons } from '../../types';

export interface IStoreState {
    myAddons: IAddon[];
    foundAddons: IAddon[];

    elvuiRetail: IAddon[];
    elvuiClassic: IAddon[];

    isRefreshing: boolean;
    refreshError: Error | SerializedError | null;

    activeTab: string;
    clientType: string;
    provider: string;
    searchFilter: string;

    wowFolder: string;
    wowFolderInput: string;
}

export const fetchAddons = createAsyncThunk<IAddon[], void, { state: IStoreState }>('addons/fetchAddons', (_, thunkApi) => {
    const clientType = thunkApi.getState().clientType;
    return addonsApi.getAddons(clientType);
});

export const updateAddon = createAsyncThunk('addons/updateAddon', (id: number) => addonsApi.updateAddon(id));

export const installAddon = createAsyncThunk<IAddon, string | number, { state: IStoreState }>('addons/installAddon', (addonId: string | number, thunkApi) => {
    const { provider, clientType } = thunkApi.getState();
    return addonsApi.installAddon({ id: addonId, provider, clientType });
});

export const findAddons = createAsyncThunk<IAddon[], IFindAddons, { state: IStoreState }>('addons/findAddons', (addonDetails: IFindAddons, thunkApi) => {
    const { searchFilter, provider, clientType } = addonDetails;

    if (provider === 'curse') {
        return addonsApi.findAddons(addonDetails);
    }

    if (provider === 'elvui') {
        return Promise.resolve()
            .then(() => {
                const state = thunkApi.getState();
                const addonsCache = clientType === 'retail' ? state.elvuiRetail : state.elvuiClassic;
                const value = searchFilter.toUpperCase();
                return addonsCache.filter(addon => addon.name.toUpperCase().includes(value));
            });
    };

    throw new Error('Unkonwn provider ' + provider);
});

export const removeAddon = createAsyncThunk('addons/removeAddon', async (id: number) => {
    await addonsApi.removeAddon(id);
    return id;
});

export const fetchElvui = createAsyncThunk('addons/fetchElvui', () => {
    return Promise.all([
        addonsApi.findAddons({ searchFilter: '', provider: 'elvui', clientType: 'retail' }),
        addonsApi.findAddons({ searchFilter: '', provider: 'elvui', clientType: 'classic' }),
    ]);
});

export const fetchSettings = createAsyncThunk('settings/fetchSettings', () => settingsApi.getSettings());

export const setWowFolder = createAsyncThunk<void, void, { state: IStoreState }>('settings/setWowFolder', async (_, thunkApi) => {
    const { wowFolder, wowFolderInput } = thunkApi.getState();
    const newPath = wowFolderInput.trim();
    const oldPath = wowFolder.trim();

    if (!newPath) {
        throw new Error('No path provided');
    }

    if (newPath === oldPath) {
        throw new Error('Same path provided');
    }

    return settingsApi.setWowFolder(newPath);
});

const initialState: IStoreState = {
    myAddons: [],
    foundAddons: [],

    elvuiRetail: [],
    elvuiClassic: [],

    refreshError: null,
    isRefreshing: false,

    activeTab: 'my-addons',
    clientType: 'retail',
    provider: 'curse',
    searchFilter: '',

    wowFolder: '',
    wowFolderInput: '',
};

const addons = createSlice({
    name: 'addons',
    initialState: initialState,
    reducers: {
        setActiveTab: (state, action: PayloadAction<string>) => {
            state.activeTab = action.payload;
        },

        setClientType: (state, action: PayloadAction<string>) => {
            state.clientType = action.payload;
        },

        setProvider: (state, action: PayloadAction<string>) => {
            state.provider = action.payload;
        },

        setSearchFilter: (state, action: PayloadAction<string>) => {
            state.searchFilter = action.payload;
        },
        setWowFolderInput: (state, action: PayloadAction<string>) => {
            state.wowFolderInput = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAddons.pending, (state, action) => {
            state.refreshError = null;
            state.isRefreshing = true;
        });

        builder.addCase(fetchAddons.fulfilled, (state, action) => {
            state.refreshError = null;
            state.myAddons = action.payload;
            state.isRefreshing = false;
        });

        builder.addCase(fetchAddons.rejected, (state, action) => {
            state.refreshError = action.error;
            state.isRefreshing = false;
        });



        builder.addCase(installAddon.pending, (state, action) => {
            const addonId = action.meta.arg;
            const isFetching = true;
            setInstallAddonStatus(state.foundAddons, addonId, isFetching);
        });

        builder.addCase(installAddon.fulfilled, (state, action) => {
            state.myAddons.push(action.payload);

            const addonId = action.meta.arg;
            const isFetching = false;
            setInstallAddonStatus(state.foundAddons, addonId, isFetching);
        });

        builder.addCase(installAddon.rejected, (state, action) => {
            const addonId = action.meta.arg;
            const isFetching = false;
            setInstallAddonStatus(state.foundAddons, addonId, isFetching);
        });



        builder.addCase(findAddons.pending, (state, action) => {

        });

        builder.addCase(findAddons.fulfilled, (state, action) => {
            state.foundAddons = action.payload;
        });

        builder.addCase(findAddons.rejected, (state, action) => {

        });



        builder.addCase(removeAddon.pending, (state, action) => {

        });

        builder.addCase(removeAddon.fulfilled, (state, action) => {
            state.myAddons = state.myAddons.filter(addon => addon.id !== action.payload);
        });

        builder.addCase(removeAddon.rejected, (state, action) => {
            console.error(removeAddon.rejected.type, action.error);
        });



        builder.addCase(updateAddon.pending, (state, action) => {
            setUpdateAddonStatus(state.myAddons, action.meta.arg, true);
        });

        builder.addCase(updateAddon.fulfilled, (state, action) => {
            const index = state.myAddons.findIndex(addon => addon.id === action.payload.id);
            if (index !== -1) {
                state.myAddons[index] = action.payload;
            }
        });

        builder.addCase(updateAddon.rejected, (state, action) => {
            setUpdateAddonStatus(state.myAddons, action.meta.arg, false);
        });



        builder.addCase(fetchElvui.pending, (state, action) => {

        });

        builder.addCase(fetchElvui.fulfilled, (state, action) => {
            const [elvuiRetail, elvuiClassic] = action.payload;
            state.elvuiRetail = elvuiRetail;
            state.elvuiClassic = elvuiClassic;
        });

        builder.addCase(fetchElvui.rejected, (state, action) => {
            console.error(action.error);
        });



        builder.addCase(fetchSettings.pending, (state, action) => {

        });

        builder.addCase(fetchSettings.fulfilled, (state, action) => {
            state.wowFolder = action.payload.wowFolder;
            state.wowFolderInput = action.payload.wowFolder;
        });

        builder.addCase(fetchSettings.rejected, (state, action) => {
            console.error(fetchSettings.rejected.type, action.error);
        });



        builder.addCase(setWowFolder.pending, (state, action) => {

        });

        builder.addCase(setWowFolder.fulfilled, (state, action) => {
            state.wowFolder = state.wowFolderInput;
        });

        builder.addCase(setWowFolder.rejected, (state, action) => {

        });
    },
});

function setInstallAddonStatus(addonList: IAddon[], addonId: string | number, status: boolean) {
    const addon = addonList.find(addon => addon.addonId === addonId);
    if (addon) {
        addon.isFetching = status;
    }
}

function setUpdateAddonStatus(addonList: IAddon[], id: number, status: boolean) {
    const addon = addonList.find(addon => addon.id === id);
    if (addon) {
        addon.isFetching = status;
    }
}

export const { setActiveTab, setClientType, setProvider, setSearchFilter, setWowFolderInput } = addons.actions;

export default configureStore({ reducer: addons.reducer });