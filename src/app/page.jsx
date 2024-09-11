"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Img from "../../public/images/Img.webp";
import { auth, db, provider, signInWithPopup } from "./firebase/firebaseConfig";
import LoadingSpinner from "./loading";

const encodeBase64 = (str) => Buffer.from(str).toString("base64");
const Page = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [userDetails, setUserDetails] = useState(null);

  const checkUserExists = async (email) => {
    if (email) {
      try {
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0].data();
          const role = userDoc.role;
          const email = userDoc.email;
          return { role, email };
        } else {
          const dismissToast = toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "User is not registered. Please sign up.",
            action: (
              <ToastActionButton
                href="/register"
                onClick={() => dismissToast.dismiss()}
              >
                {" "}
                Register
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

      setEmail(user.email || "");
      const userDetails = await checkUserExists(user.email || "");

      if (userDetails) {
        const { role } = userDetails;
        const { email } = userDetails;

        const sys_bio = { role, email };
        const encodedToken = encodeBase64(JSON.stringify(sys_bio));
        localStorage.setItem("sys_bio", encodedToken);

        fetch("/api/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: encodedToken }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            if (role === "admin") {
              router.push("/admin");
            } else if (role === "superadmin") {
              router.push("/superadmin");
            } else if (role === "auth") {
              router.push("/user");
            } else if (role === "unauth") {
              console.log("role", role);
              router.push("/notpaid");
            }
          })
          .catch((error) => {});
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (email) {
      checkUserExists(email).then((details) => {
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
              <Image src={Img} alt="Google" className="w-5 h-5 mr-2" />
              <span>Login with Google</span>
            </Button>
            <p className="flex justify-center">
              Not a User? <span className="ml-1">Click here to</span>
              <Link href="/register" className="ml-1 text-blue-500">
                Signup
              </Link>{" "}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Page;
