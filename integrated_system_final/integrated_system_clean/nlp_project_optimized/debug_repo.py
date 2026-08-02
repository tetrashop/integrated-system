"""
اشکال\u200cیابی فایل\u200cهای یک مخزن Git به صورت مستقیم (نسخه Termux)
ورودی: پوشهٔ جاری (مخزن)
خروجی: debug_report.txt
پیش\u200cنیاز: فقط پایتون ۳ (بدون نیاز به نصب بسته)
"""
import os
import re
import subprocess
import sys
import ast
import tokenize
from pathlib import Path
REPO_DIR = '.'
OUTPUT_REPORT = 'debug_report.txt'
EXTENSIONS = {'.py': 'python', '.sh': 'shell', '.bash': 'shell'}

def find_bash():
    """پیدا کردن bash در سیستم (Termux یا لینوکس معمولی)"""
    for candidate in ['bash', '/usr/bin/bash', '/bin/bash', '/system/bin/bash']:
        if Path(candidate).exists() or subprocess.run(['which', candidate], capture_output=True, text=True).returncode == 0:
            return candidate
    return None

def check_python_file(file_path):
    """بررسی خطاهای نحوی و indent پایتون"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            source = f.read()
        ast.parse(source, filename=str(file_path))
        with open(file_path, 'rb') as f:
            try:
                list(tokenize.tokenize(f.readline))
            except tokenize.TokenError as e:
                return [f'TokenError: {e}']
        return None
    except SyntaxError as e:
        return [f'SyntaxError: {e}']
    except Exception as e:
        return [f'خطا: {e}']

def check_shell_file(file_path, bash_path):
    """بررسی نحوی با bash -n"""
    if not bash_path:
        return ['bash یافت نشد']
    try:
        r = subprocess.run([bash_path, '-n', str(file_path)], capture_output=True, text=True, timeout=10)
        if r.stderr.strip():
            return [r.stderr.strip()]
        return None
    except Exception as e:
        return [f'خطای اجرای bash: {e}']

def main():
    bash_path = find_bash()
    if not bash_path:
        print('[!] هشدار: bash پیدا نشد — فایل\u200cهای sh بررسی نمی\u200cشوند.')
    else:
        print(f'[*] bash در مسیر {bash_path} یافت شد.')
    print(f"[*] پیمایش مخزن '{os.path.abspath(REPO_DIR)}' ...")
    report_lines = []
    examined = 0
    for root, dirs, files in os.walk(REPO_DIR):
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        for file in files:
            ext = Path(file).suffix
            if ext not in EXTENSIONS:
                continue
            file_path = Path(root) / file
            rel = file_path.relative_to(REPO_DIR)
            if EXTENSIONS[ext] == 'python':
                issues = check_python_file(file_path)
            elif EXTENSIONS[ext] == 'shell':
                issues = check_shell_file(file_path, bash_path)
            else:
                continue
            if issues:
                report_lines.append(f'--- {rel} ---')
                report_lines.extend(issues)
                report_lines.append('')
            examined += 1
    if report_lines:
        with open(OUTPUT_REPORT, 'w', encoding='utf-8') as f:
            f.write('\n'.join(report_lines))
        print(f"[+] {examined} فایل بررسی شدند. گزارش در '{OUTPUT_REPORT}' ذخیره شد.")
    else:
        print(f'[+] {examined} فایل بررسی شدند و هیچ مشکلی یافت نشد.')
if __name__ == '__main__':
    main()