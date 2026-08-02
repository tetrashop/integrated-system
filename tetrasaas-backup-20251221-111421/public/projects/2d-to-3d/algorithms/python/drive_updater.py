#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import json
import hashlib
from datetime import datetime
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload
import io

class GoogleDriveUpdater:
    def __init__(self, credentials_file, folder_id):
        self.SCOPES = ['https://www.googleapis.com/auth/drive']
        self.credentials_file = credentials_file
        self.folder_id = folder_id
        self.service = self.authenticate()
    
    def authenticate(self):
        """احراز هویت امن با Google Drive API"""
        try:
            if not os.path.exists(self.credentials_file):
                print(f"❌ فایل احراز هویت یافت نشد: {self.credentials_file}")
                return None
                
            creds = service_account.Credentials.from_service_account_file(
                self.credentials_file, scopes=self.SCOPES
            )
            print("✅ احراز هویت با موفقیت انجام شد")
            return build('drive', 'v3', credentials=creds)
        except Exception as e:
            print(f"❌ خطا در احراز هویت: {e}")
            return None
    
    def get_drive_files(self):
        """دریافت لیست فایل‌های موجود در پوشه A"""
        try:
            results = self.service.files().list(
                q=f"'{self.folder_id}' in parents and trashed=false",
                spaces='drive',
                fields='files(id, name, md5Checksum, modifiedTime)',
                pageSize=100
            ).execute()
            
            files = {}
            for file in results.get('files', []):
                files[file['name']] = {
                    'id': file['id'],
                    'hash': file.get('md5Checksum', ''),
                    'modified': file['modifiedTime']
                }
            
            print(f"✅ {len(files)} فایل در پوشه A یافت شد")
            return files
            
        except Exception as e:
            print(f"❌ خطا در دریافت لیست فایل‌ها: {e}")
            return {}
    
    def calculate_file_hash(self, file_path):
        """محاسبه هش MD5 برای کنترل یکپارچگی"""
        try:
            hash_md5 = hashlib.md5()
            with open(file_path, "rb") as f:
                for chunk in iter(lambda: f.read(4096), b""):
                    hash_md5.update(chunk)
            return hash_md5.hexdigest()
        except Exception as e:
            print(f"❌ خطا در محاسبه هش فایل {file_path}: {e}")
            return ""
    
    def scan_local_changes(self, local_path):
        """اسکن تغییرات محلی"""
        print(f"🔍 در حال اسکن مسیر محلی: {local_path}")
        
        changes = {
            'new_files': [],
            'modified_files': [],
            'deleted_files': []
        }
        
        if not os.path.exists(local_path):
            print(f"❌ مسیر محلی وجود ندارد: {local_path}")
            return changes
        
        # محاسبه هش فایل‌های محلی
        local_files = {}
        for root, dirs, files in os.walk(local_path):
            for file in files:
                file_path = os.path.join(root, file)
                file_hash = self.calculate_file_hash(file_path)
                if file_hash:  # فقط فایل‌های قابل خواندن
                    local_files[file] = {
                        'path': file_path,
                        'hash': file_hash,
                        'modified': os.path.getmtime(file_path),
                        'size': os.path.getsize(file_path)
                    }
        
        print(f"📁 {len(local_files)} فایل محلی یافت شد")
        
        # مقایسه با فایل‌های موجود در درایو
        drive_files = self.get_drive_files()
        
        for file_name, local_info in local_files.items():
            if file_name not in drive_files:
                changes['new_files'].append(local_info)
                print(f"🆕 فایل جدید شناسایی شد: {file_name}")
            else:
                if local_info['hash'] != drive_files[file_name]['hash']:
                    changes['modified_files'].append(local_info)
                    print(f"📝 فایل تغییر یافته: {file_name}")
        
        # شناسایی فایل‌های حذف شده
        for file_name in drive_files:
            if file_name not in local_files:
                changes['deleted_files'].append(file_name)
                print(f"🗑️ فایل حذف شده از محلی: {file_name}")
        
        return changes
    
    def upload_file(self, file_path, file_name):
        """آپلود امن فایل به پوشه A"""
        try:
            print(f"⬆️ در حال آپلود: {file_name}")
            
            file_metadata = {
                'name': file_name,
                'parents': [self.folder_id]
            }
            
            media = MediaFileUpload(
                file_path,
                mimetype='application/octet-stream',
                resumable=True
            )
            
            file = self.service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id, name, size'
            ).execute()
            
            print(f"✅ فایل {file_name} با موفقیت آپلود شد (ID: {file['id']})")
            return file
            
        except Exception as e:
            print(f"❌ خطا در آپلود {file_name}: {e}")
            return None
    
    def update_existing_file(self, file_id, file_path, file_name):
        """به‌روزرسانی فایل موجود"""
        try:
            print(f"🔄 در حال به‌روزرسانی: {file_name}")
            
            media = MediaFileUpload(
                file_path,
                mimetype='application/octet-stream',
                resumable=True
            )
            
            updated_file = self.service.files().update(
                fileId=file_id,
                media_body=media,
                fields='id, name, size'
            ).execute()
            
            print(f"✅ فایل {file_name} به‌روزرسانی شد")
            return updated_file
            
        except Exception as e:
            print(f"❌ خطا در به‌روزرسانی فایل {file_name}: {e}")
            return None
    
    def create_version_backup(self, file_id, file_name):
        """ایجاد نسخه پشتیبان قبل از به‌روزرسانی"""
        try:
            print(f"💾 ایجاد پشتیبان برای: {file_name}")
            
            request = self.service.files().get_media(fileId=file_id)
            backup_dir = "drive_backups"
            os.makedirs(backup_dir, exist_ok=True)
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_path = os.path.join(backup_dir, f"{timestamp}_{file_name}")
            
            with open(backup_path, 'wb') as f:
                downloader = MediaIoBaseDownload(f, request)
                done = False
                while not done:
                    status, done = downloader.next_chunk()
                    if status:
                        print(f"📥 در حال دانلود پشتیبان: {int(status.progress() * 100)}%")
            
            print(f"✅ نسخه پشتیبان ایجاد شد: {backup_path}")
            return backup_path
            
        except Exception as e:
            print(f"⚠️ خطا در ایجاد پشتیبان: {e}")
            return None
    
    def sync_folder(self, local_path):
        """همگام‌سازی کامل پوشه"""
        print("🔄 شروع فرآیند همگام‌سازی...")
        
        changes = self.scan_local_changes(local_path)
        
        # آپلود فایل‌های جدید
        for file_info in changes['new_files']:
            file_name = os.path.basename(file_info['path'])
            self.upload_file(file_info['path'], file_name)
        
        # به‌روزرسانی فایل‌های تغییر کرده
        drive_files = self.get_drive_files()
        for file_info in changes['modified_files']:
            file_name = os.path.basename(file_info['path'])
            if file_name in drive_files:
                # ایجاد پشتیبان قبل از به‌روزرسانی
                self.create_version_backup(
                    drive_files[file_name]['id'], 
                    file_name
                )
                # به‌روزرسانی فایل
                self.update_existing_file(
                    drive_files[file_name]['id'],
                    file_info['path'],
                    file_name
                )
        
        print("✅ همگام‌سازی کامل شد")
        return changes
    
    def generate_sync_report(self, changes):
        """تولید گزارش همگام‌سازی"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'sync_summary': {
                'new_files_uploaded': len(changes['new_files']),
                'files_updated': len(changes['modified_files']),
                'missing_files': len(changes['deleted_files'])
            },
            'details': {
                'new_files': [os.path.basename(f['path']) for f in changes['new_files']],
                'updated_files': [os.path.basename(f['path']) for f in changes['modified_files']],
                'missing_files': changes['deleted_files']
            }
        }
        
        # ذخیره گزارش
        report_file = f"sync_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"📊 گزارش همگام‌سازی در {report_file} ذخیره شد")
        return report

def main():
    """اسکریپت اصلی به‌روزرسانی پوشه A"""
    
    print("🚀 راه‌اندازی سیستم به‌روزرسانی Google Drive")
    print("=" * 50)
    
    # تنظیمات - این مقادیر باید تنظیم شوند
    CREDENTIALS_FILE = "credentials.json"  # فایل احراز هویت
    FOLDER_ID = "YOUR_FOLDER_ID_HERE"  # ID پوشه A
    LOCAL_PATH = "."  # مسیر فایل‌های محلی (پوشه جاری)
    
    # بررسی فایل احراز هویت
    if not os.path.exists(CREDENTIALS_FILE):
        print("""
