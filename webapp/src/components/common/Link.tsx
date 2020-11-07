import React from 'react';

interface ILinkNewTabProps {
    href: string;
    children: React.ReactNode;
}

export default function LinkNewTab ({ href, children }: ILinkNewTabProps) {
    return (
        <a href={href} target="_blank" rel="noreferrer noopener">{children}</a>
    );
}