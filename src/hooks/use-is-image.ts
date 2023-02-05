import mime from 'mime';

export function useIsImage(filename: string) {
  const mimeType = mime.getType(filename);
  const isImage = !!mimeType?.includes('image');

  return { mimeType, isImage };
}
