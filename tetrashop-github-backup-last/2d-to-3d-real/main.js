// تخمین‌گر زمان
class TimeEstimator {
    static estimate(imageWidth, imageHeight, quality) {
        const megapixels = (imageWidth * imageHeight) / 1000000;
        
        // فرمول تخمین زمان بر اساس مگاپیکسل
        const baseTimePerMP = {
            'low': 500,     // 0.5s per MP
            'medium': 1500, // 1.5s per MP
            'high': 4000,   // 4s per MP
            'ultra': 10000  // 10s per MP
        }[quality] || 1500;
        
        const estimatedMs = megapixels * baseTimePerMP;
        return {
            seconds: Math.round(estimatedMs / 1000),
            minutes: Math.floor(estimatedMs / 60000),
            milliseconds: estimatedMs
        };
    }
}

// استفاده
const image = { width: 1920, height: 1080 }; // Full HD
const quality = 'medium';
const estimate = TimeEstimator.estimate(image.width, image.height, quality);

console.log(`⏱️ تخمین زمان برای ${image.width}x${image.height} (${quality}):`);
console.log(`• ثانیه: ${estimate.seconds}s`);
console.log(`• دقیقه: ${estimate.minutes}m`);
console.log(`• کل: ${estimate.milliseconds}ms`);

document.getElementById('timer').textContent = 
    `⏱️ زمان تخمینی: ${estimate.seconds} ثانیه (${estimate.minutes} دقیقه و ${estimate.seconds % 60} ثانیه)`;
