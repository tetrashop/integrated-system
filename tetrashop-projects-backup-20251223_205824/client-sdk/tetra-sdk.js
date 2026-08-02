class TetraSaaS {
  constructor(apiKey, baseURL = 'http://localhost:3000') {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }

  async request(service, action, data = {}) {
    try {
      const response = await fetch(`${this.baseURL}/api/${service}/${action}`, {
        method: 'POST',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calling TetraSaaS API:', error);
      throw error;
    }
  }

  // ==================== سرویس‌های پرکاربرد ====================

  // تحلیل متن (NLP)
  async analyzeText(text, options = {}) {
    return this.request('content', 'analyze', {
      text,
      language: options.language || 'fa',
      detailed: options.detailed || false
    });
  }

  // حل فرمول ریاضی
  async solveFormula(formula, variables = {}) {
    return this.request('formula', 'solve', {
      formula,
      variables,
      precision: 6
    });
  }

  // تولید محتوا با هوش مصنوعی
  async generateContent(prompt, options = {}) {
    return this.request('ai', 'write', {
      prompt,
      length: options.length || 'medium',
      style: options.style || 'professional',
      language: options.language || 'fa'
    });
  }

  // تبدیل 3D
  async convert3D(model, options = {}) {
    return this.request('3d', 'convert', {
      model,
      format: options.format || 'glb',
      quality: options.quality || 'high'
    });
  }

  // رمزگذاری داده
  async encryptData(data, algorithm = 'aes-256') {
    return this.request('security', 'encrypt', {
      data,
      algorithm
    });
  }

  // پردازش تصویر
  async processImage(imageUrl, operation = 'analyze') {
    return this.request('image', 'process', {
      image_url: imageUrl,
      operation
    });
  }

  // ==================== ابزارهای کمکی ====================

  // دریافت وضعیت Gateway
  async getGatewayStatus() {
    const response = await fetch(`${this.baseURL}/health`);
    return response.json();
  }

  // دریافت لیست سرویس‌ها
  async listServices() {
    const response = await fetch(`${this.baseURL}/services`);
    return response.json();
  }

  // تست اتصال
  async ping() {
    const start = Date.now();
    await this.getGatewayStatus();
    const latency = Date.now() - start;
    return { connected: true, latency: `${latency}ms` };
  }

  // ==================== مدیریت اعتبار ====================

  async getUsageStats() {
    // این endpoint نیاز به پیاده‌سازی در Gateway دارد
    try {
      return await this.request('user', 'stats');
    } catch {
      return { message: 'Endpoint مدیریت اعتبار در حال توسعه است' };
    }
  }
}

// نمونه‌های کد برای استفاده
const tetra = new TetraSaaS('apikey_user_free_123');

// مثال استفاده ۱: تحلیل متن
async function example1() {
  const result = await tetra.analyzeText('این یک متن نمونه برای تحلیل است.');
  console.log('نتیجه تحلیل:', result);
  return result;
}

// مثال استفاده ۲: حل فرمول
async function example2() {
  const result = await tetra.solveFormula('x^2 + 2x + 1', { x: 3 });
  console.log('نتیجه فرمول:', result);
  return result;
}

// مثال استفاده ۳: بررسی وضعیت
async function example3() {
  const status = await tetra.ping();
  console.log('وضعیت اتصال:', status);
  return status;
}

module.exports = TetraSaaS;
