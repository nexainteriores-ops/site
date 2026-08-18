import { useState, useRef, ChangeEvent, MouseEvent, TouchEvent } from 'react';
import { Camera, Upload, Image as ImageIcon, ArrowRight, RefreshCw, CheckCircle2, Sparkles, MoveRight, Info, Eraser, FileSpreadsheet } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';

type CatalogItemType = {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  colors?: string[];
  imageUrl?: string;
};

const DEFAULT_CATALOG: CatalogItemType[] = [
  { id: '1', name: 'Mid-Century Modern Yellow Sofa', category: 'sofa', icon: '🛋️', description: 'A vibrant, comfortable centerpiece.' },
  { id: '2', name: 'Industrial Oak Dining Table', category: 'table', icon: '🪑', description: 'Sturdy wood with metal legs.' },
  { id: '3', name: 'Minimalist Arc Floor Lamp', category: 'lamp', icon: '💡', description: 'Sleek lighting for any corner.' },
  { id: '4', name: 'Velvet Navy Blue Armchair', category: 'chair', icon: '💺', description: 'Luxurious seating with gold accents.' },
  { id: '5', name: 'Bohemian Woven Area Rug', category: 'rug', icon: '🧶', description: 'Adds warmth and texture to the floor.' },
  { id: '6', name: 'Abstract Canvas Wall Art', category: 'decor', icon: '🖼️', description: 'A splash of color for empty walls.' },
];

const COLORS = [
  { name: 'Red', class: 'bg-red-500' },
  { name: 'Blue', class: 'bg-blue-500' },
  { name: 'Green', class: 'bg-green-500' },
  { name: 'Black', class: 'bg-stone-900' },
  { name: 'White', class: 'bg-white border border-stone-200' },
  { name: 'Brown', class: 'bg-amber-800' },
  { name: 'Grey', class: 'bg-stone-500' },
  { name: 'Yellow', class: 'bg-yellow-400' },
];

type Step = 'upload' | 'analyzing' | 'cleanup' | 'select' | 'processing' | 'result';

