export const patterns = {
  slug: (length: number) => `^[a-z\\-]{1,${length}}$`,
  nonEmptyString: (length: number) => `^[\\p{L}\\p{Nd}\\p{Z}\\p{S}\\p{P}]{1,${length}}$`,
  anyString: (length: number) => `^[\\p{L}\\p{Nd}\\p{Z}\\p{S}\\p{P}]{0,${length}}$`,
  urlPath: () => "^(?:\/:?[A-Za-z\\-]+)+$",
  isoDateTime: () => "^[1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]T[0-2][0-9]:[0-5][0-9]:[0-5][0-9]Z$",
  email: () => "^[\\w._\\-]+@(?:[\\w\\-]+\.)+[\\w]{2,4}$",
};
