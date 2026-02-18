declare module "signature_pad" {
  interface SignaturePadOptions {
    dotSize?: number
    minWidth?: number
    maxWidth?: number
    throttle?: number
    minDistance?: number
    backgroundColor?: string
    penColor?: string
    velocityFilterWeight?: number
  }

  interface PointGroup {
    color: string
    points: Array<{
      x: number
      y: number
      time: number
      pressure: number
    }>
  }

  export default class SignaturePad {
    constructor(canvas: HTMLCanvasElement, options?: SignaturePadOptions)
    clear(): void
    isEmpty(): boolean
    toDataURL(type?: string, encoderOptions?: number): string
    fromDataURL(
      dataUrl: string,
      options?: { ratio?: number; width?: number; height?: number },
    ): Promise<void>
    toData(): PointGroup[]
    fromData(pointGroups: PointGroup[], options?: { clear?: boolean }): void
    on(): void
    off(): void
    addEventListener(type: string, listener: () => void): void
    removeEventListener(type: string, listener: () => void): void
  }
}
