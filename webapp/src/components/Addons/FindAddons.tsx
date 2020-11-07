import React, { useEffect } from 'react';
import Table, { IColumn } from '../common/Table';
import LinkNewTab from '../common/Link';
import { formatNumber, getLocalId } from '../../utils/utils';

import { AddonType } from '../../../../addon';

interface IFindAddons {
    foundAddons: AddonType[];
    myAddons: AddonType[];
    onInstall(id: string | number): void;
}

export default function FindAddons({ foundAddons, myAddons, onInstall }: IFindAddons) {
    console.log(arguments);
    const columns: IColumn[] = [
        {
            name: 'Name',
            headerComponent(column: IColumn) {
                return column.name;
            },
            component(column: IColumn, addon: AddonType) {
                return (
                    <>
                        <LinkNewTab href={addon.website}>{addon.name}</LinkNewTab>
                        <h4 >{'Downloads: ' + formatNumber(addon.downloadCount)}</h4>
                    </>
                );
            },
        },
        {
            name: 'Status',
            headerComponent(column: IColumn) {
                return column.name;
            },
            component(column: IColumn, addon: AddonType) {
                const key = getLocalId(addon);
                const myAddon = myAddons.find(myAddon => getLocalId(myAddon)=== key);

                if (!myAddon) {
                    const isLoading = addon.isFetching ? 'is-loading' : '';
                    return (
                        <button className={`button is-primary is-rounded is-small ${isLoading}`}
                            onClick={() => onInstall(addon.addonId)}>
                            Install
                        </button>
                    );
                }

                if (myAddon.ver !== addon.ver || myAddon.date !== addon.date) {
                    return 'Out of Date';
                }

                return 'Up to Date';
            },
        },
        {
            name: 'Game Ver',
            headerComponent(column: IColumn) {
                return column.name;
            },
            component(column: IColumn, addon: AddonType) {
                return addon.gameVers;
            },
        },
        {
            name: 'Authors',
            headerComponent(column: IColumn) {
                return column.name;
            },
            component(column: IColumn, addon: AddonType) {
                return addon.authors;
            },
        },
    ];

    useEffect(() => {
        console.log('render FindAddons', foundAddons);
    });

    return (
        <Table data={foundAddons} columns={columns} className="table is-striped is-fullwidth" />
    );
}