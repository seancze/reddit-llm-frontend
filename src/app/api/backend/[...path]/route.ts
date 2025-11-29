// Configure Node.js runtime with extended timeout for streaming
export const runtime = "nodejs";
export const maxDuration = 300;

// NOTE: this API is required because the actual backend server only supports HTTP requests
// so we rely on the NextJS route handler to handle HTTPS requests and forward them to the backend via HTTP
export async function POST(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Extract the path segments
    const { path: pathSegments } = await params;
    const path = pathSegments.join("/");

    // Get the backend URL from environment variables
    const backendUrl = process.env.BACKEND_URL;

    // Get request headers
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      // Forward relevant headers but exclude host-related headers
      if (!["host", "connection"].includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    });

    // Get request body
    const body = await request.text();

    // Forward the request to the backend
    const response = await fetch(`${backendUrl}/${path}`, {
      method: "POST",
      headers,
      body,
      // Important: Don't set a timeout on the fetch call
      // to allow the full streaming duration
    });

    // Return the response (preserving streaming capability)
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

// Support GET requests as well if needed
export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const path = pathSegments.join("/");

    const backendUrl = process.env.BACKEND_URL;

    const headers = new Headers();
    request.headers.forEach((value, key) => {
      if (!["host", "connection"].includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    });

    const response = await fetch(`${backendUrl}/${path}`, {
      method: "GET",
      headers,
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
