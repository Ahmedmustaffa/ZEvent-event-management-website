"use client";
import { useAuth } from "@/src/context/AuthContext";
import { Avatar, Card, Button, Badge } from "flowbite-react";
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex grow items-center justify-center">
        Loading Profile...
      </div>
    );
  if (!user)
    return (
      <div className="p-10 text-center">Please login to view your profile.</div>
    );

  return (
    <main className="flex grow flex-col items-center bg-gray-50 p-8 dark:bg-gray-900">
      <Card className="w-full max-w-2xl">
        <div className="flex flex-col items-center pb-10">
          <Avatar
            img={user.avatar || "/usericon.svg"}
            size="xl"
            rounded
            className="mb-4"
          />
          <h5 className="mb-1 text-2xl font-medium text-gray-900 dark:text-white">
            {user.fullName}
          </h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {user.email}
          </span>

          <div className="mt-4 flex gap-2">
            <Badge color={user.role === "admin" ? "purple" : "gray"}>
              {user.role.toUpperCase()}
            </Badge>
          </div>

          <div className="mt-8 w-full border-t border-gray-200 pt-6 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h6 className="text-lg font-bold dark:text-white">
                Account Details
              </h6>
              <Link href="/my/profile/edit">
                <Button size="sm" color="gray">
                  <HiPencilAlt className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">First Name</p>
                <p className="font-medium dark:text-white">{user.firstName}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Name</p>
                <p className="font-medium dark:text-white">{user.lastName}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium dark:text-white">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}
