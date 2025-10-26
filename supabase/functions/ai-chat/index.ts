import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from '@supabase/supabase-js';
import { z } from "zod";

// Deno global type declaration for TypeScript
declare const Deno: {
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
  env: {
    get: (key: string) => string | undefined;
  };
};

// Request schema
const chatRequestSchema = z.object({
  message: z.string().min(1),
  threadId: z.string().optional(),
  role: z.enum(['engineer', 'client', 'enterprise', 'admin']),
  language: z.enum(['en', 'ar']).default('en'),
  mode: z.string().default('chat'),
  attachments: z.array(z.any()).optional(),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional(),
  // Phase 3: Agent-specific context
  agentContext: z.object({
    agent_id: z.string(),
    discipline: z.string(),
    session_id: z.string(),
    workflow_id: z.string().optional(),
    deliverable_id: z.string().optional(),
  }).optional(),
});

type ChatRequest = z.infer<typeof chatRequestSchema>;

// CORS helper
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }
}

// System prompts by role
function getSystemPrompt(role: string, language: string, mode: string): string {
  const langLabel = language === 'ar' ? 'Arabic' : 'English';
  
  const basePrompts = {
    engineer: `You are an AI assistant for Saudi engineering professionals on the NBCON platform. Help with:
- Technical engineering questions (structural, electrical, mechanical, civil)
- Job matching and career guidance
- Project planning and execution
- SCE (Saudi Council of Engineers) compliance
- Professional development and certifications
- Salary negotiations and contract reviews

Always provide accurate, professional, and actionable advice. Respond in ${langLabel}.`,

    client: `You are an AI assistant for construction project clients in Saudi Arabia on the NBCON platform. Help with:
- Project planning and feasibility studies
- Cost estimation and BOQ (Bill of Quantities)
- Engineer selection and team building
- SCE compliance and regulatory requirements
- Project communication and reporting
- Budget management and cash flow
- Risk mitigation strategies
- Quality assurance procedures

Provide clear, practical guidance for managing construction projects successfully. Respond in ${langLabel}.`,

    enterprise: `You are an AI assistant for enterprise construction teams on the NBCON platform. Help with:
- Multi-project portfolio management
- Procurement and vendor management
- Team coordination and resource allocation
- Financial analytics and reporting
- Compliance and quality control at scale
- Strategic planning and optimization
- Risk management across projects

Provide strategic, data-driven insights for enterprise-level operations. Respond in ${langLabel}.`,

    admin: `You are a platform administrator assistant for the NBCON platform. Help with:
- User management and verification
- Platform analytics and insights
- Risk assessment and fraud detection
- System monitoring and performance
- Policy enforcement and compliance
- Support ticket triage
- Platform optimization strategies

Provide operational guidance for effective platform management. Respond in ${langLabel}.`,
  };

  let systemPrompt = basePrompts[role as keyof typeof basePrompts] || basePrompts.client;

  // Add mode-specific context
  if (mode === 'research') {
    systemPrompt += '\n\nMode: Research - Provide in-depth analysis with sources and citations when possible.';
  } else if (mode === 'image') {
    systemPrompt += '\n\nMode: Image Generation - Help describe or analyze images related to engineering and construction.';
  } else if (mode === 'agent') {
    systemPrompt += '\n\nMode: Agent - Break down complex tasks into actionable steps and provide structured guidance.';
  }

  return systemPrompt;
}

