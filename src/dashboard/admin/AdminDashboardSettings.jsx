import { useEffect, useState } from "react";
import { getMe } from "../../services/AuthService";
import { getuserbyid } from "../../services/AuthService";
export default function AdminDashboardSettings() {
  const [UserData, setUserData] = useState({});

  useEffect(() => {
    const fetchdata = async () => {
      const data = await getMe();
      const userData = await getuserbyid(data.userId);
      setUserData(userData);
    };

    fetchdata();
  }, []);


  return (
    <div className="bg-white rounded-2xl p-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Profile Details
      </h2>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl font-bold">
          {UserData?.name
            ?.split(" ")
            .slice(0, 2)
            .map((w) => w[0]?.toUpperCase())
            .join("")}
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-800">Admin</p>
          <p className="text-gray-500 text-sm">Administrator</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Full Name</label>
          <div className="bg-gray-100 rounded-xl px-4 py-3 text-gray-700">
            {UserData.name}
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Email</label>
          <div className="bg-gray-100 rounded-xl px-4 py-3 text-gray-700">
            {UserData.email}
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Phone</label>
          <div className="bg-gray-100 rounded-xl px-4 py-3 text-gray-700">
            +91 {UserData.phone}
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Role</label>
          <div className="bg-gray-100 rounded-xl px-4 py-3 text-gray-700">
            {UserData.role}
          </div>
        </div>
      </div>
    </div>
  );
}

