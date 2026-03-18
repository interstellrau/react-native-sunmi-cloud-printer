import { NativeModule, requireNativeModule } from 'expo';

import { PrinterInterface, PrintersEventPayload, PrinterConnectionPayload, WiFiConfigStatusPayload, PrinterSerialNumberPayload } from './ReactNativeSunmiCloudPrinter.types';

declare class ReactNativeSunmiCloudPrinterModule extends NativeModule {
  // Event listeners
  addListener<EventName extends 'onUpdatePrinters'>(
    eventName: EventName,
    listener: (event: PrintersEventPayload) => void
  ): { remove: () => void };
  addListener<EventName extends 'onPrinterConnectionUpdate'>(
    eventName: EventName,
    listener: (event: PrinterConnectionPayload) => void
  ): { remove: () => void };
  addListener<EventName extends 'onWiFiNetworkReceived'>(
    eventName: EventName,
    listener: (event: { network: any }) => void
  ): { remove: () => void };
  addListener<EventName extends 'onWiFiListComplete'>(
    eventName: EventName,
    listener: () => void
  ): { remove: () => void };
  addListener<EventName extends 'onWiFiConfigStatus'>(
    eventName: EventName,
    listener: (event: WiFiConfigStatusPayload) => void
  ): { remove: () => void };
  addListener<EventName extends 'onPrinterSerialNumber'>(
    eventName: EventName,
    listener: (event: PrinterSerialNumberPayload) => void
  ): { remove: () => void };

  // Setup and configuration
  setup(): void;
  setTimeout(timeout: number): void;

  // Printer discovery and connection
  discoverPrinters(printerInterface: PrinterInterface): Promise<void>;
  disconnectPrinter(): Promise<void>;
  connectLanPrinter(ipAddress: string, force: boolean): Promise<void>;
  connectBluetoothPrinter(uuid: string): Promise<void>;
  connectUSBPrinter(name: string): Promise<void>;

  // Printer connection status
  isBluetoothPrinterConnected(uuid: string): Promise<boolean>;
  isLanPrinterConnected(ip: string): Promise<boolean>;
  isUSBPrinterConnected(name: string): Promise<boolean>;

  // Permissions
  checkBluetoothPermissions(): Promise<boolean>;

  // Printing commands
  lineFeed(lines: number): Promise<void>;
  setTextAlign(align: number): Promise<void>;
  setPrintModesBold(bold: boolean, doubleHeight: boolean, doubleWidth: boolean): Promise<void>;
  restoreDefaultSettings(): Promise<void>;
  restoreDefaultLineSpacing(): Promise<void>;
  addCut(fullCut: boolean): Promise<void>;
  addText(text: string): Promise<void>;
  addImage(base64: string, width: number, height: number): Promise<void>;
  clearBuffer(): Promise<void>;
  sendData(): Promise<void>;
  openCashDrawer(): Promise<void>;

  // Device state
  getDeviceState(): Promise<'OFFLINE' | 'UNKNOWN' | 'RUNNING' | 'NEAR_OUT_PAPER' | 'OUT_PAPER' | 'JAM_PAPER' | 'PICK_PAPER' | 'COVER' | 'OVER_HOT' | 'MOTOR_HOT'>;

  // WiFi configuration
  enterNetworkMode(serialNumber: string): Promise<void>;
  getPrinterSerialNumber(): Promise<void>;
  getWiFiList(): Promise<void>;
  configureWiFi(ssid: string, password: string): Promise<void>;
  quitWiFiConfig(): Promise<void>;
  deleteWiFiSettings(): Promise<void>;

  // Inner printer (Android Sunmi devices)
  hasInnerPrinter(): boolean;
  innerPrinterInit(): Promise<void>;
  getInnerPrinterStatus(): Promise<number>;
  getInnerPrinterSerialNo(): Promise<string>;
  getInnerPrinterVersion(): Promise<string>;
  getInnerPrinterModel(): Promise<string>;
  getInnerPrinterPaper(): Promise<string>;
  innerPrintText(text: string): Promise<void>;
  innerPrintTextWithFont(text: string, typeface: string, fontSize: number): Promise<void>;
  innerSetAlignment(alignment: number): Promise<void>;
  innerSetFontSize(fontSize: number): Promise<void>;
  innerSetFontWeight(isBold: boolean): Promise<void>;
  innerLineWrap(lines: number): Promise<void>;
  innerPrintBitmap(base64: string, width: number): Promise<void>;
  innerPrintBarCode(data: string, symbology: number, height: number, width: number, textPosition: number): Promise<void>;
  innerPrintQRCode(data: string, moduleSize: number, errorLevel: number): Promise<void>;
  innerCutPaper(): Promise<void>;
  innerOpenCashDrawer(): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ReactNativeSunmiCloudPrinterModule>('ReactNativeSunmiCloudPrinter');
