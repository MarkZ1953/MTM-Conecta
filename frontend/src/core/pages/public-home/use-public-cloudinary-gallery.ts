import { useEffect, useState } from "react";
import type { PublicImageCarouselSlide } from "./public-image-carousel";
import { getPublicCloudinaryFolder } from "./public-media.api";

export function usePublicCloudinaryGallery(
  folderKey: string,
  fallbackSlides: PublicImageCarouselSlide[],
) {
  const [slides, setSlides] = useState(fallbackSlides);

  useEffect(() => {
    let isActive = true;

    getPublicCloudinaryFolder(folderKey)
      .then((assets) => {
        if (isActive && assets.length) {
          setSlides(assets);
        }
      })
      .catch(() => {
        if (isActive) {
          setSlides(fallbackSlides);
        }
      });

    return () => {
      isActive = false;
    };
  }, [fallbackSlides, folderKey]);

  return slides;
}
