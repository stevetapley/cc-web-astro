import React, { useEffect, useMemo, useState } from "react";

type ImageLike =
  | string
  | {
      src: string;
      alt?: string;
    };

const ImageCarousel = ({
  images,
  altPrefix = "Screenshot",
  autoRotateMs = 3000,
  minHeight = "clamp(280px, 34vw, 420px)",
}: {
  images: ImageLike[];
  altPrefix?: string;
  autoRotateMs?: number;
  minHeight?: string;
}) => {
  const items = useMemo(
    () =>
      (images || []).map((image, index) =>
        typeof image === "string"
          ? { src: image, alt: `${altPrefix} ${index + 1}` }
          : { src: image.src, alt: image.alt || `${altPrefix} ${index + 1}` },
      ),
    [altPrefix, images],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const hasMultiple = items.length > 1;

  useEffect(() => {
    if (!hasMultiple || lightboxOpen || autoRotateMs <= 0) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, autoRotateMs);

    return () => window.clearInterval(intervalId);
  }, [autoRotateMs, hasMultiple, items.length, lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowRight") {
        setActiveIndex((current) => (current + 1) % items.length);
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => (current - 1 + items.length) % items.length);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [items.length, lightboxOpen]);

  if (!items.length) return null;

  const activeItem = items[activeIndex];

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + items.length) % items.length);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % items.length);
  };

  return (
    <>
      <div className="image-carousel">
        <div className="image-carousel-stage">
          {hasMultiple && (
            <button
              type="button"
              className="image-carousel-nav prev"
              aria-label="Previous screenshot"
              onClick={showPrevious}
            >
              ‹
            </button>
          )}

          <button
            type="button"
            className="group image-carousel-preview"
            aria-label="Open screenshot fullscreen"
            onClick={() => setLightboxOpen(true)}
            style={{ minHeight }}
          >
            <img
              src={activeItem.src}
              alt={activeItem.alt}
              loading="lazy"
              style={{ minHeight }}
            />
            <span className="image-carousel-hint">Click to enlarge</span>
          </button>

          {hasMultiple && (
            <button
              type="button"
              className="image-carousel-nav next"
              aria-label="Next screenshot"
              onClick={showNext}
            >
              ›
            </button>
          )}
        </div>

      </div>

      {lightboxOpen && (
        <div
          className="image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="image-lightbox-content" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="image-lightbox-close"
              aria-label="Close fullscreen viewer"
              onClick={() => setLightboxOpen(false)}
            >
              ×
            </button>

            {hasMultiple && (
              <button
                type="button"
                className="image-lightbox-nav prev"
                aria-label="Previous screenshot"
                onClick={showPrevious}
              >
                ‹
              </button>
            )}

            <img src={activeItem.src} alt={activeItem.alt} className="image-lightbox-image" />

            {hasMultiple && (
              <button
                type="button"
                className="image-lightbox-nav next"
                aria-label="Next screenshot"
                onClick={showNext}
              >
                ›
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCarousel;
