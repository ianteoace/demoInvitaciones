"use client";

type GalleryImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type ImageCarouselProps = {
  images: GalleryImage[];
};

export default function ImageCarousel({ images }: ImageCarouselProps) {
  return (
    <div className="mx-auto max-w-full columns-1 gap-3 sm:max-w-6xl sm:gap-4 sm:columns-2 lg:columns-3">
      {images.map((image) => (
        <div
          key={image.src}
          className="mb-3 break-inside-avoid overflow-hidden rounded-[1.5rem] bg-[rgba(255,255,255,0.18)] shadow-[0_18px_50px_rgba(93,63,59,0.06)] sm:mb-2 sm:rounded-[2rem]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt={image.alt}
            className="block h-auto w-full"
          />
        </div>
      ))}
    </div>
  );
}
