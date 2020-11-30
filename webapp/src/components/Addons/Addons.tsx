import React from 'react';
import { useSelector } from 'react-redux';
import MyAddons from './MyAddons';
import FindAddons from './FindAddons';
import { IStoreState } from '../../store';

export default React.memo(function Addons() {
    const activeTab = useSelector((state: IStoreState) => state.activeTab);
    console.log('Addons render');

    if (activeTab === 'my-addons') {
        return <MyAddons />;
    }

    return <FindAddons />;
});