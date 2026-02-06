import Image from "next/image";
import Link from "next/link";

type ImageSize = "sm" | "md" | "lg" | "full";
type ImageAlign = "left" | "center" | "right";

interface BlogImageProps {
  /** 이미지 경로 (필수) */
  src: string;
  /** 대체 텍스트 - 접근성을 위해 필수 */
  alt: string;
  /** 이미지 너비 (px) */
  width?: number;
  /** 이미지 높이 (px) */
  height?: number;
  /** 프리셋 크기 (sm: 300px, md: 500px, lg: 700px, full: 100%) */
  size?: ImageSize;
  /** 이미지 캡션 */
  caption?: string;
  /** 정렬 방향 */
  align?: ImageAlign;
  /** 둥근 모서리 적용 */
  rounded?: boolean;
  /** 그림자 효과 적용 */
  shadow?: boolean;
  /** LCP 이미지용 우선 로딩 */
  priority?: boolean;
  /** 클릭 시 이동할 링크 */
  href?: string;
}

const SIZE_MAP: Record<ImageSize, number> = {
  sm: 300,
  md: 500,
  lg: 700,
  full: 1200,
};

const ALIGN_CLASSES: Record<ImageAlign, string> = {
  left: "mr-auto",
  center: "mx-auto",
  right: "ml-auto",
};

/**
 * 블로그 이미지 컴포넌트
 * MDX에서 사용할 수 있는 커스텀 이미지 컴포넌트
 * 크기 조절, 캡션, 정렬, 반응형을 지원
 */
const BlogImage = ({
  src,
  alt,
  width,
  height,
  size = "md",
  caption,
  align = "center",
  rounded = true,
  shadow = true,
  priority = false,
  href,
}: BlogImageProps) => {
  const imageWidth = width ?? SIZE_MAP[size];
  const imageHeight = height ?? Math.round(imageWidth * 0.6);

  const imageClasses = [
    "block",
    rounded && "rounded-xl",
    shadow && "shadow-lg shadow-black/20",
    "transition-transform duration-300",
    href && "group-hover:scale-[1.02]",
  ]
    .filter(Boolean)
    .join(" ");

  const containerClasses = [
    "my-8",
    size === "full" ? "w-full" : "",
    ALIGN_CLASSES[align],
  ]
    .filter(Boolean)
    .join(" ");

  const figureStyles =
    size === "full"
      ? { width: "100%" }
      : { maxWidth: `${imageWidth}px`, width: "100%" };

  const imageElement = (
    <Image
      src={src}
      alt={alt}
      width={imageWidth}
      height={imageHeight}
      className={imageClasses}
      priority={priority}
      sizes={
        size === "full"
          ? "100vw"
          : `(max-width: ${imageWidth}px) 100vw, ${imageWidth}px`
      }
      style={{
        width: "100%",
        height: "auto",
      }}
    />
  );

  const wrappedImage = href ? (
    <Link
      href={href}
      className="group block overflow-hidden rounded-xl focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:outline-none"
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      aria-label={caption ?? alt}
    >
      {imageElement}
    </Link>
  ) : (
    <div className="overflow-hidden rounded-xl">{imageElement}</div>
  );

  return (
    <figure className={containerClasses} style={figureStyles}>
      {wrappedImage}
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-zinc-500 leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default BlogImage;
