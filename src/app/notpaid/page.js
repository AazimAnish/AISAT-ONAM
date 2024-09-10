import { Card } from '@/components/ui/card';
import { ImCross } from "react-icons/im";
import Image from 'next/image';
import onam from "../../../public/images/onam.gif";

const Verify = () => {
  return (
    <div className='flex h-screen justify-center items-center'>
      <Card className="flex flex-col items-center p-8 bg-white shadow-md rounded-lg">
      <div>
      
      <a href="https://example.com" target="_blank" rel="noopener noreferrer">
        <Image 
          src={onam} 
          alt="Running GIF" 
          width={300} 
          height={300} 
          unoptimized={true} // Disable optimization for GIFs
        />
      </a>
    </div>
        <p className=" pt-1 text-md font-bold">പൈസ കൊടുക്ക് എന്നിട്ട കഴിക്കാം</p>
        <p className="text-lg font-bold">Payment Not Done </p>
      </Card>
    </div>
  );
};

export default Verify;