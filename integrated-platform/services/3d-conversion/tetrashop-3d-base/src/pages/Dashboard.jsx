import React from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">پنل کاربری</h1>
        <p className="text-gray-600">خوش آمدید {user?.name} 👋</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            اطلاعات کاربر
          </h3>
          <div className="space-y-2">
            <p>
              <strong>نام:</strong> {user?.name || "کاربر مهمان"}
            </p>
            <p>
              <strong>ایمیل:</strong> {user?.email || "ثبت نام نکرده‌اید"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">سبد خرید</h3>
          <p className="text-gray-600">سبد خرید شما خالی است</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            اقدامات سریع
          </h3>
          <div className="space-y-3">
            <button className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all">
              🛒 ادامه خرید
            </button>
            <button className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-all">
              💳 صفحه پرداخت
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
