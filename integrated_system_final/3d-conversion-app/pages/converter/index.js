import { useState } from 'react';
import { ThreeDConverter } from '../../lib/converter/ThreeDConverter';
import Head from 'next/head';

export default function ConverterPage() {
  const [file, setFile] = useState(null);
  const [options, setOptions] = useState({
    format: 'glb',
    compression: 'medium',
    reducePolygons: 50,
    optimize: true,
    preserveTextures: true
  });
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      try {
        ThreeDConverter.validateFile(selectedFile);
        setFile(selectedFile);
        setError(null);
      } catch (err) {
        setError(err.message);
        setFile(null);
      }
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    
    setConverting(true);
    setError(null);
    
    try {
      const conversionResult = await ThreeDConverter.convert(file, options);
      setResult(conversionResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setConverting(false);
    }
  };

  return (
    <>
      <Head>
        <title>تبدیل‌کننده مدل‌های 3D | 3D Conversion App</title>
      </Head>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h1>🔄 تبدیل‌کننده مدل‌های سه‌بعدی</h1>
        <p>فایل‌های 3D خود را به فرمت‌های مختلف تبدیل و بهینه‌سازی کنید</p>

        {error && (
          <div style={{ backgroundColor: '#fee', border: '1px solid #fcc', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
            ❌ {error}
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <h3>📁 آپلود فایل</h3>
          <input 
            type="file" 
            accept=".obj,.stl,.fbx,.gltf,.glb,.blend,.3ds,.dae"
            onChange={handleFileChange}
            style={{ padding: '10px' }}
          />
          {file && (
            <div style={{ marginTop: '10px' }}>
              ✅ فایل انتخاب شده: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>⚙️ تنظیمات تبدیل</h3>
          
          <label>فرمت خروجی:</label>
          <select 
            value={options.format}
            onChange={(e) => setOptions({...options, format: e.target.value})}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          >
            <option value="glb">GLB (Binary) - بهترین برای وب</option>
            <option value="gltf">GLTF (JSON) - سبک و قابل ویرایش</option>
            <option value="obj">OBJ - سازگار با اکثر نرم‌افزارها</option>
            <option value="fbx">FBX - مناسب برای انیمیشن و بازی</option>
            <option value="stl">STL - مناسب برای پرینت سه‌بعدی</option>
          </select>

          <label>سطح فشرده‌سازی:</label>
          <select 
            value={options.compression}
            onChange={(e) => setOptions({...options, compression: e.target.value})}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          >
            <option value="none">بدون فشرده‌سازی (100%)</option>
            <option value="low">کم (70%)</option>
            <option value="medium">متوسط (50%)</option>
            <option value="high">زیاد (30%)</option>
          </select>

          <label>
            <input 
              type="checkbox" 
              checked={options.optimize}
              onChange={(e) => setOptions({...options, optimize: e.target.checked})}
            />
            بهینه‌سازی خودکار
          </label>
          
          <label style={{ marginLeft: '20px' }}>
            <input 
              type="checkbox" 
              checked={options.preserveTextures}
              onChange={(e) => setOptions({...options, preserveTextures: e.target.checked})}
            />
            حفظ بافت‌ها
          </label>
        </div>

        <button 
          onClick={handleConvert}
          disabled={!file || converting}
          style={{
            backgroundColor: converting ? '#ccc' : '#0070f3',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: converting ? 'not-allowed' : 'pointer'
          }}
        >
          {converting ? '⏳ در حال تبدیل...' : '🔄 شروع تبدیل'}
        </button>

        {result && (
          <div style={{ 
            marginTop: '20px', 
            padding: '20px', 
            backgroundColor: '#f0f8f0', 
            border: '1px solid #0a0', 
            borderRadius: '5px' 
          }}>
            <h3>✅ تبدیل موفقیت‌آمیز</h3>
            <p>فایل خروجی: {result.convertedFile}</p>
            <p>فرمت: {result.format.toUpperCase()}</p>
            <p>حجم: {(result.size / 1024 / 1024).toFixed(2)} MB</p>
            <button 
              onClick={() => {
                const a = document.createElement('a');
                a.href = result.downloadUrl;
                a.download = result.convertedFile;
                a.click();
              }}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              ⬇️ دانلود فایل تبدیل شده
            </button>
          </div>
        )}
      </div>
    </>
  );
}
