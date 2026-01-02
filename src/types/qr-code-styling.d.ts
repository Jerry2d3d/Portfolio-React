/**
 * Type definitions for qr-code-styling library
 * https://github.com/kozakdenys/qr-code-styling
 */

declare module 'qr-code-styling' {
  export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';
  export type Mode = 'Numeric' | 'Alphanumeric' | 'Byte' | 'Kanji';
  export type DotType = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
  export type CornerSquareType = 'square' | 'dot' | 'extra-rounded';
  export type CornerDotType = 'square' | 'dot';
  export type FileExtension = 'svg' | 'png' | 'jpeg' | 'webp';
  export type DrawType = 'canvas' | 'svg';
  export type Gradient = {
    type: 'linear' | 'radial';
    rotation?: number;
    colorStops: Array<{
      offset: number;
      color: string;
    }>;
  };

  export interface QRCodeStylingOptions {
    width?: number;
    height?: number;
    type?: DrawType;
    data?: string;
    image?: string;
    margin?: number;
    qrOptions?: {
      typeNumber?: number;
      mode?: Mode;
      errorCorrectionLevel?: ErrorCorrectionLevel;
    };
    imageOptions?: {
      hideBackgroundDots?: boolean;
      imageSize?: number;
      margin?: number;
      crossOrigin?: string;
    };
    dotsOptions?: {
      type?: DotType;
      color?: string;
      gradient?: Gradient;
    };
    backgroundOptions?: {
      color?: string;
      gradient?: Gradient;
    };
    cornersSquareOptions?: {
      type?: CornerSquareType;
      color?: string;
      gradient?: Gradient;
    };
    cornersDotOptions?: {
      type?: CornerDotType;
      color?: string;
      gradient?: Gradient;
    };
  }

  export interface DownloadOptions {
    name?: string;
    extension?: FileExtension;
  }

  export default class QRCodeStyling {
    constructor(options?: QRCodeStylingOptions);

    append(container: HTMLElement): void;

    getRawData(extension?: FileExtension): Promise<Blob | null>;

    update(options?: QRCodeStylingOptions): void;

    download(downloadOptions?: DownloadOptions | string): Promise<void>;

    applyExtension(extension: (qrCode: QRCodeStyling) => void): void;
  }
}
