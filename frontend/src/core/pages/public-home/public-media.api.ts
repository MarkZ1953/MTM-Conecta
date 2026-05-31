import API_BASE_URL from "@/config/api.config";
import type { PublicImageCarouselSlide } from "./public-image-carousel";

type PublicCloudinaryFolderResponse = {
  assets: PublicImageCarouselSlide[];
  folder: string;
};

export async function getPublicCloudinaryFolder(folderKey: string) {
  const response = await fetch(`${API_BASE_URL}/public/cloudinary-folders/${folderKey}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Could not load public Cloudinary folder: ${folderKey}`);
  }

  const data = (await response.json()) as PublicCloudinaryFolderResponse;
  return data.assets;
}
