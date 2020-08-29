import { Parameters } from '../models';

// TODO: Decide on common type (Buffer / Stream / Filename)

// Getting template and returning list of parameters
export interface ParseTemplate {
  (document: string): Promise<string[]>
}

// Creating document from a template and parameters
export interface ProcessTemplate {
  (document: string, parameters: Parameters): Promise<string>
}

// Converting DOCX to PDF
export interface ConvertDocument {
  (document: string): Promise<string>
}

export interface DocumentService {
  parseTemplate: ParseTemplate;
  processTemplate: ProcessTemplate;
  convertDocument: ConvertDocument;
}
