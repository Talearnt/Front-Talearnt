export const extractImageSrcList = (content: string) =>
  [...content.matchAll(/<img[^>]+src="([^"]+)"/g)].map(match => match[1]);
