export function useParseFilename(filename: string) {
  const split = filename.split('.');
  const ext = split.pop();
  return { name: split.join('.'), ext };
}
