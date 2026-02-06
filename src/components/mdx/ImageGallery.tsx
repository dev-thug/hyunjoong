import Image from "next/image";

interface GalleryImage {
  /** 이미지 경로 */
  src: string;
  /** 대체 텍스트 */
  alt: string;
  /** 이미지 캡션 */
  caption?: string;
}

type ColumnCount = 2 | 3 | 4;

interface ImageGalleryProps {
  /** 이미지 배열 */
  images: GalleryImage[];
  /** 열 개수 (기본값: 2) */
  columns?: ColumnCount;
  /** 갤러리 전체 캡션 */
  caption?: string;
  /** 이미지 간격 조절 */
  gap?: "sm" | "md" | "lg";
}

const GAP_CLASSES = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
};

const COLUMN_CLASSES: Record<ColumnCount, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
};

/**
 * 이미지 갤러리 컴포넌트
 * 여러 이미지를 그리드 형태로 표시
 */
const ImageGallery = ({
  images,
  columns = 2,
  caption,
  gap = "md",
}: ImageGalleryProps) => {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <figure className="my-8">
      <div className={`grid ${COLUMN_CLASSES[columns]} ${GAP_CLASSES[gap]}`}>
        {images.map((image, index) => (
          <div key={`${image.src}-${index}`} className="relative">
            <div className="overflow-hidden rounded-xl bg-zinc-900/50">
              <Image
                src={image.src}
                alt={image.alt}
                width={600}
                height={400}
                className="block w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                sizes={`(max-width: 640px) 100vw, (max-width: 768px) 50vw, ${Math.round(100 / columns)}vw`}
              />
            </div>
            {image.caption && (
              <p className="mt-2 text-xs text-zinc-500 text-center leading-relaxed">
                {image.caption}
              </p>
            )}
          </div>
        ))}
      </div>
      {caption && (
        <figcaption className="mt-4 text-center text-sm text-zinc-500 leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default ImageGallery;
