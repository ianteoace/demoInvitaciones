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
    <div className="mx-auto grid max-w-full grid-cols-1 gap-3 sm:max-w-6xl sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {images.map((image) => (
        <div
          key={image.src}
          className="overflow-hidden rounded-[1.5rem] bg-[rgba(255,255,255,0.18)] shadow-[0_18px_50px_rgba(93,63,59,0.06)] sm:rounded-[2rem]"
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
