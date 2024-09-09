"use client";
import { db } from "@/app/firebase/firebaseConfig"; // Import your firebase config
import { toast } from "@/components/ui/use-toast";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const SuperAdmin = () => {
  // State to store selected branch, year, and division
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");

  // State to store students
  const [students, setStudents] = useState([]);

  // List of branches, years, and divisions for filtering
  const branches = ["CSE", "ECE", "EEE", "MECH"]; // Add more branches as needed
  const years = ["2", "3", "4"];
  const divisions = ["A", "B"]; // Only for CSE Year 2

  // Function to fetch unauth students based on branch, year, and division (if applicable)
  const fetchStudents = async (branch, year, division) => {
    try {
      // Create a base query with branch and year filters
      let q = query(
        collection(db, "users"),
        where("role", "==", "unauth"),
        where("branch", "==", branch),
        where("yearOfStudy", "==", year)
      );

      // If CSE Year 2, add division filter
      if (branch === "CSE" && year === "2" && division) {
        q = query(q, where("division", "==", division));
      }

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

  // Handle branch, year, and division selection
  useEffect(() => {
    if (selectedBranch && selectedYear) {
      // For CSE Year 2, wait for division selection
      if (selectedBranch === "CSE" && selectedYear === "2") {
        if (selectedDivision) {
          fetchStudents(selectedBranch, selectedYear, selectedDivision);
        }
      } else {
        fetchStudents(selectedBranch, selectedYear, selectedDivision);
      }
    }
  }, [selectedBranch, selectedYear, selectedDivision]);

  // Function to handle accepting a student
  const handleAccept = async (student) => {
    try {
      // Get the number of documents in the "paid" collection to calculate the token number
      const paidSnapshot = await getDocs(collection(db, "paid"));
      const tokenNumber = paidSnapshot.size + 1; // Next token number

      // Update the student's role to "auth" in the "users" collection
      const userRef = doc(db, "users", student.id);
      await updateDoc(userRef, {
        role: "auth",
      });

      // Add the student to the "paid" collection with tokenNumber
      const paidRef = doc(db, "paid", student.id);
      await setDoc(paidRef, {
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
                setSelectedYear("");
                setSelectedDivision("");
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
                onClick={() => {
                  setSelectedYear(year);
                  setSelectedDivision(""); // Reset division on year change
                }}
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

      {/* Division Selection (only for CSE Year 2) */}
      {selectedBranch === "CSE" && selectedYear === "2" && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Select Division
          </h2>
          <div className="flex flex-wrap gap-4">
            {divisions.map((division) => (
              <button
                key={division}
                onClick={() => setSelectedDivision(division)}
                className={`px-4 py-2 rounded-md text-white font-semibold 
              ${
                selectedDivision === division
                  ? "bg-purple-600"
                  : "bg-purple-400"
              } hover:bg-purple-500 transition`}
              >
                {division}
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
