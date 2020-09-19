import { Bucket } from '@google-cloud/storage';
import { pathForFileInBucket } from './common';
import { LoadFile } from '../../services';
import { fileDataFromURL } from '../../utilities';

export const ShareURLFromCloud = (bucket: Bucket): LoadFile =>
  async (file) => {
    const [url] = await bucket.file(pathForFileInBucket(file)).getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // 5 minutes
    });

    file.fileData = fileDataFromURL(url);
  };