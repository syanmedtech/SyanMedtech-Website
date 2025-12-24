
import { GoogleGenAI, Type } from "@google/genai";
import { db } from "./firestore.ts";
import { Product, Order } from "../types.ts";

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'SYAN AI Diagnostic Core',
    category: 'Software',
    price: 499.00,
    stock: 50,
    description: 'Enterprise-grade AI engine for clinical decision support.',
    image: 'https://picsum.photos/id/201/400/300',
    features: ['Real-time analysis', 'HIPAA compliant', 'Cloud sync']
  },
  {
    id: 'p2',
    name: 'Portable ECG Scanner V3',
    category: 'Hardware',
    price: 1250.00,
    stock: 15,
    description: 'Ultra-portable 12-lead ECG with Bluetooth connectivity.',
    image: 'https://picsum.photos/id/447/400/300',
    features: ['12-hour battery', 'Smartphone integration', 'Storage case']
  },
  {
    id: 'p3',
    name: 'Clinical Exam Module',
    category: 'Software',
    price: 299.00,
    stock: 100,
    description: 'Secure proctoring module for medical licensing exams.',
    image: 'https://picsum.photos/id/304/400/300',
    features: ['Anti-cheat AI', 'HD video support', 'Instant grading']
  }
];

export const ecommerceService = {
  getProducts: async (): Promise<Product[]> => {
    const stored = await db.list('products');
    if (stored.length === 0) {
      // Seed initial data if empty
      for (const p of INITIAL_PRODUCTS) {
        await db.save('products', p.id, p);
      }
      return INITIAL_PRODUCTS;
    }
    return stored;
  },

  getOrders: async (): Promise<Order[]> => {
    return await db.list('orders');
  },

  createOrder: async (order: Order) => {
    return await db.save('orders', order.id, order);
  },

  aiSmartSearch: async (query: string, products: Product[]) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const productList = products.map(p => `${p.name} (ID: ${p.id}): ${p.description}`).join('\n');
    
    const prompt = `Given the following medical product catalog, identify the IDs of products that best match the user's search query. 
    Query: "${query}"
    Catalog:
    ${productList}
    
    Return a JSON array of product IDs only. If no matches, return an empty array.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });
      return JSON.parse(response.text || '[]');
    } catch (e) {
      console.error("AI Search Error:", e);
      return [];
    }
  }
};
