import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Carregar variáveis de ambiente
dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getAiClient() {
  if (!aiClient) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("A variável de ambiente GEMINI_API_KEY está ausente no servidor.");
    }
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { 
        timeout: 300000, // 5 minutos
        headers: {
          'User-Agent': 'nexa-reimagine-backend',
        }
      },
    });
  }
  return aiClient;
}

type ImageMime =
  | 'image/png' | 'image/jpeg' | 'image/webp'
  | 'image/heic' | 'image/heif' | 'image/gif' | 'image/bmp' | 'image/tiff';

interface InlineImage {
  data: string; // base64 puros
  mimeType: ImageMime;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // Endpoint 1: Analisar Geometria do Cômodo e Bounding Boxes dos móveis
  app.post("/api/analyze", async (req, res) => {
    try {
      const { imageBase64, mimeType } = req.body;
      if (!imageBase64 || !mimeType) {
        return res.status(400).json({ error: "A imagem e o mimeType são obrigatórios para a análise." });
      }

      const base64Data = imageBase64.split(",")[1] || imageBase64;
      const ai = getAiClient();

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            inlineData: { data: base64Data, mimeType }
          },
          "Analyze this room photograph and detect the exact coordinates (bounding boxes) of the main furniture items (especially sofas, coffee tables, dining tables, chairs, lamps). For each detected furniture item, provide its name in Portuguese and its precise bounding box coordinates in the scale of 0 to 1000 [ymin, xmin, ymax, xmax]. Also, provide a detailed room description including walls, flooring, geometry, and lighting direction."
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              roomDescription: {
                type: Type.STRING,
                description: "Descrição detalhada em português da geometria do cômodo, cores das paredes, tipo/cor do piso e direção da iluminação principal."
              },
              detectedObjects: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Nome do objeto em português (ex: sofá, mesa de centro)." },
                    box: {
                      type: Type.OBJECT,
                      properties: {
                        ymin: { type: Type.INTEGER, description: "Coordenada y mínima (0-1000)" },
                        xmin: { type: Type.INTEGER, description: "Coordenada x mínima (0-1000)" },
                        ymax: { type: Type.INTEGER, description: "Coordenada y máxima (0-1000)" },
                        xmax: { type: Type.INTEGER, description: "Coordenada x máxima (0-1000)" }
                      },
                      required: ["ymin", "xmin", "ymax", "xmax"]
                    }
                  },
                  required: ["name", "box"]
                }
              }
            },
            required: ["roomDescription", "detectedObjects"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      res.json(data);
    } catch (error: any) {
      console.error("Erro na rota de análise:", error);
      res.status(500).json({ error: error.message || "Falha ao analisar a imagem." });
    }
  });

  // Endpoint 2: Inpainting (Substituição ou Remoção)
  app.post("/api/generate", async (req, res) => {
    try {
      const { originalImageBase64, mimeType, referenceImageBase64, referenceMimeType, prompt, aspectRatio } = req.body;
      if (!originalImageBase64 || !mimeType || !prompt) {
        return res.status(400).json({ error: "Imagem de ambiente, mimeType e prompt são obrigatórios." });
      }

      const mainBase64Data = originalImageBase64.split(",")[1] || originalImageBase64;
      const parts: any[] = [
        {
          inlineData: {
            data: mainBase64Data,
            mimeType: mimeType,
          },
        }
      ];

      // Se houver uma imagem de referência de estoque Nexa
      if (referenceImageBase64 && referenceMimeType) {
        const refBase64Data = referenceImageBase64.split(",")[1] || referenceImageBase64;
        parts.push({
          inlineData: {
            data: refBase64Data,
            mimeType: referenceMimeType,
          }
        });
      }

      parts.push({ text: prompt });

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: parts,
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio || "1:1"
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

      if (!generatedImageUrl) {
        return res.status(500).json({ error: "Nenhuma imagem foi gerada pela IA." });
      }

      res.json({ imageUrl: generatedImageUrl });
    } catch (error: any) {
      console.error("Erro na rota de geração (Inpainting):", error);
      res.status(500).json({ error: error.message || "Falha ao gerar imagem." });
    }
  });

  // Endpoint 3: Gerar Vídeo Showcase 3D via Gemini Omni
  app.post("/api/generate-video", async (req, res) => {
    try {
      const { imageBase64, mimeType, productName } = req.body;
      if (!imageBase64 || !mimeType) {
        return res.status(400).json({ error: "Imagem de ambiente é obrigatória para gerar o vídeo." });
      }

      const cleanBase64 = imageBase64.split(",")[1] || imageBase64;
      const ai = getAiClient();

      console.log(`Escrevendo prompt de vídeo comercial para o produto: ${productName || "móvel nexa"}`);

      // Instrução do Diretor Omni para compor o vídeo
      const promptWriterSystemInstruction = `## Role
You are an elite product-film director, editor and Gemini Omni prompt engineer in one box. You receive a photo of a room redesigned with a new piece of furniture and return one flawless, timestamped Omni directive prompt that yields a premium, short-form product showcase reel built from several shots. You direct like a luxury commercial and cut like a master editor. Your taste is the product: restrained, expensive, clarifying. Never slop, never gimmick, never overclaim.
Inputs you receive:
1 room image — showing the product in the environment.
A short product description — what it is.
Non-negotiable taste:
Classy, simple, high-end. A tight, deliberate edit where every cut earns its place.
Premium = restraint and intent: controlled palette, motivated light, real materials behaving correctly.
Format & length:
~10 seconds total. 3–5 shots.
Omni craft you apply:
Reference the images. Lock identity, geometry, proportions, label and material from all views.
Camera repertoire: "slow push in", "orbit / arc", "macro detail", "rack focus", "top-down reveal", "gentle levitation", "locked off", "static", "dolly".
Hard suppressions:
No music of any kind. No score, soundtrack, background music, beat, or musical sting — ever. No voiceover, narration, dialogue or vocals.
No overlaid graphics, text or UI.
Audio is near-silent: only very subtle, realistic diegetic sound effects (a soft glass chime, gentle fabric or air, a single soft touch).
Output contract:
Output only the directive prompt. It must begin with the words "Create a professional product showcase reel" and read as one clean directive in this shape:
Create a professional product showcase reel of the room and the placed product locked to the reference image so its identity, proportions, label and material stay accurate in every shot. Hard cuts between shots; the environment is the hero.
0.0-2.0s - <shot detail>.
2.0-4.0s - <shot detail>.
...
8.0-10.0s - <shot detail>.
Materials and physics: <how light behaves>. Audio: near-silent, only very subtle realistic diegetic sound effects; no music of any kind, no score, no soundtrack, no voiceover. No text or UI overlay.`;

      const promptResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: [
          { text: `Create a video showcase prompt for a room image that features a new "${productName || 'Móvel Nexa'}" in the layout.` },
          { inlineData: { mimeType, data: cleanBase64 } }
        ],
        config: { systemInstruction: promptWriterSystemInstruction },
      });

      const videoPrompt = promptResponse.text || `Create a professional product showcase reel of the room. 0.0-10.0s - Slow push in towards the new ${productName || 'Móvel Nexa'} highlighting its premium material, reflections and integrated shadows. Audio: near-silent; no music, no voiceover, no graphics.`;
      console.log(`Prompt de Vídeo Gerado: ${videoPrompt}`);

      console.log("Enviando requisição para Gemini Omni (gemini-omni-flash-preview)...");
      const interaction = await ai.interactions.create({
        model: 'gemini-omni-flash-preview',
        input: [
          { type: 'image' as const, data: cleanBase64, mime_type: mimeType },
          { type: 'text', text: videoPrompt }
        ],
        //@ts-ignore - a tipagem provisória do SDK pode não ter o formato de vídeo mapeado, mas o backend aceita
        response_format: { type: 'video', delivery: 'uri' },
        store: true,
        background: false,
        stream: false
      });

      console.log(`Interação Omni Criada: ${interaction.id}`);
      if (!interaction.output_video || !interaction.output_video.uri) {
        throw new Error("A API Gemini Omni não retornou uma URI de vídeo.");
      }

      const fileIdMatch = interaction.output_video.uri.match(/files\/([a-zA-Z0-9_-]+)/);
      const fileId = fileIdMatch ? fileIdMatch[1] : null;

      res.json({ interactionId: interaction.id, uri: interaction.output_video.uri, fileId });
    } catch (error: any) {
      console.error("Erro na rota de geração de vídeo:", error);
      res.status(500).json({ error: error.message || "Falha ao gerar o vídeo." });
    }
  });

  // Endpoint 4: Polling do Status do Arquivo
  app.get("/api/file-status/:fileId", async (req, res) => {
    try {
      const { fileId } = req.params;
      const ai = getAiClient();
      
      const fInfo = await ai.files.get({ name: `files/${fileId}` });
      const state = (fInfo.state as any)?.name || fInfo.state;
      res.json({ state });
    } catch (error: any) {
      console.error("Erro ao obter status do vídeo:", error);
      res.status(500).json({ error: error.message });
    }
  });

  const videoCache = new Map<string, Buffer>();

  // Endpoint 5: Streaming e Download do Vídeo MP4
  app.get("/api/video/:fileId", async (req, res) => {
    try {
      const { fileId } = req.params;
      let buffer = videoCache.get(fileId);
      
      if (!buffer) {
        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/files/${fileId}:download?alt=media&key=${apiKey}`;
        const upstream = await fetch(url);
        if (!upstream.ok) {
          return res.status(upstream.status).send(`Falha ao obter vídeo: ${upstream.statusText}`);
        }
        buffer = Buffer.from(await upstream.arrayBuffer());
        if (videoCache.size >= 12) {
          const oldest = videoCache.keys().next().value;
          if (oldest) videoCache.delete(oldest);
        }
        videoCache.set(fileId, buffer);
      }

      const total = buffer.length;
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'public, max-age=31536000');

      const range = req.headers.range;
      if (range) {
        const match = /bytes=(\d*)-(\d*)/.exec(range);
        let start = match && match[1] ? parseInt(match[1], 10) : 0;
        let end = match && match[2] ? parseInt(match[2], 10) : total - 1;
        if (Number.isNaN(start)) start = 0;
        if (Number.isNaN(end) || end >= total) end = total - 1;
        if (start > end || start >= total) {
          res.status(416).setHeader('Content-Range', `bytes */${total}`).end();
          return;
        }
        res.status(206);
        res.setHeader('Content-Range', `bytes ${start}-${end}/${total}`);
        res.setHeader('Content-Length', end - start + 1);
        res.end(buffer.subarray(start, end + 1));
      } else {
        res.setHeader('Content-Length', total);
        res.end(buffer);
      }
    } catch (error: any) {
      console.error("Erro no streaming de vídeo:", error);
      res.status(500).send(error.message);
    }
  });

  // Middleware do Vite (Apenas em Desenvolvimento)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      configFile: false,
      plugins: [react(), tailwindcss()],
      resolve: {
        alias: {
          '@': path.resolve(process.cwd(), '.'),
        },
      },
      server: { 
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Servir arquivos de produção compilados
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
