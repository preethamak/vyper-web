import { NextResponse } from "next/server";
import { fetchProjectIntel } from "@/lib/live-intel";

export async function GET() {
  const intel = await fetchProjectIntel();
  return NextResponse.json(intel, {
    headers: {
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
