# 📚 گسترش پایگاه داده نطق مصطلح به صورت حرفه‌ای

import json
import random
from datetime import datetime

class NatiqMosatalah:
    def __init__(self):
        self.bargiri_paygah_dade()
    
    def bargiri_paygah_dade(self):
        try:
            with open('paygah_dade_azim.json', 'r', encoding='utf-8') as f:
                self.dadeha = json.load(f)
            print("✅ پایگاه داده بارگیری شد")
        except:
            self.dadeha = self.ijad_paygah_dade_pishfarz()
            print("🆕 پایگاه داده جدید ایجاد شد")
    
    def ijad_paygah_dade_pishfarz(self):
        return {
            "etelaat_paygah": {
                "name": "نطق مصطلح - نسخه طلایی",
                "tarikh_ijad": str(datetime.now()),
                "tedad_ebarat": 0,
                "version": "2.0.0"
            },
            "estelahat": {},
            "zarbolmasalha": {},
            "tabirat": {},
            "kenayeha": {},
            "ashare_mardomi": {}
        }
    
    def afzoodan_ebarat_jadid(self, daste, ebarat, etelaat):
        if daste not in self.dadeha:
            self.dadeha[daste] = {}
        
        self.dadeha[daste][ebarat] = etelaat
        self.dadeha["etelaat_paygah"]["tedad_ebarat"] += 1
        
        print(f"✅ '{ebarat}' به دسته '{daste}' اضافه شد")
    
    def zakhire_paygah_dade(self):
        with open('paygah_dade_azim.json', 'w', encoding='utf-8') as f:
            json.dump(self.dadeha, f, ensure_ascii=False, indent=2)
        print("💾 پایگاه داده ذخیره شد")
    
    def jostojo(self, ebarat):
        results = {}
        for daste, mohتava in self.dadeha.items():
            if daste != "etelaat_paygah":
                for key, value in mohتava.items():
                    if ebarat in key or any(ebarat in str(v) for v in value.values()):
                        if daste not in results:
                            results[daste] = {}
                        results[daste][key] = value
        return results

# ایجاد نمونه و افزودن داده‌های غنی
natiq = NatiqMosatalah()

# افزودن اصطلاحات جدید
estelahat_jadid = [
    {
        "ebarat": "ان شاء الله",
        "daste": "estelahat",
        "etelaat": {
            "mani": "اگر خدا بخواهد (بیان امیدواری و توکل)",
            "karbord": "دعا، امید، برنامه‌ریزی آینده",
            "freakvens": 100,
            "mesal": "ان شاء الله فردا می‌بینمت",
            "ehsas": "مثبت"
        }
    },
    {
        "ebarat": "دستش درد نکند", 
        "daste": "estelahat",
        "etelaat": {
            "mani": "آفرین، زحمت کشیدی",
            "karbord": "تشکر و قدردانی",
            "freakvens": 89,
            "mesal": "دستت درد نکند که این غذا را درست کردی",
            "ehsas": "قدردانی"
        }
    }
]

for estelah in estelahat_jadid:
    natiq.afzoodan_ebarat_jadid(estelah["daste"], estelah["ebarat"], estelah["etelaat"])

# ذخیره پایگاه داده گسترش یافته
natiq.zakhire_paygah_dade()

print(f"\n🎉 پایگاه داده نطق مصطلح با {natiq.dadeha['etelaat_paygah']['tedad_ebarat']} عبارت غنی شد!")
print("📚 حالا می‌توانی هزاران عبارت دیگر اضافه کنی!")
