import { SERVICES, ServiceMode } from "./services.ts";

const encoder = new TextEncoder();

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify(body), { ...init, headers });
}

function notFound(service?: string): Response {
  return jsonResponse(
    {
      error: "service_not_found",
      message: `Service "${service ?? "unknown"}" is not registered`,
      available: Object.keys(SERVICES),
    },
    { status: 404 },
  );
}

async function parseRequest(req: Request): Promise<{ service?: ServiceMode; payload: any }> {
  const url = new URL(req.url);
  const segments = url.pathname.split("/").filter(Boolean);
  const service = segments.length > 1 ? (segments.at(-1) as ServiceMode) : undefined;

  if (req.method === "GET") {
    return { service, payload: null };
  }

  if (req.headers.get("content-type")?.includes("application/json")) {
    return { service, payload: await req.json() };
  }

  if (req.headers.get("content-type")?.includes("multipart/form-data")) {
    const formData = await req.formData();
    const data: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    return { service, payload: data };
  }

  const text = await req.text();
  return { service, payload: text ? JSON.parse(text) : null };
}

function buildPlanningPrompt(service: ServiceMode, payload: any) {
  const config = SERVICES[service];

  return {
    service,
    title: config.title,
    prompt: config.prompt,
    tools: config.tools,
    output: config.output,
    input: payload ?? {},
    instructions:
      "Use the service prompt to gather missing data, then call downstream tools in the order provided. Return outputs using the specified format and deliverables.",
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": req.headers.get("Access-Control-Request-Headers") ?? "*",
      },
    });
  }

  const { service, payload } = await parseRequest(req);

  if (!service) {
    if (req.method === "GET") {
      return jsonResponse({ services: SERVICES });
    }
    return jsonResponse(
      {
        error: "missing_service",
        message: "Provide a service identifier in the request path (e.g. /ai-service/site-inspection)",
      },
      { status: 400 },
    );
  }

  if (!SERVICES[service]) {
    return notFound(service);
  }

  if (req.method === "GET") {
    return jsonResponse({ service, config: SERVICES[service] });
  }

  return jsonResponse({ plan: buildPlanningPrompt(service, payload) });
});
