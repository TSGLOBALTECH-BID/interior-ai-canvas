import { NextRequest, NextResponse } from 'next/server';
import { SceneConfig } from '@/app/config/sceneConfig';

/**
 * AI Scene Update API
 * 
 * Receives the current scene state as JSON along with a user prompt,
 * and returns an updated scene configuration based on AI processing.
 * 
 * In a production environment, this would integrate with an AI service
 * like OpenAI, Anthropic, or a specialized 3D generation API.
 */

// Mock AI response generator for demo purposes
// In production, replace with actual AI API call
function generateAIResponse(prompt: string, currentConfig: SceneConfig): Partial<SceneConfig> {
  const updates: Partial<SceneConfig> = {};
  const promptLower = prompt.toLowerCase();

  // Update furniture based on prompt
  const furniture: SceneConfig['furniture'] = [];
  
  // Check for sofa preferences
  if (promptLower.includes('sofa') || promptLower.includes('couch') || promptLower.includes('living room')) {
    let sofaColor = '#d4c4b0';
    let cushionColor = '#e8dcc8';
    
    if (promptLower.includes('modern') || promptLower.includes('gray') || promptLower.includes('grey')) {
      sofaColor = '#6b7280';
      cushionColor = '#9ca3af';
    } else if (promptLower.includes('blue') || promptLower.includes('navy')) {
      sofaColor = '#1e3a5f';
      cushionColor = '#3b82f6';
    } else if (promptLower.includes('red') || promptLower.includes('maroon')) {
      sofaColor = '#7f1d1d';
      cushionColor = '#dc2626';
    } else if (promptLower.includes('green') || promptLower.includes('emerald')) {
      sofaColor = '#064e3b';
      cushionColor = '#10b981';
    } else if (promptLower.includes('white') || promptLower.includes('minimalist')) {
      sofaColor = '#f5f5f4';
      cushionColor = '#ffffff';
    }
    
    furniture.push({
      id: 'sofa-1',
      type: 'sofa',
      position: { x: -2, y: 0, z: 0 },
      properties: {
        color: sofaColor,
        cushionColor: cushionColor,
        legColor: '#5c4033',
      },
    });
  }
  
  // Check for table preferences
  if (promptLower.includes('table') || promptLower.includes('coffee') || promptLower.includes('living room')) {
    let topColor = '#8b7355';
    
    if (promptLower.includes('modern') || promptLower.includes('white')) {
      topColor = '#f5f5f4';
    } else if (promptLower.includes('dark') || promptLower.includes('mahogany')) {
      topColor = '#3d2314';
    } else if (promptLower.includes('oak') || promptLower.includes('natural')) {
      topColor = '#d4a574';
    } else if (promptLower.includes('black')) {
      topColor = '#1f2937';
    }
    
    furniture.push({
      id: 'table-1',
      type: 'table',
      position: { x: 2, y: 0, z: 0 },
      properties: {
        topColor: topColor,
        legColor: '#5c4033',
        accentColors: ['#7c3aed', '#dc2626', '#22c55e', '#f97316', '#fef3c7'],
      },
    });
  }
  
  // Check for floor preferences
  if (promptLower.includes('floor') || promptLower.includes('wooden') || promptLower.includes('hardwood')) {
    let floorColor = '#a39382';
    let floorRoughness = 0.8;
    let floorMetalness = 0.1;
    
    if (promptLower.includes('dark') || promptLower.includes('walnut')) {
      floorColor = '#3d2314';
    } else if (promptLower.includes('oak') || promptLower.includes('light')) {
      floorColor = '#d4a574';
      floorRoughness = 0.6;
    } else if (promptLower.includes('white') || promptLower.includes('modern')) {
      floorColor = '#f5f5f4';
      floorRoughness = 0.3;
    } else if (promptLower.includes('gray') || promptLower.includes('grey')) {
      floorColor = '#6b7280';
    }
    
    updates.floor = {
      ...currentConfig.floor,
      material: {
        color: floorColor,
        roughness: floorRoughness,
        metalness: floorMetalness,
      },
    };
  }
  
  // Check for wall preferences
  if (promptLower.includes('wall') || promptLower.includes('paint') || promptLower.includes('color')) {
    let wallColor = '#f5f5f4';
    
    if (promptLower.includes('blue') || promptLower.includes('sky')) {
      wallColor = '#dbeafe';
    } else if (promptLower.includes('green') || promptLower.includes('sage')) {
      wallColor = '#d1fae5';
    } else if (promptLower.includes('cream') || promptLower.includes('warm')) {
      wallColor = '#fef3c7';
    } else if (promptLower.includes('gray') || promptLower.includes('grey')) {
      wallColor = '#9ca3af';
    } else if (promptLower.includes('white') || promptLower.includes('minimalist')) {
      wallColor = '#ffffff';
    }
    
    updates.walls = {
      ...currentConfig.walls,
      material: {
        color: wallColor,
        roughness: 0.9,
      },
    };
  }
  
  // Check for background/lighting changes
  if (promptLower.includes('dark') || promptLower.includes('night')) {
    updates.background = {
      gradient: {
        from: 'from-zinc-800',
        to: 'to-zinc-950',
      },
    };
  } else if (promptLower.includes('bright') || promptLower.includes('sunny') || promptLower.includes('morning')) {
    updates.background = {
      gradient: {
        from: 'from-blue-100',
        to: 'to-amber-100',
      },
    };
  }
  
  // If no furniture was added, add defaults
  if (furniture.length === 0) {
    furniture.push({
      id: 'sofa-1',
      type: 'sofa',
      position: { x: -2, y: 0, z: 0 },
      properties: currentConfig.furniture[0]?.properties || {},
    });
    furniture.push({
      id: 'table-1',
      type: 'table',
      position: { x: 2, y: 0, z: 0 },
      properties: currentConfig.furniture[1]?.properties || {},
    });
  }
  
  updates.furniture = furniture;
  
  return updates;
}

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

    // In production, you would call an actual AI API here
    // For now, we'll use our mock generator
    const updatedConfig = generateAIResponse(prompt, currentConfig);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      updates: updatedConfig,
      message: 'Scene updated based on your prompt',
    });
  } catch (error) {
    console.error('Error processing AI request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
