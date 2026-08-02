from گسترش_پایگاه_داده import NatiqMosatalah

natiq = NatiqMosatalah()

print("🧪 تست جامع سیستم نطق مصطلح")
print("=" * 35)

test_ha = ["درد", "کبوتر", "ماهی", "رنج", "تازه"]

for test in test_ha:
    print(f"\n🔍 جستجوی '{test}':")
    natije = natiq.jostojo(test)
    if natije:
        for daste in natije:
            print(f"   📂 {daste}: {len(natije[daste])} نتیجه")
    else:
        print("   ❌ نتیجه‌ای یافت نشد")

print(f"\n🎯 پایگاه داده نهایی: {natiq.dadeha['etelaat_paygah']['tedad_ebarat']} عبارت")
