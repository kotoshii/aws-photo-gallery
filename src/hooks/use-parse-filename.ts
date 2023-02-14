export function useParseFilename(filename: string) {
  const split = filename.split('.');
  const ext = split.length > 1 ? split.pop() : '';
  return { name: split.join('.'), ext };
}
