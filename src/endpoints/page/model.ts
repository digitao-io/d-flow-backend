export interface Page extends PageData, PageIdentifier {}

export interface PageData {
  title: string;
  description: string;
  urlPattern: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details: any;
}

export interface PageIdentifier {
  key: string;
}
