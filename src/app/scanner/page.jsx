"use client";
import { db } from "@/app/firebase/firebaseConfig";
import QrCodeScanner from "@/components/layout/scanner";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import {
  collection,
  doc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";

const AdminScanner = () => {
  const { toast } = useToast();
  const [messNumber, setMessNumber] = useState("");
  const [result, setResult] = useState("");
  const [bg, setBg] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const [lastFiveScans, setLastFiveScans] = useState([]);

  let name = "";
  let hostelName = "paid";

  const updateAttendanceCount = async () => {
    try {
      const countDocRef = doc(db, "count", "Q4006zimmJlyhIm7wNYv");
      await updateDoc(countDocRef, {
        attendanceCount: increment(1),
      });
    } catch (error) {
      console.error("Error incrementing attendance count:", error);
    }
  };

  const handleScan = async () => {
    if (messNumber && hostelName) {
      try {
        const Query = query(
          collection(db, hostelName),
          where("tokenNumber", "==", parseInt(messNumber))
        );
        const Snapshot = await getDocs(Query);
        Snapshot.forEach((doc) => {
          const docData = doc.data();

          name = docData.name;
        });

        toast({
          description: (
            <div>
              <p className="font-bold">Name: {name}</p>
              <p className="font-bold">Token number: {messNumber}</p>
            </div>
          ),
          action: (
            <ToastAction
              altText="Mark Attendance"
              className="bg-black text-white"
              onClick={() => markAttendance()}
            >
              Mark Token
            </ToastAction>
          ),
        });
      } catch (error) {
        console.error("Error fetching picUrl:", error);
      }
    }
  };

  const markAttendance = async () => {
    setResult("");
    setBg("");

    try {
      let docId = null;
      let food = false;

      const Query = query(
        collection(db, hostelName),
        where("tokenNumber", "==", parseInt(messNumber))
      );
      const Snapshot = await getDocs(Query);
      Snapshot.forEach((doc) => {
        const data = doc.data();
        docId = doc.id;
        food = data.food;
      });

      if (food) {
        setBg("destructive");
        setResult("Rejected");
      } else {
        setBg("success");
        setResult("Accepted");

        setLastFiveScans((prevScans) => {
          const updatedScans = [{ messNumber: messNumber, name }, ...prevScans];
          return updatedScans.slice(0, 3);
        });
        await updateDoc(doc(db, hostelName, docId), {
          food: true,
        });
        updateAttendanceCount();
      }
    } catch (error) {
      setBg("destructive");
      setResult("Error fetching data");
    }

    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);

    setMessNumber("");
  };

  return (
    <div className="flex flex-col items-center pt-10 h-screen w-screen p-5">
      <QrCodeScanner setLastFiveScans={setLastFiveScans} />
      <div>
        {showAlert && (
          <Alert variant={bg} className="w-96 px-4 py-2 text-left">
            <AlertTitle>{result}</AlertTitle>
          </Alert>
        )}
      </div>

      <div className="flex items-center mb-5 mt-20">
        <span className="mr-2">Token number: </span>
        <Input
          className="w-20"
          type="number"
          value={messNumber}
          onChange={(e) => setMessNumber(e.target.value)}
        />
      </div>

      <Button type="button" onClick={handleScan} className="mb-22">
        Search using token number
      </Button>

      <div className="w-full md:w-1/2 max-w-lg mt-12">
        <h3 className="font-bold text-lg mb-4 text-center">
          Last 3 Accepted Scans
        </h3>
        <div className="flex justify-center space-x-4">
          {lastFiveScans.length > 0 ? (
            lastFiveScans.map((scan, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-3 w-28 h-32 flex flex-col space-y-1 border border-gray-200 text-center"
              >
                <p className="text-sm text-gray-600">
                  <strong>Token no:</strong> {scan.messNumber}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Name:</strong> {scan.name}
                </p>
              </div>
            ))
          ) : (
            <div className="bg-white shadow-lg rounded-lg p-4 text-center border border-gray-200">
              <p className="text-gray-500">No scans yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminScanner;