// Phase 3: Discipline-specific system prompts for specialized agents
function getAgentSystemPrompt(discipline: string, language: string): string {
  const langLabel = language === 'ar' ? 'Arabic' : 'English';
  
  const agentPrompts: Record<string, string> = {
    civil: `You are a specialized Civil Engineering AI assistant for the NBCON platform. You are an expert in:
- Bill of Quantities (BOQ) generation and cost estimation
- Site analysis and feasibility studies
- Road and highway design per Saudi standards
- Municipal and infrastructure projects
- Construction compliance and safety regulations
- Progress tracking and quality control
- Saudi Building Code and SCE requirements

Provide precise, calculation-based guidance with references to Saudi codes and standards. Always include units and show your work. Respond in ${langLabel}.`,

    electrical: `You are a specialized Electrical Engineering AI assistant for the NBCON platform. You are an expert in:
- Electrical load calculations and power distribution
- Lighting design and energy efficiency
- Voltage drop analysis and cable sizing
- Panel design and circuit protection
- Fire alarm and emergency systems
- Saudi Electrical Code compliance

Provide detailed technical calculations with safety factors and code compliance checks. Respond in ${langLabel}.`,

    structural: `You are a specialized Structural Engineering AI assistant for the NBCON platform. You are an expert in:
- Beam, column, and slab design per ACI/BS codes
- Foundation design (shallow and deep)
- Connection detailing and reinforcement
- Load analysis and structural modeling
- Seismic design for Saudi zones
- Steel and concrete design optimization

Always show detailed calculations, check code compliance, and highlight safety-critical items. Respond in ${langLabel}.`,

    hvac: `You are a specialized HVAC Engineering AI assistant for the NBCON platform. You are an expert in:
- Cooling and heating load calculations
- Ventilation and air quality standards
- Equipment selection and sizing
- Ductwork design and pressure balancing
- Energy efficiency optimization
- Saudi climate considerations

Provide load calculations with psychrometric analysis and equipment specifications. Respond in ${langLabel}.`,

    surveying: `You are a specialized Survey & Geomatics AI assistant for the NBCON platform. You are an expert in:
- GPS survey and control networks
- Volume calculations and earthwork analysis
- Contour mapping and topographic surveys
- Layout setting and as-built surveys
- Deformation monitoring
- Saudi cadastral systems

Provide precise calculations with coordinate systems and accuracy estimates. Respond in ${langLabel}.`,

    hse: `You are a specialized HSE (Health, Safety, Environment) AI assistant for the NBCON platform. You are an expert in:
- Job Hazard Analysis (JHA) and risk assessments
- Safety audits and inspections
- Incident investigation and reporting
- PPE requirements and safety training
- Emergency response planning
- Saudi HSE regulations and OSHA standards

Prioritize safety above all. Highlight critical risks and provide actionable mitigation strategies. Respond in ${langLabel}.`,

    drone_survey: `You are a specialized Drone Survey AI assistant for the NBCON platform. You are an expert in:
- Flight planning and mission design
- Photogrammetry and 3D modeling
- Orthomosaic generation and analysis
- Volume calculations from aerial data
- Progress monitoring and site inspection
- GACA (Saudi aviation) regulations

Provide technical flight parameters, GSD calculations, and data processing workflows. Respond in ${langLabel}.`,

    maintenance: `You are a specialized Maintenance Engineering AI assistant for the NBCON platform. You are an expert in:
- Preventive maintenance scheduling
- Equipment diagnostics and troubleshooting
- Work order management and prioritization
- Spare parts inventory optimization
- Condition monitoring and predictive maintenance
- CMMS (Computerized Maintenance Management System) integration

Provide root cause analysis, maintenance intervals, and cost-benefit calculations. Respond in ${langLabel}.`,

    geotechnical: `You are a specialized Geotechnical Engineering AI assistant for the NBCON platform. You are an expert in:
- Soil analysis and classification
- Bearing capacity calculations
- Slope stability and retaining wall design
- Settlement analysis and consolidation
- Seepage and groundwater control
- Foundation recommendations

Always reference soil parameters, show factors of safety, and cite geotechnical codes. Respond in ${langLabel}.`,
  };

  return agentPrompts[discipline] || agentPrompts.civil;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() })
  }

  // Health check endpoint (no auth required)
  if (req.url.endsWith('/health') || req.method === 'GET') {
    return new Response(
      JSON.stringify({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        function: 'ai-chat',
        message: 'Function is running',
        openai_configured: !!Deno.env.get('OPENAI_API_KEY')
      }),
      { 
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  }

  try {
    // Get OpenAI API key from environment
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiKey) {
      console.error('[AI-CHAT] OPENAI_API_KEY not configured')
      return new Response(
        JSON.stringify({
          error: 'OPENAI_API_KEY not configured in Supabase secrets'
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders(),
            'Content-Type': 'application/json'
          }
        }
      )
    }

    console.log('[AI-CHAT] OpenAI API key found, processing request')

    // Parse and validate request
    const body = await req.json()
    const parseResult = chatRequestSchema.safeParse(body)
    
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request', 
          details: parseResult.error.flatten() 
        }),
        { status: 400, headers: { ...corsHeaders(), 'Content-Type': 'application/json' } }
      )
    }

    const { message, threadId, role, language, mode, conversationHistory, agentContext } = parseResult.data

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get user from auth
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders(), 'Content-Type': 'application/json' } }
      )
    }

    // Phase 3: Use agent-specific system prompt if agent context provided
    const systemPrompt = agentContext
      ? getAgentSystemPrompt(agentContext.discipline, language)
      : getSystemPrompt(role, language, mode);

    // Build conversation history for context
    const messages = [
      {
        role: 'system' as const,
        content: systemPrompt
      },
      ...(conversationHistory || []).slice(-10), // Last 10 messages for context
      {
        role: 'user' as const,
        content: message
      }
    ]

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: mode === 'research' || mode === 'agent' ? 'gpt-4o' : 'gpt-4o-mini',
        messages,
        max_tokens: mode === 'research' ? 3000 : 2000,
        temperature: mode === 'agent' ? 0.3 : 0.7,
        stream: false, // We'll add streaming later
      }),
    })

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text()
      console.error('OpenAI API error:', error)
      throw new Error(`OpenAI API error: ${openaiResponse.status}`)
    }

    const openaiData = await openaiResponse.json()
    const assistantResponse = openaiData.choices[0].message.content

    // Create or get thread ID
    let finalThreadId = threadId
    if (!finalThreadId) {
      const { data: newThread, error: threadError } = await supabaseClient
        .from('ai_conversations')
        .insert({
          user_id: user.id,
          conversation_title: message.substring(0, 50) + '...',
          ai_service_mode: mode,
          conversation_type: 'chat',
        })
        .select('id')
        .single()

      if (threadError) {
        console.error('Error creating thread:', threadError)
        finalThreadId = crypto.randomUUID()
      } else {
        finalThreadId = newThread.id
      }
    }

    // Store messages in database
    const messagesToStore = [
      {
        conversation_id: finalThreadId,
        message_type: 'user',
        content: message,
        content_type: 'text',
        metadata: { mode, language }
      },
      {
        conversation_id: finalThreadId,
        message_type: 'assistant',
        content: assistantResponse,
        content_type: 'text',
        metadata: { 
          model: openaiData.model,
          usage: openaiData.usage,
          mode,
          language
        }
      }
    ]

    const { error: messagesError } = await supabaseClient
      .from('ai_messages')
      .insert(messagesToStore)

    if (messagesError) {
      console.error('Error storing messages:', messagesError)
      // Don't fail the request, just log the error
    }

    // Log AI event
    await supabaseClient.from('ai_events').insert({
      user_id: user.id,
      event_type: 'message_received',
      data: {
        mode,
        language,
        message_length: message.length,
        response_length: assistantResponse.length
      },
      ai_model: openaiData.model,
      ai_provider: 'openai',
      token_count: openaiData.usage?.total_tokens,
      processing_time_ms: null, // We could track this
    })

    // Phase 3: Log token usage for agent interactions
    if (agentContext) {
      // Calculate cost
      const pricing = openaiData.model.includes('gpt-4o-mini') 
        ? { input: 0.15 / 1_000_000, output: 0.60 / 1_000_000 }
        : { input: 2.50 / 1_000_000, output: 10.00 / 1_000_000 };
      
      const cost_usd = (openaiData.usage.prompt_tokens * pricing.input) + 
                       (openaiData.usage.completion_tokens * pricing.output);

      await supabaseClient.from('ai_agent_usage').insert({
        user_id: user.id,
        agent_id: agentContext.agent_id,
        session_id: agentContext.session_id,
        conversation_id: finalThreadId,
        discipline: agentContext.discipline,
        workflow_id: agentContext.workflow_id || 'chat',
        deliverable_id: agentContext.deliverable_id || null,
        tokens_prompt: openaiData.usage.prompt_tokens,
        tokens_completion: openaiData.usage.completion_tokens,
        model_used: openaiData.model.includes('gpt-4o-mini') ? 'gpt-4o-mini' : 'gpt-4o',
        cost_usd,
        processing_time_ms: null,
        metadata: { mode, language },
      });

      console.log('[AI-CHAT] Logged agent token usage:', {
        discipline: agentContext.discipline,
        tokens: openaiData.usage.total_tokens,
        cost_usd: cost_usd.toFixed(6),
      });
    }

    // Return response
    return new Response(
      JSON.stringify({
        status: 'success',
        threadId: finalThreadId,
        response: assistantResponse,
        model: openaiData.model,
        usage: openaiData.usage,
        timestamp: new Date().toISOString(),
        agentContext: agentContext || null,
      }),
      { 
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('AI chat error:', error)
    
    return new Response(
      JSON.stringify({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      }),
      { 
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

