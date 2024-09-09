import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const Register = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">

      <Card className="max-w-md w-full p-4 mx-4 space-y-4">
        <CardHeader>
          <CardTitle>Registration Form</CardTitle>
          <CardDescription>
            Please fill in the form below to register.
          </CardDescription>
        </CardHeader>

        <CardContent>

          {/* name */}
          <div className="my-4">
            <label>Name</label>
            <Input
              className=" w-full px-4 py-2 border border-gray-300 rounded-md"
              id="name"
              // placeholder="Name"
              // value={}
              // onChange={}
              required
            />
          </div>

          {/* year of study */}
          <div className="my-4">
            <label>Year of Study</label>
            <Select
              // value={}
              // onValueChange={(value) => handleSelectChange('yearOfStudy', value)}
              required
            >
              <SelectTrigger className=" w-full px-4 py-2 border border-gray-300 rounded-md">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Year Of Study</SelectLabel>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* department */}
          <div className="my-4">
            <label>Department</label>
            <Select
              // value={}
              // onValueChange={(value) => handleSelectChange('yearOfStudy', value)}
              required
            >
              <SelectTrigger className=" w-full px-4 py-2 border border-gray-300 rounded-md">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Department</SelectLabel>
                  <SelectItem value="1">CS</SelectItem>
                  <SelectItem value="2">ME</SelectItem>
                  <SelectItem value="3">EE</SelectItem>
                  <SelectItem value="4">EC</SelectItem>
                  <SelectItem value="4">CE</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* phone number */}
          <div className="my-4">
            <label className="block  mb-1">Phone Number</label>
            <Input
              className=" w-full px-4 py-2 border border-gray-300 rounded-md"
              id="phoneNumber"
              type="tel" maxLength={10}
              // placeholder="Phone Number"
              // value={}
              // onChange={}
              required
            />
          </div>

          <div className="my-4">
            <Button
            className="w-full py-2 px-4 flex items-center justify-center"
              type="submit"
            // disabled={}
            >
              Submit
            </Button>
          </div>
        </CardContent>

      </Card>
    </div>
  )
}

export default Register