import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { SunmiCloudPrinter } from 'react-native-sunmi-cloud-printer';

export type USBImplementation = 'legacy' | 'uuid';

export interface MyPrinter {
  cloudPrinter: SunmiCloudPrinter;
  isConnected: boolean;
}

interface MyPrintersContextType {
  printers: MyPrinter[];
  usbImplementation: USBImplementation;
  addPrinter: (printer: SunmiCloudPrinter) => void;
  removePrinter: (printer: SunmiCloudPrinter) => void;
  toggleConnection: (printer: SunmiCloudPrinter) => void;
  toggleUSBImplementation: () => void;
}

const MyPrintersContext = createContext<MyPrintersContextType | undefined>(undefined);

export const MyPrintersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [printers, setPrinters] = useState<MyPrinter[]>([]);
  const [usbImplementation, setUsbImplementation] = useState<USBImplementation>('legacy');

  const getPrinterId = useCallback((printer: SunmiCloudPrinter) => {
    switch (printer.interface) {
      case 'BLUETOOTH':
        return `BLUETOOTH:${printer.uuid}`;
      case 'LAN':
        return `LAN:${printer.ip}`;
      case 'USB':
        return `USB:${printer.uuid ?? printer.name}`;
    }
  }, []);

  const addPrinter = useCallback(
    (printer: SunmiCloudPrinter) => {
      const myPrinter = { cloudPrinter: printer, isConnected: false };
      setPrinters((prevPrinters) => {
        const nextPrinterId = getPrinterId(printer);
        const printerExists = prevPrinters.some((p) => getPrinterId(p.cloudPrinter) === nextPrinterId);
        if (printerExists) {
          return prevPrinters;
        }
        return [...prevPrinters, myPrinter];
      });
    },
    [getPrinterId]
  );

  const removePrinter = useCallback(
    (printer: SunmiCloudPrinter) => {
      const printerId = getPrinterId(printer);
      setPrinters((prevPrinters) => prevPrinters.filter((p) => getPrinterId(p.cloudPrinter) !== printerId));
    },
    [getPrinterId]
  );

  const toggleConnection = useCallback(
    (printer: SunmiCloudPrinter) => {
      const printerId = getPrinterId(printer);
      setPrinters((prevPrinters) =>
        prevPrinters.map((p) => {
          if (getPrinterId(p.cloudPrinter) === printerId) {
            return { ...p, isConnected: !p.isConnected };
          }
          return p;
        })
      );
    },
    [getPrinterId]
  );

  const toggleUSBImplementation = useCallback(() => {
    setUsbImplementation((current) => (current === 'legacy' ? 'uuid' : 'legacy'));
  }, []);

  return (
    <MyPrintersContext.Provider
      value={{ printers, usbImplementation, addPrinter, removePrinter, toggleConnection, toggleUSBImplementation }}
    >
      {children}
    </MyPrintersContext.Provider>
  );
};

export const useMyPrinters = () => {
  const context = useContext(MyPrintersContext);
  if (!context) {
    throw new Error('useMyPrinters must be used within a MyPrintersProvider');
  }
  return context;
};

export default MyPrintersProvider;
