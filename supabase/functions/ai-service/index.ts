// AI Edge Functions for Supabase
// These functions handle AI API calls securely

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AIRequest {
  service: string
  type: string
  input: any
  context?: Record<string, any>
  options?: Record<string, any>
}

interface AIResponse {
  success: boolean
  data?: any
  error?: string
  usage?: {
    promptTokens?: number
    completionTokens?: number
    totalTokens?: number
  }
}

// OpenAI API handler
async function handleOpenAI(request: AIRequest, apiKey: string): Promise<AIResponse> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(request.type),
          },
          {
            role: 'user',
            content: formatInput(request),
          },
        ],
        max_tokens: 2048,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error')
    }

    return {
      success: true,
      data: data.choices[0]?.message?.content || '',
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'OpenAI API error',
    }
  }
}

// OpenAI Vision API handler
async function handleOpenAIVision(request: AIRequest, apiKey: string): Promise<AIResponse> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: getSystemPrompt(request.type),
              },
              {
                type: 'image_url',
                image_url: request.input,
              },
            ],
          },
        ],
        max_tokens: 1024,
      }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI Vision API error')
    }

    return {
      success: true,
      data: data.choices[0]?.message?.content || '',
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'OpenAI Vision API error',
    }
  }
}

// Anthropic Claude API handler
async function handleAnthropic(request: AIRequest, apiKey: string): Promise<AIResponse> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: formatInput(request),
          },
        ],
      }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Anthropic API error')
    }

    return {
      success: true,
      data: data.content[0]?.text || '',
      usage: {
        promptTokens: data.usage?.input_tokens || 0,
        completionTokens: data.usage?.output_tokens || 0,
        totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Anthropic API error',
    }
  }
}

function getSystemPrompt(type: string): string {
  const prompts: Record<string, string> = {
    'enhance-prompt': `You are an expert D&D and AI art prompt engineer. Enhance the given prompt for Stable Diffusion generation in the style of Solo Leveling manhwa anime. Focus on dramatic lighting, high contrast, detailed character art, and dynamic poses. Add specific Solo Leveling elements like shadow energy, gates, and system interface aesthetics.`,
    'analyze-image': `You are an expert art analyst specializing in anime/manga style artwork, particularly Solo Leveling. Analyze the given image and provide detailed information about style, mood, composition, and technical aspects. Focus on elements that would be useful for D&D campaign art generation.`,
    'generate-tags': `You are an expert D&D content curator. Generate relevant tags for the given content in the context of a Solo Leveling themed campaign. Focus on mood, setting, and gameplay elements.`,
    'detect-mood': `You are an expert in emotional analysis for D&D content. Detect the primary mood of the given content and provide a single-word mood label that would be useful for categorizing campaign materials.`,
  }
  
  return prompts[type] || prompts['enhance-prompt']
}

function formatInput(request: AIRequest): string {
  let formatted = `Request: ${request.type}\n`
  formatted += `Input: ${typeof request.input === 'string' ? request.input : 'Non-text input'}\n`
  
  if (request.context) {
    formatted += `Context: ${JSON.stringify(request.context, null, 2)}\n`
  }
  
  if (request.options) {
    formatted += `Options: ${JSON.stringify(request.options, null, 2)}\n`
  }
  
  return formatted
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { service, type, input, context, options } = await req.json() as AIRequest

    // Get API keys from environment
    const apiKey = globalThis.Deno?.env.get(`${service.toUpperCase()}_API_KEY`)
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: `API key not found for service: ${service}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    let response: AIResponse

    // Route to appropriate service handler
    switch (service) {
      case 'openai':
        if (type === 'analyze-image') {
          response = await handleOpenAIVision({ service, type, input, context, options }, apiKey)
        } else {
          response = await handleOpenAI({ service, type, input, context, options }, apiKey)
        }
        break
      case 'anthropic':
        response = await handleAnthropic({ service, type, input, context, options }, apiKey)
        break
      default:
        response = { success: false, error: `Unsupported service: ${service}` }
    }

    // Log usage to Supabase
    if (response.success && response.usage) {
      const supabaseUrl = (globalThis as any).Deno?.env.get('SUPABASE_URL')
      const supabaseKey = (globalThis as any).Deno?.env.get('SUPABASE_SERVICE_ROLE_KEY')!

      const supabase = createClient(supabaseUrl, supabaseKey)

      await supabase.rpc('log_ai_usage', {
        p_service_id: service,
        p_request_type: type,
        p_tokens_used: response.usage.totalTokens || 0,
        p_cost: calculateCost(service, response.usage.totalTokens || 0),
        p_metadata: { context, options }
      })
    }

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

function calculateCost(service: string, tokens: number): number {
  // Simple cost calculation (in USD)
  const rates: Record<string, number> = {
    'openai': 0.00003, // ~$0.03 per 1K tokens for GPT-4
    'anthropic': 0.000015, // ~$0.015 per 1K tokens for Claude
  }
  
  return (tokens / 1000) * (rates[service] || 0.00003)
}
