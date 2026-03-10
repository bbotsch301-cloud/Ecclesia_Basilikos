import Anthropic from '@anthropic-ai/sdk';
import logger from './logger';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }
    client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  }
  return client;
}

interface FileInfo {
  fileName: string;
  fileType: string;
  fileSize?: string;
  title?: string;
}

interface DownloadMetadata {
  description: string;
  category: string;
  iconType: string;
  whenToUse: string[];
  contents: string[];
  whyItMatters: string;
  scriptureText: string;
  scriptureReference: string;
}

export async function generateDownloadMetadata(fileInfo: FileInfo): Promise<DownloadMetadata> {
  const anthropic = getClient();

  const prompt = `You are an assistant for a faith-based legal and educational resource platform called "Ecclesia Basilikos." The platform provides documents, templates, study guides, prayers, and legal resources grounded in Biblical principles and common law.

Given the following uploaded file information, generate metadata for the download listing:

File name: ${fileInfo.fileName}
File type: ${fileInfo.fileType}
${fileInfo.fileSize ? `File size: ${fileInfo.fileSize}` : ''}
${fileInfo.title ? `Title: ${fileInfo.title}` : ''}

Generate a JSON object with the following fields:
- "description": A 1-2 sentence description of this resource and its purpose (concise, professional tone)
- "category": One of: "Foundation", "Legal Templates", "Study Guides", "Prayers & Declarations"
- "iconType": One of: "scroll" (legal/trust documents), "shield" (protective/defensive docs), "book-open" (study/educational), "scale" (legal proceedings), "crown" (authority/declarations), "file-text" (general)
- "whenToUse": Array of 3-4 short bullet points describing when someone would use this resource
- "contents": Array of 3-5 short bullet points describing what's inside the document
- "whyItMatters": A 1-2 sentence explanation of why this resource is important for the user
- "scriptureText": A relevant Bible verse (just the text, no quotation marks)
- "scriptureReference": The scripture reference (e.g. "Hebrews 9:15-17")

Respond ONLY with a valid JSON object, no markdown formatting, no explanation.`;

  logger.info({ fileName: fileInfo.fileName, title: fileInfo.title }, 'Generating download metadata with AI');

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [
      { role: 'user', content: prompt }
    ],
  });

  const textBlock = message.content.find(block => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from AI');
  }

  const parsed = JSON.parse(textBlock.text) as DownloadMetadata;

  // Validate required fields
  const requiredFields: (keyof DownloadMetadata)[] = [
    'description', 'category', 'iconType', 'whenToUse',
    'contents', 'whyItMatters', 'scriptureText', 'scriptureReference'
  ];
  for (const field of requiredFields) {
    if (parsed[field] === undefined || parsed[field] === null) {
      throw new Error(`AI response missing required field: ${field}`);
    }
  }

  // Validate category
  const validCategories = ['Foundation', 'Legal Templates', 'Study Guides', 'Prayers & Declarations'];
  if (!validCategories.includes(parsed.category)) {
    parsed.category = 'Foundation';
  }

  // Validate iconType
  const validIcons = ['scroll', 'shield', 'book-open', 'scale', 'crown', 'file-text'];
  if (!validIcons.includes(parsed.iconType)) {
    parsed.iconType = 'file-text';
  }

  logger.info({ fileName: fileInfo.fileName, category: parsed.category }, 'AI metadata generated successfully');

  return parsed;
}
