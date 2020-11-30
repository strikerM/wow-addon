import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Navbar from './Navbar/Navbar';
import Controls from './Controls/Controls';
import Addons from './Addons/Addons';
import Settings from './Settings/Settings';

import { IStoreState, fetchAddons ,fetchElvui, findAddons } from '../store';

export default function App() {
    const dispatch = useDispatch();
    const { activeTab, searchFilter, provider, clientType } = useSelector((state: IStoreState) => ({
        activeTab: state.activeTab,
        searchFilter: state.searchFilter,
        provider: state.provider,
        clientType: state.clientType,
    }));

    console.log('App render');

    useEffect(() => {
        console.log('App useEffect');
        dispatch(fetchAddons());
        dispatch(fetchElvui());
        dispatch(findAddons({ searchFilter: '', provider: 'curse', clientType: 'retail' }));
    }, []);

    useEffect(() => {
        if (activeTab !== 'find-addons') {
            return;
        }

        console.log('Controls effect run');
        dispatch(findAddons({ searchFilter, provider, clientType }));
    }, [dispatch, activeTab, searchFilter, provider, clientType]);

    if (activeTab === 'settings') {
        return (
            <>
                <Navbar />

                <section className="section">
                    <div className="container">
                        <Settings />
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <Controls />

            <section className="section">
                <div className="container">
                    <Addons />
                </div>
            </section>
        </>
    );
}