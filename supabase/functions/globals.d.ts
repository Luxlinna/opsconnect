// Minimal Deno global declarations for IDE type checking.
// The actual runtime is Deno inside Supabase Edge Functions.
// Install the "Deno" VSCode extension for full Deno IntelliSense.

declare namespace Deno {
  const env: {
    get(key: string): string | undefined;
  };
  function serve(handler: (req: Request) => Response | Promise<Response>): void;
}
