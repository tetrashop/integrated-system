import os
import json
from pathlib import Path

def analyze_projects(root_dir):
    projects = []
    
    # اگر پوشه پروژه‌ها وجود ندارد، نمونه‌سازی کنیم
    if not os.path.exists(root_dir):
        print("⚠️  پوشه پروژه‌ها یافت نشد. ایجاد پوشه نمونه...")
        os.makedirs(root_dir, exist_ok=True)
        
        # ایجاد چند پروژه نمونه
        samples = {
            "web-app": ["index.html", "style.css", "app.js"],
            "node-api": ["package.json", "server.js", "api.js"],
            "dashboard": ["index.html", "dashboard.js", "config.json"],
            "utility": ["utility.py", "README.md"]
        }
        
        for name, files in samples.items():
            proj_dir = os.path.join(root_dir, name)
            os.makedirs(proj_dir, exist_ok=True)
            
            for file in files:
                file_path = os.path.join(proj_dir, file)
                with open(file_path, 'w') as f:
                    if file == "index.html":
                        f.write(f'''<!DOCTYPE html>
<html>
<head><title>{name}</title></head>
<body><h1>پروژه {name}</h1></body>
</html>''')
                    elif file == "package.json":
                        f.write(json.dumps({
                            "name": name,
                            "version": "1.0.0",
                            "main": "server.js"
                        }, indent=2))
                    elif file.endswith(".js"):
                        f.write(f'console.log("پروژه {name} اجرا شد");')
    
    # تحلیل پروژه‌های موجود
    for item in Path(root_dir).iterdir():
        if item.is_dir():
            proj_info = {
                "name": item.name,
                "path": str(item),
                "has_index": (item / "index.html").exists(),
                "has_package": (item / "package.json").exists(),
                "has_server": (item / "server.js").exists(),
                "files": []
            }
            
            # بررسی فایل‌ها
            for file in item.rglob("*"):
                if file.is_file():
                    rel_path = str(file.relative_to(item))
                    proj_info["files"].append(rel_path)
            
            # تعیین نوع پروژه
            if proj_info["has_index"] and proj_info["has_package"]:
                proj_info["type"] = "fullstack"
            elif proj_info["has_index"]:
                proj_info["type"] = "web"
            elif proj_info["has_package"]:
                proj_info["type"] = "node"
            else:
                proj_info["type"] = "utility"
            
            projects.append(proj_info)
    
    return projects

if __name__ == "__main__":
    projects = analyze_projects("/data/data/com.termux/files/home/tetrashop-projects")
    
    print(f"✅ تعداد پروژه‌ها: {len(projects)}")
    
    # ذخیره به JSON
    with open("projects_analysis.json", "w", encoding="utf-8") as f:
        json.dump(projects, f, ensure_ascii=False, indent=2)
    
    # خروجی برای اسکریپت Shell
    for proj in projects:
        print(f"PROJECT:{proj['name']}:{proj['type']}:{proj['has_index']}:{proj['has_package']}")
