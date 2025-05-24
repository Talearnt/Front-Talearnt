import { useEffect, useState } from "react";

import { EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import { AutoplayOptionsType } from "embla-carousel-autoplay/components/Autoplay";
import useEmblaCarousel from "embla-carousel-react";

export type useCarouselProps = {
  autoplay?: boolean;
  autoplayOptions?: AutoplayOptionsType;
  carouselOptions?: EmblaOptionsType;
  trackButtonStates?: boolean;
  trackIndexStates?: boolean;
};

type useCarouselReturnType = {
  emblaRef: (node: HTMLElement | null) => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  currentIndex: number;
  isAutoPlaying: boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
  toggleAutoplay: () => void;
};

export function useCarousel({
  autoplay,
  autoplayOptions,
  carouselOptions,
  trackButtonStates,
  trackIndexStates
}: useCarouselProps): useCarouselReturnType {
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(
    !!autoplayOptions?.playOnInit
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const plugins = autoplay ? [Autoplay(autoplayOptions)] : [];

  const [emblaRef, emblaApi] = useEmblaCarousel(carouselOptions, plugins);

  const scrollPrev = () => {
    if (!emblaApi) {
      return;
    }

    if (autoplay) {
      emblaApi.plugins().autoplay.stop();
    }

    emblaApi.scrollPrev();
  };
  const scrollNext = () => {
    if (!emblaApi) {
      return;
    }

    if (autoplay) {
      emblaApi.plugins().autoplay.stop();
    }

    emblaApi.scrollNext();
  };
  const toggleAutoplay = () => {
    if (!emblaApi || !autoplay) {
      return;
    }

    const {
      autoplay: { isPlaying, play, stop }
    } = emblaApi.plugins();

    return isPlaying() ? stop() : play();
  };

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const onSelect = () => {
      if (trackButtonStates) {
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
      }

      if (trackIndexStates) {
        setCurrentIndex(emblaApi.selectedScrollSnap());
      }
    };

    onSelect();
    emblaApi.on("reInit", onSelect).on("select", onSelect);

    if (autoplay) {
      emblaApi
        .on("autoplay:play", () => setIsAutoPlaying(true))
        .on("autoplay:stop", () => setIsAutoPlaying(false));
    }
  }, [emblaApi, trackButtonStates, autoplay, trackIndexStates]);

  return {
    emblaRef,
    canScrollPrev,
    canScrollNext,
    currentIndex,
    isAutoPlaying,
    scrollPrev,
    scrollNext,
    toggleAutoplay
  };
}