❌ فایل credentials.json یافت نشد!

لطفاً مراحل زیر را انجام دهید:

1. به Google Cloud Console بروید: https://console.cloud.google.com/
2. یک پروژه جدید ایجاد کنید یا از پروژه موجود استفاده کنید
3. Google Drive API را فعال کنید
4. از بخش "Credentials" یک Service Account ایجاد کنید
5. کلید JSON را دانلود و در این پوشه با نام credentials.json ذخیره کنید
6. فایل credentials.json را با ایمیل سرویس اکانت در پوشه A به اشتراک بگذارید
        """)
        return
    
    # بررسی Folder ID
    if FOLDER_ID == "YOUR_FOLDER_ID_HERE":
        print("""
❌ Folder ID تنظیم نشده!

لطفاً مراحل زیر را انجام دهید:

1. به پوشه A در Google Drive بروید
2. آدرس URL را کپی کنید. مثال:
   https://drive.google.com/drive/folders/1ABCdEfGHIjKlMnOpQRsTuvWxYZ
3. قسمت آخر URL (بعد از /folders/) را به عنوان FOLDER_ID در کد قرار دهید
        """)
        return
    
    # ایجاد نمونه به‌روزرسان
    updater = GoogleDriveUpdater(CREDENTIALS_FILE, FOLDER_ID)
    
    if updater.service is None:
        print("❌ خطا در راه‌اندازی سرویس Google Drive")
        return
    
    # اجرای همگام‌سازی
    changes = updater.sync_folder(LOCAL_PATH)
    
    # تولید گزارش
    report = updater.generate_sync_report(changes)
    
    print("\n🎉 عملیات به‌روزرسانی با موفقیت انجام شد")
    print("=" * 50)
    print(f"📁 فایل‌های جدید آپلود شده: {report['sync_summary']['new_files_uploaded']}")
    print(f"🔄 فایل‌های به‌روزرسانی شده: {report['sync_summary']['files_updated']}")
    print(f"⚠️  فایل‌های مفقوده: {report['sync_summary']['missing_files']}")
    print("=" * 50)

if __name__ == "__main__":
    main()
