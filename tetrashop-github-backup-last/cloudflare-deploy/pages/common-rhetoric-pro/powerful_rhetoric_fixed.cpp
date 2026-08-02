#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <algorithm>
#include <memory>
#include <random>
#include <cmath>

/**
 * نطق مصطلح - نسخه تعمیر شده با تحلیل واقعی
 */

class AdvancedRhetoricAnalyzer {
private:
    std::map<std::string, double> word_power;
    std::map<std::string, int> word_frequency;
    
public:
    AdvancedRhetoricAnalyzer() {
        initialize_power_dictionary();
    }
    
    void initialize_power_dictionary() {
        // دیکشنری قدرت کلمات فارسی
        word_power = {
            {"مهم", 0.8}, {"اساسی", 0.9}, {"حیاتی", 0.95},
            {"تأثیرگذار", 0.85}, {"کارآمد", 0.75}, {"مؤثر", 0.8},
            {"قوی", 0.7}, {"مستحکم", 0.75}, {"پایدار", 0.7}
        };
    }
    
    double analyze_sentence_power(const std::string& sentence) {
        double total_power = 0.0;
        int powerful_words = 0;
        
        std::vector<std::string> words = split_persian_text(sentence);
        
        for (const auto& word : words) {
            if (word_power.find(word) != word_power.end()) {
                total_power += word_power[word];
                powerful_words++;
            }
        }
        
        if (words.empty()) return 0.0;
        
        double power_density = powerful_words / static_cast<double>(words.size());
        double avg_power = powerful_words > 0 ? total_power / powerful_words : 0.0;
        
        return (power_density * 0.6 + avg_power * 0.4) * 0.8;
    }
    
    double calculate_clarity_score(const std::string& text) {
        // محاسبه وضوح متن بر اساس معیارهای زبانی
        std::vector<std::string> sentences = split_sentences(text);
        if (sentences.empty()) return 0.0;
        
        double total_clarity = 0.0;
        for (const auto& sentence : sentences) {
            total_clarity += analyze_sentence_clarity(sentence);
        }
        
        return total_clarity / sentences.size();
    }
    
    std::string enhance_rhetorical_impact(const std::string& original) {
        std::string enhanced = original;
        
        // تقویت ساختاری
        enhanced = add_rhetorical_devices(enhanced);
        
        // بهینه‌سازی کلمات
        enhanced = replace_weak_words(enhanced);
        
        // بهبود جریان متن
        enhanced = improve_text_flow(enhanced);
        
        return enhanced;
    }
    
private:
    std::vector<std::string> split_persian_text(const std::string& text) {
        std::vector<std::string> words;
        std::string current_word;
        
        for (char c : text) {
            if (c == ' ' || c == '.' || c == '،' || c == ';') {
                if (!current_word.empty()) {
                    words.push_back(current_word);
                    current_word.clear();
                }
            } else {
                current_word += c;
            }
        }
        
        if (!current_word.empty()) {
            words.push_back(current_word);
        }
        
        return words;
    }
    
    std::vector<std::string> split_sentences(const std::string& text) {
        std::vector<std::string> sentences;
        std::string current_sentence;
        
        for (char c : text) {
            current_sentence += c;
            if (c == '.' || c == '!' || c == '؟') {
                sentences.push_back(current_sentence);
                current_sentence.clear();
            }
        }
        
        if (!current_sentence.empty()) {
            sentences.push_back(current_sentence);
        }
        
        return sentences;
    }
    
    double analyze_sentence_clarity(const std::string& sentence) {
        std::vector<std::string> words = split_persian_text(sentence);
        if (words.empty()) return 0.0;
        
        // معیارهای وضوح
        double avg_word_length = 0.0;
        for (const auto& word : words) {
            avg_word_length += word.length();
        }
        avg_word_length /= words.size();
        
        double word_variance = 0.0;
        for (const auto& word : words) {
            word_variance += std::pow(word.length() - avg_word_length, 2);
        }
        word_variance = std::sqrt(word_variance / words.size());
        
        // محاسبه نمره وضوح
        double length_score = 1.0 - std::min(avg_word_length / 10.0, 1.0);
        double variance_penalty = std::min(word_variance / 5.0, 1.0);
        
        return length_score * (1.0 - variance_penalty * 0.3);
    }
    
    std::string add_rhetorical_devices(const std::string& text) {
        // افزودن دستگاه‌های بلاغی
        std::string enhanced = text;
        
        // در نسخه کامل، دستگاه‌های واقعی اضافه شوند
        if (enhanced.length() > 20) {
            enhanced = "با توجه به اهمیت موضوع، " + enhanced;
        }
        
        return enhanced;
    }
    
    std::string replace_weak_words(const std::string& text) {
        // جایگزینی کلمات ضعیف با قوی
        std::map<std::string, std::string> weak_to_strong = {
            {"خوب", "عالی"}, {"بد", "نامناسب"}, {"کم", "ناکافی"}
        };
        
        std::string result = text;
        for (const auto& replacement : weak_to_strong) {
            size_t pos = 0;
            while ((pos = result.find(replacement.first, pos)) != std::string::npos) {
                result.replace(pos, replacement.first.length(), replacement.second);
                pos += replacement.second.length();
            }
        }
        
        return result;
    }
    
    std::string improve_text_flow(const std::string& text) {
        // بهبود جریان متن
        std::string improved = text;
        
        // حذف فاصله‌های اضافی
        size_t pos = 0;
        while ((pos = improved.find("  ", pos)) != std::string::npos) {
            improved.replace(pos, 2, " ");
        }
        
        // اصلاح علائم نگارشی
        pos = 0;
        while ((pos = improved.find(" .", pos)) != std::string::npos) {
            improved.replace(pos, 2, ".");
        }
        
        return improved;
    }
};

// تابع اصلی
int main() {
    std::cout << "💪 نطق مصطلح - نسخه تعمیر شده" << std::endl;
    
    AdvancedRhetoricAnalyzer analyzer;
    
    std::string sample_text = "این یک متن نمونه است که خوب نوشته شده اما می تواند بهتر باشد.";
    
    double power = analyzer.analyze_sentence_power(sample_text);
    std::cout << "💪 قدرت بیانی: " << power * 100 << "%" << std::endl;
    
    double clarity = analyzer.calculate_clarity_score(sample_text);
    std::cout   << "🔍 وضوح متن: " << clarity * 100 << "%" << std::endl;
    
    std::string enhanced = analyzer.enhance_rhetorical_impact(sample_text);
    std::cout << "✨ متن تقویت شده: " << enhanced << std::endl;
    
    return 0;
}
