#include "../include/ChessCore.h"
#include <iostream>
#include <thread>
#include <vector>
#include <mutex>
#include <queue>
#include <condition_variable>
#include <unordered_map>
#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>

typedef websocketpp::server<websocketpp::config::asio> server;

using namespace ChessEngine;

class CloudChessServer {
private:
    server endpoint_;
    std::unordered_map<websocketpp::connection_hdl, 
                      std::shared_ptr<GameState>, 
                      std::owner_less<websocketpp::connection_hdl>> clients_;
    
    std::mutex clients_mutex_;
    std::queue<std::pair<websocketpp::connection_hdl, std::string>> task_queue_;
    std::mutex queue_mutex_;
    std::condition_variable condition_;
    std::vector<std::thread> worker_threads_;
    bool stop_ = false;
    
    // حافظه مشترک برای درخت حالت
    std::unordered_map<std::string, GameState> shared_state_tree_;
    std::mutex state_tree_mutex_;

public:
    CloudChessServer() {
        endpoint_.init_asio();
        endpoint_.set_open_handler([this](auto hdl) { on_open(hdl); });
        endpoint_.set_close_handler([this](auto hdl) { on_close(hdl); });
        endpoint_.set_message_handler([this](auto hdl, auto msg) { on_message(hdl, msg); });
        
        // راه‌اندازی worker threads
        start_workers(4); // 4 thread برای پردازش موازی
    }
    
    void start_workers(int num_workers) {
        for (int i = 0; i < num_workers; i++) {
            worker_threads_.emplace_back([this] { worker_loop(); });
        }
    }
    
    void worker_loop() {
        while (!stop_) {
            std::pair<websocketpp::connection_hdl, std::string> task;
            
            {
                std::unique_lock<std::mutex> lock(queue_mutex_);
                condition_.wait(lock, [this] { 
                    return stop_ || !task_queue_.empty(); 
                });
                
                if (stop_) return;
                
                task = task_queue_.front();
                task_queue_.pop();
            }
            
            process_task(task.first, task.second);
        }
    }
    
    void process_task(websocketpp::connection_hdl hdl, const std::string& message) {
        try {
            // پردازش درخواست حرکت
            auto game_state = get_client_state(hdl);
            MinimaxAI ai;
            
            // محاسبه بهترین حرکت با عمق 3
            Move best_move = ai.getBestMove(*game_state, 3);
            
            // ذخیره در حافظه مشترک
            {
                std::lock_guard<std::mutex> lock(state_tree_mutex_);
                std::string state_key = game_state->serialize();
                shared_state_tree_[state_key] = *game_state;
            }
            
            // ارسال پاسخ به کلاینت
            std::string response = format_move_response(best_move);
            endpoint_.send(hdl, response, websocketpp::frame::opcode::text);
            
        } catch (const std::exception& e) {
            std::string error_msg = "ERROR: " + std::string(e.what());
            endpoint_.send(hdl, error_msg, websocketpp::frame::opcode::text);
        }
    }
    
    void on_open(websocketpp::connection_hdl hdl) {
        std::lock_guard<std::mutex> lock(clients_mutex_);
        clients_[hdl] = std::make_shared<GameState>();
        std::cout << "Client connected. Total clients: " << clients_.size() << std::endl;
    }
    
    void on_close(websocketpp::connection_hdl hdl) {
        std::lock_guard<std::mutex> lock(clients_mutex_);
        clients_.erase(hdl);
        std::cout << "Client disconnected. Total clients: " << clients_.size() << std::endl;
    }
    
    void on_message(websocketpp::connection_hdl hdl, server::message_ptr msg) {
        std::string message = msg->get_payload();
        
        {
            std::lock_guard<std::mutex> lock(queue_mutex_);
            task_queue_.push({hdl, message});
        }
        condition_.notify_one();
    }
    
    std::shared_ptr<GameState> get_client_state(websocketpp::connection_hdl hdl) {
        std::lock_guard<std::mutex> lock(clients_mutex_);
        return clients_[hdl];
    }
    
    std::string format_move_response(const Move& move) {
        std::stringstream ss;
        ss << "MOVE " << char('a' + move.from.x) << move.from.y + 1 
           << " " << char('a' + move.to.x) << move.to.y + 1;
        return ss.str();
    }
    
    void run(uint16_t port) {
        std::cout << "Starting Cloud Chess Server on port " << port << std::endl;
        endpoint_.listen(port);
        endpoint_.start_accept();
        endpoint_.run();
    }
    
    ~CloudChessServer() {
        stop_ = true;
        condition_.notify_all();
        for (auto& thread : worker_threads_) {
            if (thread.joinable()) thread.join();
        }
    }
};

int main() {
    CloudChessServer server;
    server.run(9002);
    return 0;
}
