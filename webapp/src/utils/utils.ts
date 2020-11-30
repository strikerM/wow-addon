import { getLocalId } from '../../../server/src/Addon';

export { getLocalId };

export function formatDate(date: Date, format: string) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if (format === 'YYYY-MM-DD') {
        return `${year}-${padZero(month)}-${padZero(day)}`;
    }

    return '';
}

export function formatNumber(value: string | number) {
    const M = 1000000;
    const K = 1000;
    const v = Number(value);

    if (v >= M) {
        return (v / M).toFixed(1) + 'M';
    }

    if (v >= K) {
        return (v / K).toFixed(1) + 'K';
    }

    return String(v);
}

export function padZero(value: string | number) {
    const v = Number(value);
    if (v < 10) {
        return '0' + v;
    }
    return String(v);
}

export function sanitizeUrl(value: any): string {
    let url;

    try {
        url = new URL(value);
    }
    catch (err) { }

    if (!url) {
        return '#';
    }

    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
        return '#';
    }

    return value;
}