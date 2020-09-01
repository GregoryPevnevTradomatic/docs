import { DocumentParameters } from '../models';
import { FileData } from '../utilities';

// Getting template and returning list of parameters
export interface ParseTemplate {
  (document: FileData): Promise<string[]>
}

// Creating document from a template and parameters -> Convert to DOCX
//    - Single function for the entire pipeline
export interface ProcessTemplate {
  (document: FileData, parameters: DocumentParameters): Promise<Buffer>
}

export interface Templates {
  parseTemplate: ParseTemplate;
  processTemplate: ProcessTemplate;
}