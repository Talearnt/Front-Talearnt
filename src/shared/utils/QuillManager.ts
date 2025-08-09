import type { Quill } from "react-quill-new";

import {
  attributorsType,
  backgroundColorOptions,
  colorOptions,
  iconsOptions,
  quillIconsType,
  sizeOptions,
  updatePickerItemColors,
} from "@components/articles/writeArticle/TextEditor/Toolbar/toolbar.constants";

/**
 * Quill 에디터 설정 및 관리를 위한 싱글톤 클래스
 * React Quill의 동적 로딩과 설정을 중앙화하여 관리합니다.
 */
class QuillManager {
  private static instance: QuillManager | null = null;
  private quillInstance: typeof Quill | null = null;
  private isInitialized = false;

  // eslint-disable-next-line
  private constructor() {} // 외부에서 new 못하게 막음

  /**
   * QuillManager 싱글톤 인스턴스를 반환합니다.
   */
  public static getInstance(): QuillManager {
    if (!QuillManager.instance) {
      QuillManager.instance = new QuillManager();
    }
    return QuillManager.instance;
  }

  /**
   * Quill 라이브러리를 동적으로 로드하고 초기화합니다.
   */
  public async initialize(): Promise<typeof Quill> {
    if (this.quillInstance && this.isInitialized) {
      return this.quillInstance;
    }

    try {
      // React Quill을 동적으로 임포트
      const module = await import("react-quill-new");
      this.quillInstance = module.Quill;

      // Quill 설정 초기화
      this.setupQuillConfiguration();
      this.isInitialized = true;

      console.log("✅ Quill Manager initialized successfully");
      return this.quillInstance;
    } catch (error) {
      console.error("❌ Failed to initialize Quill Manager:", error);
      throw new Error("Quill 초기화에 실패했습니다.");
    }
  }

  /**
   * Quill의 아이콘, 속성, 모듈을 설정합니다.
   */
  private setupQuillConfiguration(): void {
    if (!this.quillInstance) {
      throw new Error("Quill instance is not loaded");
    }

    const Quill = this.quillInstance;

    // Import Quill components
    const icons = Quill.import("ui/icons") as quillIconsType;
    const size = Quill.import("attributors/style/size") as attributorsType;
    const color = Quill.import("attributors/style/color") as attributorsType;
    const background = Quill.import(
      "attributors/style/background"
    ) as attributorsType;
    const image = Quill.import("formats/image") as {
      sanitize: (url: string) => string;
    };

    // 이미지 URL 검증 설정
    this.setupImageSanitization(image);

    // 아이콘 커스터마이징
    this.setupCustomIcons(icons);

    // 속성 설정
    this.setupAttributes(size, color, background);

    // 커스텀 모듈 등록
    this.registerCustomModules(Quill);

    // Quill에 설정 등록
    this.registerQuillSettings(Quill, size, color, background);
  }

  /**
   * 이미지 URL 검증 설정
   */
  private setupImageSanitization(image: {
    sanitize: (url: string) => string;
  }): void {
    image.sanitize = (url: string) => {
      const allowedProtocols = ["blob:", "http://", "https://"];
      return allowedProtocols.some(protocol => url.startsWith(protocol))
        ? url
        : "";
    };
  }

  /**
   * 커스텀 아이콘 설정
   */
  private setupCustomIcons(icons: quillIconsType): void {
    icons.bold = null;
    icons.italic = null;
    icons.underline = null;
    icons.align = null;
    icons.link = null;
    icons.image = null;
    icons.color = iconsOptions.color;
    icons.background = iconsOptions.background;
  }

