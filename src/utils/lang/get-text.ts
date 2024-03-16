import en from "./en.js";

export default (lang: string, key: string) => {
  if (lang == "en") {
    return en[key];
  }
};
