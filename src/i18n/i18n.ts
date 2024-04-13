/*eslint sort-keys: "warn"*/
/*eslint "@typescript-eslint/camelcase": "off"*/

export type Language = "en" | "zh";

export const languages = ["en", "zh"] as Language[];

export const isLanguage = (str: string): str is Language => (languages as string[]).includes(str);