export default function App() {
  const [step, setStep] = useState<Step>('upload');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [catalogItems, setCatalogItems] = useState<CatalogItemType[]>(DEFAULT_CATALOG);
  const [selectedItem, setSelectedItem] = useState<CatalogItemType | null>(null);
  const [selectedColor, setSelectedColor] = useState<{name: string, class: string} | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Detection & Cleanup State
  const [detectedItems, setDetectedItems] = useState<string[]>([]);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [imageAspectRatio, setImageAspectRatio] = useState<string>('1:1');

  const getClosestAspectRatio = (width: number, height: number) => {
    const ratio = width / height;
    const ratios = [
      { name: '1:1', val: 1 },
      { name: '4:3', val: 4/3 },
      { name: '3:4', val: 3/4 },
      { name: '16:9', val: 16/9 },
      { name: '9:16', val: 9/16 }
    ];
    let closest = ratios[0];
    let minDiff = Math.abs(ratio - ratios[0].val);
    for (let i = 1; i < ratios.length; i++) {
      const diff = Math.abs(ratio - ratios[i].val);
      if (diff < minDiff) {
        minDiff = diff;
        closest = ratios[i];
      }
    }
    return closest.name;
  };

  // Bounding Box State
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [boundingBox, setBoundingBox] = useState<{ymin: number, xmin: number, ymax: number, xmax: number} | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  // Mouse events for drawing
  const handleMouseDown = (e: MouseEvent) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPos({ x, y });
    setCurrentPos({ x, y });
    setIsDrawing(true);
    setBoundingBox(null);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrawing || !imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    setCurrentPos({ x, y });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !imageContainerRef.current) return;
    setIsDrawing(false);
    const rect = imageContainerRef.current.getBoundingClientRect();

    const xmin = Math.round((Math.min(startPos.x, currentPos.x) / rect.width) * 1000);
    const ymin = Math.round((Math.min(startPos.y, currentPos.y) / rect.height) * 1000);
    const xmax = Math.round((Math.max(startPos.x, currentPos.x) / rect.width) * 1000);
    const ymax = Math.round((Math.max(startPos.y, currentPos.y) / rect.height) * 1000);

    if (xmax - xmin > 10 && ymax - ymin > 10) {
      setBoundingBox({ ymin, xmin, ymax, xmax });
    } else {
      setBoundingBox(null);
    }
  };

  // Touch events for drawing
  const handleTouchStart = (e: TouchEvent) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    setStartPos({ x, y });
    setCurrentPos({ x, y });
    setIsDrawing(true);
    setBoundingBox(null);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDrawing || !imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(touch.clientY - rect.top, rect.height));
    setCurrentPos({ x, y });
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      
      const img = new Image();
      img.onload = () => {
        setImageAspectRatio(getClosestAspectRatio(img.width, img.height));
        setOriginalImage(base64);
        setMimeType(file.type);
        analyzeImage(base64, file.type);
        setError(null);
      };
      img.src = base64;
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (base64: string, mimeType: string) => {
    setStep('analyzing');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const base64Data = base64.split(',')[1];
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            inlineData: { data: base64Data, mimeType }
          },
          "List the main furniture and decor items in this room. Be concise."
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of furniture and decor items detected in the image."
          }
        }
      });
      
      const items = JSON.parse(response.text || '[]');
      setDetectedItems(items);
      setStep('cleanup');
    } catch (err) {
      console.error("Detection failed", err);
      setStep('select');
    }
  };

  const handleRemoveItem = async (itemToRemove: string) => {
    if (!originalImage) return;
    setIsRemoving(itemToRemove);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const base64Data = originalImage.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: `Remove the ${itemToRemove} from this image completely and seamlessly fill in the background. CRITICAL: DO NOT change, resize, or modify any other objects, walls, windows, or the perspective of the room. Preserve the original image exactly as it is, except for the removed item.` }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: imageAspectRatio
          }
        }
      });

      let generatedImageUrl = null;
      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (generatedImageUrl) {
        setOriginalImage(generatedImageUrl);
        setDetectedItems(prev => prev.filter(i => i !== itemToRemove));
      } else {
        throw new Error('Failed to remove item.');
      }
    } catch (err: any) {
      console.error("Removal failed", err);
      setError(`Failed to remove ${itemToRemove}. Please try again.`);
    } finally {
      setIsRemoving(null);
    }
  };

  const handleCsvUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        
        const newItems: CatalogItemType[] = [];
        
        // Skip header (assuming first row is header like: Name, Category, Description, Colors, Image URL)
        for (let i = 1; i < lines.length; i++) {
          // Simple CSV parse handling basic quotes
          const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)?.map(s => s.replace(/^"|"$/g, '').trim()) || [];
          
          if (row.length >= 2) {
             const name = row[0] || `Item ${i}`;
             const category = row[1] || 'decor';
             const description = row[2] || '';
             const colorsStr = row[3] || '';
             const imageUrl = row[4] || '';
             
             const itemColors = colorsStr.split(';').map(c => c.trim()).filter(c => c);
             
             newItems.push({
               id: `custom-${i}`,
               name,
               category,
               icon: '📦', // generic icon for custom items
               description,
               colors: itemColors.length > 0 ? itemColors : undefined,
               imageUrl: imageUrl.length > 0 ? imageUrl : undefined
             });
          }
        }
        
        if (newItems.length > 0) {
          setCatalogItems(newItems);
          alert(`Successfully loaded ${newItems.length} items from your inventory!`);
        } else {
          alert('Could not find any valid items in the CSV. Please ensure it has columns like: Name, Category, Description, Colors, Image URL (separated by comma)');
        }
      } catch (err) {
        console.error("CSV Parse Error", err);
        alert('Error parsing CSV file.');
      }
    };
    reader.readAsText(file);
  };

  const handleGenerate = async (colorOverride?: {name: string, class: string} | null) => {
    const activeColor = colorOverride !== undefined ? colorOverride : selectedColor;
    if (!originalImage || !boundingBox || !selectedItem) {
      setError('Please draw a box around the object to replace and select an item from the catalog.');
      return;
    }

    setStep('processing');
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const base64Data = originalImage.split(',')[1];
      const colorPrefix = activeColor ? `${activeColor.name} ` : '';
      let prompt = `Replace the object within the bounding box [${boundingBox.ymin}, ${boundingBox.xmin}, ${boundingBox.ymax}, ${boundingBox.xmax}] with a ${colorPrefix}${selectedItem.name}. Make sure it is proportionally correct for the space, matches the lighting, and looks realistic. CRITICAL: DO NOT alter, move, or resize any other objects, walls, windows, or the background in the room. Keep the rest of the image exactly the same.`;

      const parts: any[] = [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        }
      ];

      // If item has an image URL, fetch it and add as reference
      if (selectedItem.imageUrl) {
        try {
          // Use a cors proxy to avoid CORS issues from random user URLs
          const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(selectedItem.imageUrl)}`;
          const imgRes = await fetch(proxyUrl);
          if (imgRes.ok) {
            const blob = await imgRes.blob();
            const base64Image = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            });
            const imgMimeType = base64Image.split(';')[0].split(':')[1];
            const imgData = base64Image.split(',')[1];
            
            parts.push({
              inlineData: {
                data: imgData,
                mimeType: imgMimeType,
              }
            });
            
            prompt += ` Use the second provided image as a direct visual reference for the exact product to place in the room.`;
          }
        } catch (err) {
          console.error("Failed to fetch reference image", err);
          // Continue without reference image
        }
      }

      parts.push({ text: prompt });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: parts,
        },
        config: {
          imageConfig: {
            aspectRatio: imageAspectRatio
          }
        }
      });

      let generatedImageUrl = null;
      
      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (generatedImageUrl) {
        setResultImage(generatedImageUrl);
        setStep('result');
      } else {
        throw new Error('No image was generated. Please try again.');
      }

    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate image. Please try again.');
      setStep('select');
    }
  };

  const reset = () => {
    setStep('upload');
    setOriginalImage(null);
    setBoundingBox(null);
    setIsDrawing(false);
    setSelectedItem(null);
    setSelectedColor(null);
    setResultImage(null);
    setError(null);
    setDetectedItems([]);
    setIsRemoving(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-stone-200">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-800 font-semibold text-lg tracking-tight">
            <Sparkles className="w-5 h-5 text-amber-500" />
            RoomReimagine
          </div>
          {step !== 'upload' && (
            <button 
              onClick={reset}
              className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
            >
              Start Over
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          
          {/* UPLOAD STEP */}
          {step === 'upload' && (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto text-center space-y-8"
            >
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-900">
                  Visualize new furniture in your space.
                </h1>
                <p className="text-lg text-stone-500 max-w-xl mx-auto">
                  Take a photo of your room, tell us what you want to replace, and see how our catalog items look in your home instantly.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-8">
                <button 
                  onClick={() => cameraInputRef.current?.click()}
                  className="group relative flex flex-col items-center justify-center gap-4 p-8 rounded-3xl border-2 border-stone-200 bg-white hover:border-amber-500 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-full bg-stone-100 group-hover:bg-amber-100 flex items-center justify-center transition-colors">
                    <Camera className="w-8 h-8 text-stone-600 group-hover:text-amber-600" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-stone-900">Take a Photo</h3>
                    <p className="text-sm text-stone-500">Use your device camera</p>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment" 
                    className="hidden" 
                    ref={cameraInputRef}
                    onChange={handleFileUpload}
                  />
                </button>

                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative flex flex-col items-center justify-center gap-4 p-8 rounded-3xl border-2 border-stone-200 bg-white hover:border-amber-500 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-full bg-stone-100 group-hover:bg-amber-100 flex items-center justify-center transition-colors">
                    <Upload className="w-8 h-8 text-stone-600 group-hover:text-amber-600" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-stone-900">Upload Image</h3>
                    <p className="text-sm text-stone-500">Choose from your gallery</p>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                </button>
              </div>

              <div className="pt-8 border-t border-stone-200">
                <button 
                  onClick={() => csvInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-sm font-medium transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Import Store Inventory (CSV)
                </button>
                <input 
                  type="file" 
                  accept=".csv" 
                  className="hidden" 
                  ref={csvInputRef}
                  onChange={handleCsvUpload}
                />
                <p className="text-xs text-stone-400 mt-2">Format: Name, Category, Description, Colors (separated by ;), Image URL</p>
              </div>
            </motion.div>
          )}

          {/* ANALYZING STEP */}
          {step === 'analyzing' && (
            <motion.div 
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto text-center py-20 space-y-6"
            >
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-stone-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-stone-900">Analyzing your space...</h2>
                <p className="text-stone-500">Identifying furniture and decor items.</p>
              </div>
            </motion.div>
          )}

          {/* CLEANUP STEP */}
          {step === 'cleanup' && (
            <motion.div 
              key="cleanup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-[1fr_400px] gap-8 items-start"
            >
              {/* Left: Image Preview */}
              <div className="space-y-4">
                <div className="flex justify-center bg-stone-200 rounded-3xl overflow-hidden border border-stone-200 relative shadow-sm">
                  {originalImage && (
                    <img 
                      src={originalImage} 
                      alt="Your room" 
                      className={`max-h-[60vh] w-auto block transition-opacity ${isRemoving ? 'opacity-50' : 'opacity-100'}`}
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {isRemoving && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm">
                       <RefreshCw className="w-10 h-10 text-white animate-spin mb-4" />
                       <div className="bg-white/90 px-4 py-2 rounded-full font-medium text-sm shadow-lg">
                         Erasing {isRemoving}...
                       </div>
                    </div>
                  )}
                </div>
                <div className="flex items-start gap-3 p-4 bg-amber-50 text-amber-800 rounded-2xl text-sm">
                  <Info className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>We detected these items in your room. You can erase them to clear up space before adding new furniture.</p>
                </div>
              </div>

              {/* Right: Controls */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-8">
                <div className="space-y-4">
                  <label className="block font-semibold text-stone-900 text-lg">
                    Clean up your space (Optional)
                  </label>
                  <p className="text-sm text-stone-500">
                    Click any detected item to remove it from the photo.
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {detectedItems.length > 0 ? detectedItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleRemoveItem(item)}
                        disabled={!!isRemoving}
                        className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-stone-200 rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {item}
                        <Eraser className="w-4 h-4" />
                      </button>
                    )) : (
                      <div className="text-sm text-stone-400 italic">No items detected or all items removed.</div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                    {error}
                  </div>
                )}

                <div className="pt-4 border-t border-stone-100">
                  <button 
                    onClick={() => setStep('select')}
                    disabled={!!isRemoving}
                    className="w-full py-4 px-6 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-md"
                  >
                    Continue to Add Furniture
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* SELECT STEP */}
          {step === 'select' && (
            <motion.div 
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-[1fr_400px] gap-8 items-start"
            >
              {/* Left: Image Preview */}
              <div className="space-y-4">
                <div 
                  ref={imageContainerRef}
                  className="aspect-[4/3] md:aspect-[16/9] lg:aspect-[4/3] rounded-3xl overflow-hidden bg-stone-200 border border-stone-200 relative shadow-sm touch-none cursor-crosshair"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleMouseUp}
                >
                  {originalImage && (
                    <img 
                      src={originalImage} 
                      alt="Your room" 
                      className="w-full h-full object-cover pointer-events-none select-none"
                      referrerPolicy="no-referrer"
                      draggable={false}
                    />
                  )}
                  
                  {/* Drawing Box */}
                  {isDrawing && (
                    <div 
                      className="absolute border-2 border-amber-500 bg-amber-500/20"
                      style={{
                        left: Math.min(startPos.x, currentPos.x),
                        top: Math.min(startPos.y, currentPos.y),
                        width: Math.abs(currentPos.x - startPos.x),
                        height: Math.abs(currentPos.y - startPos.y),
                      }}
                    />
                  )}

                  {/* Final Box */}
                  {!isDrawing && boundingBox && (
                    <div 
                      className="absolute border-2 border-green-500 bg-green-500/20"
                      style={{
                        left: `${(boundingBox.xmin / 1000) * 100}%`,
                        top: `${(boundingBox.ymin / 1000) * 100}%`,
                        width: `${((boundingBox.xmax - boundingBox.xmin) / 1000) * 100}%`,
                        height: `${((boundingBox.ymax - boundingBox.ymin) / 1000) * 100}%`,
                      }}
                    />
                  )}
                  
                  {/* Instruction Overlay */}
                  {!isDrawing && !boundingBox && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
                      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-stone-900 shadow-lg flex items-center gap-2">
                        <MoveRight className="w-4 h-4" />
                        Draw a box around the object
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-start gap-3 p-4 bg-amber-50 text-amber-800 rounded-2xl text-sm">
                  <Info className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>Draw a box over the object you want to replace. Our AI will seamlessly swap it with your chosen catalog item.</p>
                </div>
              </div>

              {/* Right: Controls */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-8">
                
                {/* Target Selection Status */}
                <div className="space-y-3">
                  <label className="block font-semibold text-stone-900">
                    1. Select the object to replace
                  </label>
                  <div className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-colors ${boundingBox ? 'border-green-500 bg-green-50 text-green-700' : 'border-amber-500 bg-amber-50 text-amber-700'}`}>
                    {boundingBox ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-medium">Object selected</span>
                        <button onClick={() => setBoundingBox(null)} className="ml-auto text-sm underline hover:text-green-900">Clear</button>
                      </>
                    ) : (
                      <>
                        <MoveRight className="w-5 h-5" />
                        <span className="font-medium">Draw a box on the image</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Catalog Selection */}
                <div className="space-y-3">
                  <label className="block font-semibold text-stone-900">
                    2. Choose a replacement from our catalog
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 pb-2 custom-scrollbar">
                    {catalogItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`text-left p-4 rounded-2xl border-2 transition-all ${
                          selectedItem?.id === item.id 
                            ? 'border-amber-500 bg-amber-50' 
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        {item.imageUrl ? (
                          <div className="w-12 h-12 mb-2 rounded-lg overflow-hidden bg-stone-100 flex items-center justify-center">
                            <img 
                              src={item.imageUrl} 
                              alt={item.name} 
                              className="w-full h-full object-cover" 
                              onError={(e) => { 
                                (e.target as HTMLImageElement).style.display = 'none'; 
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); 
                              }} 
                            />
                            <span className="text-3xl hidden">{item.icon}</span>
                          </div>
                        ) : (
                          <div className="text-3xl mb-2">{item.icon}</div>
                        )}
                        <div className="font-medium text-stone-900 text-sm leading-tight mb-1">{item.name}</div>
                        <div className="text-xs text-stone-500 line-clamp-2">{item.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                    {error}
                  </div>
                )}

                <button 
                  onClick={() => handleGenerate()}
                  disabled={!boundingBox || !selectedItem}
                  className="w-full py-4 px-6 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <Sparkles className="w-5 h-5" />
                  Reimagine Space
                </button>
              </div>
            </motion.div>
          )}

          {/* PROCESSING STEP */}
          {step === 'processing' && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto text-center py-20 space-y-6"
            >
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-stone-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-2xl">
                  {selectedItem?.icon}
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-stone-900">Designing your space...</h2>
                <p className="text-stone-500">Our AI is carefully placing the {selectedItem?.name} into your room.</p>
              </div>
            </motion.div>
          )}

          {/* RESULT STEP */}
          {step === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-stone-900 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                  Here's your new look
                </h2>
                <p className="text-stone-500">We replaced the selected object with the {selectedColor ? `${selectedColor.name.toLowerCase()} ` : ''}{selectedItem?.name}.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-stone-500 uppercase tracking-wider px-2">Before</div>
                  <div className="flex justify-center bg-stone-200 rounded-3xl overflow-hidden border border-stone-200 shadow-sm">
                    {originalImage && (
                      <img 
                        src={originalImage} 
                        alt="Original room" 
                        className="max-h-[60vh] w-auto block grayscale-[20%]"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-semibold text-amber-600 uppercase tracking-wider px-2 flex items-center gap-2">
                    After <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="flex justify-center bg-stone-200 rounded-3xl overflow-hidden border-2 border-amber-200 shadow-lg relative">
                    {resultImage && (
                      <img 
                        src={resultImage} 
                        alt="Reimagined room" 
                        className="max-h-[60vh] w-auto block"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Color Picker Section */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 max-w-2xl mx-auto mt-8">
                <div className="text-center">
                  <h3 className="font-semibold text-stone-900">Try a different color</h3>
                  <p className="text-sm text-stone-500">Select a color to regenerate the item</p>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  {(selectedItem?.colors 
                    ? selectedItem.colors.map(c => COLORS.find(ec => ec.name.toLowerCase() === c.toLowerCase()) || { name: c, class: 'bg-stone-300' })
                    : COLORS
                  ).map((color) => (
                    <button
                      key={color.name}
                      onClick={() => {
                        setSelectedColor(color);
                        handleGenerate(color);
                      }}
                      className={`w-10 h-10 rounded-full shadow-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${color.class} ${selectedColor?.name === color.name ? 'ring-2 ring-offset-2 ring-amber-500 scale-110' : ''}`}
                      title={color.name}
                      aria-label={`Change color to ${color.name}`}
                    >
                      {/* Show first letter if it's a custom color without a specific tailwind class */}
                      {color.class === 'bg-stone-300' && (
                        <span className="text-xs font-medium text-stone-600">{color.name.charAt(0).toUpperCase()}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-center pt-8">
                <button 
                  onClick={() => {
                    setStep('select');
                    setResultImage(null);
                    setSelectedColor(null);
                  }}
                  className="py-3 px-8 bg-white border-2 border-stone-200 hover:border-stone-300 text-stone-900 rounded-xl font-semibold flex items-center gap-2 transition-colors shadow-sm"
                >
                  <RefreshCw className="w-5 h-5" />
                  Try another item
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
      
      {/* Custom scrollbar styles for the catalog grid */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e7e5e4;
          border-radius: 10px;
        }
      `}} />
    </div>
  );
}
