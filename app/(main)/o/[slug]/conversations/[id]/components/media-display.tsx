import Image from "next/image";

import { getRagieStreamPath } from "@/lib/paths";

import PlayerControls from "../player-controls";
import type { MediaDisplayData, MediaPlayerActions, MediaPlayerState } from "../shared-types";
import ReactPlayerWrapper, { type ReactPlayerRef } from "./react-player-wrapper";

type MediaDisplayProps = {
  mediaData: MediaDisplayData;
  state: MediaPlayerState;
  actions: MediaPlayerActions;
  reactPlayerRef: React.RefObject<ReactPlayerRef | null>;
  slug: string;
  onCanPlay: () => void;
  onLoadedMetadata: () => void;
  onTimeUpdate: () => void;
};

function MediaSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="h-4 w-full mb-1 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-full mb-1 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-[85%] mb-7 bg-gray-200 rounded animate-pulse" />
    </div>
  );
}

export default function MediaDisplay({
  mediaData,
  state,
  actions,
  reactPlayerRef,
  slug,
  onCanPlay,
  onLoadedMetadata,
  onTimeUpdate,
}: MediaDisplayProps) {
  if (!mediaData.type) return null;

  if (mediaData.type === "image" && mediaData.imageUrl) {
    return (
      <div className="mb-6">
        <Image src={getRagieStreamPath(slug, mediaData.imageUrl)} alt="Image" width={500} height={500} />
      </div>
    );
  }

  if ((mediaData.type === "audio" || mediaData.type === "video") && mediaData.streamUrl) {
    const isVideo = mediaData.type === "video";
    const showControls = state.isMediaLoaded && (isVideo ? state.duration > 0 : true);

    return (
      <div className="mb-6">
        <div className="flex flex-col">
          <ReactPlayerWrapper
            ref={reactPlayerRef}
            src={getRagieStreamPath(slug, mediaData.streamUrl)}
            playing={state.isPlaying}
            muted={state.isMuted}
            width="100%"
            height={isVideo ? undefined : 0}
            style={isVideo ? { borderRadius: "0.5rem", overflow: "hidden" } : { display: "none" }}
            controls={false}
            preload="metadata"
            onCanPlay={onCanPlay}
            onLoadedMetadata={onLoadedMetadata}
            onLoadedData={onLoadedMetadata}
            onDurationChange={onLoadedMetadata}
            onTimeUpdate={onTimeUpdate}
          />
          {showControls ? (
            <PlayerControls
              isPlaying={state.isPlaying}
              isMuted={state.isMuted}
              currentTime={state.currentTime}
              duration={state.duration}
              onProgressClick={actions.onProgressClick}
              onPlayPause={actions.onPlayPause}
              onMute={actions.onMute}
              onForward={actions.onForward}
              onReplay={actions.onReplay}
              onFullscreen={actions.onFullscreen}
              onDragStateChange={actions.onDragStateChange}
              mergedTimeRanges={mediaData.mergedTimeRanges}
              onSeekTo={actions.onSeekTo}
            />
          ) : (
            <MediaSkeleton />
          )}
        </div>
      </div>
    );
  }

  return null;
}
