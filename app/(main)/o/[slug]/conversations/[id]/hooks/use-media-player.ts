import { useCallback, useEffect, useRef, useState } from "react";

import type { MediaPlayerActions, MediaPlayerState } from "../shared-types";

type UseMediaPlayerProps = {
  mediaType: "audio" | "video" | "image" | null;
  startTime?: number;
  mergedTimeRanges?: { startTime: number; endTime: number }[];
};

export function useMediaPlayer({ mediaType, startTime, mergedTimeRanges }: UseMediaPlayerProps) {
  // React Player v3 exposes HTMLVideoElement via ref (handles both audio and video)
  const reactPlayerRef = useRef<HTMLVideoElement | null>(null);

  const [state, setState] = useState<MediaPlayerState>({
    isPlaying: false,
    isMuted: false,
    currentTime: 0,
    duration: 0,
    isMediaLoaded: mediaType === "image" || !mediaType,
    isDragging: false,
    didInitialSeek: false,
  });

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (mediaType !== "audio" && mediaType !== "video") return;
      const media = reactPlayerRef.current;
      if (media && state.duration > 0) {
        const rect = e.currentTarget.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const newTime = pos * state.duration;
        media.currentTime = newTime;
        setState((prev) => ({ ...prev, currentTime: newTime }));
      }
    },
    [mediaType, state.duration],
  );

  const onPlayPause = useCallback(() => {
    if (mediaType !== "audio" && mediaType !== "video") return;
    // Controlled via `playing` prop — toggle state and React Player responds
    setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, [mediaType]);

  const onMute = useCallback(() => {
    if (mediaType !== "audio" && mediaType !== "video") return;
    setState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
  }, [mediaType]);

  const onForward = useCallback(() => {
    if (mediaType !== "audio" && mediaType !== "video") return;
    const media = reactPlayerRef.current;
    if (media) {
      const newTime = Math.min(media.duration, media.currentTime + 10);
      media.currentTime = newTime;
      setState((prev) => ({ ...prev, currentTime: newTime }));
    }
  }, [mediaType]);

  const onReplay = useCallback(() => {
    if (mediaType !== "audio" && mediaType !== "video") return;
    const media = reactPlayerRef.current;
    if (media) {
      const newTime = Math.max(0, media.currentTime - 10);
      media.currentTime = newTime;
      setState((prev) => ({ ...prev, currentTime: newTime }));
    }
  }, [mediaType]);

  const onFullscreen = useCallback(() => {
    if (mediaType !== "video") return;
    const media = reactPlayerRef.current;
    if (!media) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      media.requestFullscreen();
    }
  }, [mediaType]);

  const onDragStateChange = useCallback((isDragging: boolean) => {
    setState((prev) => ({ ...prev, isDragging }));
  }, []);

  const onSeekTo = useCallback(
    (seconds: number) => {
      if (mediaType !== "audio" && mediaType !== "video") return;
      const media = reactPlayerRef.current;
      if (media) {
        media.currentTime = seconds;
        setState((prev) => ({ ...prev, currentTime: seconds }));
      }
    },
    [mediaType],
  );

  const actions: MediaPlayerActions = {
    onPlayPause,
    onMute,
    onForward,
    onReplay,
    onFullscreen,
    onProgressClick: handleProgressClick,
    onDragStateChange,
    onSeekTo,
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setState((prev) => ({ ...prev, isPlaying: false }));
    };
  }, []);

  // Native HTML media event handlers
  const handleCanPlay = useCallback(() => {
    if (mediaType !== "audio" && mediaType !== "video") return;
    const media = reactPlayerRef.current;
    if (media && !state.didInitialSeek) {
      const seekTime = mergedTimeRanges && mergedTimeRanges.length > 0 ? mergedTimeRanges[0].startTime : startTime;
      const canSeek = media.seekable.length > 0 && media.seekable.end(0) >= (seekTime || 0);
      if (canSeek) {
        media.currentTime = seekTime || 0;
        setState((prev) => ({
          ...prev,
          currentTime: seekTime || 0,
          didInitialSeek: true,
        }));
      }
    }
  }, [mediaType, mergedTimeRanges, startTime, state.didInitialSeek]);

  const handleLoadedMetadata = useCallback(() => {
    if (mediaType !== "audio" && mediaType !== "video") return;
    const media = reactPlayerRef.current;
    if (media) {
      setState((prev) => ({
        ...prev,
        duration: media.duration,
        isMediaLoaded: true,
      }));
    }
  }, [mediaType]);

  const handleTimeUpdate = useCallback(() => {
    if (mediaType !== "audio" && mediaType !== "video") return;
    const media = reactPlayerRef.current;
    if (media && media.currentTime !== state.currentTime) {
      setState((prev) => ({ ...prev, currentTime: media.currentTime }));
    }
  }, [mediaType, state.currentTime]);

  return {
    reactPlayerRef,
    state,
    actions,
    handleCanPlay,
    handleLoadedMetadata,
    handleTimeUpdate,
  };
}