  /**
   * 속성 화이트리스트 설정
   */
  private setupAttributes(
    size: attributorsType,
    color: attributorsType,
    background: attributorsType
  ): void {
    size.whitelist = sizeOptions;

    // 컬러/배경은 hex와 rgb 모두 허용해 재마운트 시에도 스타일 보존
    const expandWhitelist = (colors: string[]): string[] => {
      const toRgb = (hex: string): string => {
        const normalized = hex.replace("#", "");
        const r = parseInt(normalized.substring(0, 2), 16);
        const g = parseInt(normalized.substring(2, 4), 16);
        const b = parseInt(normalized.substring(4, 6), 16);
        // 브라우저가 style="rgb(r, g, b)" 형태로 파싱하므로 공백 포함 포맷으로 추가
        return `rgb(${r}, ${g}, ${b})`;
      };

      const lowercaseHex = colors.map(c => c.toLowerCase());
      const rgbList = colors.map(toRgb);
      return Array.from(new Set([...colors, ...lowercaseHex, ...rgbList]));
    };

    color.whitelist = expandWhitelist(colorOptions);
    background.whitelist = expandWhitelist(backgroundColorOptions);
  }

  /**
   * 커스텀 모듈 등록
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private registerCustomModules(quillClass: any): void {
    // 최대 길이 제한 모듈
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    quillClass.register(
      "modules/maxlength",
      function (
        quill: {
          on: (event: string, callback: () => void) => void;
          getText: () => { length: number };
          deleteText: (start: number, length: number) => void;
        },
        options: { maxLength: number }
      ) {
        quill.on("text-change", () => {
          const { length } = quill.getText();
          const { maxLength } = options;

          if (length > maxLength) {
            quill.deleteText(maxLength, length - maxLength);
          }
        });
      }
    );
  }

  /**
   * Quill에 설정 등록
   */
  private registerQuillSettings(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    quillClass: any,
    size: attributorsType,
    color: attributorsType,
    background: attributorsType
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    quillClass.register(background as unknown as string, true);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    quillClass.register(color as unknown as string, true);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    quillClass.register(size as unknown as string, true);
  }

  /**
   * DOM 관련 UI 설정을 수행합니다.
   * (아이콘 변경, 컬러 피커 스타일 등)
   */
  public setupDOMElements(): void {
    // Size 아이콘 변경
    this.updateSizeIcon();

    // 컬러 피커 아이템 색상 설정 (DOM 요소 존재 확인 후)
    this.setupColorPickers();
  }

  /**
   * 컬러 피커 설정 (재시도 로직 포함)
   */
  private setupColorPickers(): void {
    const setupWithRetry = (selector: string, maxRetries = 10) => {
      const items = document.querySelectorAll(`${selector} .ql-picker-item`);

      if (items.length > 0) {
        updatePickerItemColors(selector);
      } else if (maxRetries > 0) {
        setTimeout(() => setupWithRetry(selector, maxRetries - 1), 50);
      } else {
        console.warn(`⚠️ ${selector} picker items not found after retries`);
      }
    };

    setupWithRetry(".ql-color");
    setupWithRetry(".ql-background");
  }

  /**
   * 사이즈 선택기 아이콘을 커스텀 아이콘으로 변경
   */
  private updateSizeIcon(): void {
    const sizeIcon = document.querySelector(".ql-size .ql-picker-label svg");

    if (sizeIcon) {
      sizeIcon.outerHTML =
        '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 7.5L10 12.5L5 7.5" class="ql-stroke" /></svg>';
    }
  }

  /**
   * Quill 인스턴스가 초기화되었는지 확인
   */
  public isQuillReady(): boolean {
    return this.isInitialized && this.quillInstance !== null;
  }

  /**
   * Quill 인스턴스를 반환 (초기화된 경우에만)
   */
  public getQuillInstance(): typeof Quill | null {
    return this.isInitialized ? this.quillInstance : null;
  }

  /**
   * 에디터 모듈 설정을 반환
   */
  public getEditorModules(imageHandler: () => void) {
    return {
      toolbar: {
        container: "#toolbar",
        handlers: {
          image: imageHandler,
        },
      },
      maxlength: { maxLength: 1000 },
    };
  }

  /**
   * 싱글톤 인스턴스 리셋 (테스트용)
   */
  public static resetInstance(): void {
    QuillManager.instance = null;
  }
}

export default QuillManager;
