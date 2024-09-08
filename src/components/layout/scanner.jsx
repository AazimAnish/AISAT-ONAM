import { db } from "@/app/firebase/firebaseConfig";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const QrCodeScanner = ({ setLastFiveScans }) => {
  const [result, setResult] = useState("");
  const [bg, setBg] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  let name = "";

  useEffect(() => {
    fetchAttendanceCount();

    const unsubscribeAttendance = listenToAttendanceCount();

    return () => {
      unsubscribeAttendance();
    };
  }, []);

  useEffect(() => {
    if (scanCount > 0) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [scanCount]);

  const fetchAttendanceCount = async () => {
    try {
      const hostelQuery = query(
        collection(db, "Hostels"),
        where("name", "==", hostelName)
      );
      const hostelSnapshot = await getDocs(hostelQuery);

      if (!hostelSnapshot.empty) {
        const hostelDoc = hostelSnapshot.docs[0];
        const data = hostelDoc.data();
        setAttendanceCount(data.attendanceCount || 0);
      } else {
        setInitialAttendanceCount();
      }
    } catch (error) {
      console.error("Error fetching attendance count:", error);
    }
  };

  const listenToAttendanceCount = () => {
    const hostelQuery = query(
      collection(db, "Hostels"),
      where("name", "==", hostelName)
    );

    const unsubscribe = onSnapshot(hostelQuery, (snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.data();
        setAttendanceCount(data.attendanceCount || 0);
      });
    });

    return unsubscribe;
  };

  const setInitialAttendanceCount = async () => {
    try {
      const hostelQuery = query(
        collection(db, "Hostels"),
        where("name", "==", hostelName)
      );
      const hostelSnapshot = await getDocs(hostelQuery);

      if (!hostelSnapshot.empty) {
        const hostelDoc = hostelSnapshot.docs[0];
        await updateDoc(doc(db, "Hostels", hostelDoc.id), {
          attendanceCount: 0,
        });
      }
    } catch (error) {
      console.error("Error setting initial attendance count:", error);
    }
  };

  const updateAttendanceCount = async (newCount) => {
    try {
      const hostelQuery = query(
        collection(db, "Hostels"),
        where("name", "==", Hostelname)
      );
      const hostelSnapshot = await getDocs(hostelQuery);

      if (!hostelSnapshot.empty) {
        const hostelDoc = hostelSnapshot.docs[0];
        await updateDoc(doc(db, "Hostels", hostelDoc.id), {
          attendanceCount: newCount,
        });
      }
    } catch (error) {
      console.error("Error updating attendance count:", error);
    }
  };

  const handleScan = async (data) => {
    if (data && !isScanning) {
      setIsScanning(true);
      setScannedData(data.text);
      try {
        const Query = query(
          collection(db, hostelName),
          where("tokennumber", "==", parseInt(data.text))
        );
        const Snapshot = await getDocs(Query);
        Snapshot.forEach((doc) => {
          const docData = doc.data();

          name = docData.name;
        });

        toast({
          title: (
            <div>
              <p className="font-bold">Name: {name}</p>
              <p className="font-bold">Mess number: {data.text}</p>
            </div>
          ),

          action: (
            <ToastAction
              altText="Mark Attendance"
              className="bg-black text-white"
              onClick={() => markAttendance(data.text)}
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

  const markAttendance = async (scannedData) => {
    setResult("");
    setBg("");

    setIsLoading(true);
    setScanCount((prevCount) => prevCount + 1);
    try {
      let docId = null;

      let food = false;

      const Query = query(
        collection(db, hostelName),
        where("tokennumber", "==", parseInt(scannedData))
      );
      const Snapshot = await getDocs(Query);
      Snapshot.forEach((doc) => {
        const data = doc.data();
        docId = doc.id;

        food = data.food;
      });

      if (docId) {
        if (food) {
          setBg("destructive");
          setResult("Rejected");
        } else {
          setBg("success");
          setResult("Accepted");
          setLastFiveScans((prevScans) => {
            const updatedScans = [
              { messNumber: messNumber, name },
              ...prevScans,
            ];
            return updatedScans.slice(0, 3);
          });
          await updateDoc(doc(db, hostelName, docId), {
            food: true,
          });
          incrementAttendance();
        }
      } else {
        setBg("destructive");
        setResult("Data not found");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      setBg("destructive");
      setResult("Error marking attendance");
    } finally {
      setIsScanning(false);
      setIsLoading(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
    setBg("destructive");
    setResult("Error scanning QR code");
  };

  const incrementAttendance = async () => {
    try {
      console.log("HOSTEL NAME:", Hostelname);
      const newCount = attendanceCount + 1;
      await updateAttendanceCount(newCount);
      setAttendanceCount(newCount);
    } catch (error) {
      console.error("Error incrementing attendance count:", error);
    }
  };

  const decrementAttendance = async () => {
    try {
      const newCount = Math.max(0, attendanceCount - 1);
      await updateAttendanceCount(newCount);
      setAttendanceCount(newCount);
    } catch (error) {
      console.error("Error decrementing attendance count:", error);
    }
  };

  return (
    <div className="p-4 w-full h-full flex flex-col items-center justify-center gap-4">
      <div className="w-full md:w-1/2 max-w-lg">
        <QrReader
          delay={300}
          onError={handleError}
          onResult={handleScan}
          className="w-full h-auto"
          constraints={{
            facingMode: { exact: "environment" },
            advanced: [{ zoom: 2.0 }],
          }}
        />
        {showAlert && (
          <Alert variant={bg}>
            <AlertTitle>{result}</AlertTitle>
          </Alert>
        )}
      </div>

      <div>
        <Button className="mr-2" onClick={decrementAttendance}>
          -
        </Button>
        <Badge variant="outline">{`COUNT : ${attendanceCount}`}</Badge>
        <Button className="ml-2" onClick={incrementAttendance}>
          +
        </Button>
      </div>
    </div>
  );
};

export default QrCodeScanner;
