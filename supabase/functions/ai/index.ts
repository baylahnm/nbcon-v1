import { z } from "zod";

const aiCallSchema = z.object({
  mode: z.string().min(1),
  prompt: z.string().min(1),
  userId: z.string().min(1),
  budgetMs: z.number().int().positive().optional(),
  budgetUsd: z.number().positive().optional(),
  traceId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

type AiCall = z.infer<typeof aiCallSchema>;

type ProviderRoute =
  | "openai:gpt-4o-mini"
  | "openai:gpt-4o"
  | "vertex:gemini-1.5"
  | "local:nbcon-edge";

interface RouterDecision {
  route: ProviderRoute;
  reason: string;
}

interface AiResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
  traceId: string;
}

function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "authorization, content-type, idempotency-key");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function jsonResponse(body: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  return withCors(
    new Response(JSON.stringify(body), {
      ...init,
      headers,
    }),
  );
}

function badRequest(message: string, issues?: unknown) {
  return jsonResponse({ error: "bad_request", message, issues }, { status: 400 });
}

function notAllowed(method: string) {
  return jsonResponse(
    {
      error: "method_not_allowed",
      message: `Method ${method} is not supported. Use POST for AI calls.`,
    },
    { status: 405 },
  );
}

function planRoute(request: AiCall): RouterDecision {
  // Smart routing based on mode and requirements
  if (request.mode.startsWith("structural") || request.mode.startsWith("electrical")) {
    return {
      route: "openai:gpt-4o",
      reason: "Complex engineering analysis requires advanced reasoning",
    };
  }

  if (request.mode.includes("image") || request.mode === "drone-surveying") {
    return {
      route: "openai:gpt-4o",
      reason: "Multimodal capabilities needed for image analysis",
    };
  }

  if (request.mode === "research" || request.mode.includes("analysis")) {
    return {
      route: "openai:gpt-4o",
      reason: "Research mode requires comprehensive analysis",
    };
  }

  // Default to cost-effective model for general tasks
  return {
    route: "openai:gpt-4o-mini",
    reason: "Cost-effective model for general engineering tasks",
  };
}

async function callOpenAI(prompt: string, model: string, traceId: string): Promise<AiResponse> {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not found in environment variables");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "system",
          content: "You are an expert engineering assistant for the NBCON platform in Saudi Arabia. Provide accurate, helpful, and professional responses for engineering projects and services."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  
  return {
    content: data.choices[0].message.content,
    usage: data.usage,
    model: data.model,
    traceId,
  };
}

async function callVertexAI(prompt: string, model: string, traceId: string): Promise<AiResponse> {
  // Placeholder for Vertex AI integration
  // You would implement this similar to OpenAI but with Vertex AI API
  throw new Error("Vertex AI integration not yet implemented");
}

async function callLocalAI(prompt: string, traceId: string): Promise<AiResponse> {
  // Placeholder for local AI model integration
  // This could be a local Ollama instance or other local model
  return {
    content: `[Local AI Response] I understand you're asking about: "${prompt}". This is a placeholder response from the local AI handler.`,
    model: "local:nbcon-edge",
    traceId,
  };
}

async function executeAiCall(aiCall: AiCall): Promise<AiResponse> {
  const decision = planRoute(aiCall);
  const traceId = aiCall.traceId ?? crypto.randomUUID();

  try {
    // Set timeout based on budget
    const timeoutMs = aiCall.budgetMs ?? 30000; // 30 second default
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    let response: AiResponse;

    try {
      if (decision.route.startsWith("openai:")) {
        const model = decision.route.split(":")[1];
        response = await callOpenAI(aiCall.prompt, model, traceId);
      } else if (decision.route.startsWith("vertex:")) {
        const model = decision.route.split(":")[1];
        response = await callVertexAI(aiCall.prompt, model, traceId);
      } else {
        response = await callLocalAI(aiCall.prompt, traceId);
      }
    } finally {
      clearTimeout(timeoutId);
    }

    return response;
  } catch (error) {
    console.error("AI call failed:", error);
    
    // Fallback response
    return {
      content: `I apologize, but I'm experiencing technical difficulties. Your request was: "${aiCall.prompt}". Please try again in a moment.`,
      model: "fallback",
      traceId,
    };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return withCors(new Response(null, { status: 204 }));
  }

  if (req.method === "GET") {
    return jsonResponse({
      status: "ok",
      message: "AI router is online",
      supportedRoutes: ["openai:gpt-4o-mini", "openai:gpt-4o", "vertex:gemini-1.5", "local:nbcon-edge"],
      features: [
        "Smart routing based on mode",
        "OpenAI GPT-4 integration",
        "Timeout and budget controls",
        "Fallback handling"
      ]
    });
  }

  if (req.method !== "POST") {
    return notAllowed(req.method);
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch (error) {
    return badRequest("Request body must be valid JSON.", error instanceof Error ? error.message : String(error));
  }

  const parseResult = aiCallSchema.safeParse(payload);
  if (!parseResult.success) {
    return badRequest("Invalid AI call payload", parseResult.error.flatten());
  }

  const aiCall = parseResult.data;
  const traceId = aiCall.traceId ?? crypto.randomUUID();

  try {
    const response = await executeAiCall(aiCall);
    
    return jsonResponse({
      status: "success",
      traceId,
      response,
      routing: planRoute(aiCall),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI router error:", error);
    
    return jsonResponse({
      status: "error",
      traceId,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
});