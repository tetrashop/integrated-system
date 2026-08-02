// Tetrashop Advanced API System
class TetrashopAdvancedAPI {
    constructor() {
        this.baseURL = window.location.origin;
        this.cache = new Map();
    }

    // Core API Methods
    async getAllAlgorithms() {
        const cacheKey = 'all-algorithms';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const response = await fetch(`${this.baseURL}/api/all-algorithms`);
            const data = await response.json();
            this.cache.set(cacheKey, data);
            return data;
        } catch (error) {
            console.error('API Error:', error);
            return this.getFallbackData();
        }
    }

    async getAlgorithmCode(category, filename) {
        try {
            const response = await fetch(`${this.baseURL}/api/algorithms/${category}/${filename}`);
            if (!response.ok) throw new Error('File not found');
            return await response.text();
        } catch (error) {
            console.error('API Error:', error);
            return this.getFallbackCode(category, filename);
        }
    }

    // Section-specific data
    async getNLPData() {
        return {
            categories: [
                {
                    name: 'پردازش متن',
                    count: 45,
                    algorithms: ['Tokenizer', 'Stemmer', 'Lemmatizer', 'POS Tagger', 'NER']
                },
                {
                    name: 'تحلیل احساسات',
                    count: 28,
                    algorithms: ['Sentiment Analysis', 'Emotion Detection', 'Sarcasm Detection']
                },
                {
                    name: 'ترجمه ماشینی',
                    count: 32,
                    algorithms: ['Neural MT', 'Statistical MT', 'Rule-based MT']
                },
                {
                    name: 'چت بات',
                    count: 24,
                    algorithms: ['Intent Recognition', 'Dialog Management', 'Response Generation']
                },
                {
                    name: 'خلاصه‌سازی',
                    count: 18,
                    algorithms: ['Extractive Summary', 'Abstractive Summary', 'Multi-document']
                },
                {
                    name: 'تولید متن',
                    count: 22,
                    algorithms: ['Text Generation', 'Story Writing', 'Poetry Generation']
                }
            ],
            total: 219,
            lastPost: 219,
            status: 'complete'
        };
    }

    async getQuantumData() {
        return {
            features: [
                {
                    title: 'تولید متن کوانتومی',
                    description: 'استفاده از مکانیک کوانتومی برای تولید متن‌های خلاقانه',
                    icon: 'fas fa-atom',
                    code: true
                },
                {
                    title: 'بهینه‌سازی کوانتومی',
                    description: 'بهینه‌سازی پارامترهای نوشتاری با الگوریتم‌های کوانتومی',
                    icon: 'fas fa-bolt',
                    code: true
                },
                {
                    title: 'پردازش موازی',
                    description: 'پردازش همزمان چندین سند با سرعت بالا',
                    icon: 'fas fa-tachometer-alt',
                    code: true
                },
                {
                    title: 'یادگیری عمیق کوانتومی',
                    description: 'شبکه‌های عصبی کوانتومی برای درک متون پیچیده',
                    icon: 'fas fa-brain',
                    code: true
                }
            ],
            algorithms: [
                {
                    name: 'QuantumTextGenerator',
                    description: 'تولید متن با استفاده از حالت‌های کوانتومی',
                    language: 'Python',
                    size: 15400
                },
                {
                    name: 'EntanglementWriter',
                    description: 'نوشتن متون درهم‌تنیده با مفهوم یکپارچه',
                    language: 'Python',
                    size: 12800
                },
                {
                    name: 'SuperpositionEditor',
                    description: 'ویرایشگر متون در حالت سوپرپوزیشن',
                    language: 'JavaScript',
                    size: 9200
                },
                {
                    name: 'QuantumGrammarChecker',
                    description: 'بررسی گرامر با الگوریتم‌های کوانتومی',
                    language: 'Python',
                    size: 18700
                }
            ]
        };
    }

    async getSecretData() {
        return {
            levels: [
                {
                    name: 'سطح ۱: پایه',
                    description: 'رمزنگاری استاندارد برای متون عادی',
                    protection: 'AES-256'
                },
                {
                    name: 'سطح ۲: پیشرفته',
                    description: 'رمزنگاری چندلایه با کلیدهای پویا',
                    protection: 'RSA-4096 + AES'
                },
                {
                    name: 'سطح ۳: نظامی',
                    description: 'الگوریتم‌های رمزنگاری نظامی و دولتی',
                    protection: 'Quantum-Resistant'
                },
                {
                    name: 'سطح ۴: کوانتومی',
                    description: 'رمزنگاری مبتنی بر مکانیک کوانتومی',
                    protection: 'Quantum Key Distribution'
                }
            ],
            algorithms: [
                {
                    name: 'SteganographyWriter',
                    description: 'مخفی‌سازی متن درون تصاویر و فایل‌ها',
                    language: 'Python',
                    size: 21300
                },
                {
                    name: 'ZeroKnowledgeWriter',
                    description: 'نوشتن بدون افشای اطلاعات',
                    language: 'C++',
                    size: 18700
                },
                {
                    name: 'HomomorphicEncryption',
                    description: 'پردازش متن‌های رمزنگاری شده',
                    language: 'Python',
                    size: 25400
                },
                {
                    name: 'SecretSharing',
                    description: 'تقسیم اسرار بین چندین نگهدارنده',
                    language: 'JavaScript',
                    size: 16800
                }
            ]
        };
    }

    async getSpeechData() {
        return {
            features: [
                {
                    title: 'تشخیص گفتار بلادرنگ',
                    description: 'تبدیل گفتار به متن با تأخیر کمتر از ۱۰۰ms',
                    icon: 'fas fa-microphone-alt',
                    code: true
                },
                {
                    title: 'تشخیص لهجه و گویش',
                    description: 'تشخیص خودکار لهجه‌های مختلف فارسی',
                    icon: 'fas fa-language',
                    code: true
                },
                {
                    title: 'تشخیص احساس از صوت',
                    description: 'تشخیص احساسات گوینده از روی تن صدا',
                    icon: 'fas fa-smile',
                    code: true
                },
                {
                    title: 'تشخیص چند گوینده',
                    description: 'تشخیص و تفکیک صداهای چندین گوینده',
                    icon: 'fas fa-users',
                    code: true
                }
            ],
            algorithms: [
                {
                    name: 'DeepSpeechFA',
                    description: 'تشخیص گفتار فارسی مبتنی بر یادگیری عمیق',
                    language: 'Python',
                    size: 32500
                },
                {
                    name: 'VoiceActivityDetection',
                    description: 'تشخیص فعالیت صوتی و حذف سکوت',
                    language: 'C++',
                    size: 18700
                },
                {
                    name: 'SpeakerDiarization',
                    description: 'تشخیص و تفکیک گویندگان مختلف',
                    language: 'Python',
                    size: 29400
                },
                {
                    name: 'EmotionFromSpeech',
                    description: 'تشخیص احساسات از روی ویژگی‌های آکوستیک',
                    language: 'Python',
                    size: 21800
                }
            ]
        };
    }

    // Algorithm retrieval methods
    async getNLPAlgorithms() {
        const data = await this.getNLPData();
        return data.algorithms || [];
    }

    async getQuantumAlgorithms() {
        const data = await this.getQuantumData();
        return data.algorithms || [];
    }

    async getSecretAlgorithms() {
        const data = await this.getSecretData();
        return data.algorithms || [];
    }

    async getSpeechAlgorithms() {
        const data = await this.getSpeechData();
        return data.algorithms || [];
    }

    // Utility methods
    calculateStats(algorithmData) {
        const stats = {
            total: 0,
            byCategory: {},
            byLanguage: {},
            totalLines: 0,
            totalSize: 0
        };

        Object.entries(algorithmData).forEach(([category, algorithms]) => {
            stats.byCategory[category] = algorithms?.length || 0;
            stats.total += stats.byCategory[category];

            algorithms?.forEach(algo => {
                // Count by language
                const lang = algo.language || 'unknown';
                stats.byLanguage[lang] = (stats.byLanguage[lang] || 0) + 1;
                
                // Add to totals
                stats.totalSize += algo.size || 0;
                stats.totalLines += algo.lines || 100; // Estimate
            });
        });

        return stats;
    }

    async globalSearch(query) {
        const allData = await this.getAllAlgorithms();
        const results = [];

        Object.entries(allData).forEach(([category, algorithms]) => {
            algorithms?.forEach(algo => {
                if (algo.name.toLowerCase().includes(query.toLowerCase()) ||
                    (algo.description && algo.description.toLowerCase().includes(query.toLowerCase()))) {
                    results.push({
                        ...algo,
                        category: category,
                        score: this.calculateSearchScore(algo, query)
                    });
                }
            });
        });

        // Sort by score
        return results.sort((a, b) => b.score - a.score);
    }

    calculateSearchScore(algorithm, query) {
        let score = 0;
        
        // Name match (highest weight)
        if (algorithm.name.toLowerCase().includes(query.toLowerCase())) {
            score += 100;
        }
        
        // Description match
        if (algorithm.description && algorithm.description.toLowerCase().includes(query.toLowerCase())) {
            score += 50;
        }
        
        // Partial matches
        const queryWords = query.toLowerCase().split(' ');
        queryWords.forEach(word => {
            if (algorithm.name.toLowerCase().includes(word)) score += 30;
            if (algorithm.description && algorithm.description.toLowerCase().includes(word)) score += 15;
        });
        
        return score;
    }

    generateCatOutput(algorithms, category) {
        let output = `# خروجی ${this.getCategoryName(category)}\n`;
        output += `# تعداد: ${algorithms.length} الگوریتم\n`;
        output += `# تاریخ: ${new Date().toLocaleDateString('fa-IR')}\n\n`;
        
        output += `mkdir -p ${category}\n`;
        output += `cd ${category}\n\n`;
        
        algorithms.forEach((algo, index) => {
            output += `# ${index + 1}. ${algo.name}\n`;
            output += `cat > "${algo.name}.${algo.language === 'Python' ? 'py' : algo.language === 'JavaScript' ? 'js' : algo.language === 'C++' ? 'cpp' : 'txt'}" << 'EOF'\n`;
            output += `${algo.code || this.generateSampleCode(algo)}\n`;
            output += `EOF\n\n`;
        });
        
        output += `cd ..\n`;
        output += `echo "✅ تمام الگوریتم‌های ${this.getCategoryName(category)} کپی شدند"\n`;
        
        return output;
    }

    generateSampleCode(algorithm) {
        const templates = {
            'Python': `# ${algorithm.name}\n# ${algorithm.description}\n\nimport numpy as np\n\nclass ${algorithm.name.replace(/\s+/g, '')}:\n    def __init__(self):\n        self.model = None\n    \n    def process(self, input_data):\n        \"\"\"\n        Process input data\n        \"\"\"\n        return f"Processed: {input_data}"\n\nif __name__ == \"__main__\":\n    processor = ${algorithm.name.replace(/\s+/g, '')}()\n    result = processor.process(\"test data\")\n    print(result)`,
            
            'JavaScript': `// ${algorithm.name}\n// ${algorithm.description}\n\nclass ${algorithm.name.replace(/\s+/g, '')} {\n    constructor() {\n        this.model = null;\n    }\n    \n    process(inputData) {\n        /**\n         * Process input data\n         */\n        return \`Processed: \${inputData}\`;\n    }\n}\n\nmodule.exports = ${algorithm.name.replace(/\s+/g, '')};`,
            
            'C++': `// ${algorithm.name}\n// ${algorithm.description}\n\n#include <iostream>\n#include <string>\n\nclass ${algorithm.name.replace(/\s+/g, '')} {\nprivate:\n    // Model parameters\npublic:\n    ${algorithm.name.replace(/\s+/g, '')}() {\n        // Constructor\n    }\n    \n    std::string process(const std::string& input_data) {\n        // Process input data\n        return \"Processed: \" + input_data;\n    }\n};\n\nint main() {\n    ${algorithm.name.replace(/\s+/g, '')} processor;\n    std::string result = processor.process(\"test data\");\n    std::cout << result << std::endl;\n    return 0;\n}`
        };
        
        return templates[algorithm.language] || `# ${algorithm.name}\n# Language: ${algorithm.language}\n# Description: ${algorithm.description}\n\n// Implementation goes here`;
    }

    getCategoryName(category) {
        const names = {
            'nlp': 'پردازش زبان طبیعی',
            'quantum': 'Quantum Writer',
            'secret': 'Secret Garden',
            'speech': 'Speech Recognition',
            'js': 'JavaScript',
            'python': 'Python',
            'cpp': 'C++',
            'docs': 'مستندات'
        };
        return names[category] || category;
    }

    // Fallback methods
    getFallbackData() {
        return {
            nlp: Array(219).fill(0).map((_, i) => ({
                name: `NLP_Algorithm_${i + 1}`,
                description: `الگوریتم پردازش زبان طبیعی شماره ${i + 1}`,
                language: i % 3 === 0 ? 'Python' : i % 3 === 1 ? 'JavaScript' : 'C++',
                size: 10000 + (i * 100),
                lines: 500 + (i * 10),
                modified: new Date(Date.now() - i * 86400000).toISOString()
            })),
            quantum: Array(15).fill(0).map((_, i) => ({
                name: `Quantum_${i + 1}`,
                description: `الگوریتم کوانتومی شماره ${i + 1}`,
                language: 'Python',
                size: 15000 + (i * 200),
                lines: 800 + (i * 20),
                modified: new Date(Date.now() - i * 172800000).toISOString()
            })),
            secret: Array(12).fill(0).map((_, i) => ({
                name: `Secret_${i + 1}`,
                description: `الگوریتم امنیتی شماره ${i + 1}`,
                language: i % 2 === 0 ? 'C++' : 'Python',
                size: 20000 + (i * 300),
                lines: 1000 + (i * 30),
                modified: new Date(Date.now() - i * 259200000).toISOString()
            })),
            speech: Array(18).fill(0).map((_, i) => ({
                name: `Speech_${i + 1}`,
                description: `الگوریتم تشخیص گفتار شماره ${i + 1}`,
                language: 'Python',
                size: 25000 + (i * 250),
                lines: 1200 + (i * 25),
                modified: new Date(Date.now() - i * 86400000).toISOString()
            }))
        };
    }

    getFallbackCode(category, filename) {
        const templates = {
            nlp: `# NLP Algorithm: ${filename}\n# پردازش زبان طبیعی\n\nimport nltk\nimport numpy as np\n\nclass ${filename.replace('.py', '')}:\n    \"\"\"\n    الگوریتم پردازش زبان طبیعی\n    \"\"\"\n    \n    def __init__(self):\n        self.model = self.load_model()\n    \n    def process(self, text):\n        \"\"\"\n        پردازش متن ورودی\n        \"\"\"\n        # Implement NLP processing here\n        return {\n            'processed': True,\n            'result': 'پردازش موفق'\n        }\n\nif __name__ == \"__main__\":\n    processor = ${filename.replace('.py', '')}()\n    result = processor.process(\"متن نمونه برای پردازش\")\n    print(result)`,
            
            quantum: `# Quantum Algorithm: ${filename}\n# الگوریتم کوانتومی\n\nfrom qiskit import QuantumCircuit, execute, Aer\nimport numpy as np\n\nclass ${filename.replace('.py', '')}:\n    \"\"\"\n    الگوریتم کوانتومی برای تولید متن\n    \"\"\"\n    \n    def __init__(self):\n        self.backend = Aer.get_backend('qasm_simulator')\n    \n    def generate(self, seed):\n        \"\"\"\n        تولید متن کوانتومی\n        \"\"\"\n        qc = QuantumCircuit(2, 2)\n        qc.h(0)\n        qc.cx(0, 1)\n        qc.measure([0,1], [0,1])\n        \n        job = execute(qc, self.backend, shots=1)\n        result = job.result().get_counts()\n        \n        return f\"تولید شده با خروجی کوانتومی: {result}\"\n\nif __name__ == \"__main__\":\n    generator = ${filename.replace('.py', '')}()\n    text = generator.generate(\"seed\")\n    print(text)`,
            
            secret: `# Secret Algorithm: ${filename}\n# الگوریتم امنیتی\n\nfrom cryptography.fernet import Fernet\nimport hashlib\n\nclass ${filename.replace('.py', '')}:\n    \"\"\"\n    الگوریتم رمزنگاری امن\n    \"\"\"\n    \n    def __init__(self, key=None):\n        self.key = key or Fernet.generate_key()\n        self.cipher = Fernet(self.key)\n    \n    def encrypt(self, text):\n        \"\"\"\n        رمزنگاری متن\n        \"\"\"\n        encrypted = self.cipher.encrypt(text.encode())\n        return encrypted\n    \n    def decrypt(self, encrypted):\n        \"\"\"\n        رمزگشایی متن\n        \"\"\"\n        decrypted = self.cipher.decrypt(encrypted)\n        return decrypted.decode()\n\nif __name__ == \"__main__\":\n    secret = ${filename.replace('.py', '')}()\n    encrypted = secret.encrypt(\"متن محرمانه\")\n    decrypted = secret.decrypt(encrypted)\n    print(f\"رمز شده: {encrypted}\")\n    print(f\"رمزگشایی شده: {decrypted}\")`,
            
            speech: `# Speech Algorithm: ${filename}\n# الگوریتم تشخیص گفتار\n\nimport speech_recognition as sr\nimport numpy as np\n\nclass ${filename.replace('.py', '')}:\n    \"\"\"\n    الگوریتم تشخیص گفتار فارسی\n    \"\"\"\n    \n    def __init__(self):\n        self.recognizer = sr.Recognizer()\n    \n    def recognize(self, audio_file):\n        \"\"\"\n        تشخیص گفتار از فایل صوتی\n        \"\"\"\n        with sr.AudioFile(audio_file) as source:\n            audio = self.recognizer.record(source)\n            \n        try:\n            text = self.recognizer.recognize_google(audio, language=\"fa-IR\")\n            return text\n        except sr.UnknownValueError:\n            return \"گفتار تشخیص داده نشد\"\n        except sr.RequestError:\n            return \"خطا در سرویس تشخیص گفتار\"\n\nif __name__ == \"__main__\":\n    recognizer = ${filename.replace('.py', '')}()\n    result = recognizer.recognize(\"audio.wav\")\n    print(f\"متن تشخیص داده شده: {result}\")`
        };
        
        return templates[category] || `# Algorithm: ${filename}\n# Category: ${category}\n\n// Implementation will be loaded from server`;
    }
}

// Initialize API
window.tetrashopAPI = new TetrashopAdvancedAPI();
