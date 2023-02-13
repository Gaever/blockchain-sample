import { configBigNumber } from "@ctocker/lib/build/main/src/utils";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import StockListPage from "./pages/stock-list.page";
import StockPage from "./pages/stock.page";
import "./styles/font.css";
import "./styles/nprogress.css";
import userTheme from "./styles/theme";

const queryClient = new QueryClient();

configBigNumber();

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

function App() {
  const [mode, setMode] = React.useState<"light" | "dark">((localStorage.getItem("theme") as "light" | "dark") || "dark");
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = React.useMemo(() => userTheme(mode), [mode]);

  useEffect(() => {
    localStorage.setItem("theme", theme.palette.mode);
  }, [theme.palette.mode]);

  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<StockListPage />} />
              <Route path="/stock/:id" element={<StockPage />} />
              <Route path="*" element={<StockListPage />}></Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
