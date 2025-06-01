import React, { useEffect, useState } from "react";
import { fetchDataV2 } from "../../../apiUtils";
import TopBar from "../../sections/TopBar"
import Sidebar from "../../sections/Sidebar"

const DashboardAdmin = () => {
  const [Errors, setErrors] = useState();
  const [userData, setUserData] = useState();

  useEffect(() => {
    const parameter = {
      url: "/api/user_profile/",
      setErrors: setErrors,
      setterFunction: setUserData,
    };
    fetchDataV2(parameter);
  }, []);

  return (
    <div className="flex h-screen">

      <Sidebar/>

      {/* Main Content Area */}
      <main className="flex-1 bg-white">

        <TopBar />

        <div className="main_section bg-red-100 p-4 overflow-y-scroll ">

          <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#9E286A]">Admin Dashboard</h1>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userData?.map((user, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
              >
                <h3 className="font-semibold text-[#9E286A]">{user.first_name}  {user.last_name}</h3>
                <p className="text-sm text-gray-600">
                  {user.dob}
                </p>
                <p className="text-sm text-gray-600">
                  {user.gender}
                </p><p className="text-sm text-gray-600">
                  {user.martial_status}
                </p>
              </div>
            ))}
          </section>


        </div>

      </main>
    </div>
  );
};

export default DashboardAdmin;
