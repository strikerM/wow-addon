import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import * as addons from './addons';

const app = express();

interface IDirectives {
    'default-src'?: string[];
    'style-src'?: string[];
    'object-src'?: string[];
    'require-trusted-types-for'?: string[];
    'report-uri'?: string[];
}

function csp({ directives, reportOnly }: { directives: IDirectives, reportOnly?: boolean }) {
    const headerName = reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy';

    const keys = Object.keys(directives) as (keyof IDirectives)[];
    const directiveString = keys.reduce((acc, key, i, arr) => {
        const directive = directives[key] as string[];

        acc += key + ' ';
        directive.forEach((value, i, arr) => {
            acc += value;
            if (i !== arr.length - 1) {
                acc += ' '
            }
        });

        if (i === arr.length - 1) {
            acc += ';';
        }
        else {
            acc += '; ';
        }

        return acc;
    }, '');

    return function (req: express.Request, res: express.Response, next: express.NextFunction) {
        if (req.url === '/' || req.url === '/index.html') {
            res.setHeader(headerName, directiveString);
        }
        next();
    }
}

app.use(csp({
    directives: {
        'default-src': ["'self'"],
        'style-src': ["'self'", "https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css"],
        'object-src': ["'none'"],
        'require-trusted-types-for': ["'script'"],
        //reportUri: ["/csp"],
    },
    reportOnly: false,
}));

// app.use((req, res, next) => {
//     res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self' https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css");
//     next();
// });

app.use(express.static(path.join(__dirname, '../../webapp/build')));
app.use(bodyParser.json());

app.get('/addons/:clientType', (req, res) => {
    addons.getAddons(req.params.clientType)
        .then(addons => res.json(addons))
        .catch(err => {
            console.error(err);
            res.json([]);
        });
});

app.post('/addons', (req, res) => {
    const { id, provider, clientType } = req.body;
    addons.installAddon(id, provider, clientType)
        .then(addon => res.json(addon))
        .catch(err => {
            console.error(err);
            res.status(500).end();
        });
});

app.put('/addons', (req, res) => {
    const { id }: { id: number } = req.body;
    addons.updateAddon(Number(id))
        .then(addon => res.json(addon))
        .catch(err => {
            console.error(err);
            res.status(500).end();
        })
});

app.delete('/addons', (req, res) => {
    const { id } = req.query;
    addons.removeAddon(Number(id))
        .then(() => res.end())
        .catch(err => {
            console.error(err);
            res.status(500).end();
        })
});

app.get('/find-addons', (req, res) => {
    const { searchFilter, provider, clientType } = req.query;
    addons.findAddons(String(searchFilter), String(provider), String(clientType))
        .then(addons => res.json(addons))
        .catch(err => {
            console.error(err);
            res.json([]);
        });
});

app.get('/settings', (req, res) => {
    addons.getSettings()
        .then(settings => res.json(settings))
        .catch(err => {
            console.error(err);
            res.json({});
        });
});

app.post('/wow-folder', (req, res) => {
    addons.setWowFolder(req.body.wowFolder)
        .then(() => res.json({}))
        .catch(err => {
            console.error(err);
            res.json({ err: err.message });
        });
});

app.use(bodyParser.json({ type: 'application/csp-report' }));
app.post('/csp', (req, res) => {
    console.log('csp-violation', req.body);
    res.end();
});

app.listen(3000, '127.0.0.1', () => console.log('App started on port 3000'));