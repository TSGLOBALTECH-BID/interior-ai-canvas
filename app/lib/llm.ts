import { HfInference } from "@huggingface/inference";
import { SceneConfig, FurnitureItem } from "@/app/config/sceneConfig";

// Hugging Face Configuration
const HUGGING_FACE_API_TOKEN = process.env.HUGGING_FACE_API_TOKEN;
const HUGGING_FACE_MODEL = process.env.HUGGING_FACE_MODEL || "mistralai/Mistral-7B-Instruct-v0.2";
type InferenceProvider = "hf-inference" | "baseten" | "black-forest-labs" | "cerebras" | "clarifai" | "cohere" | "deepinfra" | "fal-ai" | "featherless-ai" | "fireworks-ai" | "groq" | "hyperbolic" | "nebius" | "novita" | "nscale" | "nvidia" | "openai" | "ovhcloud" | "publicai" | "replicate" | "sambanova" | "scaleway" | "together" | "wavespeed" | "zai-org" | "auto";
const HUGGING_FACE_PROVIDER = (process.env.HUGGING_FACE_PROVIDER || "hf-inference") as InferenceProvider;

// Initialize Hugging Face inference client
const hf = new HfInference(HUGGING_FACE_API_TOKEN);

// Scene generation system prompt
const SYSTEM_PROMPT = `You are an AI interior design assistant. Based on the user's prompt, generate a scene configuration update for a 3D interior design application.

The scene has the following configurable elements:
1. Furniture - sofas, tables with customizable colors
2. Floor - wood, carpet, tile with customizable colors
3. Walls - paint colors
4. Background - lighting mood (bright, dark, etc.)

Respond with a JSON object containing only the fields that should be updated.

Furniture color options:
- Sofa: #d4c4b0 (beige), #6b7280 (gray), #1e3a5f (navy), #7f1d1d (red), #064e3b (green), #f5f5f4 (white)
- Table: #8b7355 (brown), #f5f5f4 (white), #3d2314 (dark), #d4a574 (oak), #1f2937 (black)

Floor colors:
- #a39382 (default), #3d2314 (walnut), #d4a574 (oak), #f5f5f4 (white), #6b7280 (gray)

Wall colors:
- #f5f5f4 (default), #dbeafe (blue), #d1fae5 (green), #fef3c7 (cream), #9ca3af (gray), #ffffff (white)

Background options:
- Bright: from-blue-100 to-amber-100
- Dark: from-zinc-800 to-zinc-950
- Default: from-zinc-100 to-zinc-200

Only respond with valid JSON object, no additional text.`;

/**
 * Main function to generate scene updates using Hugging Face
 */
