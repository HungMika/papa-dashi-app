export {};

declare global {
  interface Window {
    electronAPI: {
      readImage: (imagePath: string) => string;
    };
  }
}
