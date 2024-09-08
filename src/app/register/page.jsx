"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Img from "../../../public/images/Img.webp";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { auth, provider, signInWithPopup, db } from '../firebase/firebaseConfig';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const Page = ({ email, profilePicURL }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
   // role: 'unauth',
    name: '',
    branch: '',
    yearOfStudy: '',
    phoneNumber: '',
    //foodPreference: '',
   // roomNumber: '',
   // userType: '',
   // claim: '',
  //  caution: '',
   // bloodGroup: '',
   // profilePicURL: profilePicURL || '/',
    email: email || '',
   // hostelName: '',
   // category: '',
   // other: '',
    //hostelID: ''
  });
  const [userExists, setUserExists] = useState(false);
  const [hostelData, setHostelData] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const checkUserExists = async (email) => {
    if (email) {
      try {
        const q = query(collection(db, 'users'), where('email', '==', email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setUserExists(true);
          router.push('/');
        } else {
          setUserExists(false);
        }
      } catch (error) {
        console.error('Error checking user existence:', error);
      }
    }
  };
  useEffect(() => {
    if (email) {
      checkUserExists(email);
    }
  }, [email, router]);

  useEffect(() => {
    if (formData.hostelName) {
      fetchHostelData(formData.hostelName);
    }
  }, [formData.hostelName]);

  const fetchHostelData = async (hostelName) => {
    try {
      const hostelCollection = collection(db, hostelName);
      const querySnapshot = await getDocs(hostelCollection);
      const data = querySnapshot.docs.map(doc => doc.data());
      setHostelData(data);
      console.log('Fetched Hostel Data:', data);
    } catch (error) {
      console.error('Error fetching hostel data:', error);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };
  const handleSelectChange = (id, value) => {
    setFormData((prevData) => {
      let newFormData = { ...prevData, [id]: value };

      if (id === 'userType') {
        newFormData.hostelID = value === 'outmess' ? 'none' : prevData.hostelID;
        newFormData.roomNumber = value === 'outmess' ? 'none' : prevData.roomNumber;
      }

      if (id === 'claim') {
        newFormData.category = value === 'No' ? 'none' : prevData.category;
        newFormData.other = value === 'No' ? 'none' : prevData.other;
      }

      if (id === 'category') {
        newFormData.other = value === 'other' ? prevData.other : 'none';
      }

      return newFormData;
    });
  };

  const addDataToFirestore = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('User must be signed in to submit the form');
        return;
      }

      const docRef = collection(db, 'users');
      await addDoc(docRef, {
        ...formData,
        userId: user.uid,
      });

      console.log('Form data stored successfully');
    } catch (error) {
      console.error('Error storing form data:', error);
    }
  };

  const isFormValid = () => {
    for (const [key, value] of Object.entries(formData)) {
      // Skip validation for fields that are conditionally not required and set to 'none'
      if (
        (key === 'hostelID' || key === 'roomNumber' || key === 'other') &&
        value === 'none'
      ) {
        continue;
      }

      // Ensure that required fields are not empty
      if (value === '') {
        console.error(`Field ${key} is missing`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid()) {
      setIsLoading(true); // Set loading state to true
      console.log('Form Data:', formData);
      try {
        await addDataToFirestore();
        setFormData({
          //role: 'unauth',
          name: '',
          branch: '',
          yearOfStudy: '',
          phoneNumber: '',
          //foodPreference: '',
          //hostelName: '',
          //hostelID: '',
          //roomNumber: '',
         // claim: '',
          //caution: '',
          //bloodGroup: '',
          //category: '',
         // other: '',
         // profilePicURL: profilePicURL || '/',
          email: email || '',
        });
        router.push('/'); // Navigate to the loading page
      } catch (error) {
        console.error("Error during form submission:", error);
      } finally {
        setIsLoading(false); // Set loading state to false after operation completes
      }
    } else {
      alert('Please fill out all fields.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setFormData((prevData) => ({
        ...prevData,
        email: user.email || '',
      }));
      checkUserExists(user.email);
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      {userExists || formData.email ? (
        <>
          <h1 className=' mt-10'>Enter User Details</h1>
          <form onSubmit={handleSubmit} className="mt-10 w-1/2 space-y-6">
            <div>
              <label className="block  mb-1">Name</label>
              <Input
                className=" w-full px-4 py-2 border border-gray-300 rounded-md"
                id="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block  mb-1">Branch</label>
              <Select
                value={formData.branch}
                onValueChange={(value) => handleSelectChange('branch', value)}
                required
              >
                <SelectTrigger className=" w-full px-4 py-2 border border-gray-300 rounded-md">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Branch</SelectLabel>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="SF">SF</SelectItem>
                    <SelectItem value="CE">CE</SelectItem>
                    <SelectItem value="MECH">MECH</SelectItem>
                    <SelectItem value="ECE">ECE</SelectItem>
                    <SelectItem value="EEE">EEE</SelectItem>
                    <SelectItem value="Main Campus">Main Campus</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block  mb-1">Year Of Study</label>
              <Select
                value={formData.yearOfStudy}
                onValueChange={(value) => handleSelectChange('yearOfStudy', value)}
                required
              >
                <SelectTrigger className=" w-full px-4 py-2 border border-gray-300 rounded-md">
                  <SelectValue placeholder="Year Of Study" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Year Of Study</SelectLabel>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block  mb-1">Email</label>
              <Input
                disabled
                className=" w-full px-4 py-2 border border-gray-300 rounded-md"
                id="email"
                placeholder="Email"
                value={formData.email}
                readOnly
                required
              />
            </div>
            <div>
              <label className="block  mb-1">Phone Number</label>
              <Input
                className=" w-full px-4 py-2 border border-gray-300 rounded-md"
                id="phoneNumber"
                type="tel" maxLength={10}
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block  mb-1">Blood Group</label>
              <Select
                value={formData.bloodGroup}
                onValueChange={(value) => handleSelectChange('bloodGroup', value)}
                required
              >
                <SelectTrigger className=" w-full px-4 py-2 border border-gray-300 rounded-md">
                  <SelectValue placeholder="Blood Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Blood Group</SelectLabel>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block  mb-1">Food Preference</label>
              <Select
                value={formData.foodPreference}
                onValueChange={(value) => handleSelectChange('foodPreference', value)}
                required
              >
                <SelectTrigger className=" w-full px-4 py-2 border border-gray-300 rounded-md">
                  <SelectValue placeholder="Food Preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Food Preference</SelectLabel>
                    <SelectItem value="Vegetarian">Veg</SelectItem>
                    <SelectItem value="Non-Vegetarian">Non-Veg</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block  mb-1">Hostel Name</label>
              <Select
                value={formData.hostelName}
                onValueChange={(value) => handleSelectChange('hostelName', value)}
                required
              >
                <SelectTrigger className=" w-full px-4 py-2 border border-gray-300 rounded-md">
                  <SelectValue placeholder="Hostel Name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Hostel Name</SelectLabel>
                    <SelectItem value="sahara">Sahara</SelectItem>
                    <SelectItem value="swaraj">Swaraj</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <div>
                <label className="block mb-1">User Type</label>
                <Select
                  value={formData.userType}
                  onValueChange={(value) => handleSelectChange('userType', value)}
                  required
                >
                  <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-md">
                    <SelectValue placeholder="User Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>User Type</SelectLabel>
                      <SelectItem value="inmate">Inmate</SelectItem>
                      <SelectItem value="guest">Guest</SelectItem>
                      <SelectItem value="outmess">Outmess</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {(formData.userType === 'inmate' || formData.userType === 'guest') && (
                <>
                  <div>
                    <label className="block mb-1">Hostel ID </label>
                    <Input
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      id="hostelID"
                      placeholder="Hostel ID"
                      value={formData.hostelID}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Room Number</label>
                    <Input
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      id="roomNumber"
                      placeholder="Room Number"
                      value={formData.roomNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}
            </div>
            <div>
              <label className="block  mb-1">Claim</label>
              <Select
                value={formData.claim}
                onValueChange={(value) => handleSelectChange('claim', value)}
                required
              >
                <SelectTrigger >
                  <SelectValue placeholder="Claim" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Claim</SelectLabel>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {(formData.claim === 'Yes') && (
              <div>
                <label className="block  mb-1">Category</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                  required
                >
                  <SelectTrigger >
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Category</SelectLabel>
                      <SelectItem value="sc">SC</SelectItem>
                      <SelectItem value="st">ST</SelectItem>
                      <SelectItem value="oec">OEC</SelectItem>
                      <SelectItem value="obh">OBH</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
            {(formData.category === 'other') && (
              <>
                <div>
                  <label className="block mb-1"> Other </label>
                  <Input
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    id="other"
                    placeholder="Other"
                    value={formData.other}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}
            <div>
              <label className="block  mb-1">Caution (Transaction ID)</label>
              <Input
                className=" w-full px-4 py-2 border border-gray-300 rounded-md"
                id="caution"
                placeholder="Caution"
                value={formData.caution}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex justify-center ">
              <Button
                type="submit"
                disabled={isLoading}
                className={`mb-5 w-1/2 px-4 py-2 font-bold rounded-md ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
                  } text-white`}
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="flex flex-col items-center">
            <Button onClick={handleGoogleSignIn} className="mt-5 py-2 px-4 rounded mb-1 flex items-center">
              <Image
                src={Img}
                alt="Google"
                className="w-5 h-5 mr-2" // Adjust size as needed
              />
              <span>Sign up with Google</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Page;