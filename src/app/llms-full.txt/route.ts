import { shouldNoIndexDeployment } from "@/lib/indexing-policy";
import { getAiDiscoveryData, buildAiDiscoveryDocuments } from "@/lib/ai-discovery";

export const revalidate = 3600;

export async function GET(): Promise<Response> {
  if (shouldNoIndexDeployment()) {
    return new Response("", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const data = await getAiDiscoveryData();
  const { full } = buildAiDiscoveryDocuments(data);
  return new Response(full, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
