export const runtime = "nodejs";
export const maxDuration = 300;

// NOTE: this API is required because the actual backend server only supports HTTP requests
// so we rely on the NextJS route handler to handle HTTPS requests and forward them to the backend via HTTP
async function handleRequest(request: Request, method: string) {
  try {
    // extract everything after "/api/backend/"
    // when sending to our actual backend, there is no "/api/backend/" prefix
    const url = new URL(request.url);
    const path = url.pathname.split("/api/backend/")[1] || "";

    const backendUrl = process.env.BACKEND_URL;

    const headers = new Headers();
    request.headers.forEach((value, key) => {
      // exclude host-related headers
      if (!["host", "connection"].includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    });

    // Only include body for methods that support it
    const body = ["POST", "PUT", "PATCH"].includes(method)
      ? await request.text()
      : undefined;

    const response = await fetch(`${backendUrl}${path}`, {
      method,
      headers,
      body,
      // Important: Don't set a timeout on the fetch call
      // to allow the full streaming duration
    });

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (error) {
    console.error("Error forwarding request:", error);
    return new Response(
      JSON.stringify({ error: "Failed to forward request to backend" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function GET(request: Request) {
  return handleRequest(request, "GET");
}

export async function POST(request: Request) {
  return handleRequest(request, "POST");
}

export async function PUT(request: Request) {
  return handleRequest(request, "PUT");
}

export async function DELETE(request: Request) {
  return handleRequest(request, "DELETE");
}
