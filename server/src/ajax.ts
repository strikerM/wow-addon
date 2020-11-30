import https from 'https';
import fs from 'fs';

export function get(url: string | URL) {
    return request(url);
}

export function post(url: string | URL, data: any) {
    const options = { method: 'POST' };
    return request(url, options, data);
}

export function getJson(url: string | URL) {
    return request(url)
        .then(data => JSON.parse(data));
}

export function request(url: string | URL, options: https.RequestOptions = {}, data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let data = '';

            res.setEncoding('utf8');

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(data);
            });

            res.on('error', (err) => {
                console.error(err);
                reject(err);
            })
        });

        req.on('error', (err) => {
            console.error(err);
            reject(err);
        });

        if ((options.method === 'POST' || options.method === 'PUT') && data) {
            req.write(data);
        }

        req.end();
    });
}

function _download(url: string | URL, dest: string, file: fs.WriteStream, resolve: ((_?: any) => void), reject: ((err?: Error) => void)): void {
    const req = https.get(url, (res) => {
        if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
            return _download(res.headers.location, dest, file, resolve, reject)
        }

        if (res.statusCode !== 200) {
            fs.unlink(dest, () => { });
            reject(new Error('Could not download file'));
        }

        res.pipe(file);
    });

    file.on('finish', () => {
        file.close();
    });

    file.on('close', () => {
        resolve();
    });

    req.on('error', (err) => {
        fs.unlink(dest, () => { });
        reject(err);
    });

    file.on('error', (err) => {
        fs.unlink(dest, () => { });
        reject(err);
    });
}

export function download(url: string | URL, dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        return _download(url, dest, file, resolve, reject)
    });
}