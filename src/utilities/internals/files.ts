import fs from 'fs';
import util from 'util';

export const loadBuffer = util.promisify(fs.readFile);
export const saveBuffer = util.promisify(fs.writeFile);
