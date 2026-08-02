FROM ubuntu:22.04

# نصب وابستگی‌ها
RUN apt-get update && apt-get install -y \
    g++ \
    cmake \
    libboost-system-dev \
    libwebsocketpp-dev \
    && rm -rf /var/lib/apt/lists/*

# کپی سورس کد
COPY . /app
WORKDIR /app

# کامپایل
RUN make server

EXPOSE 9002

CMD ["./bin/chess_server"]
