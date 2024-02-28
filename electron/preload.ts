import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge } from 'electron';

if (process.contextIsolated) {
  // contextBridge.exposeInMainWorld('versions', {
  //   node: () => process.versions.node,
  //   chrome: () => process.versions.chrome,
  //   electron: () => process.versions.electron,
  //   // 除函数之外，我们也可以暴露变量
  // });
  console.log('1111111');
  contextBridge.exposeInMainWorld('electron', electronAPI);
} else {
  console.log('222222');

  window.electron = electronAPI;
  window.electron.ipcRenderer.on('electron:say', (_, args) => {
    console.log(args);
  });
  setInterval(() => {
    window.electron.ipcRenderer.send('electron:say', 'hello');
  }, 1000);
}
console.log('preload.tss', electronAPI);
