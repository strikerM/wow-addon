import React, { useEffect } from 'react';
import Table, { IColumn } from '../common/Table';
import LinkNewTab from '../common/Link';
import { formatDate, formatNumber } from '../../utils/utils';

import { AddonType } from '../../../../addon';

interface IMyAddonsProps {
    myAddons: AddonType[];
    onUpdate(addon: AddonType): void;
    onRemove(addon: AddonType): void;
}

export default React.memo(function MyAddons({ myAddons, onUpdate, onRemove }: IMyAddonsProps) {
    //pushProps({myAddons, onUpdate, onRemove})
    
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
                if (addon.upstreamVer === addon.ver && addon.upstreamDate === addon.date) {
                    return 'Up to Date';
                }

                const isLoading = addon.isFetching ? 'is-loading' : '';

                return (
                    <button className={`button is-primary is-rounded is-small ${isLoading}`}
                        onClick={() => onUpdate(addon)}
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
            component(column: IColumn, addon: AddonType) {
                return addon.ver;
            },
        },
        {
            name: 'Upstream Ver',
            headerComponent(column: IColumn) {
                return column.name;
            },
            component(column: IColumn, addon: AddonType) {
                return addon.upstreamVer;
            },
        },
        {
            name: 'Local Date',
            headerComponent(column: IColumn) {
                return column.name;
            },
            component(column: IColumn, addon: AddonType) {
                return formatDate(new Date(addon.date), 'YYYY-MM-DD');
            },
        },
        {
            name: 'Upstream Date',
            headerComponent(column: IColumn) {
                return column.name;
            },
            component(column: IColumn, addon: AddonType) {
                return formatDate(new Date(addon.upstreamDate), 'YYYY-MM-DD');
            },
        },
        {
            name: 'Remove',
            headerComponent(column: IColumn) {
                return '';
            },
            component(column: IColumn, addon: AddonType) {
                return (
                    <button className="delete is-small"
                        style={{ backgroundColor: '#f14668' }}
                        onClick={(e) => e.shiftKey ? onRemove(addon) : null}
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