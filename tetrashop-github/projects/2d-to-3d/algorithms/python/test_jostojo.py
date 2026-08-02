from گسترش_پایگاه_داده import NatiqMosatalah

natiq = NatiqMosatalah()
natije = natiq.jostojo("درد")

print("🔍 نتایج جستجو برای 'درد':")
for daste, mohتava in natije.items():
    print(f"\n📂 {daste}:")
    for ebarat, etelaat in mohتava.items():
        print(f"   ✨ {ebarat}: {etelaat['mani']}")
