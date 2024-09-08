"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import Link from 'next/link';
import Img from "../../public/images/Img.webp";
import { auth, provider, signInWithPopup, db } from './firebase/firebaseConfig';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useToast } from "@/components/ui/use-toast";
import ToastActionButton from '../components/toastButton'; // Import the custom button
import LoadingSpinner from './loading'; // Import the loading spinner component

// Utility functions for encoding/decoding
const encodeBase64 = (str) => Buffer.from(str).toString('base64');

const Page = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkUserExists = async (email) => {
    if (email) {
      try {
        const q = query(collection(db, 'users'), where('email', '==', email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0].data();
          const userId = userDoc.userId;
          const role = userDoc.role;
          const hostelName = userDoc.hostelName;
          return { userId, role, hostelName };
        } else {
          const dismissToast = toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "User is not registered. Please sign up.",
            action: (
              <ToastActionButton href="/register" onClick={() => dismissToast.dismiss()}> Register
              </ToastActionButton>
              
            ),
          });
          return null;
        }
      } catch (error) {
        
        return null;
      }
    }
    return null;
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      setEmail(user.email || '');
      const userDetails = await checkUserExists(user.email || '');

      if (userDetails) {
        const { userId, role, hostelName } = userDetails;

        const sys_bio = { userId, role, hostelName };
        const encodedToken = encodeBase64(JSON.stringify(sys_bio));
        localStorage.setItem('sys_bio', encodedToken);

        fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: encodedToken }),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            if (role === 'admin') {
              router.push('/admin');
            } else if (role === 'superadmin') {
              router.push('/superadmin');
            } else if (role === 'auth') {
              router.push('/user');
            } else if (role === 'unauth') {
              router.push('/notverified');
            }
          })
          .catch(error => {
           
          });
      } else {
       
        setIsLoading(false);
      }
    } catch (error) {
      
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (email) {
      checkUserExists(email).then(details => {
        if (details) {
          setUserDetails(details);
        }
      });
    }
  }, [email]);

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      {isLoading && <LoadingSpinner />}
      {!isLoading && (
        <Card className="max-w-md w-full p-4 mx-4 space-y-4">
          <CardHeader>
            <CardTitle>Sadhya-Fi</CardTitle>
            <CardDescription>Login to Sadhya-Fi</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="py-2 px-4 flex items-center justify-center w-full mb-4"
              onClick={handleGoogleSignIn}
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
      )}
    </div>
  );
};

export default Page;