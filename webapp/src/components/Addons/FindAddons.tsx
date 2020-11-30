import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table, { IColumn } from '../common/Table';
import LinkNewTab from '../common/Link';
import { formatNumber, getLocalId } from '../../utils/utils';

import { IStoreState, installAddon } from '../../store';
import { IAddon } from '../../../../types';

export default function FindAddons() {
    const dispatch = useDispatch();
    const [foundAddons, myAddons] = useSelector((state: IStoreState) => [state.foundAddons, state.myAddons]);

    const columns: IColumn[] = [
        {
            name: 'Name',
            headerComponent(column: IColumn) {
                return column.name;
            },
            component(column: IColumn, addon: IAddon) {
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
            component(column: IColumn, addon: IAddon) {
                const localId = getLocalId(addon);
                const myAddon = myAddons.find(myAddon => getLocalId(myAddon) === localId);

                if (!myAddon) {
                    const isLoading = addon.isFetching ? 'is-loading' : '';
                    return (
                        <button className={`button is-primary is-rounded is-small ${isLoading}`}
                            onClick={() => dispatch(installAddon(addon.addonId))}>
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
            component(column: IColumn, addon: IAddon) {
                return addon.gameVers;
            },
        },
        {
            name: 'Authors',
            headerComponent(column: IColumn) {
                return column.name;
            },
            component(column: IColumn, addon: IAddon) {
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