export interface ImageMetadataJson {
  images: Record<string, ImageMetadata>;
}

export interface ImageMetadata {
  fileName: string;
  formats: string[];
  alt: string;
  title?: string;
  description?: string;
  location?: string;
  date?: string;
  credit?: string;
}

export interface GroupedImages {
  fileName: string;
  files: Map<string, File[]>;
}

export class ImageDataCls {
  fileName: string;
  formats: string[];
  alt: string;
  title?: string;
  description?: string;
  location?: string;
  date?: string;
  credit?: string;

  constructor(meta: ImageMetadata) {
    this.fileName = $state(meta.fileName);
    this.formats = $state(meta.formats);
    this.alt = $state(meta.alt);
    this.title = $state(meta.title);
    this.description = $state(meta.description);
    this.location = $state(meta.location);
    this.date = $state(meta.date);
    this.credit = $state(meta.credit);
  }
}
