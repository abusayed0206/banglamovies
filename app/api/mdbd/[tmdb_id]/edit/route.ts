import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { tmdb_id: string } }
) {
  const { tmdb_id } = params;

  if (!tmdb_id) {
    return NextResponse.json({ error: "TMDB ID is required" }, { status: 400 });
  }

  const workerUrl = `https://mdbd.lrsayed.workers.dev/${tmdb_id}`;

  try {
    const response = await fetch(workerUrl);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { tmdb_id: string } }
) {
  const { tmdb_id } = params;

  if (!tmdb_id) {
    return NextResponse.json({ error: "TMDB ID is required" }, { status: 400 });
  }

  const workerUrl = `https://mdbd.lrsayed.workers.dev/${tmdb_id}/edit`;

  try {
    const body = await request.json();
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
