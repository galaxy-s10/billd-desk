import path from 'path';

const appDir = process.cwd();

export const resolveApp = (relativePath) => path.resolve(appDir, relativePath);
