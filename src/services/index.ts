import { DocumentRepository, UserRepository, LogRepository } from './data';
import { DocumentService } from './docs';
import { StorageService } from './storage';

export interface Services {
  documentRepository: DocumentRepository;
  userRepository: UserRepository;
  logRepository: LogRepository;
  documentService: DocumentService;
  storageService: StorageService;
}

export * from './data';
export * from './docs';
export * from './storage';
