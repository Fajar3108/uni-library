import { getUploadAuthParams } from "@imagekit/next/server";
import config from "@/lib/config";
import { NextResponse } from "next/server";

export async function GET() {
  const { token, expire, signature } = getUploadAuthParams({
    privateKey: config.env.imagekit.privateKey,
    publicKey: config.env.imagekit.publicKey,
  });

  return NextResponse.json({ token, expire, signature });
}

export async function DELETE(request: Request) {
  const { fileId } = (await request.json()) as { fileId?: string };

  if (!fileId) {
    return NextResponse.json({ error: "fileId is required" }, { status: 400 });
  }

  const response = await fetch(
    `https://api.imagekit.io/v1/files/${encodeURIComponent(fileId)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${config.env.imagekit.privateKey}:`,
        ).toString("base64")}`,
      },
    },
  );

  if (!response.ok) {
    const error = await response.text();

    return NextResponse.json(
      { error: error || "Failed to delete ImageKit file" },
      { status: response.status },
    );
  }

  return NextResponse.json({ success: true });
}
