// src/global.d.ts

declare global {
  interface Window {
    snap: {
      embed: (
        token: string,
        options: {
          embedId: string;
          onSuccess: (result: any) => void;
          onPending: (result: any) => void;
          onError: (result: any) => void;
          onClose: () => void;
        }
      ) => void;
      pay: (
        token: string,
        options: {
          onSuccess: (result: any) => void;
          onPending: (result: any) => void;
          onError: (result: any) => void;
          onClose: () => void;
        }
      ) => void;
    };
  }
}

export {};


// Tambahkan deklarasi untuk 'qrcode.react' di sini
declare module 'qrcode.react' {
  const QRCode: any;
  export default QRCode;
}

declare module 'xendit-node' {
  const Xendit: any;
  export default Xendit;
}

declare module 'jsPDF' {
  const jspdf: any;
  export default jspdf;
}

declare module 'nodemailer' {
  const nodemailer: any;
  export default nodemailer;
}

declare module 'express' {
  const express: any;
  export default express;
}

declare module 'cors' {
  const cors: any;
  export default cors;
}

export {};
