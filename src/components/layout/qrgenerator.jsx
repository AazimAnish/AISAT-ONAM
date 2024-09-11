"use client";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

const QRCodeGenerator = ({ mess_id, link }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const generateQRCode = async (data) => {
    try {
      const url = await QRCode.toDataURL(data, {
        width: 512, // Increase size of the QR code
        margin: 1, // Minimize margin to reduce white space
        color: {
          light: "#0000", // Transparent background (using CSS-like notation)
        },
      });
      setQrCodeUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const data = link || `${mess_id}`;
    if (data) {
      generateQRCode(data);
    }
  }, [mess_id, link]);

  return (
    <div className="flex justify-center items-center">
      {qrCodeUrl ? (
        <img src={qrCodeUrl} alt="Generated QR Code" className="w-64 h-64" />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default QRCodeGenerator;
