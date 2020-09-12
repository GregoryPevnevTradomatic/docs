import { Storage } from '../../services';
import { LocalStorageSettings, initializeDirectories } from './common';
import { LoadFileFromDisk } from './store/loadFile';
import { SaveFileToDisk } from './store/saveFile';

export const LocalStorage = (settings: LocalStorageSettings): Storage => {
  initializeDirectories(settings.storagePath);

  return {
    saveFile: SaveFileToDisk(settings),
    loadFile: LoadFileFromDisk(settings),
    shareURL: () => { throw new Error('CANNOT GET SHARABLE URL') },
  };
};
