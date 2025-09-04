import mammoth from 'mammoth';
import PDFParser from 'pdf2json';

export const parsePDF = async (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const pdfParser = new PDFParser();
      let text = '';

      pdfParser.on('pdfParser_dataError', (errData: { parserError: Error }) => {
        console.error('PDF parsing error:', errData);
        reject(new Error(`Failed to process PDF: ${errData.parserError.message}`));
      });

      pdfParser.on('pdfParser_dataReady', (pdfData: { Pages?: Array<{ Texts?: Array<{ R?: Array<{ T?: string }> }> }> }) => {
        try {
          // Extract text from all pages
          if (pdfData.Pages) {
            for (const page of pdfData.Pages) {
              if (page.Texts) {
                for (const textItem of page.Texts) {
                  if (textItem.R) {
                    for (const r of textItem.R) {
                      if (r.T) {
                        text += decodeURIComponent(r.T) + ' ';
                      }
                    }
                  }
                }
              }
            }
          }

          const cleanText = text
            .replace(/\s+/g, ' ')
            .trim();

          if (cleanText.length < 10) {
            reject(new Error('PDF appears to be image-based or encrypted. Please use a text-based PDF or convert to DOCX format.'));
            return;
          }

          console.log(`PDF processing: Extracted ${cleanText.length} characters`);
          resolve(cleanText);
        } catch (error) {
          reject(new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      });

      // Parse the PDF buffer
      pdfParser.parseBuffer(buffer);
    } catch (error) {
      reject(new Error(`Failed to process PDF: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
};

export const parseWord = async (buffer: Buffer): Promise<string> => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    
    if (!result || !result.value) {
      throw new Error('Failed to extract text from DOC/DOCX');
    }
    
    console.log(`DOC processing: Extracted ${result.value.length} characters`);
    return result.value;
  } catch (error) {
    console.error('Error parsing DOC/DOCX:', error);
    throw new Error(`Failed to process DOC/DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const parseText = (buffer: Buffer): string => {
  return buffer.toString('utf-8');
};

export const getFileType = (filename: string): 'pdf' | 'docx' | 'doc' | 'txt' => {
  const extension = filename.toLowerCase().split('.').pop();
  
  switch (extension) {
    case 'pdf':
      return 'pdf';
    case 'docx':
      return 'docx';
    case 'doc':
      return 'doc';
    case 'txt':
      return 'txt';
    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }
};

export const parseDocument = async (buffer: Buffer, filename: string): Promise<string> => {
  const fileType = getFileType(filename);
  
  switch (fileType) {
    case 'pdf':
      return await parsePDF(buffer);
    case 'docx':
    case 'doc':
      return await parseWord(buffer);
    case 'txt':
      return parseText(buffer);
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
};
