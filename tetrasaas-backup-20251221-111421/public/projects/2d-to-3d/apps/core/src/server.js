import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

// مدل‌های تولید محتوا
const writingModels = {
    creative: {
        name: "خلاق",
        description: "تولید محتوای خلاقانه و داستانی"
    },
    technical: {
        name: "فنی", 
        description: "تولید محتوای فنی و تخصصی"
    },
    marketing: {
        name: "بازاریابی",
        description: "تولید محتوای تبلیغاتی و بازاریابی"
    }
};

// پایگاه داده در حافظه
const documents = new Map();
const userSessions = new Map();

// Routes
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'Intelligent Writer',
        version: '2.0.0',
        models: Object.keys(writingModels)
    });
});

app.post('/api/generate', (req, res) => {
    const { prompt, model = 'creative', style = 'professional' } = req.body;
    
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    // شبیه‌سازی تولید محتوا
    const documentId = uuidv4();
    const generatedContent = generateContent(prompt, model, style);
    
    const document = {
        id: documentId,
        prompt,
        model,
        style,
        content: generatedContent,
        createdAt: new Date().toISOString(),
        wordCount: generatedContent.split(' ').length
    };
    
    documents.set(documentId, document);
    
    res.json({
        documentId,
        content: generatedContent,
        model: writingModels[model],
        wordCount: document.wordCount
    });
});

app.get('/api/documents/:id', (req, res) => {
    const document = documents.get(req.params.id);
    if (!document) {
        return res.status(404).json({ error: 'Document not found' });
    }
    res.json(document);
});

// تابع تولید محتوا
function generateContent(prompt, model, style) {
    const templates = {
        creative: [
            `در دنیای شگفت‌انگیز ${prompt}، داستانی آغاز می‌شود که...`,
            `روزی روزگاری در سرزمین ${prompt}، قهرمان داستان ما...`
        ],
        technical: [
            `از دیدگاه فنی، ${prompt} شامل مولفه‌های متعددی است که...`,
            `بررسی تخصصی ${prompt} نشان می‌دهد که این موضوع...`
        ],
        marketing: [
            `کشف کنید چگونه ${prompt} می‌تواند زندگی شما را متحول کند!`,
            `فرصت استثنایی: ${prompt} با بهترین کیفیت و قیمت`
        ]
    };
    
    const template = templates[model] || templates.creative;
    const selectedTemplate = template[Math.floor(Math.random() * template.length)];
    
    return selectedTemplate + " " + generateAdditionalText();
}

function generateAdditionalText() {
    const phrases = [
        "این موضوع از اهمیت ویژه‌ای برخوردار است.",
        "تحقیقات نشان داده که این رویکرد بسیار مؤثر است.",
        "با توجه به تجربیات گذشته، می‌توان به نتایج مطلوبی دست یافت.",
        "این نوآوری تحول عظیمی در صنعت ایجاد کرده است.",
        "کاربران از این ویژگی استقبال چشمگیری کرده‌اند."
    ];
    
    return phrases[Math.floor(Math.random() * phrases.length)];
}

// WebSocket برای ارتباط real-time
wss.on('connection', (ws) => {
    const sessionId = uuidv4();
    userSessions.set(sessionId, { ws, createdAt: new Date() });
    
    console.log(`Client connected: ${sessionId}`);
    
    ws.send(JSON.stringify({
        type: 'welcome',
        sessionId,
        message: 'به Intelligent Writer خوش آمدید!'
    }));
    
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            
            if (message.type === 'generate_request') {
                // پردازش درخواست تولید محتوا
                const content = generateContent(message.prompt, message.model, message.style);
                
                ws.send(JSON.stringify({
                    type: 'generate_response',
                    content,
                    prompt: message.prompt,
                    model: message.model
                }));
            }
            
        } catch (error) {
            ws.send(JSON.stringify({
                type: 'error',
                message: 'خطا در پردازش درخواست'
            }));
        }
    });
    
    ws.on('close', () => {
        userSessions.delete(sessionId);
        console.log(`Client disconnected: ${sessionId}`);
    });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
    console.log(`🚀 Intelligent Writer running on port ${PORT}`);
    console.log(`📝 Models: ${Object.keys(writingModels).join(', ')}`);
});
