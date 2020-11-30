import React from 'react';
import { sanitizeUrl } from '../../utils/utils';

interface ILinkNewTabProps {
    href: string;
    children: React.ReactNode;
}

export default function LinkNewTab({ href, children }: ILinkNewTabProps) {
    return (
        <a href={sanitizeUrl(href)} target="_blank" rel="noreferrer noopener">{children}</a>
    );
}