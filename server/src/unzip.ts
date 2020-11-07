import { exec } from 'child_process';
import crypto from 'crypto';
import os from 'os';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const mkdir = promisify(fs.mkdir);
const rmdir = promisify(fs.rmdir);

export async function unzip(src: string, dest: string): Promise<string[]> {
    const randomFolderName = await getRandomString();
    const tempDest = path.join(os.tmpdir(), randomFolderName);
    await mkdirRecursive(tempDest);
    let cmd = `tar -x -f "${src}" -C "${tempDest}"`;
    await executeCommand(cmd);
    const files = await readdir(tempDest);
    await rmdirRecursive(tempDest);

    cmd = `tar -x -f "${src}" -C "${dest}"`;
    await executeCommand(cmd);

    return files;
}

function executeCommand(cmd: string): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                return reject(err);
            }

            if (stderr) {
                return reject(new Error(stderr));
            }

            resolve(stdout);
        });
    });
}

function getRandomString(len = 48): Promise<string> {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(len, (err, buffer) => {
            if (err) {
                return reject(err);
            }
            const token = buffer.toString('hex');
            resolve(token);
        });
    });
}

function mkdirRecursive(dirPath: string, options = { recursive: true }) {
    return mkdir(dirPath, options);
}

export function rmdirRecursive(dirPath: string, options = { recursive: true, maxRetries: 5 }) {
    return rmdir(dirPath, options);
}