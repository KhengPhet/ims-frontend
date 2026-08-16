import { environment } from '../../../environments/environment';

const ABSOLUTE = /^(https?:)?\/\//i;

export function resolveImageUrl(
  image: string | null | undefined,
  fallback = 'https://i.pravatar.cc/100',
): string {
  if (!image) {
    return fallback;
  }

  if (
    ABSOLUTE.test(image) ||
    image.startsWith('data:') ||
    image.startsWith('blob:')
  ) {
    return image;
  }

  return `${environment.apiUrl}${image.startsWith('/') ? '' : '/'}${image}`;
}
