void UCIHandler::processPosition(const std::string& command) {
	// پارس کردن وضعیت و اعمال حرکات
}

void UCIHandler::processGo(const std::string& command) {
	// شروع جستجو و بازگرداندن بهترین حرکت
}
// در UCI.cpp  
void UCIHandler::process_command(const std::string& cmd) {
	if (cmd.starts_with("position")) {
		size_t start = cmd.find("moves");
		if (start != std::string::npos) {
			std::string moves_str = cmd.substr(start + 6);
			std::istringstream iss(moves_str);
			std::string move;
			while (iss >> move) {
				// تبدیل حرکت رشته‌ای به مختصات (مثلاً e2e4 به [6,4] -> [4,4])  
				// اعمال حرکت روی تخته  
			}
		}
	}
}