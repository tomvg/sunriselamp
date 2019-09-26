declare module 'spi-device' {

  export function openSync(a: number, b: number ,c: any): any

  export class SpiDevice {
    transferSync(data: any): void
  }
}
