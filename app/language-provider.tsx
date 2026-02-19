/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { translations, Language } from "./i18n";

// Context type
interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    dir: "ltr" | "rtl";
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
    defaultLanguage?: Language;
}

export const LanguageProvider = ({ children, defaultLanguage = "en" }: LanguageProviderProps) => {
    const [language, setLanguage] = useState<Language>(defaultLanguage);

    // translation function
    const t = (key: string) => {
        const keys = key.split(".");
        let value: any = translations[language];

        for (let k of keys) {
            value = value[k];
            if (!value) return key; // fallback
        }
        return value;
    };

    const dir: "ltr" | "rtl" = language === "ar" ? "rtl" : "ltr";

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
            {children}
        </LanguageContext.Provider>
    );
};

// Custom hook
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
    return context;
};
