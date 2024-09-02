import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

const Barcode = ({ number }) => {
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (barcodeRef.current && number) {
      JsBarcode(barcodeRef.current, number, {
        format: "CODE128",
        width: 2,
        height: 40,
        displayValue: true,
      });
    }
  }, [number]);
  return <svg ref={barcodeRef} />;
};

export default Barcode;
