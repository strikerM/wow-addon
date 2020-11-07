import React from 'react';
import { AddonType } from '../../../../addon';
import MyAddons from './MyAddons';
import FindAddons from './FindAddons';

interface IAddonsProps {
    myAddons: AddonType[];
    foundAddons: AddonType[];
    activeTab: string;
    onInstall(id: string | number): void;
    onUpdate(addon: AddonType): void;
    onRemove(addon: AddonType): void;
}

export default React.memo(function Addons({ myAddons, foundAddons, activeTab, onInstall, onUpdate, onRemove }: IAddonsProps) {
    if (activeTab === 'my-addons') {
        return <MyAddons myAddons={myAddons} onUpdate={onUpdate} onRemove={onRemove} />;
    }

    return <FindAddons foundAddons={foundAddons} myAddons={myAddons} onInstall={onInstall} />;
});