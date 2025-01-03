export const patterns = {
  slug: (length: number) => `^[a-z\\-]{1,${length}}$`,
  nonEmptyString: (length: number) => `^[\\p{L}\\p{Nd}\\p{Z}\\p{S}\\p{P}]{1,${length}}$`,
  anyString: (length: number) => `^[\\p{L}\\p{Nd}\\p{Z}\\p{S}\\p{P}]{0,${length}}$`,
  urlPath: () => "^(?:\/:?[A-Za-z\\-]+)+$",
  isoDateTime: () => "^[1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]T[0-2][0-9]:[0-5][0-9]:[0-5][0-9]Z$",
  email: () => "^[\\w._\\-]+@(?:[\\w\\-]+\.)+[\\w]{2,4}$",
  mimetype: () => "^[a-zA-Z0-9!#$&^_.+-]+/[a-zA-Z0-9!#$&^_.+-]+$",
  filename: () => "^.{1,120}\\.(?:jpeg|jpg|png|webp|tiff|tif|gif|svg|eps|pdf|mp3|aac|ogg|flac|alac|wav|aiff|webm|avi|mov|wmv|mp4|m4v|m4p|mpg|mpeg|zip|7z|gz|bz2|xz|lz)$",
};
