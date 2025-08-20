import { writeClient } from "@/sanity/lib/write-client";
import { NextResponse } from "next/server";


export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = (await params).id;

  try {
    const updated = await writeClient
      .patch(id)
      .setIfMissing({ likes: 0 })
      .inc({ likes: 1 })
      .commit({ returnDocuments: true });

    return NextResponse.json({ likes: updated.likes ?? 0 }, { status: 200 });
  } catch (err) {
    console.error("Like PATCH failed", err);
    return NextResponse.json(
      { error: "Failed to update likes" },
      { status: 500 }
    );
  }
}
