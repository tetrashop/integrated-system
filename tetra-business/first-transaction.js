// بسم الله الرحمن الرحیم
// اولین تراکنش مالی Tetra Ecosystem

const firstTransaction = {
    id: "TXN_" + Date.now(),
    amount: 5000, // تومان
    type: "conversion_basic",
    customer: "First_Customer",
    timestamp: new Date(),
    status: "completed",
    note: "الشکر لله - اولین درآمد کسب‌وکار"
};

console.log("🎉 اولین تراکنش ثبت شد!");
console.log("💰 مبلغ:", firstTransaction.amount + " تومان");
console.log("🕒 زمان:", firstTransaction.timestamp.toLocaleString('fa-IR'));
console.log("📝 یادداشت:", firstTransaction.note);
console.log("🎯 الشکر لله رب العالمین");
