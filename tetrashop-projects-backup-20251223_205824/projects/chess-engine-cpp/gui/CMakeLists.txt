# اجرایی رابط کاربری
add_executable(ChessEngineGUI
    main.cpp
)

# لینک به کتابخانه اصلی
target_link_libraries(ChessEngineGUI PRIVATE ChessEngineCore)
