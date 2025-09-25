import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css"; // hoặc "swiper/css" tùy phiên bản
import "simplebar-react/dist/simplebar.min.css";
import 'antd/dist/reset.css';

import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import Footer from "./components/footer/Footer.tsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// (tuỳ chọn) Devtools:
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Tạo 1 client dùng chung
const queryClient = new QueryClient({
  // tuỳ chọn khuyến nghị
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppWrapper>
          <App />
          <Footer />
        </AppWrapper>
      </ThemeProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </StrictMode>
);
