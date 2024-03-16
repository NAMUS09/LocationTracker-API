import en from "./en";

export default (lang: string, key: string) => {
  if (lang == "en") {
    return en[key];
  }
};
