import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IStoreState, fetchAddons, setSearchFilter, setProvider, findAddons } from '../../store';

export default React.memo(function Controls() {
    const dispatch = useDispatch();
    const { isRefreshing, activeTab, searchFilter, provider, clientType } = useSelector((state: IStoreState) => ({
        isRefreshing: state.isRefreshing,
        activeTab: state.activeTab,
        searchFilter: state.searchFilter,
        provider: state.provider,
        clientType: state.clientType,
    }));

    const searchInputOnEnter = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode !== 13) {
            return;
        }

        const input = e.target as HTMLInputElement;
        dispatch(setSearchFilter(input.value));
    }, []);

    const onProviderChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => dispatch(setProvider(e.target.value)), []);

    const onRefreshClick = useCallback(() => dispatch(fetchAddons()), []);

    const refreshButtonClassList = `button is-info is-rounded ${isRefreshing ? 'is-loading' : ''}`;

    console.log('render Controls', { activeTab, isRefreshing, searchFilter, provider, clientType });

    return (
        <section className="section">
            <div className="container">
                <div className="columns">
                    <div className="column">
                        <button className={refreshButtonClassList} onClick={onRefreshClick} disabled={activeTab !== 'my-addons'}>Refresh</button>
                    </div>
                    <div className="column">
                        <div className="columns">
                            <div className="column" style={{ flexGrow: 0, paddingRight: 1 }}>
                                <div className="select">
                                    <select name="provider" onChange={onProviderChange} disabled={activeTab !== 'find-addons'}>
                                        <option value="curse">Curse</option>
                                        <option value="elvui">ElvUi</option>
                                    </select>
                                </div>
                            </div>
                            <div className="column" style={{ paddingLeft: 0 }}>
                                <input className="input" type="text" placeholder="Search" onKeyDown={searchInputOnEnter} disabled={activeTab !== 'find-addons'} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});