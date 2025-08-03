import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { ViteUserConfig } from "vitest/dist/config";

const vitestConfig: ViteUserConfig = {
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/polyfill.ts", "./src/test/setup.ts"],
    reporters: ["junit", "default"],
    outputFile: "test-results.xml",
  },
};

export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), tsconfigPaths()],
    define: {
      global: "globalThis",
    },
    build: {
      rollupOptions: {
        output: {
          // 수동 청크 분할을 통한 번들 최적화
          manualChunks: {
            // 리액트 관련 라이브러리들을 별도 청크로 분리
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            // UI 라이브러리들을 별도 청크로 분리
            "ui-vendor": ["react-hook-form", "@hookform/resolvers", "yup"],
            // 데이터 페칭 관련 라이브러리들을 별도 청크로 분리
            "query-vendor": ["@tanstack/react-query", "axios"],
            // 에디터 관련 라이브러리를 별도 청크로 분리 (큰 용량)
            "editor-vendor": ["react-quill-new"],
            // 유틸리티 라이브러리들을 별도 청크로 분리
            "utils-vendor": [
              "dayjs",
              "clsx",
              "tailwind-merge",
              "class-variance-authority",
            ],
            // 상태 관리 라이브러리들을 별도 청크로 분리
            "state-vendor": ["zustand"],
            // 캐러셀 라이브러리들을 별도 청크로 분리
            "carousel-vendor": [
              "embla-carousel-react",
              "embla-carousel-autoplay",
            ],
            // WebSocket 관련 라이브러리들을 별도 청크로 분리
            "websocket-vendor": ["@stomp/stompjs", "sockjs-client"],
          },
          // 청크 파일명을 더 명확하게 설정
          chunkFileNames: () => `assets/chunks/[name]-[hash].js`,
        },
      },
      // 소스맵 생성하지 않음 (프로덕션에서 번들 크기 감소)
      sourcemap: mode === "development",
    },
    ...vitestConfig,
  };
});
