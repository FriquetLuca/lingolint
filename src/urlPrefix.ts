export const urlPrefix = (src: string) => {
  if (
    /^(?:[a-z+]+:)?\/\//i.test(src) ||
    src.startsWith('data:') ||
    src.startsWith('blob:')
  ) {
    return src;
  }
  return `${import.meta.env.BASE_URL}${src.replace(/^\//, '')}`;
};
