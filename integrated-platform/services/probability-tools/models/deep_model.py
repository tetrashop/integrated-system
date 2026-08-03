import numpy as np
import pickle
import os

class SimpleDeepModel:
    """
    یک مدل ساده که با استفاده از رگرسیون خطی و به‌روزرسانی وزن‌ها، قدرت تیم را تخمین می‌زند.
    در واقع این یک نورون ساده است که با دیدن توالی رتبه‌های Elo، وزن‌ها را تنظیم می‌کند.
    """
    def __init__(self, input_size=5):
        self.input_size = input_size
        self.weights = np.ones(input_size) / input_size  # وزن‌دهی به تاریخچه
        self.load_or_create()

    def load_or_create(self):
        weights_path = "models/simple_weights.npy"
        if os.path.exists(weights_path):
            self.weights = np.load(weights_path)
        else:
            # ذخیره وزن‌های اولیه
            np.save(weights_path, self.weights)

    def predict_next_strength(self, historical_ratings):
        """
        historical_ratings: لیستی از رتبه‌های Elo در گذشته (حداقل 1 عنصر)
        خروجی: رتبه پیش‌بینی شده
        """
        if len(historical_ratings) == 0:
            return 1500.0
        if len(historical_ratings) < self.input_size:
            # اگر تعداد داده کم است، میانگین ساده
            return np.mean(historical_ratings)
        # استفاده از وزن‌ها برای ترکیب خطی آخرین input_size مقدار
        recent = np.array(historical_ratings[-self.input_size:])
        prediction = np.dot(recent, self.weights)
        # محدود کردن به بازه منطقی Elo
        return max(1300, min(2100, prediction))

    def update_weights(self, historical_ratings, actual_next_rating, learning_rate=0.01):
        """
        به‌روزرسانی وزن‌ها با استفاده از خطای پیش‌بینی (فقط در صورت وجود داده واقعی بعدی)
        """
        if len(historical_ratings) < self.input_size:
            return
        recent = np.array(historical_ratings[-self.input_size:])
        pred = np.dot(recent, self.weights)
        error = actual_next_rating - pred
        self.weights += learning_rate * error * recent
        # نرمال‌سازی ساده
        self.weights = self.weights / np.sum(np.abs(self.weights))
        np.save("models/simple_weights.npy", self.weights)

# نمونه سراسری
model = SimpleDeepModel()
