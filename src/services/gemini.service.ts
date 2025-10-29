import { Injectable } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';

// This will be populated by the esbuild --define option in the build script
declare var process: {
  env: {
    API_KEY: string;
  }
};

export interface PalmReading {
  lifeLine: string;
  heartLine: string;
  headLine: string;
  fateLine: string;
}

export interface KundaliReading {
  lagnaChart: string;
  kundaliAnalysis: string;
  palmLeafInsights: string;
  remedies: string;
}

export interface EmotionalGuidance {
  guidance: string;
  theme: 'Money & Abundance' | 'Health & Healing' | 'Love & Relationships' | 'Success & Career' | 'Peace & Protection';
}

export interface VideoTakeaways {
  takeaways: string[];
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI | null = null;
  
  constructor() {

    const apiKey = process.env.API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey: apiKey });
    } else {
      console.error('API Key not found. Make sure it is set in Vercel environment variables.');
    }
  }

  async analyzePalm(base64Image: string, userQuestion?: string): Promise<PalmReading> {
    if (!this.ai) {
      throw new Error('Gemini AI client is not initialized.');
    }

    const base64Data = base64Image.split(',')[1];
    const imagePart = {
      inlineData: { data: base64Data, mimeType: 'image/jpeg' },
    };
    
    let prompt = 'Analyze the provided image of a palm. Identify and interpret the heart line, head line, life line, and fate line. Provide a brief, positive, and insightful astrological reading for each line.';

    if (userQuestion && userQuestion.trim().length > 0) {
      prompt += `\n\nAdditionally, the user has a specific question: "${userQuestion}". Please address this question in your analysis where relevant.`;
    }

    const textPart = {
      text: prompt
    };

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lifeLine: { type: Type.STRING, description: 'Interpretation of the life line.' },
            heartLine: { type: Type.STRING, description: 'Interpretation of the heart line.' },
            headLine: { type: Type.STRING, description: 'Interpretation of the head line.' },
            fateLine: { type: Type.STRING, description: 'Interpretation of the fate line.' },
          },
          required: ['lifeLine', 'heartLine', 'headLine', 'fateLine'],

        }
      }
    });

    const resultText = response.text;
    return JSON.parse(resultText) as PalmReading;
  }

  async generateKundali(name: string, dob: string, tob: string, pob:string): Promise<KundaliReading> {
    if (!this.ai) {
      throw new Error('Gemini AI client is not initialized.');
    }

    const prompt = `
      Act as an expert Vedic astrologer from India with deep knowledge of ancient scriptures and the legendary Nadi astrology tradition of Vaideeswaran Koil (palm leaf reading).
      
      Generate a personalized Kundali (Vedic birth chart) analysis for the following individual:
      - Name: ${name}
      - Date of Birth: ${dob}
      - Time of Birth: ${tob}
      - Place of Birth: ${pob}

      Provide a comprehensive and insightful reading structured in four parts. Use a warm, spiritual, and encouraging tone.

      1. **Lagna (Ascendant) Chart Analysis**: Describe the primary characteristics of the Lagna, the positions of key planets in the first house, and how this shapes their core personality, physical attributes, and life's purpose.

      2. **Detailed Kundali Analysis**: Provide a deeper interpretation of the planetary positions across different houses. Cover key life areas such as career and wealth (2nd, 10th, 11th houses), relationships and marriage (7th house), and health and well-being (6th house). Offer guidance on potential challenges and strengths revealed in the chart.

      3. **Legendary Vaideeswaran Koil Palm Leaf Reading (Nadi Astrology)**: Emulate the legendary Nadi astrologers of Vaideeswaran Koil. As if reading from a predestined ancient palm leaf manuscript, provide a complete, accurate, and brief reading that reveals insights into the individual's past, present, and future.
          - **Past Karmic Imprints**: Briefly touch upon significant karmic patterns or events from past lives that influence the present.
          - **Present Life Path**: Offer clear insights into their current life situation, challenges, and opportunities.
          - **Future Glimpse**: Provide a predictive glimpse into key future milestones, 

potential turning points, and ultimate destiny.

      4. **Astrological Remedies**: Based on the analysis, provide a few simple, actionable, and positive Vedic remedies to mitigate challenges and enhance positive planetary influences. This could include chanting specific mantras, recommending a gemstone, performing simple rituals, or suggesting charitable acts.

      The response must be in JSON format.
    `;

    const textPart = { text: prompt };

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lagnaChart: { type: Type.STRING, description: 'Analysis of the Lagna (Ascendant) chart, personality, and life purpose.' },
            kundaliAnalysis: { type: Type.STRING, description: 'Detailed interpretation of planetary positions covering career, relationships, and health.' },
            palmLeafInsights: { type: Type.STRING, description: 'Legendary Vaideeswaran Koil palm leaf reading (Nadi Astrology) with insights into past karmic imprints, present life path, and future glimpses.' },
            remedies: { type: Type.STRING, description: 'Actionable Vedic remedies to mitigate challenges and enhance positive planetary influences.' },
          },
          required: ['lagnaChart', 'kundaliAnalysis', 'palmLeafInsights', 'remedies'],
        }
      }
    });

    const resultText = response.text;
    return JSON.parse(resultText) as KundaliReading;
  }

  async getSpiritualGuidance(query: string, language: string): Promise<string> {
    if (!this.ai) {
      throw new Error('Gemini AI client is not initialized.');
    }

    const prompt = `

      You are a wise and compassionate spiritual guide from India, deeply versed in ancient Hindu wisdom and philosophies.
      A user is asking you a question in ${language}.
      User's question: "${query}"

      Please provide a brief, insightful, and comforting response in ${language}.
      Your tone should be gentle, encouraging, and full of wisdom.
      Keep the response to 2-3 sentences.
    `;

    const textPart = { text: prompt };

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart] },
    });
    
    return response.text;
  }

  async getEmotionalGuidance(emotion: string): Promise<EmotionalGuidance> {
    if (!this.ai) {
      throw new Error('Gemini AI client is not initialized.');
    }

    const prompt = `
      Act as a wise, compassionate, and ancient spiritual guide from India.
      A user is feeling "${emotion}".
      
      Provide a short, comforting, and insightful piece of wisdom or a mantra (1-2 sentences) to help them with this feeling. The tone should be gentle, reassuring, and profound.
      
      Also, suggest one of the following themes that is most relevant to the user's feeling:
      - 'Money & Abundance'
      - 'Health & Healing'
      - 'Love & Relationships'
      - 'Success & Career'
      - 'Peace & Protection'

      The response must be in JSON format.
    `;

    const textPart = { text: prompt };

    const response = await this.ai.models.generateContent({

      model: 'gemini-2.5-flash',
      contents: { parts: [textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            guidance: { type: Type.STRING, description: 'A short, comforting piece of wisdom or mantra.' },
            theme: { 
              type: Type.STRING, 
              enum: ['Money & Abundance', 'Health & Healing', 'Love & Relationships', 'Success & Career', 'Peace & Protection'],
              description: 'The most relevant theme for the emotion.' 
            },
          },
          required: ['guidance', 'theme'],
        }
      }
    });

    const resultText = response.text;
    return JSON.parse(resultText) as EmotionalGuidance;
  }

  async getMantraInsight(mantraName: string, mantraPurpose: string): Promise<string> {
    if (!this.ai) {
      throw new Error('Gemini AI client is not initialized.');
    }

    const prompt = `
      You are a wise and compassionate spiritual guide, well-versed in Vedic traditions.
      A user is reflecting on the mantra: "${mantraName}".
      Its purpose is: "${mantraPurpose}".

      Please provide a brief (2-3 sentences), profound, and unique meditation insight or focus point related to this mantra.
      Your response should be calming, encouraging, and help deepen their spiritual practice.
      Do not just repeat the meaning; offer a fresh perspective for their meditation.
    `;

    const textPart = { text:.
    
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',

      contents: { parts: [textPart] },
    });

    return response.text;
  }

  async getVideoTakeaways(videoTitle: string): Promise<string[]> {
    if (!this.ai) {
      throw new Error('Gemini AI client is not initialized.');
    }

    const prompt = `
      Act as a spiritual guide who summarizes complex topics into simple, profound points.
      A user has just watched a spiritual video titled: "${videoTitle}".

      Please provide 3 to 5 key spiritual takeaways or life lessons from this video.
      Present them as a simple list of short, insightful sentences.
      Focus on the core message and its practical application for personal growth.

      The response must be in JSON format.
    `;

    const textPart = { text: prompt };

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            takeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'A list of key spiritual takeaways from the video.'
            }
          },
          required: ['takeaways'],
        }
      }
    });

    const resultText = response.text;
    const resultJson = JSON.parse(resultText) as VideoTakeaways;

    return resultJson.takeaways;
  }
}
