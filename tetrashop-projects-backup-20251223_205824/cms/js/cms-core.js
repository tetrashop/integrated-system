// هسته مرکزی CMS TetraShop
class TetraCMS {
    constructor() {
        this.folders = ['root', 'public', 'projects'];
        this.currentFolder = 'root';
        this.files = {};
        this.init();
    }
    
    async init() {
        console.log('🚀 TetraCMS راه‌اندازی شد');
        await this.loadAllFolders();
        this.setupEventListeners();
    }
    
    async loadAllFolders() {
        try {
            // بارگذاری فایل‌ها از سرور
            const response = await fetch('/api/files');
            this.files = await response.json();
            this.updateUI();
        } catch (error) {
            console.error('خطا در بارگذاری:', error);
        }
    }
    
    updateUI() {
        // به‌روزرسانی رابط کاربری
        this.updateFileCounts();
        this.displayCurrentFolder();
    }
    
    updateFileCounts() {
        this.folders.forEach(folder => {
            const count = this.files[folder]?.length || 0;
            document.getElementById(`${folder}-count`).textContent = count;
        });
    }
    
    displayCurrentFolder() {
        const files = this.files[this.currentFolder] || [];
        // نمایش فایل‌ها در رابط کاربری
    }
}

// راه‌اندازی CMS
document.addEventListener('DOMContentLoaded', () => {
    window.tetraCMS = new TetraCMS();
});
