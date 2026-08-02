# مدیریت OpeningBook
add_library(OpeningBook STATIC
    OpeningBook.h
    OpeningBook.cpp
)

target_include_directories(OpeningBook PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}
)