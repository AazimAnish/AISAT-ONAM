'use client';
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, updateDoc, doc, setDoc, getDoc, query, orderBy, deleteDoc, onSnapshot, where } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import LoadingSpinner from "@/app/user/loading";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const getSysBioFromLocalStorage = () => {
  const encodedToken = localStorage.getItem('sys_bio');
  if (encodedToken) {
    try {
      const decodedToken = Buffer.from(encodedToken, 'base64').toString('utf8');
      return JSON.parse(decodedToken);
    } catch (error) {
      console.error('Error decoding sys_bio from localStorage:', error);
      return null;
    }
  }
  return null;
};
const deleteUser = async (userId, userName, setFilteredUsers, setHostelUsers) => {
  try {
    const sysBio = getSysBioFromLocalStorage();
    const hostelName = sysBio ? sysBio.hostelName : null;
    console.log('Hostel Name:', hostelName);

    if (!hostelName) throw new Error('Hostel name not found');
    alert(`${userName} has been deleted`);


    const hostelDocRef = doc(db, hostelName, userId);
    // Find the document in the 'users' collection where the name matches
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('name', '==', userName));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('User not found in users collection');
    }

    // Assuming there's only one document per userName
    const userDoc = querySnapshot.docs[0];
    const userDocRef = doc(db, 'users', userDoc.id);

    // Delete the user from the 'users' collection
    await deleteDoc(userDocRef);


    // Delete the user from the hostel collection
    await deleteDoc(hostelDocRef);


    // Optionally, update the state to reflect the deletion
    setFilteredUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
    setHostelUsers(prevUsers => prevUsers.filter(user => user.id !== userId));

  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

const getMessnumber = async (hostelName) => {
  try {
    // Reference to the hostelName collection
    const hostelCollectionRef = collection(db, hostelName);

    // Query to get documents ordered by messnumber in descending order
    const q = query(hostelCollectionRef, orderBy("messnumber", "desc"));
    const querySnapshot = await getDocs(q);

    // Check if there are any documents in the collection
    if (!querySnapshot.empty) {
      // Get the highest messnumber from the first document
      const lastDoc = querySnapshot.docs[0];
      const lastMessNumber = lastDoc.data().messnumber || 0;
      console.log('Last mess number:', lastMessNumber);
      return lastMessNumber + 1; // Increment by 1
    }
    else {

      return 1;
    }
  } catch (error) {
    console.error('Error getting mess number:', error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};



const fetchCollectionDetails = async (collectionName, setHostelUsers) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const hosteluserList = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }));

    hosteluserList.forEach(user => {

    });

    setHostelUsers(hosteluserList);


  } catch (error) {
    console.error('Error fetching collection details:', error);
  }
};

