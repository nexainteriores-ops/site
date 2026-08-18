import { useState, useEffect, useRef, ChangeEvent, MouseEvent, TouchEvent } from 'react';
import { Camera, Upload, RefreshCw, CheckCircle2, Sparkles, MoveRight, Info, Eraser, FileSpreadsheet, ArrowLeft, ArrowRight, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

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
  // Sofás
  { id: 'sofa-1', name: 'Sofá Design', category: 'sofa', icon: '🛋️', description: 'Design contemporâneo e linhas orgânicas fluidas.', imageUrl: '/images/sofas/s1.webp' },
  { id: 'sofa-2', name: 'Sofá Contemporâneo', category: 'sofa', icon: '🛋️', description: 'Estrutura robusta com conforto ultra premium.', imageUrl: '/images/sofas/s2.webp' },
  { id: 'sofa-4', name: 'Sofá Minimalista', category: 'sofa', icon: '🛋️', description: 'Linhas retas e design clean e sofisticado.', imageUrl: '/images/sofas/s4.webp' },
  { id: 'sofa-6', name: 'Sofá Elegance', category: 'sofa', icon: '🛋️', description: 'Sofá luxuoso com acabamentos impecáveis.', imageUrl: '/images/sofas/s6_v3.webp' },

  // Poltronas
  { id: 'poltrona-1', name: 'Poltrona Exclusiva', category: 'chair', icon: '💺', description: 'Linhas curvas sofisticadas e base giratória refinada.', imageUrl: '/images/poltronas/74594662-DCB1-42B4-BB1D-B1A85BD3FDC0.webp' },
  { id: 'poltrona-2', name: 'Poltrona Classic', category: 'chair', icon: '💺', description: 'Conforto atemporal com alto padrão de estofamento.', imageUrl: '/images/poltronas/p1.webp' },
  { id: 'poltrona-3', name: 'Poltrona Velvet', category: 'chair', icon: '💺', description: 'Toque aveludado luxuoso e ergonomia perfeita.', imageUrl: '/images/poltronas/p2.webp' },
  { id: 'poltrona-4', name: 'Poltrona Lounge', category: 'chair', icon: '💺', description: 'Ideal para ambientes de leitura e descanso premium.', imageUrl: '/images/poltronas/p4.webp' },

  // Salas de Jantar / Mesas
  { id: 'mesa-1', name: 'Mesa de Jantar Alto Padrão', category: 'table', icon: '🪑', description: 'Tampo nobre e pés esculturais de design exclusivo.', imageUrl: '/images/salas-de-jantar/D976339B-E0C1-4249-A47F-E6C2C9FB7EF7.webp' },
  { id: 'mesa-2', name: 'Mesa de Jantar Exclusiva', category: 'table', icon: '🪑', description: 'Mesa contemporânea ideal para jantares sofisticados.', imageUrl: '/images/salas-de-jantar/m2.webp' },
  { id: 'mesa-3', name: 'Mesa de Jantar Clássica', category: 'table', icon: '🪑', description: 'Elegância clássica com materiais de altíssima qualidade.', imageUrl: '/images/salas-de-jantar/m3.webp' },
];

const COLORS = [
  { name: 'Vermelho', class: 'bg-red-500' },
  { name: 'Azul', class: 'bg-blue-500' },
  { name: 'Verde', class: 'bg-green-500' },
  { name: 'Preto', class: 'bg-[#06120F] border border-white/10' },
  { name: 'Branco', class: 'bg-white border border-stone-200' },
  { name: 'Marrom', class: 'bg-amber-800' },
  { name: 'Cinza', class: 'bg-stone-500' },
  { name: 'Amarelo', class: 'bg-yellow-400' },
];

type Step = 'upload' | 'analyzing' | 'cleanup' | 'select' | 'processing' | 'result';

