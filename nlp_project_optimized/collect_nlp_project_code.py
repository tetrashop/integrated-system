"""
ذخیره\u200cسازی تمام کدهای برنامه\u200cنویسی مخزن NLP در یک فایل متنی
"""
import os
import subprocess
import sys
REPO_URL = 'https://github.com/tetrashop/nlp-project.git'
LOCAL_DIR = './nlp-project'
BRANCH = 'main'
OUTPUT_FILE = 'nlp-project-all-code.txt'
EXTENSIONS = ['.py', '.js', '.jsx', '.ts', '.tsx', '.java', '.cpp', '.c', '.h', '.hpp', '.cs', '.rb', '.php', '.swift', '.go', '.rs', '.html', '.css', '.scss', '.less', '.json', '.xml', '.yaml', '.yml', '.sh', '.bash', '.sql', '.r', '.jl', '.scala', '.kt', '.dart', '.lua', '.m', '.mm']

def run_command(cmd):
    """اجرای یک دستور سیستم و بررسی خطا"""
    result = subprocess.run(cmd, shell=True, text=True)
    return result.returncode == 0

def main():
    if not os.path.isdir(LOCAL_DIR):
        print('در حال clone کردن مخزن...')
        if not run_command(f'git clone --branch {BRANCH} {REPO_URL} {LOCAL_DIR}'):
            print('خطا در clone کردن مخزن.')
            sys.exit(1)
        print('مخزن با موفقیت clone شد.')
    else:
        print('مخزن از قبل وجود دارد. در حال به\u200cروزرسانی...')
        os.chdir(LOCAL_DIR)
        run_command(f'git pull origin {BRANCH}')
        os.chdir('..')
    print('در حال جمع\u200cآوری فایل\u200cهای کد...')
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as out:
        for root, dirs, files in os.walk(LOCAL_DIR):
            dirs[:] = [d for d in dirs if not d.startswith('.')]
            for f in files:
                if any((f.endswith(ext) for ext in EXTENSIONS)):
                    full_path = os.path.join(root, f)
                    try:
                        with open(full_path, 'r', encoding='utf-8') as infile:
                            content = infile.read()
                        out.write(f'===== {full_path} =====\n')
                        out.write(content)
                        out.write('\n')
                    except Exception as e:
                        print(f'ناتوانی در خواندن {full_path}: {e}')
    print(f"فایل '{OUTPUT_FILE}' با موفقیت ایجاد شد.")
if __name__ == '__main__':
    main()