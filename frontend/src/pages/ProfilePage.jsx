import React from "react";
import UserProfile from "../components/UserProfile";
import { useAuth } from "../context/AuthContext"; 

const ProfilePage = () => {
  const { user } = useAuth(); 

  if (!user) return <div>Loading...</div>; 

  return (
    <div className="p-4">
      <UserProfile user={user} />
    </div>
  );
};

export default ProfilePage;
