import { DocumentParameters } from '../models';

// Getting template and returning list of parameters
export interface ParseTemplate {
  (document: Buffer): Promise<string[]>
}

// Creating document from a template and parameters -> Convert to DOCX
//    - Single function for the entire pipeline
export interface ProcessTemplate {
  (document: Buffer, parameters: DocumentParameters): Promise<Buffer>
}

export interface DocumentService {
  parseTemplate: ParseTemplate;
  processTemplate: ProcessTemplate;
}
