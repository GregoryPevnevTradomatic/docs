import { DocumentRepository, UserRepository, LogRepository } from './data';
import { Templates } from './templates';
import { Storage } from './storage';

export interface Services {
  documentRepository: DocumentRepository;
  userRepository: UserRepository;
  logRepository: LogRepository;
  templates: Templates;
  storage: Storage;
}

export * from './data';
export * from './templates';
export * from './storage';
