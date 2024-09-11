import React from 'react';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75">
      <div className="flex items-center justify-center">
        <AiOutlineLoading3Quarters className=" text-4xl animate-rotate-360" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
