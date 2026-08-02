from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import json
import asyncio
from typing import List, Dict
import uuid

app = FastAPI(title="Tetrashop Backend API", version="2.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# مدل‌های داده
class Product(BaseModel):
    id: str
    name: str
    price: float
    category: str
    description: str = ""
    image_url: str = ""

class Order(BaseModel):
    id: str
    products: List[Product]
    total: float
    status: str = "pending"

class AIRequest(BaseModel):
    text: str
    model: str = "default"

class AIResponse(BaseModel):
    result: str
    model: str
    processing_time: float

# دیتابیس در حافظه
products_db: List[Product] = [
    Product(
        id="1",
        name="لپ‌تاپ گیمینگ",
        price=25000000,
        category="الکترونیک",
        description="لپ‌تاپ گیمینگ با پردازنده Core i7 و کارت گرافیک RTX 4060",
        image_url="/api/placeholder/300/200"
    ),
    Product(
        id="2", 
        name="هدفون بی‌سیم",
        price=3500000,
        category="صوتی",
        description="هدفون با قابلیت نویز کنسلینگ و باتری 30 ساعته",
        image_url="/api/placeholder/300/200"
    )
]

orders_db: Dict[str, Order] = {}
connected_websockets: List[WebSocket] = []

# Routes
@app.get("/")
async def root():
    return {"message": "🚀 Tetrashop Backend API فعال است", "version": "2.0.0"}

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Tetrashop Backend",
        "timestamp": "2024-12-19T10:30:00Z",
        "performance": "95%"
    }

@app.get("/api/products")
async def get_products(category: str = None):
    if category:
        filtered = [p for p in products_db if p.category == category]
        return {"products": filtered, "count": len(filtered)}
    return {"products": products_db, "count": len(products_db)}

@app.post("/api/orders")
async def create_order(order: Order):
    order.id = str(uuid.uuid4())
    orders_db[order.id] = order
    
    # notify all connected clients
    for ws in connected_websockets:
        try:
            await ws.send_json({
                "type": "new_order",
                "order_id": order.id,
                "total": order.total
            })
        except:
            continue
            
    return {"order_id": order.id, "status": "created"}

@app.get("/api/orders/{order_id}")
async def get_order(order_id: str):
    if order_id not in orders_db:
        raise HTTPException(status_code=404, detail="Order not found")
    return orders_db[order_id]

@app.post("/api/ai/process")
async def ai_process(request: AIRequest):
    # شبیه‌سازی پردازش AI
    processing_time = 0.5
    
    # پردازش متن
    if "سلام" in request.text or "hello" in request.text.lower():
        result = "درود! من دستیار هوش مصنوعی Tetrashop هستم. چگونه می‌توانم کمک کنم؟"
    elif "قیمت" in request.text:
        result = "برای اطلاعات قیمت، لطفا به بخش محصولات مراجعه کنید."
    elif "ساعت" in request.text:
        result = "ساعت کاری ما: 9 صبح تا 6 عصر"
    else:
        result = f"پردازش متن: {request.text}"
    
    return AIResponse(
        result=result,
        model=request.model,
        processing_time=processing_time
    )

# WebSocket برای ارتباط real-time
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_websockets.append(websocket)
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "ping":
                await websocket.send_json({"type": "pong", "timestamp": "2024-12-19T10:30:00Z"})
                
    except WebSocketDisconnect:
        connected_websockets.remove(websocket)

# استاتیک فایل‌ها
app.mount("/static", StaticFiles(directory="static"), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
