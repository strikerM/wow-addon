import React from 'react';
import TableRow, { IColumn } from './TableRow';

export { IColumn };

interface ITableProps {
    data: any[];
    columns: IColumn[];
    className?: string;
}

export default function Table({ data, columns, className }: ITableProps) {
    return(
        <table className={className} >
            <thead>
                <TableRow columns={columns} isHeader={true} />
            </thead>

            <tbody>
                {data.map(el => <TableRow key={el.id || el.addonId} columns={columns} isHeader={false} el={el} />)}
            </tbody>
        </table>
    )
}