export default function Reimagine() {
  useEffect(() => {
    const loader = document.getElementById('app-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.remove();
      }, 500);
    }
  }, []);

  const [step, setStep] = useState<Step>('upload');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [catalogItems, setCatalogItems] = useState<CatalogItemType[]>(DEFAULT_CATALOG);
  const [selectedItem, setSelectedItem] = useState<CatalogItemType | null>(null);
  const [selectedColor, setSelectedColor] = useState<{name: string, class: string} | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Vídeo 3D State
  const [videoFileId, setVideoFileId] = useState<string | null>(null);
  const [videoState, setVideoState] = useState<'idle' | 'generating' | 'polling' | 'ready' | 'failed'>('idle');

  // Detection & Cleanup State
  const [detectedItems, setDetectedItems] = useState<string[]>([]);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [imageAspectRatio, setImageAspectRatio] = useState<string>('1:1');
  const [roomDescription, setRoomDescription] = useState<string>('');
  const [detectedObjects, setDetectedObjects] = useState<{
    name: string;
    box: {
      ymin: number;
      xmin: number;
      ymax: number;
      xmax: number;
    };
  }[]>([]);

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

  // Bounding Box & Placement State
  const [boundingBox, setBoundingBox] = useState<{ymin: number, xmin: number, ymax: number, xmax: number} | null>(null);
  const [placementPoint, setPlacementPoint] = useState<{ x: number; y: number } | null>(null);
  const [customScale, setCustomScale] = useState<number>(300); // 300 = 30% da largura da imagem
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const updateBoundingBox = (point: { x: number; y: number }, scale: number) => {
    const ratio = 1.15; // proporção altura/largura aproximada do móvel
    const width = scale;
    const height = Math.round(scale * ratio);

    let xmin = Math.max(0, Math.round(point.x - width / 2));
    let xmax = Math.min(1000, Math.round(point.x + width / 2));
    let ymax = Math.min(1000, Math.round(point.y)); // Base da caixa é ancorada no piso
    let ymin = Math.max(0, Math.round(point.y - height)); // Altura é projetada para cima

    setBoundingBox({ ymin, xmin, ymax, xmax });
  };

  const handleImageClick = (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    
    let clientX = 0;
    let clientY = 0;
    
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const xRelative = ((clientX - rect.left) / rect.width) * 1000;
    const yRelative = ((clientY - rect.top) / rect.height) * 1000;
    
    const newPoint = { x: xRelative, y: yRelative };
    setPlacementPoint(newPoint);
    updateBoundingBox(newPoint, customScale);
  };

  const handleScaleChange = (newScale: number) => {
    setCustomScale(newScale);
    if (placementPoint) {
      updateBoundingBox(placementPoint, newScale);
    }
  };

  const handleSelectDetectedObject = (obj: { name: string; box: { ymin: number; xmin: number; ymax: number; xmax: number } }) => {
    setBoundingBox(obj.box);
    setPlacementPoint(null); // Desativa a escala manual para usar a detecção original
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
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mimeType })
      });
      if (!res.ok) {
        throw new Error("Falha na análise do cômodo pelo servidor.");
      }
      const data = await res.json();
      setRoomDescription(data.roomDescription || '');
      setDetectedObjects(data.detectedObjects || []);
      const itemsList = (data.detectedObjects || []).map((o: any) => o.name);
      setDetectedItems(itemsList);
      setStep('cleanup');
    } catch (err: any) {
      console.error("Detecção de objetos falhou", err);
      setError(err.message || "Erro na análise da imagem.");
      setStep('select');
    }
  };

  const handleRemoveItem = async (itemToRemove: string) => {
    if (!originalImage) return;
    setIsRemoving(itemToRemove);
    setError(null);
    try {
      const targetObj = detectedObjects.find(o => o.name === itemToRemove);
      const base64Data = originalImage.split(',')[1] || originalImage;
      
      let prompt = `Remove the "${itemToRemove}" from the image. Seamlessly inpaint and reconstruct the background (e.g., the flooring, wall textures, skirting boards, or curtains behind it) to match the surrounding area. CRITICAL: Do not alter, resize, blur, or modify any other elements, furniture, lighting, or the overall structure of the room. The edit must be invisible and look like the room was originally photographed without the ${itemToRemove}.`;
      
      if (targetObj?.box) {
        const { ymin, xmin, ymax, xmax } = targetObj.box;
        prompt = `Remove the object inside the bounding box [${ymin}, ${xmin}, ${ymax}, ${xmax}] from the image. The object is a "${itemToRemove}". Seamlessly inpaint and reconstruct the background (e.g. flooring, wall textures, skirting boards, or curtains behind it) within this bounding box area to match the surrounding room. CRITICAL: Do not alter, resize, blur, or modify any other elements, furniture, lighting, or the overall structure of the room outside the bounding box. The edit must be completely invisible and natural.`;
      }
      
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalImageBase64: base64Data,
          mimeType,
          prompt,
          aspectRatio: imageAspectRatio
        })
      });

      if (!res.ok) {
        throw new Error("Erro no servidor ao tentar remover objeto.");
      }
      
      const data = await res.json();
      if (data.imageUrl) {
        setOriginalImage(data.imageUrl);
        setDetectedItems(prev => prev.filter(i => i !== itemToRemove));
      } else {
        throw new Error('Falha ao apagar o objeto.');
      }
    } catch (err: any) {
      console.error("Falha ao apagar objeto", err);
      setError(`Falha ao remover ${itemToRemove}. Por favor, tente novamente.`);
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
        
        for (let i = 1; i < lines.length; i++) {
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
               icon: '📦',
               description,
               colors: itemColors.length > 0 ? itemColors : undefined,
               imageUrl: imageUrl.length > 0 ? imageUrl : undefined
             });
          }
        }
        
        if (newItems.length > 0) {
          setCatalogItems(newItems);
          alert(`Sucesso! ${newItems.length} itens foram carregados no inventário!`);
        } else {
          alert('Não foi possível encontrar itens válidos no arquivo. Certifique-se de que o cabeçalho contenha: Name, Category, Description, Colors, Image URL');
        }
      } catch (err) {
        console.error("Falha ao processar o CSV", err);
        alert('Erro ao ler o arquivo CSV.');
      }
    };
    reader.readAsText(file);
  };

  const handleGenerate = async (colorOverride?: {name: string, class: string} | null) => {
    const activeColor = colorOverride !== undefined ? colorOverride : selectedColor;
    if (!originalImage || !boundingBox || !selectedItem) {
      setError('Por favor, desenhe uma caixa ao redor do objeto que quer substituir e escolha um item do catálogo.');
      return;
    }

    setStep('processing');
    setError(null);

    try {
      const base64Data = originalImage.split(',')[1] || originalImage;
      const colorPrefix = activeColor ? `${activeColor.name} ` : '';
      let prompt = `Replace the object inside the bounding box [${boundingBox.ymin}, ${boundingBox.xmin}, ${boundingBox.ymax}, ${boundingBox.xmax}] with the item "${colorPrefix}${selectedItem.name}".

ROOM GEOMETRY & STYLE CONTEXT (IMMEDIATELY APPLICABLE TO PLACEMENT):
- Structural Description: ${roomDescription || "Fundo com piso e parede estruturais a serem mantidos integrados."}

TECHNICAL EXECUTION RULES FOR LUXURY INTERIOR ARCHITECTURE:
1. BACKGROUND PRESERVATION: Keep 100% of the original background, walls, flooring, curtains, doors, windows, and surrounding decorations exactly as they are in the original image. Only modify the area inside the specified bounding box.
2. REFERENCE FUSION: The second provided image is a catalog product photo of the "${selectedItem.name}". Extract only the product itself from this reference image. Completely ignore its white/studio background.
3. 3D PERSPECTIVE ALIGNMENT: Dynamically rotate, tilt, and scale the product to perfectly match the 3D perspective, angle, and floor plane of the room. It must look like it is physically sitting on the floor.
4. LIGHTING & REFLECTIONS: Adjust the product's lighting, highlights, shadows, and color temperature to blend naturally with the light sources in the room (e.g. windows, lamps).
5. SOFT CONTACT SHADOWS: Generate realistic, soft contact shadows (ambient occlusion shadows) on the floor directly underneath the product to ground it in the space.
6. DESIGN FIDELITY: The shape, materials, fabric texture, and details of the placed item must stay highly faithful to the reference product image. Do not invent a different design.`;

      let referenceImageBase64 = null;
      let referenceMimeType = null;

      // Se o item tiver uma imagem do catálogo Nexa, envia-a como referência
      if (selectedItem.imageUrl) {
        try {
          let url = selectedItem.imageUrl;
          if (!url.startsWith('/') && !url.startsWith(window.location.origin)) {
            url = `https://corsproxy.io/?${encodeURIComponent(url)}`;
          } else {
            url = window.location.origin + url;
          }
          const imgRes = await fetch(url);
          if (imgRes.ok) {
            const blob = await imgRes.blob();
            const base64Image = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            });
            referenceMimeType = base64Image.split(';')[0].split(':')[1];
            referenceImageBase64 = base64Image.split(',')[1];
            
            prompt += `\nCRITICAL REFERENCE INSTRUCTION: The second image contains the exact product design to place. Carefully copy its design, color, structure, and fabric texture, and place it at the correct 3D perspective inside the bounding box of the first image. Ignore the white background of the product image.`;
          }
        } catch (err) {
          console.error("Erro ao carregar a imagem de referência", err);
        }
      }

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalImageBase64: base64Data,
          mimeType,
          referenceImageBase64,
          referenceMimeType,
          prompt,
          aspectRatio: imageAspectRatio
        })
      });

      if (!res.ok) {
        throw new Error("Erro no servidor ao tentar gerar a imagem.");
      }

      const data = await res.json();
      if (data.imageUrl) {
        setResultImage(data.imageUrl);
        setStep('result');
        // Resetar o estado do vídeo anterior
        setVideoFileId(null);
        setVideoState('idle');
      } else {
        throw new Error('Nenhuma imagem foi gerada pela IA. Por favor, tente novamente.');
      }

    } catch (err: any) {
      console.error('Erro na geração:', err);
      setError(err.message || 'Falha ao processar e projetar o móvel. Tente de novo.');
      setStep('select');
    }
  };

  const handleGenerateVideo = async () => {
    if (!resultImage || !selectedItem) return;
    setVideoState('generating');
    setError(null);
    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: resultImage,
          mimeType: 'image/png',
          productName: selectedItem.name
        })
      });

      if (!res.ok) throw new Error("Falha ao criar requisição de vídeo no servidor.");
      const { fileId } = await res.json();
      
      if (!fileId) throw new Error("ID de arquivo do vídeo ausente.");

      setVideoFileId(fileId);
      setVideoState('polling');

      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/file-status/${fileId}`);
          if (statusRes.ok) {
            const { state } = await statusRes.json();
            if (state === 'ACTIVE') {
              clearInterval(pollInterval);
              setVideoState('ready');
            } else if (state === 'FAILED') {
              clearInterval(pollInterval);
              setVideoState('failed');
            }
          }
        } catch (e) {
          console.error("Erro no polling do status do vídeo", e);
        }
      }, 3000);

    } catch (e: any) {
      console.error("Erro na geração do vídeo", e);
      setError(e.message || "Erro na geração do vídeo 3D.");
      setVideoState('failed');
    }
  };

  const reset = () => {
    setStep('upload');
    setOriginalImage(null);
    setBoundingBox(null);
    setSelectedItem(null);
    setSelectedColor(null);
    setResultImage(null);
    setError(null);
    setDetectedItems([]);
    setIsRemoving(null);
    setRoomDescription('');
    setDetectedObjects([]);
    setVideoFileId(null);
    setVideoState('idle');
  };

  return (
    <div className="min-h-screen bg-[#06120F] text-white font-sans relative">
      {/* Background Texture Overlay */}
      <div 
        className="absolute inset-0 -z-10 opacity-30"
        style={{ 
          backgroundImage: "url('/images/textura.webp')",
          backgroundSize: "800px auto",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
        }}
      />

      {/* Header */}
      <header className="border-b border-white/5 bg-[#06120F]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <ArrowLeft className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-sm font-medium text-white/70">Voltar para o Início</span>
          </Link>
          <div className="flex items-center gap-2 font-display font-semibold text-lg tracking-wider text-[#D4AF37]">
            <Sparkles className="w-5 h-5" />
            REIMAGINE SEU AMBIENTE
          </div>
          {step !== 'upload' ? (
            <button 
              onClick={reset}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all rounded-full cursor-pointer"
            >
              Recomeçar
            </button>
          ) : (
            <div className="w-24 md:block hidden" />
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          
          {/* UPLOAD STEP */}
          {step === 'upload' && (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto text-center space-y-10 py-10"
            >
              <div className="space-y-4">
                <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.3em] font-display">
                  Visualização por Inteligência Artificial
                </span>
                <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-gradient">
                  Reimagine seu espaço <br /> com as nossas peças.
                </h1>
                <p className="text-base md:text-lg text-white/60 max-w-xl mx-auto leading-relaxed">
                  Envie uma foto do seu ambiente atual, selecione um móvel do nosso catálogo e veja-o posicionado no seu espaço de forma realista e instantânea.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 pt-8">
                <button 
                  onClick={() => cameraInputRef.current?.click()}
                  className="group relative flex flex-col items-center justify-center gap-5 p-10 rounded-[2rem] border border-white/5 bg-white/5 hover:bg-white/10 hover:border-[#D4AF37]/40 transition-all duration-500 shadow-2xl cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-[#D4AF37]/10 flex items-center justify-center transition-colors border border-white/10 group-hover:border-[#D4AF37]/30">
                    <Camera className="w-6 h-6 text-white/80 group-hover:text-[#D4AF37] transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-white font-display text-lg">Tirar uma Foto</h3>
                    <p className="text-sm text-white/40">Use a câmera do seu celular</p>
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
                  className="group relative flex flex-col items-center justify-center gap-5 p-10 rounded-[2rem] border border-white/5 bg-white/5 hover:bg-white/10 hover:border-[#D4AF37]/40 transition-all duration-500 shadow-2xl cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-[#D4AF37]/10 flex items-center justify-center transition-colors border border-white/10 group-hover:border-[#D4AF37]/30">
                    <Upload className="w-6 h-6 text-white/80 group-hover:text-[#D4AF37] transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-white font-display text-lg">Carregar da Galeria</h3>
                    <p className="text-sm text-white/40">Escolha uma foto do seu dispositivo</p>
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

              <div className="pt-10 border-t border-white/5 max-w-lg mx-auto">
                <button 
                  onClick={() => csvInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 hover:text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#D4AF37]" />
                  Importar Inventário Físico (CSV)
                </button>
                <input 
                  type="file" 
                  accept=".csv" 
                  className="hidden" 
                  ref={csvInputRef}
                  onChange={handleCsvUpload}
                />
                <p className="text-[11px] text-white/30 mt-3">Layout esperado: Nome, Categoria, Descrição, Cores (separadas por ;), URL da Imagem</p>
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
              className="max-w-md mx-auto text-center py-24 space-y-6"
            >
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-white/5"></div>
                <div className="absolute inset-0 rounded-full border-4 border-[#D4AF37] border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-[#D4AF37] animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold font-display text-white">Analisando o espaço...</h2>
                <p className="text-white/50 text-sm">Nossa IA está identificando as peças e a disposição do ambiente.</p>
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
              className="grid lg:grid-cols-[1fr_420px] gap-10 items-start"
            >
              {/* Left: Image Preview */}
              <div className="space-y-4">
                <div className="flex justify-center bg-black/40 rounded-[2rem] overflow-hidden border border-white/5 relative shadow-2xl">
                  {originalImage && (
                    <img 
                      src={originalImage} 
                      alt="Seu cômodo" 
                      className={`max-h-[65vh] w-auto block transition-opacity duration-300 ${isRemoving ? 'opacity-40' : 'opacity-100'}`}
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {isRemoving && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                       <RefreshCw className="w-10 h-10 text-[#D4AF37] animate-spin mb-4" />
                       <div className="bg-[#06120F]/90 border border-white/10 px-6 py-3 rounded-full font-bold text-sm shadow-2xl text-[#D4AF37]">
                         Apagando {isRemoving}...
                       </div>
                    </div>
                  )}
                </div>
                <div className="flex items-start gap-3 p-5 bg-[#D4AF37]/5 border border-[#D4AF37]/10 text-white/80 rounded-2xl text-sm leading-relaxed">
                  <Info className="w-5 h-5 shrink-0 mt-0.5 text-[#D4AF37]" />
                  <p>Identificamos alguns móveis no seu espaço. Se você quiser remover algum para abrir espaço antes de colocar as peças novas, basta clicar no item abaixo.</p>
                </div>
              </div>

              {/* Right: Controls */}
              <div className="glass p-8 rounded-[2rem] border border-white/5 shadow-2xl space-y-8">
                <div className="space-y-4">
                  <label className="block font-display font-bold text-white text-xl">
                    Organize seu espaço (Opcional)
                  </label>
                  <p className="text-sm text-white/50 leading-relaxed">
                    Clique em qualquer objeto detectado para removê-lo digitalmente da foto.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {detectedItems.length > 0 ? detectedItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleRemoveItem(item)}
                        disabled={!!isRemoving}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-red-950/40 hover:text-red-400 hover:border-red-500/30 border border-white/10 rounded-full text-xs font-semibold tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {item}
                        <Eraser className="w-4 h-4 text-white/40" />
                      </button>
                    )) : (
                      <div className="text-sm text-white/30 italic">Nenhum item detectado ou todos removidos.</div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-950/20 text-red-400 border border-red-500/20 rounded-2xl text-sm">
                    {error}
                  </div>
                )}

                <div className="pt-4 border-t border-white/5">
                  <button 
                    onClick={() => setStep('select')}
                    disabled={!!isRemoving}
                    className="w-full py-4 px-6 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:brightness-110 disabled:from-stone-800 disabled:to-stone-900 disabled:text-white/40 disabled:cursor-not-allowed text-black font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg text-sm uppercase tracking-wider cursor-pointer"
                  >
                    Prosseguir para Móveis
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
              className="grid lg:grid-cols-[1fr_420px] gap-10 items-start"
            >
              {/* Left: Image Preview */}
              <div className="space-y-4">
                <div 
                  ref={imageContainerRef}
                  className="aspect-[4/3] md:aspect-[16/9] lg:aspect-[4/3] rounded-[2rem] overflow-hidden bg-black/40 border border-white/5 relative shadow-2xl cursor-pointer select-none"
                  onClick={handleImageClick}
                >
                  {originalImage && (
                    <img 
                      src={originalImage} 
                      alt="Seu cômodo" 
                      className="w-full h-full object-cover pointer-events-none select-none"
                      referrerPolicy="no-referrer"
                      draggable={false}
                    />
                  )}
                  
                  {/* Caixa Guia Interativa baseada no bounding box */}
                  {boundingBox && (
                    <div 
                      className="absolute border-2 border-[#D4AF37] bg-[#D4AF37]/10 flex flex-col items-center justify-center shadow-lg transition-all duration-150"
                      style={{
                        left: `${(boundingBox.xmin / 1000) * 100}%`,
                        top: `${(boundingBox.ymin / 1000) * 100}%`,
                        width: `${((boundingBox.xmax - boundingBox.xmin) / 1000) * 100}%`,
                        height: `${((boundingBox.ymax - boundingBox.ymin) / 1000) * 100}%`,
                      }}
                    >
                      {/* Silhueta Guia Transparente baseada na categoria */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-35 pointer-events-none select-none">
                        {selectedItem?.category === 'sofa' ? (
                          <span className="text-4xl filter drop-shadow">🛋️</span>
                        ) : selectedItem?.category === 'chair' ? (
                          <span className="text-4xl filter drop-shadow">💺</span>
                        ) : (
                          <span className="text-4xl filter drop-shadow">🪑</span>
                        )}
                      </div>
                      {/* Rótulo de escala/posição da base */}
                      {placementPoint && (
                        <div className="absolute bottom-1 bg-black/75 border border-[#D4AF37]/30 text-[9px] text-[#D4AF37] px-2 py-0.5 rounded font-mono pointer-events-none select-none">
                          Âncora no Piso
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Instruction Overlay */}
                  {!boundingBox && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none select-none">
                      <div className="bg-[#06120F]/90 border border-white/10 backdrop-blur-md px-5 py-3 rounded-full text-xs font-semibold tracking-wider text-[#D4AF37] shadow-2xl flex items-center gap-2">
                        <MoveRight className="w-4 h-4 animate-pulse" />
                        Clique no piso para definir onde colocar o móvel
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Slider de Escala do Móvel */}
                {boundingBox && placementPoint && (
                  <div className="glass p-5 rounded-2xl border border-white/5 shadow-lg space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-white/60">Tamanho Proporcional do Móvel</span>
                      <span className="text-[#D4AF37] font-mono">{Math.round(customScale / 10)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="120" 
                      max="450" 
                      value={customScale}
                      onChange={(e) => handleScaleChange(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                    />
                    <div className="flex justify-between text-[10px] text-white/40">
                      <span>Menor (Ao fundo)</span>
                      <span>Maior (À frente)</span>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-5 bg-[#D4AF37]/5 border border-[#D4AF37]/10 text-white/80 rounded-2xl text-sm leading-relaxed">
                  <Info className="w-5 h-5 shrink-0 mt-0.5 text-[#D4AF37]" />
                  <p>Clique no piso (chão) no local exato onde o móvel deve ficar, ou substitua um item existente do cômodo usando as opções ao lado. Ajuste a escala se necessário.</p>
                </div>
              </div>

              {/* Right: Controls */}
              <div className="glass p-8 rounded-[2rem] border border-white/5 shadow-2xl space-y-8">
                
                {/* Botões de Substituição Rápida de Móveis Existentes */}
                {detectedObjects.length > 0 && (
                  <div className="space-y-3">
                    <label className="block font-display font-semibold text-white/95 text-sm">
                      Substituir item existente:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {detectedObjects.map((obj, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectDetectedObject(obj)}
                          className="px-3.5 py-1.5 bg-white/5 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] border border-white/10 hover:border-[#D4AF37]/30 rounded-full text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                          {obj.name}
                        </button>
                      ))}
                    </div>
                    <div className="text-[10px] text-white/40 leading-relaxed">
                      Clique acima para herdar a escala e profundidade originais do móvel do seu ambiente.
                    </div>
                  </div>
                )}

                {/* Target Selection Status */}
                <div className="space-y-3">
                  <label className="block font-display font-semibold text-white/95 text-base">
                    1. Área de Substituição
                  </label>
                  <div className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-colors ${boundingBox ? 'border-green-500/30 bg-green-500/5 text-green-400' : 'border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37]'}`}>
                    {boundingBox ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-semibold text-sm">Área definida</span>
                        <button onClick={() => { setBoundingBox(null); setPlacementPoint(null); }} className="ml-auto text-xs underline hover:text-white transition-colors">Limpar</button>
                      </>
                    ) : (
                      <>
                        <MoveRight className="w-5 h-5" />
                        <span className="font-semibold text-sm">Clique na foto ou escolha um item acima</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Catalog Selection */}
                <div className="space-y-3">
                  <label className="block font-display font-semibold text-white/95 text-base">
                    2. Escolha a peça em estoque
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-2 pb-2 custom-scrollbar">
                    {catalogItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                          selectedItem?.id === item.id 
                            ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-[0_0_15px_rgba(212,175,55,0.15)]' 
                            : 'border-white/5 hover:border-white/10 bg-white/5'
                        }`}
                      >
                        {item.imageUrl ? (
                          <div className="w-full h-24 mb-3 rounded-xl overflow-hidden bg-black/40 flex items-center justify-center border border-white/5">
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
                          <div className="text-3xl mb-3">{item.icon}</div>
                        )}
                        <div className="font-display font-bold text-white text-xs leading-tight mb-1 truncate">{item.name}</div>
                        <div className="text-[10px] text-white/50 line-clamp-2 leading-relaxed">{item.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-950/20 text-red-400 border border-red-500/20 rounded-2xl text-sm">
                    {error}
                  </div>
                )}

                <button 
                  onClick={() => handleGenerate()}
                  disabled={!boundingBox || !selectedItem}
                  className="w-full py-4 px-6 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:brightness-110 disabled:from-stone-800 disabled:to-stone-900 disabled:text-white/40 disabled:cursor-not-allowed text-black font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg text-sm uppercase tracking-wider cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  Reimaginar com IA
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
              className="max-w-md mx-auto text-center py-24 space-y-6"
            >
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-white/5"></div>
                <div className="absolute inset-0 rounded-full border-4 border-[#D4AF37] border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-3xl">
                  {selectedItem?.icon}
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold font-display text-white">Posicionando o móvel...</h2>
                <p className="text-white/50 text-sm">Nossa IA está integrando a peça à iluminação e perspectiva da sua foto.</p>
              </div>
            </motion.div>
          )}

          {/* RESULT STEP */}
          {step === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-display font-bold text-white flex items-center justify-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-[#D4AF37]" />
                  Seu ambiente reimaginado
                </h2>
                <p className="text-white/60 text-sm md:text-base">Inserimos o(a) {selectedColor ? `${selectedColor.name.toLowerCase()} ` : ''}**{selectedItem?.name}** no local demarcado.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-white/50 uppercase tracking-widest px-2">Antes</div>
                  <div className="flex justify-center bg-black/40 rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
                    {originalImage && (
                      <img 
                        src={originalImage} 
                        alt="Cômodo original" 
                        className="max-h-[60vh] w-auto block grayscale-[15%] opacity-80"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest px-2 flex items-center gap-2">
                    Depois <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="flex justify-center bg-black/40 rounded-[2rem] overflow-hidden border-2 border-[#D4AF37]/50 shadow-[0_0_30px_rgba(212,175,55,0.15)] relative aspect-[4/3] md:aspect-auto animate-fade-in">
                    {videoState === 'ready' && videoFileId ? (
                      <video 
                        src={`/api/video/${videoFileId}`}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="max-h-[60vh] w-full object-cover block rounded-[2rem]"
                      />
                    ) : resultImage ? (
                      <img 
                        src={resultImage} 
                        alt="Cômodo projetado" 
                        className={`max-h-[60vh] w-auto block transition-all ${videoState === 'generating' || videoState === 'polling' ? 'opacity-30 blur-sm' : ''}`}
                        referrerPolicy="no-referrer"
                      />
                    ) : null}

                    {/* Loader para Geração de Vídeo */}
                    {(videoState === 'generating' || videoState === 'polling') && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-6 text-center">
                        <RefreshCw className="w-10 h-10 text-[#D4AF37] animate-spin mb-4" />
                        <h4 className="font-display font-semibold text-white text-sm">Modelando seu ambiente em 3D...</h4>
                        <p className="text-[11px] text-white/50 mt-1 max-w-[200px]">Isso pode levar de 30 a 60 segundos enquanto a IA renderiza a câmera tridimensional.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Color Picker Section */}
              <div className="glass p-8 rounded-[2rem] border border-white/5 shadow-2xl space-y-5 max-w-xl mx-auto mt-6">
                <div className="text-center space-y-1">
                  <h3 className="font-display font-bold text-white text-lg">Gostaria de experimentar outra cor?</h3>
                  <p className="text-xs text-white/50">Selecione uma tonalidade abaixo para reimaginar a peça.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  {(selectedItem?.colors 
                    ? selectedItem.colors.map(c => COLORS.find(ec => ec.name.toLowerCase() === c.toLowerCase()) || { name: c, class: 'bg-[#06120F] border border-white/10' })
                    : COLORS
                  ).map((color) => (
                    <button
                      key={color.name}
                      onClick={() => {
                        setSelectedColor(color);
                        handleGenerate(color);
                      }}
                      className={`w-10 h-10 rounded-full shadow-lg transition-all hover:scale-110 focus:outline-none cursor-pointer ${color.class} ${selectedColor?.name === color.name ? 'ring-2 ring-offset-2 ring-offset-[#06120F] ring-[#D4AF37] scale-115' : ''}`}
                      title={color.name}
                      aria-label={`Mudar a cor para ${color.name}`}
                    />
                  ))}
                </div>
              </div>

              {/* Seção de Conversão / CTA */}
              <div className="glass p-8 md:p-10 rounded-[2rem] border border-[#D4AF37]/20 bg-gradient-to-b from-white/[0.02] to-[#D4AF37]/5 shadow-2xl space-y-6 max-w-2xl mx-auto text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-xl -z-10" />
                <div className="space-y-3">
                  <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em] font-display">
                    Gostou do resultado?
                  </span>
                  <h3 className="font-display font-bold text-white text-xl md:text-2xl">
                    Leve essa experiência para a sua casa
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed max-w-lg mx-auto">
                    Nossos consultores podem te ajudar a escolher o acabamento perfeito e alinhar todos os detalhes para o seu espaço. Agende uma visita ou tire suas dúvidas agora mesmo.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                  <a 
                    href={`https://wa.me/5516997908686?text=${encodeURIComponent(
                      `Olá! Usei o visualizador de IA do site e gostei muito de como o(a) ${selectedItem?.name}${selectedColor ? ` na cor ${selectedColor.name}` : ''} ficou no meu ambiente. Gostaria de falar com um consultor!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:brightness-110 text-black font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(212,175,55,0.25)] text-sm uppercase tracking-wider cursor-pointer"
                  >
                    Falar com Consultor no WhatsApp
                  </a>

                  {videoState === 'idle' && (
                    <button 
                      onClick={handleGenerateVideo}
                      className="w-full sm:w-auto px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all text-sm uppercase tracking-wider cursor-pointer"
                    >
                      <Video className="w-4 h-4 text-[#D4AF37]" />
                      Gerar Vídeo 3D do Ambiente
                    </button>
                  )}

                  <button 
                    onClick={() => {
                      setStep('select');
                      setResultImage(null);
                      setSelectedColor(null);
                      setVideoFileId(null);
                      setVideoState('idle');
                    }}
                    className="w-full sm:w-auto px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all text-sm uppercase tracking-wider cursor-pointer"
                  >
                    Tentar outro móvel
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
      
      {/* Custom scrollbar styles for the catalog grid */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.08);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(212, 175, 55, 0.2);
        }
      `}} />
    </div>
  );
}
