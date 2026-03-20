import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ptBR from "./pt-br";
import enUS from "./en-us";

const resources = {
  "pt-BR": { translation: ptBR },
  "en-US": { translation: enUS },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "pt-BR", // idioma padrão
  fallbackLng: "pt-BR",
  interpolation: {
    escapeValue: false, // React já faz escape
  },
});

export default i18n;
