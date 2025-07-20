import yaml from 'js-yaml';

export interface FrontMatter {
  title?: string;
  description?: string;
  author?: string;
  date?: string;
  lastModified?: string;
  version?: string;
  category?: string;
  section?: string;
  order?: number;
  tags?: string[];
  keywords?: string[];
  toc?: boolean;
  sidebar?: boolean;
  locale?: string; // Locale for date formatting (e.g., 'en-US', 'nl-BE', 'fr-BE', 'be')
  breadcrumbs?: Array<{
    name: string;
    path: string;
  }>;
  related?: Array<{
    title: string;
    path: string;
  }>;
  [key: string]: any; // Allow additional custom properties
}

export interface ParsedMarkdown {
  frontMatter: FrontMatter | null;
  content: string;
}

/**
 * Parses markdown content and extracts YAML front matter
 * @param markdown - Raw markdown content with potential front matter
 * @returns Object containing parsed front matter and clean content
 */
export function parseFrontMatter(markdown: string): ParsedMarkdown {
  // Check if content starts with front matter delimiter
  if (!markdown.startsWith('---')) {
    return {
      frontMatter: null,
      content: markdown
    };
  }

  // Find the closing delimiter - check for multiple variations
  let endDelimiter = markdown.indexOf('\n---\n', 4);
  if (endDelimiter === -1) {
    endDelimiter = markdown.indexOf('\r\n---\r\n', 4);
  }
  if (endDelimiter === -1) {
    endDelimiter = markdown.indexOf('\r\n---\n', 4);
  }
  if (endDelimiter === -1) {
    endDelimiter = markdown.indexOf('\n---\r\n', 4);
  }
  
  if (endDelimiter === -1) {
    return {
      frontMatter: null,
      content: markdown
    };
  }

  try {
    // Extract YAML content between delimiters
    const yamlContent = markdown.slice(4, endDelimiter);
    
    // Parse YAML
    const frontMatter = yaml.load(yamlContent) as FrontMatter;
    
    // Extract content after front matter - determine the delimiter length
    let delimiterLength = 5; // default for '\n---\n'
    if (markdown.indexOf('\r\n---\r\n', 4) === endDelimiter) {
      delimiterLength = 6; // '\r\n---\r\n'
    } else if (markdown.indexOf('\r\n---\n', 4) === endDelimiter) {
      delimiterLength = 6; // '\r\n---\n'
    } else if (markdown.indexOf('\n---\r\n', 4) === endDelimiter) {
      delimiterLength = 6; // '\n---\r\n'
    }
    
    const content = markdown.slice(endDelimiter + delimiterLength);
    
    return {
      frontMatter,
      content: content.trim()
    };
  } catch (error) {
    console.warn('Failed to parse YAML front matter:', error);
    return {
      frontMatter: null,
      content: markdown
    };
  }
}

/**
 * Formats a date string for display
 * @param dateString - ISO date string or other date format
 * @param locale - Locale for formatting (defaults to 'en-US', supports 'nl-BE', 'fr-BE' for Belgian formats)
 * @returns Formatted date string
 */
export function formatDate(dateString: string, locale: string = 'en-US'): string {
  try {
    const date = new Date(dateString);
    
    // Belgian locale mapping
    const localeMap: { [key: string]: string } = {
      'be': 'nl-BE',        // Belgian Dutch
      'belgian': 'nl-BE',   // Belgian Dutch
      'be-fr': 'fr-BE',     // Belgian French
      'be-nl': 'nl-BE',     // Belgian Dutch
      'belgium': 'nl-BE'    // Belgian Dutch
    };
    
    const actualLocale = localeMap[locale.toLowerCase()] || locale;
    
    return date.toLocaleDateString(actualLocale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString; // Return original if parsing fails
  }
}
