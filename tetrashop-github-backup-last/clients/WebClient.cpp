#include <emscripten.h>
#include <emscripten/websocket.h>
#include <iostream>
#include <string>

EMSCRIPTEN_WEBSOCKET_T websocket;

void on_open(int event_type, const EmscriptenWebSocketOpenEvent* websocket_event, void* user_data) {
    std::cout << "Connected to Cloud Chess Server" << std::endl;
}

void on_error(int event_type, const EmscriptenWebSocketErrorEvent* websocket_event, void* user_data) {
    std::cout << "WebSocket error" << std::endl;
}

void on_close(int event_type, const EmscriptenWebSocketCloseEvent* websocket_event, void* user_data) {
    std::cout << "WebSocket closed" << std::endl;
}

void on_message(int event_type, const EmscriptenWebSocketMessageEvent* websocket_event, void* user_data) {
    if (websocket_event->isText) {
        std::string message(websocket_event->data, websocket_event->numBytes);
        std::cout << "Received: " << message << std::endl;
        
        // پردازش پاسخ سرور
        if (message.find("MOVE") == 0) {
            // به روزرسانی رابط کاربری
            EM_ASM({
                updateBoardWithComputerMove(UTF8ToString($0));
            }, message.c_str());
        }
    }
}

extern "C" {
    EMSCRIPTEN_KEEPALIVE
    void connectToServer(const char* url) {
        EmscriptenWebSocketCreateAttributes attributes;
        attributes.url = url;
        attributes.protocols = nullptr;
        attributes.createOnMainThread = true;
        
        websocket = emscripten_websocket_new(&attributes);
        
        emscripten_websocket_set_onopen_callback(websocket, nullptr, on_open);
        emscripten_websocket_set_onerror_callback(websocket, nullptr, on_error);
        emscripten_websocket_set_onclose_callback(websocket, nullptr, on_close);
        emscripten_websocket_set_onmessage_callback(websocket, nullptr, on_message);
    }
    
    EMSCRIPTEN_KEEPALIVE
    void sendMove(const char* move) {
        emscripten_websocket_send_utf8_text(websocket, move);
    }
    
    EMSCRIPTEN_KEEPALIVE
    void initializeGame() {
        // راه‌اندازی بازی جدید
        const char* init_msg = "NEW_GAME";
        emscripten_websocket_send_utf8_text(websocket, init_msg);
    }
}