const Page = () => {
  const [user, setUser] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [hostelUsers, setHostelUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentMonthYear = () => {
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    return { month, year };
  };

  const getPreviousMonthYear = (currentMonth, currentYear) => {
    const date = new Date(`${currentMonth} 1, ${currentYear}`);
    date.setMonth(date.getMonth() - 1);
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return { month, year };
  };

  // Usage
  const { month: currentMonth, year: currentYear } = getCurrentMonthYear();
  const { month: previousMonth, year: previousYear } = getPreviousMonthYear(currentMonth, currentYear);
  const [selectedMonth, setSelectedMonth] = useState(previousMonth);
  const [selectedYear, setSelectedYear] = useState(previousYear);
  const [buttonText, setButtonText] = useState('Unpaid');
  const [buttonColor, setButtonColor] = useState('bg-red-500');
  const [isMonthYearValid, setIsMonthYearValid] = useState(true);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = [2023, 2024, 2025, 2026];

  useEffect(() => {
    const fetchUsers = () => {
      try {
        const sysBio = getSysBioFromLocalStorage();
        const hostelName = sysBio ? sysBio.hostelName : null;

        if (hostelName) {
          const usersCollectionRef = collection(db, "users");
          const hostelCollectionRef = collection(db, hostelName);

          // Real-time listener for filtered users
          const unsubscribeFiltered = onSnapshot(usersCollectionRef, (snapshot) => {
            const userList = snapshot.docs
              .map(doc => ({ id: doc.id, ...doc.data() }))
              .filter(user => user.hostelName === hostelName && user.role === 'unauth');
            setFilteredUsers(userList);
          });

          // Real-time listener for hostel users
          const unsubscribeHostel = onSnapshot(hostelCollectionRef, (snapshot) => {
            const hostelUserList = snapshot.docs
              .map(doc => ({ id: doc.id, ...doc.data() }));
            setHostelUsers(hostelUserList);
            setUser(hostelUserList);
            console.log('Hostel users:', hostelUserList);
          });

          // Cleanup function to unsubscribe listeners
          return () => {
            unsubscribeFiltered();
            unsubscribeHostel();
          };

        } else {
          console.log('No valid hostelName found.');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (user && user.userId) {
      console.log('User:', user);
      fetchPaymentStatus(user.userId);
    }
  }, [selectedMonth, selectedYear, user]);

  const fetchPaymentStatus = async (userId) => {

    if (!selectedMonth || !selectedYear) return;
    console.log('Fetching payment status for:', userId);
    const selectedMonthYear = `${selectedMonth} ${selectedYear}`;
    const sysBio = getSysBioFromLocalStorage();
    const hostelName = sysBio ? sysBio.hostelName : null;
    console.log('userId', userId);
    const userDocRef = doc(db, hostelName, userId);
    console.log('User doc ref:', userDocRef);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      const monthlyData = userData.monthlyData || [];
      const currentBill = monthlyData.find(bill => bill.month === selectedMonthYear);

      if (currentBill) {
        setButtonText(currentBill.paid ? 'Paid' : 'Unpaid');
        setButtonColor(currentBill.paid ? 'bg-green-500' : 'bg-red-500');
      }
    }
  };

  // Call fetchPaymentStatus when the component mounts or when selectedMonth or selectedYear changes

  const downloadExcel = () => {
    // Create a workbook and a worksheet
    const wb = XLSX.utils.book_new();
    const wsData = [
      ['Mess Number', 'Name', 'Email', 'Phone', 'Branch', 'Blood Group', 'Caution', 'Food Preference', 'User Type', 'Hostel ID', 'Room Number', 'Claim', 'Category', 'other', 'Year Of Study', 'JoinedAt']
    ];

    const sortedHostelUsers = hostelUsers
      .slice()
      .sort((a, b) => (a.messnumber || 0) - (b.messnumber || 0));

    sortedHostelUsers.forEach(user => {

      wsData.push([
        user.messnumber,
        user.name,
        user.email,
        user.phone,
        user.branch,
        user.bloodGroup,
        user.caution,
        user.foodPreference,
        user.userType,
        user.hostelID || 'None',
        user.roomNumber || 'None',
        user.claim,
        user.category || 'None',
        user.other || 'None',
        user.yearOfStudy,
      ]);
    });

    // Convert data to a worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Users');

    // Write the workbook and trigger download
    XLSX.writeFile(wb, 'UsersData.xlsx');
  };

  const handleAccept = async (userId, id, name, phone, branch, bloodGroup, caution, email, foodPreference, userType, hostelID, roomNumber, claim, category, other, yearOfStudy) => {
    setIsLoading(true);
    try {

      // Remove user from hostelUsers and add to filteredUsers
      setFilteredUsers(prevUsers => {
        let updatedUsers = [...prevUsers];
        updatedUsers = updatedUsers.filter(user => user.userId !== userId);


        return updatedUsers;
      });


      const sysBio = getSysBioFromLocalStorage();
      const hostelName = sysBio ? sysBio.hostelName : null;
      if (!hostelName) throw new Error('Hostel name not found');
      const documentCount = await getMessnumber(hostelName);
      const messNumber = documentCount;

      // References to collections
      const usersRef = doc(db, "users", id);
      const newCollectionRef = collection(db, hostelName);

      // Update user role to 'auth'
      await updateDoc(usersRef, { role: 'auth' });

      const updatedUserDoc = await getDoc(usersRef);
      if (updatedUserDoc.exists()) {
        const updatedUserData = updatedUserDoc.data();

      } else {
        console.error('User document not found');
      }
      const messMonth = new Date().toLocaleString('default', { month: 'long' });
      const dates = [];
      const messCut = 0;

      const newArray = [
        {
          messMonth: messMonth,
          messDates: dates,
          applicableMesscuts: messCut,
        },
      ];

      await setDoc(doc(newCollectionRef, userId), {
        userId: userId,
        name: name,
        email: email,
        phone: phone,
        branch: branch,
        bloodGroup: bloodGroup,
        caution: caution,
        foodPreference: foodPreference,
        userType: userType,
        claim: claim,
        category: category,
        other: other,
        yearOfStudy: yearOfStudy,
        hostelID: hostelID,
        roomNumber: roomNumber,
        attendence: 0,
        paid: true,
        messcuts: newArray,
        eve: false,
        mon: false,
        noon: false,
        messnumber: messNumber,
      });

      await fetchCollectionDetails(hostelName, setHostelUsers);
    } catch (error) {
      console.error('Error handling accept:', error);
    }
    finally {
      setIsLoading(false);
    }
  };
  const handleCheckPayment = async (userId) => {

    if (!selectedMonth || !selectedYear) {
      alert('Please select a month and year.');
      return;
    }

    const selectedMonthYear = `${selectedMonth} ${selectedYear}`;
    const sysBio = getSysBioFromLocalStorage();
    const hostelName = sysBio ? sysBio.hostelName : null;
    const userDocRef = doc(db, hostelName, userId);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      console.log('User data:', userData);
      const monthlyData = userData.monthlyData || [];

      // Check if the selected month and year exist in the monthlyData array
      const isEntryFound = monthlyData.some(bill => bill.month === selectedMonthYear);
      setIsMonthYearValid(isEntryFound);

      if (isEntryFound) {
        const updatedMonthlyData = monthlyData.map((bill) => {
          if (bill.month === selectedMonthYear) {
            return { ...bill, paid: true };
          }
          return bill;
        });

        await updateDoc(userDocRef, { monthlyData: updatedMonthlyData });
        alert(`Payment for ${selectedMonthYear} marked as paid.`);
      } else {
        alert(`No bill found for ${selectedMonthYear}.`);
      }

    } else {
      alert('No user found');
    }
  };


  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const sortedHostelUsers = hostelUsers
    .slice()
    .sort((a, b) => (a.messnumber || 0) - (b.messnumber || 0));

  const filteredHostelUsers = sortedHostelUsers.filter(user =>
    (user.name || '').toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  return (
    <div>
      <div className="flex min-h-screen min-w-fit flex-col ">
        <div className="flex flex-col items-start  sm:gap-4 sm:py-4 sm:pl-14">
          <main className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
            <Tabs defaultValue="users">
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="requests">Requests</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="users">
                <Card x-chunk="dashboard-06-chunk-0">
                  <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>Manage your users.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center">
                        <Input
                          type="text"
                          placeholder="Search by name"
                          value={searchQuery}
                          onChange={handleSearchChange}
                        />
                        <Button onClick={downloadExcel} className="ml-2">Export Excel</Button>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Mess Number</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Branch</TableHead>
                            <TableHead>Blood Group</TableHead>
                            <TableHead>Caution</TableHead>
                            <TableHead>Food Preference</TableHead>
                            <TableHead>User Type</TableHead>
                            <TableHead>Hostel ID</TableHead>
                            <TableHead>Room Number</TableHead>
                            <TableHead>Claim</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Other</TableHead>
                            <TableHead>Year of Study</TableHead>
                            <TableHead>JoinedAt</TableHead>
                            <TableCell>
                              <div className="w-full">
                                <Select
                                  value={selectedMonth}
                                  onValueChange={(value) => {
                                    setSelectedMonth(value);
                                  }}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Month" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {months.map((month) => (
                                      <SelectItem key={month} value={month}>
                                        {month}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="w-full">
                                <Select
                                  value={selectedYear}
                                  onValueChange={(value) => {
                                    setSelectedYear(value);
                                    fetchPaymentStatus(user.userId);
                                  }}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Year" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {years.map((year) => (
                                      <SelectItem key={year} value={year}>
                                        {year}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredHostelUsers.map(user => {
                            // Initialize variables for button text and color
                            let buttonText = "Unpaid";
                            let buttonColor = "bg-red-500"; // Default color for unpaid

                            // Check if selectedMonth and selectedYear are set
                            if (selectedMonth && selectedYear && user.monthlyData) {
                              // Find the entry in monthlyData that matches the selected month and year
                              const matchingMonthData = user.monthlyData.find(
                                (entry) => entry.month === `${selectedMonth} ${selectedYear}`
                              );

                              // If a matching entry is found, update the button text and color based on the paid field
                              if (matchingMonthData) {
                                if (matchingMonthData.paid) {
                                  buttonText = "Paid";
                                  buttonColor = "bg-green-500"; // Red color for paid
                                } else {
                                  buttonText = "Unpaid";
                                  buttonColor = "bg-red-500"; // Green color for unpaid
                                }
                              }
                            }

                            return (
                              <TableRow key={user.userId}>
                                <TableCell>{user.messnumber}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>{user.branch}</TableCell>
                                <TableCell>{user.bloodGroup}</TableCell>
                                <TableCell>{user.caution}</TableCell>
                                <TableCell>{user.foodPreference}</TableCell>
                                <TableCell>{user.userType}</TableCell>
                                <TableCell>{user.hostelID || 'None'}</TableCell>
                                <TableCell>{user.roomNumber || 'None'}</TableCell>
                                <TableCell>{user.claim}</TableCell>
                                <TableCell>{user.category || 'None'}</TableCell>
                                <TableCell>{user.other || 'None'}</TableCell>
                                <TableCell>{user.yearOfStudy}</TableCell>
                                <TableCell>{formatDate(user.joinedAtDate)}</TableCell>
                                <TableCell>
                                  <Button onClick={() => deleteUser(user.userId, user.name, setFilteredUsers, setHostelUsers)}>Delete</Button>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    className={`mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonColor}`}
                                    onClick={() => handleCheckPayment(user.userId)}
                                  >
                                    {buttonText}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                  <CardFooter></CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="requests">
                <Card x-chunk="dashboard-06-chunk-1">
                  <CardHeader>
                    <CardTitle>Requests</CardTitle>
                    <CardDescription>Manage your Requests</CardDescription>
                  </CardHeader>
                  <CardContent>

                    <Table className="md:block hidden w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Gmail</TableHead>
                          <TableHead className="hidden md:table-cell">Phone</TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.length ? (
                          filteredUsers.map(user => (
                            <TableRow key={user.id}>
                              <TableCell>{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell className="hidden md:table-cell">{user.phoneNumber}</TableCell>
                              <TableCell>
                                <Button className="bg-green-400" onClick={() =>
                                  handleAccept(
                                    user.userId, user.id, user.name, user.phoneNumber, user.branch, user.bloodGroup, user.caution, user.email,
                                    user.foodPreference, user.userType, user.hostelID, user.roomNumber, user.claim, user.category, user.other,
                                    user.yearOfStudy
                                  )
                                }
                                  disabled={isLoading} // Optionally disable the button while loading
                                >
                                  {isLoading ? <LoadingSpinner /> : 'Accept'}
                                </Button>

                              </TableCell>
                              {/* <TableCell className="hidden md:table-cell">
                                <Button className="bg-red-500">Reject</Button>
                              </TableCell> */}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center">
                              No requests available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>


                  </CardContent>



                  <CardFooter className="md:block hidden">
                    <div className="text-xs text-muted-foreground">
                      Showing <strong>1-10</strong> of <strong>32</strong> requests
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div >
    </div >
  );
};

export default Page;