export async function generateSceneWithLLM(
  prompt: string,
  currentConfig: SceneConfig
): Promise<{ updates: Partial<SceneConfig>; error: string | null }> {
  // Check if Hugging Face is available
  // const isHFAvailable = await checkHuggingFaceAvailability();
  
  // if (!isHFAvailable) {
  //   console.log("Hugging Face not available, using fallback generator");
  //   return generateFallbackResponse(prompt, currentConfig);
  // }

  try {
    // Build context from current config
    const currentFurniture = currentConfig.furniture.map((f: FurnitureItem) => 
      `${f.id}: ${f.type} at (${f.position.x}, ${f.position.y}, ${f.position.z})`
    ).join(', ');
    
    const userMessage = `Current furniture: ${currentFurniture}
Current floor color: ${currentConfig.floor.material.color}
Current wall color: ${currentConfig.walls.material.color}
Current background: ${currentConfig.background.gradient.from} to ${currentConfig.background.gradient.to}

User request: ${prompt}

Generate a JSON response with only the updated fields.`;

    // Create the full prompt for the model
    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser: ${userMessage}\nAssistant:`;
    
    // Call Hugging Face API using the library - only chat completion
    // Some providers don't support max_new_tokens directly, so we use a subset of params
    console.log('Full prompt-',fullPrompt)
    const chatResponse = await hf.chatCompletion({
      model: HUGGING_FACE_MODEL,
      messages: [
        { role: "user", content: fullPrompt }
      ],
      temperature: 0.7,
      provider: HUGGING_FACE_PROVIDER,
    });
    
    console.log('Response-',chatResponse)
    // Extract the response content
    const responseText = chatResponse.choices?.[0]?.message?.content || "";
    
    // Parse the JSON response
    const updates = parseLLMResponse(responseText, currentConfig);

    return {
      updates: validateAndCleanUpdates(updates, currentConfig),
      error: null,
    };
  } catch (error) {
    console.error("Hugging Face execution error:", error);
    // Fallback to mock on error
    return generateFallbackResponse(prompt, currentConfig);
  }
}

/**
 * Parse LLM response to extract JSON
 */
function parseLLMResponse(response: string, currentConfig: SceneConfig): Partial<SceneConfig> {
  console.log('LLM Output:', response);
  
  try {
    // Try to find JSON in the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonStr = jsonMatch[0];
      console.log('Extracted JSON:', jsonStr);
      return JSON.parse(jsonStr) as Partial<SceneConfig>;
    }
  } catch (error) {
    console.error("Failed to parse LLM response:", error);
    
    // Try to fix common issues like unquoted hex colors
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        let fixedJson = jsonMatch[0];
        // Fix unquoted #hex values by adding quotes
        fixedJson = fixedJson.replace(/([\[,:])\s*#([0-9a-fA-F]{6})\s*([,\]}])/g, '$1"#$2"$3');
        console.log('Fixed JSON:', fixedJson);
        return JSON.parse(fixedJson) as Partial<SceneConfig>;
      }
    } catch (fixError) {
      console.error("Failed to fix JSON:", fixError);
    }
  }
  
  // Return empty if parsing fails
  return {};
}

/**
 * Validate and clean up updates from LLM
 */
function validateAndCleanUpdates(
  updates: Partial<SceneConfig>,
  currentConfig: SceneConfig
): Partial<SceneConfig> {
  const cleaned: Partial<SceneConfig> = {};
  
  // Validate furniture
  if (updates.furniture && Array.isArray(updates.furniture)) {
    cleaned.furniture = updates.furniture.map((item) => ({
      id: item.id || 'unknown',
      type: item.type || 'custom',
      position: item.position || { x: 0, y: 0, z: 0 },
      properties: item.properties || {},
    }));
  }
  
  // Validate floor
  if (updates.floor) {
    cleaned.floor = {
      ...currentConfig.floor,
      ...updates.floor,
      material: {
        ...currentConfig.floor.material,
        ...updates.floor?.material,
      },
    };
  }
  
  // Validate walls
  if (updates.walls) {
    cleaned.walls = {
      ...currentConfig.walls,
      ...updates.walls,
      material: {
        ...currentConfig.walls.material,
        ...updates.walls?.material,
      },
    };
  }
  
  // Validate background
  if (updates.background) {
    cleaned.background = updates.background;
  }
  
  return cleaned;
}

/**
 * Check if Hugging Face API is available
 */
async function checkHuggingFaceAvailability(): Promise<boolean> {
  if (!HUGGING_FACE_API_TOKEN) {
    console.log("Hugging Face API token not configured");
    return false;
  }
  
  try {
    console.log(HUGGING_FACE_MODEL)
    console.log(HUGGING_FACE_PROVIDER)
    console.log(hf)
    // Try a simple request to check connectivity using chat completion
    await hf.chatCompletion({
      model: HUGGING_FACE_MODEL,
      messages: [{ role: "user", content: "Hi" }],
      provider: HUGGING_FACE_PROVIDER,
    });
    return true;
  } catch (error) {
    console.log("Hugging Face not available:", error);
    return false;
  }
}

/**
 * Fallback generator when LLM is not available
 */
export function generateFallbackResponse(
  prompt: string,
  currentConfig: SceneConfig
): { updates: Partial<SceneConfig>; error: string | null } {
  const updates: Partial<SceneConfig> = {};
  const promptLower = prompt.toLowerCase();
  
  // Furniture updates
  const furniture: FurnitureItem[] = [];
  
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
      properties: { color: sofaColor, cushionColor, legColor: '#5c4033' },
    });
  }
  
  if (promptLower.includes('table') || promptLower.includes('coffee')) {
    let topColor = '#8b7355';
    if (promptLower.includes('modern') || promptLower.includes('white')) topColor = '#f5f5f4';
    else if (promptLower.includes('dark')) topColor = '#3d2314';
    else if (promptLower.includes('oak') || promptLower.includes('natural')) topColor = '#d4a574';
    else if (promptLower.includes('black')) topColor = '#1f2937';
    
    furniture.push({
      id: 'table-1',
      type: 'table',
      position: { x: 2, y: 0, z: 0 },
      properties: { topColor, legColor: '#5c4033', accentColors: ['#7c3aed', '#dc2626', '#22c55e', '#f97316', '#fef3c7'] },
    });
  }
  
  if (furniture.length > 0) {
    updates.furniture = furniture;
  }
  
  // Floor updates
  if (promptLower.includes('floor') || promptLower.includes('wooden') || promptLower.includes('hardwood')) {
    let floorColor = '#a39382';
    let floorRoughness = 0.8;
    
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
      material: { color: floorColor, roughness: floorRoughness, metalness: 0.1 },
    };
  }
  
  // Wall updates
  if (promptLower.includes('wall') || promptLower.includes('paint')) {
    let wallColor = '#f5f5f4';
    if (promptLower.includes('blue')) wallColor = '#dbeafe';
    else if (promptLower.includes('green') || promptLower.includes('sage')) wallColor = '#d1fae5';
    else if (promptLower.includes('cream') || promptLower.includes('warm')) wallColor = '#fef3c7';
    else if (promptLower.includes('gray')) wallColor = '#9ca3af';
    else if (promptLower.includes('white')) wallColor = '#ffffff';
    
    updates.walls = {
      ...currentConfig.walls,
      material: { color: wallColor, roughness: 0.9 },
    };
  }
  
  // Background updates
  if (promptLower.includes('dark') || promptLower.includes('night')) {
    updates.background = {
      gradient: { from: 'from-zinc-800', to: 'to-zinc-950' },
    };
  } else if (promptLower.includes('bright') || promptLower.includes('sunny')) {
    updates.background = {
      gradient: { from: 'from-blue-100', to: 'to-amber-100' },
    };
  }
  
  // Add default furniture if none specified
  if (furniture.length === 0) {
    updates.furniture = [
      {
        id: 'sofa-1',
        type: 'sofa',
        position: { x: -2, y: 0, z: 0 },
        properties: currentConfig.furniture[0]?.properties || {},
      },
      {
        id: 'table-1',
        type: 'table',
        position: { x: 2, y: 0, z: 0 },
        properties: currentConfig.furniture[1]?.properties || {},
      },
    ];
  }
  
  return { updates, error: null };
}
