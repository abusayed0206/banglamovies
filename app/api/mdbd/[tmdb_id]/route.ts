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

    // Check if the response is in JSON format
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text(); // If it's not JSON, get the raw text
    }

    // Check if the response has no data or is an error message
    if (!data || Object.keys(data).length === 0 || data === "Data not found") {
      return NextResponse.json(
        { message: `There is no data. Please add it here /${tmdb_id}/edit` },
        { status: 404 }
      );
    }

    // If the data is valid JSON, return it
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
