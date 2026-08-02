from گسترش_پایگاه_داده import NatiqMosatalah

natiq = NatiqMosatalah()

print("🧪 تست سیستم گسترش یافته نطق مصطلح")
print("=" * 45)

# تست جستجوهای مختلف
test_ha = [
    "عاقل", "ستون", "بار", "عصا", "قلب", 
    "آب", "پا", "آدم", "دست", "عضوی"
]

print(f"📚 پایگاه داده: {natiq.dadeha['etelaat_paygah']['tedad_ebarat']} عبارت")

for daste, mohتava in natiq.dadeha.items():
    if daste != "etelaat_paygah" and mohتava:
        print(f"📂 {daste}: {len(mohتava)} عبارت")

print(f"\n🔍 تست جستجو:")
for test in test_ha:
    natije = natiq.jostojo(test)
    tedad = sum(len(mohتava) for mohتava in natije.values())
    if tedad > 0:
        print(f"   ✅ '{test}': {tedad} نتیجه")
    else:
        print(f"   ❌ '{test}': نتیجه‌ای یافت نشد")

print(f"\n🎊 سیستم نطق مصطلح اکنون یک پایگاه داده جامع فارسی است!")
