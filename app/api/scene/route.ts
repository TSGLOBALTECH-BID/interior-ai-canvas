import { NextRequest, NextResponse } from 'next/server';
import { SceneConfig } from '@/app/config/sceneConfig';
import { generateSceneWithLLM } from '@/app/lib/llm';

/**
 * Simplified Canvas JSON format for AI communication
 */
interface CanvasJSON {
  room: {
    width: number;
    depth: number;
    floorMaterial: string;
  };
  objects: Array<{
    id: string;
    type: string;
    position: [number, number, number];
    rotation: number;
    color: string;
  }>;
}

/**
 * AI Scene Update API
 * 
 * Uses LangChain with Ollama (free local LLM) to process scene generation requests.
 * Falls back to rule-based generation if Ollama is not available.
 * 
 * Request body:
 * {
 *   prompt: string,        // User's design prompt
 *   currentConfig: CanvasJSON  // Current canvas JSON state
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   updates: CanvasJSON,  // Updated canvas JSON
 *   message: string
 * }
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, currentConfig } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Validate currentConfig matches expected CanvasJSON format
    const canvasConfig = currentConfig as CanvasJSON;
    if (!canvasConfig.room || !canvasConfig.objects) {
      return NextResponse.json(
        { error: 'Invalid canvas JSON format' },
        { status: 400 }
      );
    }

    // Use LangChain with Ollama for scene generation
    // Falls back to rule-based if Ollama is not available
    const result = await generateSceneWithLLM(prompt, canvasConfig);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      updates: result.updates,
      message: result.error || 'Scene updated based on your prompt',
    });
  } catch (error) {
    console.error('Error processing AI request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
