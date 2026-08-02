# arm-toolchain.cmake
set(CMAKE_SYSTEM_NAME Generic)
set(CMAKE_SYSTEM_PROCESSOR arm)

# مسیر کامپایلر
set(TOOLCHAIN_PATH "C:/Program Files (x86)/GNU Tools Arm Embedded/10 2021.10/bin")
set(CMAKE_C_COMPILER "${TOOLCHAIN_PATH}/arm-none-eabi-gcc.exe")
set(CMAKE_CXX_COMPILER "${TOOLCHAIN_PATH}/arm-none-eabi-g++.exe")

# تنظیمات کامپایلر
set(CMAKE_C_FLAGS "-nostartfiles" CACHE STRING "C Flags")
set(CMAKE_CXX_FLAGS "-nostartfiles -fno-rtti -fno-exceptions" CACHE STRING "C++ Flags")
set(CMAKE_TOOLCHAIN_FILE "C:/vcpkg/scripts/buildsystems/vcpkg.cmake")  