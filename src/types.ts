
export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  size?: number; // File size in bytes
  lastModified?: string; // ISO date string
  itemCount?: number; // For folders: total number of items inside
  extension?: string; // For files: file extension without the dot
}

