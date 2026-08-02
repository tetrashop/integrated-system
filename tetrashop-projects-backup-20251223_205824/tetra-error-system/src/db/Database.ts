// فایل: src/db/Database.ts
// شبیه‌ساز پایگاه داده برای محیط توسعه

export class Database {
    private static data: Record<string, any[]> = {};

    static async insert(collection: string, record: any): Promise<void> {
        if (!this.data[collection]) {
            this.data[collection] = [];
        }
        this.data[collection].push(record);
    }

    static async update(collection: string, id: string, updates: any): Promise<void> {
        if (!this.data[collection]) return;
        
        const index = this.data[collection].findIndex(item => item.id === id);
        if (index !== -1) {
            this.data[collection][index] = { ...this.data[collection][index], ...updates };
        }
    }

    static async query(collection: string, query: any): Promise<any[]> {
        if (!this.data[collection]) return [];
        
        return this.data[collection].filter(item => {
            for (const key in query) {
                if (key === '$gte') {
                    if (item.timestamp < query[key]) return false;
                } else if (item[key] !== query[key]) {
                    return false;
                }
            }
            return true;
        });
    }

    static async clear(collection: string): Promise<void> {
        this.data[collection] = [];
    }
}
