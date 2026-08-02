import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            به Tetrashop100 خوش آمدید
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            تجربه‌ای جدید از خرید آنلاین با امنیت، سرعت و کیفیت بی‌نظیر
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/products"
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all flex items-center space-x-2 space-x-reverse text-lg font-semibold"
          >
            <span>مشاهده محصولات</span>
          </Link>
          {!user && (
            <Link
              to="/register"
              className="px-8 py-4 border border-gray-300 text-gray-600 rounded-xl hover:border-blue-500 hover:text-blue-500 transition-all"
            >
              ثبت نام رایگان
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: "⚡", title: "سرعت بالا", desc: "تجربه خرید سریع و روان" },
          {
            icon: "🔒",
            title: "امنیت",
            desc: "پرداخت امن با رمزگذاری پیشرفته",
          },
          { icon: "🚚", title: "تحویل سریع", desc: "ارسال به تمام نقاط کشور" },
        ].map((feature, index) => (
          <div
            key={index}
            className="text-center p-6 bg-white rounded-2xl shadow-lg"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
