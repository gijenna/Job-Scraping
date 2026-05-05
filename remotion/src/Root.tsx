import React from "react";
import { Composition, Still } from "remotion";
import { OpeningScene } from "./scenes/OpeningScene";
import { LockupBuildOn } from "./scenes/LockupBuildOn";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Full opening on solid black: fire, sparks, kite, dismiss, snowflake burst */}
      <Composition
        id="opening-full-black"
        component={OpeningScene as any}
        durationInFrames={300}
        fps={30}
        width={2160}
        height={2160}
        defaultProps={{ withStarBurst: true, blackBackground: true }}
      />
      {/* Just the fire + kite, transparent background, no star burst */}
      <Composition
        id="fire-and-kite"
        component={OpeningScene as any}
        durationInFrames={220}
        fps={30}
        width={2160}
        height={2160}
        defaultProps={{ withStarBurst: false, blackBackground: false }}
      />
      {/* Lockup build-on, transparent */}
      <Composition
        id="lockup-buildon"
        component={LockupBuildOn}
        durationInFrames={150}
        fps={30}
        width={2160}
        height={2160}
      />
      {/* Final still of the lockup */}
      <Still
        id="lockup-still"
        component={LockupBuildOn}
        width={2160}
        height={2160}
      />
    </>
  );
};
