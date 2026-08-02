cmake_minimum_required(VERSION 3.12)
cmake_policy(VERSION 3.16)
include(FetchContent)
FetchContent_Declare(
    googletest
    URL https://github.com/google/googletest/archive/refs/heads/main.zip
)
FetchContent_MakeAvailable(googletest)

add_executable(board_test BoardTest.cpp)
target_link_libraries(board_test PRIVATE gtest_main)
add_executable(check_test tests/CheckTest.cpp src/Board/Board.cpp)  
target_link_libraries(check_test gtest_main) 
