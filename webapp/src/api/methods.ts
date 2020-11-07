export function get(url: string) {
    return fetch(url).then(res => {
        if (res.status !== 200) {
            console.error('Get failed with statusCode: ', res.status, url);
            throw (new Error('Get failed with statusCode: ' + res.status));
        }
        return res.json();
    });
}

export function post(url: string, data: any) {
    return update(url, data, 'POST');
}

export function put(url: string, data: any) {
    return update(url, data, 'PUT');
}

export function update(url: string, data: any, method: string) {
    return fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(res => {
            if (res.status !== 200) {
                console.error(method + ' failed with statusCode: ', res.status, url, data);
                throw (new Error(method + ' failed with statusCode: ' + res.status));
            }
            return res.json();
        });
}

export function remove(url: string) {
    return fetch(url, { method: 'DELETE' })
        .then(res => {
            if (res.status !== 200) {
                console.error('Delete failed with statusCode: ', res.status, url);
                throw (new Error('Delete failed with statusCode: ' + res.status));
            }
        });
}