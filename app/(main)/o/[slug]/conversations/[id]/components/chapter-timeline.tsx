"use client";

type TimeRange = { startTime: number; endTime: number };

type ChapterTimelineProps = {
  mergedTimeRanges: TimeRange[];
  duration: number;
  onSeekTo: (seconds: number) => void;
};

const formatTime = (time: number) => {
  if (isNaN(time) || !isFinite(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function ChapterTimeline({ mergedTimeRanges, duration, onSeekTo }: ChapterTimelineProps) {
  if (!mergedTimeRanges.length || duration <= 0) return null;

  return (
    <>
      {mergedTimeRanges.map((range, i) => {
        const left = (range.startTime / duration) * 100;
        const width = Math.max(((range.endTime - range.startTime) / duration) * 100, 0.5);
        return (
          <div
            key={i}
            className="absolute top-0 h-full bg-amber-400/60 rounded-sm cursor-pointer hover:bg-amber-400/80 transition-colors z-10"
            style={{ left: `${left}%`, width: `${width}%` }}
            onClick={(e) => {
              e.stopPropagation();
              onSeekTo(range.startTime);
            }}
            title={`${formatTime(range.startTime)} – ${formatTime(range.endTime)}`}
          />
        );
      })}
    </>
  );
}

type ChapterPillsProps = {
  mergedTimeRanges: TimeRange[];
  onSeekTo: (seconds: number) => void;
};

export function ChapterPills({ mergedTimeRanges, onSeekTo }: ChapterPillsProps) {
  if (!mergedTimeRanges.length) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-2 px-2">
      <span className="text-xs text-gray-400 self-center mr-1">Cited clips:</span>
      {mergedTimeRanges.map((range, i) => (
        <button
          key={i}
          onClick={() => onSeekTo(range.startTime)}
          className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors border border-amber-300 cursor-pointer"
        >
          {formatTime(range.startTime)} – {formatTime(range.endTime)}
        </button>
      ))}
    </div>
  );
}
