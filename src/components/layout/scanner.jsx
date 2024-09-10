import { db } from "@/app/firebase/firebaseConfig";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import {
  collection,
  doc,
  getDocs,
  increment,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import { Badge } from "../ui/badge";

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

  const hostelName = "paid"; // Default hostel name
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
      const queryRef = query(collection(db, "count"));
      const snapshot = await getDocs(queryRef);

      if (!snapshot.empty) {
        const docData = snapshot.docs[0].data();
        setAttendanceCount(docData.attendanceCount || 0);
      } else {
        setAttendanceCount(0);
      }
    } catch (error) {
      console.error("Error fetching attendance count:", error);
    }
  };

  const listenToAttendanceCount = () => {
    const queryRef = query(collection(db, "count"));

    const unsubscribe = onSnapshot(queryRef, (snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.data();
        setAttendanceCount(data.attendanceCount || 0);
      });
    });

    return unsubscribe;
  };

  const updateAttendanceCount = async () => {
    try {
      const countDocRef = doc(db, "count", "Q4006zimmJlyhIm7wNYv"); // Hardcoded document ID
      await updateDoc(countDocRef, {
        attendanceCount: increment(1),
      });
    } catch (error) {
      console.error("Error incrementing attendance count:", error);
    }
  };

  const handleScan = async (data) => {
    if (data && !isScanning) {
      setIsScanning(true);
      setScannedData(data.text);

      try {
        const queryRef = query(
          collection(db, hostelName),
          where("tokenNumber", "==", parseInt(data.text)) // Ensure tokenNumber is numeric
        );
        const snapshot = await getDocs(queryRef);

        let messNumber = data.text;

        snapshot.forEach((doc) => {
          const docData = doc.data();
          name = docData.name;
        });

        toast({
          description: (
            <div>
              <p className="font-bold">Name: {name}</p>
              <p className="font-bold">Mess number: {messNumber}</p>
            </div>
          ),
          action: (
            <ToastAction
              altText="Mark Attendance"
              className="bg-black text-white"
              onClick={() => markAttendance(messNumber)}
            >
              Mark Attendance
            </ToastAction>
          ),
        });
      } catch (error) {
        console.error("Error fetching name or token data:", error);
      } finally {
        setIsScanning(false);
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

      const queryRef = query(
        collection(db, hostelName),
        where("tokenNumber", "==", parseInt(scannedData))
      );
      const snapshot = await getDocs(queryRef);

      snapshot.forEach((doc) => {
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
          const updatedScans = [
            { messNumber: scannedData, name: name },
            ...prevScans,
          ];
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

  return (
    <div className="p-4 w-full h-full flex flex-col items-center justify-center gap-4">
      <div className="w-full md:w-1/2 max-w-lg">
        <QrReader
          delay={300}
          onError={handleError}
          onResult={handleScan}
          className="w-full h-auto"
          constraints={{
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
        <Badge variant="outline">{`COUNT : ${attendanceCount}`}</Badge>
      </div>
    </div>
  );
};

export default QrCodeScanner;
