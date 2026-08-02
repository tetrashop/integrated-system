# کتابخانه Syzygy Tablebases  
add_library(Syzygy STATIC  
    tbprobe.cpp  
    tbprobe.h  
)  

target_include_directories(Syzygy PUBLIC  
    ${CMAKE_CURRENT_SOURCE_DIR}  
)  

# بهینه‌سازی برای Syzygy  
if(CMAKE_CXX_COMPILER_ID MATCHES "MSVC")  
    target_compile_options(Syzygy PRIVATE /O2 /fp:fast)  
else()  
    target_compile_options(Syzygy PRIVATE -O3 -ffast-math)  
endif()  