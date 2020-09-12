import { Storage as BucketStorage, Bucket } from '@google-cloud/storage';
import { LoadFileFromCloud } from './loadFile';
import { SaveFileToCloud } from './saveFile';
import { Storage } from '../../services';
import { ShareURLFromCloud } from './shareURL';

export interface CloudStorageSettings {
  credentialsFilePath: string;
  projectId: string;
  bucketName: string;
}

export const CloudStorage = (settings: CloudStorageSettings): Storage => {
  const bucketStorage: BucketStorage = new BucketStorage({
    projectId: settings.projectId,
    keyFilename: settings.credentialsFilePath,
  });

  const bucket: Bucket = bucketStorage.bucket(settings.bucketName);

  return {
    saveFile: SaveFileToCloud(bucket),
    loadFile: LoadFileFromCloud(bucket),
    shareURL: ShareURLFromCloud(bucket),
  };
};
