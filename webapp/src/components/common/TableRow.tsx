import React from 'react';

export interface IColumn {
    name: string;
    headerComponent(column: IColumn): React.ReactNode;
    component(column: IColumn, el: any): React.ReactNode;
}

interface ITableRowProps {
    columns: IColumn[];
    isHeader?: boolean;
    el?: any;
}

export default function TableRow({ columns, isHeader, el }: ITableRowProps) {
    return (
        <tr>
            {columns.map(column => <td key={column.name}>{isHeader ? column.headerComponent(column) : column.component(column, el)}</td>)}
        </tr>
    );
}