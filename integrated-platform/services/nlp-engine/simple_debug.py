"""
اسکریپت ساده اشکال\u200cیابی - نسخه Termux بدون نیاز به نصب بسته اضافی
ورودی: nlp-project-all-code.txt
خروجی: debug_report.txt
"""
import os
import re
import subprocess
import sys
import tempfile
import ast
import tokenize
from pathlib import Path
INPUT_FILE = 'nlp-project-all-code.txt'
OUTPUT_REPORT = 'debug_report.txt'
TEMP_DIR = tempfile.mkdtemp(prefix='nlp_')

def extract_files(input_path, out_dir):
    print('[*] استخراج فایل\u200cها...')
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()
    pattern = '^=====\\s+(.*?)\\s+=====\\n'
    parts = re.split('\\n(?=====.*?=====\\n)', content, flags=re.MULTILINE)
    count = 0
    for part in parts:
        part = part.strip()
        if not part:
            continue
        header = re.match(pattern, part)
        if not header:
            continue
        rel_path = header.group(1).strip()
        code_start = part.index('\n') + 1
        code = part[code_start:]
        dest = Path(out_dir) / rel_path.lstrip(os.sep)
        dest.parent.mkdir(parents=True, exist_ok=True)
        with open(dest, 'w', encoding='utf-8') as fout:
            fout.write(code)
        count += 1
    print(f'[+] {count} فایل استخراج شد.')
    return count

def check_python(file_path):
    """بررسی فایل پایتون با استفاده از ast و tokenize"""
    issues = []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            source = f.read()
        ast.parse(source, filename=str(file_path))
        with open(file_path, 'rb') as f:
            try:
                list(tokenize.tokenize(f.readline))
            except tokenize.TokenError as e:
                issues.append(f'TokenError: {e}')
        if not issues:
            return None
    except SyntaxError as e:
        issues.append(f'SyntaxError: {e}')
    except Exception as e:
        issues.append(f'خطای ناشناخته: {e}')
    return issues

def check_shell(file_path):
    """بررسی فایل shell با استفاده از bash (یافتن خودکار مسیر)"""
    bash_path = None
    for cmd in ['bash', '/usr/bin/bash', '/bin/bash', '/system/bin/bash']:
        if Path(cmd).exists() or subprocess.run(['which', cmd], capture_output=True).returncode == 0:
            bash_path = cmd
            break
    if not bash_path:
        return ['bash یافت نشد، بررسی انجام نشد']
    try:
        result = subprocess.run([bash_path, '-n', str(file_path)], capture_output=True, text=True, timeout=10)
        if result.stderr.strip():
            return [result.stderr.strip()]
        return None
    except Exception as e:
        return [f'خطا در اجرای bash: {e}']

def main():
    extract_files(INPUT_FILE, TEMP_DIR)
    report = []
    print('[*] شروع بررسی فایل\u200cها...')
    for root, dirs, files in os.walk(TEMP_DIR):
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        for file in files:
            file_path = Path(root) / file
            rel = file_path.relative_to(TEMP_DIR)
            ext = file_path.suffix
            issues = None
            if ext == '.py':
                issues = check_python(file_path)
            elif ext in ('.sh', '.bash'):
                issues = check_shell(file_path)
            else:
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    if '\x00' in content:
                        issues = ['وجود کاراکتر null (باینری)']
                except Exception as e:
                    issues = [f'خطا در خواندن فایل: {e}']
            if issues:
                report.append(f'--- {rel} ---')
                report.extend(issues)
                report.append('')
    if report:
        with open(OUTPUT_REPORT, 'w', encoding='utf-8') as f:
            f.write('\n'.join(report))
        print(f'[+] گزارش در {OUTPUT_REPORT} ذخیره شد.')
    else:
        print('[+] هیچ مشکلی شناسایی نشد (یا فقط فایل\u200cهای غیرقابل بررسی وجود داشت).')
    print(f'پوشه موقت: {TEMP_DIR}')
if __name__ == '__main__':
    main()