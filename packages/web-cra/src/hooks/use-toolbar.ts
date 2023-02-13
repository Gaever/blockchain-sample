import { useCallback, useState } from "react";

const lsLangKey = process.env.REACT_APP_LANG || "lang";
const lsCurKey = process.env.REACT_APP_LANG || "cur";

export const langs = [
  { key: "eng", value: "English" },
  { key: "rus", value: "Russian" },
];
export const curs = [
  { key: "usd", value: "USD" },
  { key: "rub", value: "RUB" },
];

function useToolbar() {
  const [langKey, setLangKey] = useState(localStorage.getItem(lsLangKey) || langs[0].key);
  const [curKey, setCurKey] = useState(localStorage.getItem(lsCurKey) || curs[0].key);

  const curValue = curs.find((item) => item.key === curKey)?.value || "";
  const langValue = langs.find((item) => item.key === langKey)?.value || "";

  const changeLang = useCallback((value: string) => {
    localStorage.setItem(lsLangKey, value);
    setLangKey(value);
  }, []);

  const changeCur = useCallback((value: string) => {
    localStorage.setItem(lsCurKey, value);
    setCurKey(value);
  }, []);

  return {
    langKey,
    curKey,
    curValue,
    langValue,
    changeLang,
    changeCur,
  };
}

export default useToolbar;
