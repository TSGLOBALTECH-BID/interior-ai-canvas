import { HfInference } from "@huggingface/inference";
import { SceneConfig, FurnitureItem } from "@/app/config/sceneConfig";

// Hugging Face Configuration
const HUGGING_FACE_API_TOKEN = process.env.HUGGING_FACE_API_TOKEN;
const HUGGING_FACE_MODEL = process.env.HUGGING_FACE_MODEL || "mistralai/Mistral-7B-Instruct-v0.2";
type InferenceProvider = "hf-inference" | "baseten" | "black-forest-labs" | "cerebras" | "clarifai" | "cohere" | "deepinfra" | "fal-ai" | "featherless-ai" | "fireworks-ai" | "groq" | "hyperbolic" | "nebius" | "novita" | "nscale" | "nvidia" | "openai" | "ovhcloud" | "publicai" | "replicate" | "sambanova" | "scaleway" | "together" | "wavespeed" | "zai-org" | "auto";
const HUGGING_FACE_PROVIDER = (process.env.HUGGING_FACE_PROVIDER || "hf-inference") as InferenceProvider;

// Initialize Hugging Face inference client
const hf = new HfInference(HUGGING_FACE_API_TOKEN);

/**
 * Simplified Canvas JSON format for AI communication
 */
export interface CanvasJSON {
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

// Scene generation system prompt
const SYSTEM_PROMPT = `You are an Interior Design AI. Your task is to update a 3D scene based on user request. 
Respond only with a valid JSON object in this exact format:

{
  "room": { "width": number, "depth": number, "floorMaterial": string },
  "objects": [ { "id": string, "type": string, "position": [x, y, z], "rotation": number, "color": string } ]
}

Do not include any additional text. Only respond with valid JSON.
`;

/**
 * Main function to generate scene updates using Hugging Face
 */
export async function generateSceneWithLLM(
  prompt: string,
  currentConfig: CanvasJSON
): Promise<{ updates: CanvasJSON; error: string | null }> {
  // Check if Hugging Face is available
  // const isHFAvailable = await checkHuggingFaceAvailability();
  
  // if (!isHFAvailable) {
  //   console.log("Hugging Face not available, using fallback generator");
  //   return generateFallbackResponse(prompt, currentConfig);
  // }

  try {
    // Build context from current config
    const currentObjects = currentConfig.objects.map((obj) => 
      `${obj.id}: ${obj.type} at position [${obj.position.join(', ')}], color: ${obj.color}`
    ).join(', ');
    
    const userMessage = `Current room: width=${currentConfig.room.width}, depth=${currentConfig.room.depth}, floor=${currentConfig.room.floorMaterial}
Current objects: ${currentObjects || 'none'}

User request: ${prompt}

Generate a JSON response with the updated room and objects fields.`;

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
    const updates = parseLLMResponse(responseText);

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
function parseLLMResponse(response: string): CanvasJSON {
  console.log('LLM Output:', response);
  
  try {
    // Try to find JSON in the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonStr = jsonMatch[0];
      console.log('Extracted JSON:', jsonStr);
      return JSON.parse(jsonStr) as CanvasJSON;
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
        return JSON.parse(fixedJson) as CanvasJSON;
      }
    } catch (fixError) {
      console.error("Failed to fix JSON:", fixError);
    }
  }
  
  // Return default empty canvas if parsing fails
  return {
    room: { width: 20, depth: 20, floorMaterial: '#a39382' },
    objects: [],
  };
}

/**
 * Validate and clean up updates from LLM
 */
function validateAndCleanUpdates(
  updates: CanvasJSON,
  currentConfig: CanvasJSON
): CanvasJSON {
  const cleaned: CanvasJSON = {
    room: {
      width: updates?.room?.width || currentConfig.room.width,
      depth: updates?.room?.depth || currentConfig.room.depth,
      floorMaterial: updates?.room?.floorMaterial || currentConfig.room.floorMaterial,
    },
    objects: [],
  };
  
  // Validate objects
  if (updates.objects && Array.isArray(updates.objects)) {
    cleaned.objects = updates.objects.map((obj) => ({
      id: obj.id || `obj-${Date.now()}`,
      type: obj.type || 'custom',
      position: obj.position || [0, 0, 0],
      rotation: obj.rotation || 0,
      color: obj.color || '#ffffff',
    }));
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
  currentConfig: CanvasJSON
): { updates: CanvasJSON; error: string | null } {
  const promptLower = prompt.toLowerCase();
  
  // Build objects array
  const objects: CanvasJSON['objects'] = [];
  let floorMaterial = currentConfig.room.floorMaterial;
  
  // Sofa
  if (promptLower.includes('sofa') || promptLower.includes('couch') || promptLower.includes('living room')) {
    let color = '#d4c4b0';
    
    if (promptLower.includes('modern') || promptLower.includes('gray') || promptLower.includes('grey')) {
      color = '#6b7280';
    } else if (promptLower.includes('blue') || promptLower.includes('navy')) {
      color = '#1e3a5f';
    } else if (promptLower.includes('red') || promptLower.includes('maroon')) {
      color = '#7f1d1d';
    } else if (promptLower.includes('green') || promptLower.includes('emerald')) {
      color = '#064e3b';
    } else if (promptLower.includes('white') || promptLower.includes('minimalist')) {
      color = '#f5f5f4';
    }
    
    objects.push({
      id: 'sofa-1',
      type: 'sofa',
      position: [-2, 0, 0],
      rotation: 0,
      color,
    });
  }
  
  // Table
  if (promptLower.includes('table') || promptLower.includes('coffee')) {
    let color = '#8b7355';
    if (promptLower.includes('modern') || promptLower.includes('white')) color = '#f5f5f4';
    else if (promptLower.includes('dark')) color = '#3d2314';
    else if (promptLower.includes('oak') || promptLower.includes('natural')) color = '#d4a574';
    else if (promptLower.includes('black')) color = '#1f2937';
    
    objects.push({
      id: 'table-1',
      type: 'table',
      position: [2, 0, 0],
      rotation: 0,
      color,
    });
  }
  
  // Floor material
  if (promptLower.includes('floor') || promptLower.includes('wooden') || promptLower.includes('hardwood')) {
    if (promptLower.includes('dark') || promptLower.includes('walnut')) {
      floorMaterial = '#3d2314';
    } else if (promptLower.includes('oak') || promptLower.includes('light')) {
      floorMaterial = '#d4a574';
    } else if (promptLower.includes('white') || promptLower.includes('modern')) {
      floorMaterial = '#f5f5f4';
    } else if (promptLower.includes('gray') || promptLower.includes('grey')) {
      floorMaterial = '#6b7280';
    }
  }
  
  // Default objects if none specified
  if (objects.length === 0) {
    objects.push(
      {
        id: 'sofa-1',
        type: 'sofa',
        position: [-2, 0, 0],
        rotation: 0,
        color: '#d4c4b0',
      },
      {
        id: 'table-1',
        type: 'table',
        position: [2, 0, 0],
        rotation: 0,
        color: '#8b7355',
      }
    );
  }
  
  return {
    updates: {
      room: {
        width: currentConfig.room.width,
        depth: currentConfig.room.depth,
        floorMaterial,
      },
      objects,
    },
    error: null,
  };
}
