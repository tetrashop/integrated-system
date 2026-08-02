CXX = g++
CXXFLAGS = -std=c++17 -O3 -pthread -I./include
EMFLAGS = -std=c++17 -O3 -s WASM=1 -s USE_PTHREADS=1 -s PROXY_TO_PTHREAD=1

# هدف‌های اصلی
all: server web_client

# سرور ابری
server: cloud-server/CloudChessServer.cpp src/ChessCore.cpp
$(CXX) $(CXXFLAGS) -o bin/chess_server $^ -lwebsocketpp -lboost_system -lpthread

# کلاینت وب (WebAssembly)
web_client: clients/WebClient.cpp src/ChessCore.cpp
emcc $(EMFLAGS) -o public/chess_client.js $^ -I./include

# کامپایل کتابخانه اصلی
libchess: src/ChessCore.cpp
$(CXX) $(CXXFLAGS) -c -o lib/libchess_core.o $^
ar rcs lib/libchess.a lib/libchess_core.o

# تست
test: libchess tests/test_chess.cpp
$(CXX) $(CXXFLAGS) -o bin/test_chess tests/test_chess.cpp -L./lib -lchess

clean:
rm -rf bin/* lib/* public/chess_client.* build/*

install_deps:
# نصب وابستگی‌ها برای Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y g++ cmake libboost-system-dev libwebsocketpp-dev emscripten

.PHONY: all server web_client libchess test clean install_deps
