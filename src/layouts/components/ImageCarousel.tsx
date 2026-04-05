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
}: {
  images: ImageLike[];
  altPrefix?: string;
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
  const hasMultiple = items.length > 1;

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
          >
            <img src={activeItem.src} alt={activeItem.alt} loading="lazy" />
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

        {hasMultiple && (
          <div className="image-carousel-thumbs">
            {items.map((item, index) => (
              <button
                key={`${item.src}-${index}`}
                type="button"
                className={`image-carousel-thumb ${index === activeIndex ? "active" : ""}`}
                aria-label={`Show screenshot ${index + 1}`}
                onClick={() => setActiveIndex(index)}
              >
                <img src={item.src} alt={item.alt} loading="lazy" />
              </button>
            ))}
          </div>
        )}
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
