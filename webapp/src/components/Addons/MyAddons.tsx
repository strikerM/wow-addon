import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table, { IColumn } from '../common/Table';
import LinkNewTab from '../common/Link';
import { formatDate, formatNumber } from '../../utils/utils';

import { IStoreState, updateAddon, removeAddon } from '../../store';
import { IAddon } from '../../../../types';

export default React.memo(function MyAddons() {
    const dispatch = useDispatch();
    const myAddons = useSelector((state: IStoreState) => state.myAddons);
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
                if (addon.upstreamVer === addon.ver && addon.upstreamDate === addon.date) {
                    return 'Up to Date';
                }

                const isLoading = addon.isFetching ? 'is-loading' : '';

                return (
                    <button className={`button is-primary is-rounded is-small ${isLoading}`}
                        onClick={() => dispatch(updateAddon(addon.id || -1))}
                    >
                        Update
                    </button>
                );
            },
        },
        {
            name: 'Local Ver',
            headerComponent(column: IColumn) {
                return column.name;
            },
            component(column: IColumn, addon: IAddon) {
                return addon.ver;
            },
        },
        {
            name: 'Upstream Ver',
            headerComponent(column: IColumn) {
                return column.name;
            },
            component(column: IColumn, addon: IAddon) {
                return addon.upstreamVer;
            },
        },
        {
            name: 'Local Date',
            headerComponent(column: IColumn) {
                return column.name;
            },
            component(column: IColumn, addon: IAddon) {
                return formatDate(new Date(addon.date), 'YYYY-MM-DD');
            },
        },
        {
            name: 'Upstream Date',
            headerComponent(column: IColumn) {
                return column.name;
            },
            component(column: IColumn, addon: IAddon) {
                return formatDate(new Date(addon.upstreamDate), 'YYYY-MM-DD');
            },
        },
        {
            name: 'Remove',
            headerComponent(column: IColumn) {
                return '';
            },
            component(column: IColumn, addon: IAddon) {
                return (
                    <button className="delete is-small"
                        style={{ backgroundColor: '#f14668' }}
                        onClick={(e) => e.shiftKey ? dispatch(removeAddon(addon.id || -1)) : null}
                    >
                        Remove
                    </button>
                );
            },
        },
    ];

    useEffect(() => {
        console.log('render MyAddons', myAddons);
    });

    return (
        <Table data={myAddons} columns={columns} className="table is-striped is-fullwidth" />
    );
});