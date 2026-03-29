"use client";

import dynamic from "next/dynamic";
import React from "react";

const DynamicReactPlayer = dynamic(() => import("react-player"), { ssr: false });

// Props we expose to consumers — React Player v3 accepts HTML video attrs + its own extras
type ReactPlayerWrapperProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  playing?: boolean;
  onReady?: () => void;
  style?: React.CSSProperties;
};

// React Player v3 exposes HTMLVideoElement via ref directly
export type ReactPlayerRef = HTMLVideoElement;

const ReactPlayerWrapper = React.forwardRef<ReactPlayerRef, ReactPlayerWrapperProps>(
  function ReactPlayerWrapper(props, ref) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <DynamicReactPlayer {...(props as any)} ref={ref} />;
  },
);
ReactPlayerWrapper.displayName = "ReactPlayerWrapper";

export default ReactPlayerWrapper;
