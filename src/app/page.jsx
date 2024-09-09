import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import Link from 'next/link';
import Img from "../../public/images/Img.webp";

const Page = () => {

  return (
    <div className="h-screen w-screen flex justify-center items-center">
        <Card className="max-w-md w-full p-4 mx-4 space-y-4">
          <CardHeader>
            <CardTitle>Sadhya-Fi</CardTitle>
            <CardDescription>Login to Sadhya-Fi</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="py-2 px-4 flex items-center justify-center w-full mb-4"
              // onClick={}
            >
              <Image
                src={Img}
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              <span>Login with Google</span>
            </Button>
            <p className="flex justify-center">
              Not a User?{' '}
              <span className="ml-1">Click here to</span>
              <Link href="/register" className="ml-1 text-blue-500">
                Signup
              </Link>{' '}
              
            </p>
          </CardContent>
        </Card>
    </div>
  );
};

export default Page;