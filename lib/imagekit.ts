import config from "@/lib/config";

const imageKitAuthEndpoint = `${config.env.apiEndpoint || ""}/api/auth/imagekit`;

export const getUploadAuth = async () => {
  try {
    const res = await fetch(imageKitAuthEndpoint);

    if (!res.ok) {
      const errText = await res.text();

      throw new Error(`Request failed with status ${res.status}: ${errText}`);
    }

    const { signature, expire, token } = await res.json();

    return { signature, expire, token };
  } catch (err: unknown) {
    throw new Error(`Authentication failed: ${getErrorMessage(err)}`);
  }
};

export const deleteImageKitFile = async (fileId: string) => {
  try {
    const res = await fetch(imageKitAuthEndpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileId }),
    });

    if (!res.ok) {
      const errText = await res.text();

      throw new Error(`Request failed with status ${res.status}: ${errText}`);
    }
  } catch (err: unknown) {
    throw new Error(`Image deletion failed: ${getErrorMessage(err)}`);
  }
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
