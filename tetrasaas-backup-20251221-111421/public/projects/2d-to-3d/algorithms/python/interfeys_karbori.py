from گسترش_پایگاه_داده import NatiqMosatalah

def interfeys():
    natiq = NatiqMosatalah()
    
    print("🎯 **رابط کاربری نطق مصطلح**")
    print("=" * 40)
    
    while True:
        print("\n1. جستجوی عبارت")
        print("2. نمایش آمار")
        print("3. خروج")
        
        entekhab = input("\nانتخاب کنید (1-3): ")
        
        if entekhab == "1":
            kalame = input("عبارت مورد جستجو: ")
            natije = natiq.jostojo(kalame)
            
            if natije:
                print(f"\n🔍 {len(natije)} نتیجه پیدا شد:")
                for daste, mohتava in natije.items():
                    print(f"\n📂 {daste}:")
                    for ebarat, etelaat in mohتava.items():
                        print(f"   ✨ {ebarat}")
                        print(f"      معنی: {etelaat['mani']}")
                        print(f"      مثال: {etelaat.get('mesal', 'ندارد')}")
            else:
                print("❌ هیچ نتیجه‌ای یافت نشد")
                
        elif entekhab == "2":
            print(f"\n📊 آمار پایگاه داده:")
            print(f"   تعداد کل عبارات: {natiq.dadeha['etelaat_paygah']['tedad_ebarat']}")
            for daste, mohتava in natiq.dadeha.items():
                if daste != "etelaat_paygah":
                    print(f"   {daste}: {len(mohتava)} عبارت")
                    
        elif entekhab == "3":
            print("👋 خدانگهدار!")
            break
        else:
            print("❌ انتخاب نامعتبر")

if __name__ == "__main__":
    interfeys()
