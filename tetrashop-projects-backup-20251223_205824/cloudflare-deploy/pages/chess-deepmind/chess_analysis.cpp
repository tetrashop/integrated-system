#include <iostream>
#include <vector>
#include <string>

struct ChessIssue {
    std::string category;
    std::string description;
    std::string severity;
};

void analyze_chess_issues() {
    std::vector<ChessIssue> issues = {
        {"الگوریتم", "minimax واقعی پیاده‌سازی نشده", "بالا"},
        {"شبکه عصبی", "آموزش و backpropagation وجود ندارد", "بالا"},
        {"موتور شطرنج", "قوانین شطرنج و حرکت‌سنجی پیاده‌سازی نشده", "بسیار بالا"},
        {"کوانتومی", "الگوریتم‌های کوانتومی واقعی missing", "متوسط"},
        {"داده", encoding موقعیت‌های شطرنج پیاده‌سازی نشده", "بالا"},
        {"بهینه‌سازی", "جستجوی درخت حرکت وجود ندارد", "بالا"}
    };
    
    std::cout << "🔍 مشکلات شناسایی شده در موتور شطرنج:" << std::endl;
    for (const auto& issue : issues) {
        std::cout << "❌ [" << issue.severity << "] " << issue.category << ": " << issue.description << std::endl;
    }
}

int main() {
    analyze_chess_issues();
    return 0;
}
