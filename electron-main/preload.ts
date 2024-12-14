import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

console.log('执行了electron-main的preload.ts');
