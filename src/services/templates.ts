import { DocumentFile, DocumentParameters } from '../models';

// Getting template and returning list of parameters
export interface ParseTemplate {
  (file: DocumentFile): Promise<DocumentParameters>;
}

// Creating document from a template and parameters -> Convert to DOCX
//    - Single function for the entire pipeline
export interface ProcessTemplate {
  (file: DocumentFile, parameters: DocumentParameters): Promise<DocumentFile>
}

export interface Templates {
  parseTemplate: ParseTemplate;
  processTemplate: ProcessTemplate;
}
