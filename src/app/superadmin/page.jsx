"use client";
import { db } from "@/app/firebase/firebaseConfig"; // Import your firebase config
import { toast } from "@/components/ui/use-toast";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const SuperAdmin = () => {
  // State to store selected branch and year
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // State to store students
  const [students, setStudents] = useState([]);

  // List of branches and years for filtering
  const branches = ["CSE-A", "CSE-B", "CSE", "ECE", "EEE", "ME"]; // Remove "CSE" since it's split into CSE-A and CSE-B
  const years = ["2", "3", "4"];

  // Function to fetch unauth students based on branch and year
  const fetchStudents = async (branch, year) => {
    try {
      // Create a base query with branch and year filters
      let q = query(
        collection(db, "users"),
        where("role", "==", "unauth"),
        where("branch", "==", branch),
        where("yearOfStudy", "==", year)
      );

      const querySnapshot = await getDocs(q);
      const filteredStudents = [];
      querySnapshot.forEach((doc) => {
        filteredStudents.push({ id: doc.id, ...doc.data() });
      });

      // Update state with filtered students
      setStudents(filteredStudents);
    } catch (error) {
      console.error("Error fetching students: ", error);
    }
  };

  // Handle branch and year selection
  useEffect(() => {
    if (selectedBranch && selectedYear) {
      fetchStudents(selectedBranch, selectedYear);
    }
  }, [selectedBranch, selectedYear]);

  // Function to get the last tokenNumber and increment it by 1
  const getNextTokenNumber = async () => {
    try {
      const paidQuery = query(
        collection(db, "paid"),
        orderBy("tokenNumber", "desc"),
        limit(1) // Limit to get the last document
      );

      const querySnapshot = await getDocs(paidQuery);
      if (!querySnapshot.empty) {
        const lastDoc = querySnapshot.docs[0];
        const lastTokenNumber = lastDoc.data().tokenNumber;
        return lastTokenNumber + 1;
      } else {
        return 1; // If no document is present, start with tokenNumber 1
      }
    } catch (error) {
      console.error("Error getting the last tokenNumber: ", error);
      return 1; // Default to 1 if there's an error
    }
  };

  // Function to handle accepting a student
  const handleAccept = async (student) => {
    try {
      // Get the next token number by checking the last one in the "paid" collection
      const tokenNumber = await getNextTokenNumber();

      // Update the student's role to "auth" in the "users" collection
      const userRef = doc(db, "users", student.id);
      await updateDoc(userRef, {
        role: "auth",
      });

      // Add the student to the "paid" collection with tokenNumber
      await addDoc(collection(db, "paid"), {
        ...student,
        role: "auth",
        tokenNumber,
        food: false,
      });

      // Remove student from the current list
      setStudents((prev) => prev.filter((item) => item.id !== student.id));
      toast({
        title: "Student accepted successfully",
        status: "success",
      });
    } catch (error) {
      console.error("Error updating student: ", error);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-600">
        ZOOPER Admin
      </h1>

      {/* Branch Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Select Branch
        </h2>
        <div className="flex flex-wrap gap-4">
          {branches.map((branch) => (
            <button
              key={branch}
              onClick={() => {
                setSelectedBranch(branch);
                setSelectedYear(""); // Reset year when branch changes
              }}
              className={`px-4 py-2 rounded-md text-white font-semibold 
              ${
                selectedBranch === branch ? "bg-indigo-600" : "bg-indigo-400"
              } hover:bg-indigo-500 transition`}
            >
              {branch}
            </button>
          ))}
        </div>
      </div>

      {/* Year Selection */}
      {selectedBranch && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Select Year
          </h2>
          <div className="flex flex-wrap gap-4">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-md text-white font-semibold 
              ${
                selectedYear === year ? "bg-green-600" : "bg-green-400"
              } hover:bg-green-500 transition`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Display Students */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {students.length > 0 ? (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Phone Number
                </th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b">
                  <td className="px-4 py-2">{student.name}</td>
                  <td className="px-4 py-2">{student.phoneNumber}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleAccept(student)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition"
                    >
                      Accept
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center">
            No students found for this branch and year.
          </p>
        )}
      </div>
    </div>
  );
};

export default SuperAdmin;
