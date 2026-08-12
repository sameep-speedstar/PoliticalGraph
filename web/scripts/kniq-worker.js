/**
 * kniqnew Worker — static assets + SPA fallback for Stance map handles.
 * Unknown /stance/map/:handle serves /stance/map/ (200) so the client can render.
 * All other paths (including /poligraph) pass through to assets unchanged.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    const mapMatch = path.match(/^\/stance\/map\/([^/]+)\/?$/);
    if (mapMatch) {
      const handle = mapMatch[1];
      // Never SPA-fallback static files
      if (!handle.includes(".")) {
        const assetRes = await env.ASSETS.fetch(request);
        if (assetRes.status !== 404) {
          return assetRes;
        }
        const shellUrl = new URL("/stance/map/", url);
        // Preserve handle for clients that read ?handle=
        shellUrl.searchParams.set("handle", handle);
        const shellReq = new Request(shellUrl.toString(), {
          method: "GET",
          headers: request.headers,
        });
        const shell = await env.ASSETS.fetch(shellReq);
        // Important: 200 with original URL (browser keeps /map/handle)
        const headers = new Headers(shell.headers);
        headers.set("cache-control", "public, max-age=0, must-revalidate");
        return new Response(shell.body, { status: 200, headers });
      }
    }

    return env.ASSETS.fetch(request);
  },
};
