import React from "react";
import { Composition, Still } from "remotion";
import { OpeningScene } from "./scenes/OpeningScene";
import { LockupBuildOn } from "./scenes/LockupBuildOn";
import { SocialPost } from "./scenes/SocialPost";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="opening-full-black"
        component={OpeningScene as any}
        durationInFrames={300}
        fps={30}
        width={2160}
        height={2160}
        defaultProps={{ withStarBurst: true, blackBackground: true }}
      />
      <Composition
        id="opening-full-black-with-logo"
        component={OpeningScene as any}
        durationInFrames={300}
        fps={30}
        width={2160}
        height={2160}
        defaultProps={{ withStarBurst: true, blackBackground: true, withLogo: true }}
      />
      <Composition
        id="opening-sunset"
        component={OpeningScene as any}
        durationInFrames={300}
        fps={30}
        width={2160}
        height={2160}
        defaultProps={{ withStarBurst: true, sunsetBackground: true, withLogo: true }}
      />
      <Composition
        id="fire-and-kite"
        component={OpeningScene as any}
        durationInFrames={220}
        fps={30}
        width={2160}
        height={2160}
        defaultProps={{ withStarBurst: false, blackBackground: false }}
      />
      <Composition
        id="fire-and-kite-black"
        component={OpeningScene as any}
        durationInFrames={220}
        fps={30}
        width={2160}
        height={2160}
        defaultProps={{ withStarBurst: false, blackBackground: true }}
      />
      <Composition
        id="fire-and-kite-sunset"
        component={OpeningScene as any}
        durationInFrames={220}
        fps={30}
        width={2160}
        height={2160}
        defaultProps={{ withStarBurst: false, sunsetBackground: true }}
      />
      <Composition
        id="lockup-buildon"
        component={LockupBuildOn}
        durationInFrames={150}
        fps={30}
        width={2160}
        height={2160}
      />
      <Composition
        id="lockup-buildon-black"
        component={LockupBuildOn as any}
        durationInFrames={150}
        fps={30}
        width={2160}
        height={2160}
        defaultProps={{ blackBackground: true } as any}
      />
      <Composition
        id="lockup-buildon-sunset"
        component={LockupBuildOn as any}
        durationInFrames={150}
        fps={30}
        width={2160}
        height={2160}
        defaultProps={{ sunsetBackground: true } as any}
      />
      <Still
        id="lockup-still"
        component={LockupBuildOn}
        width={2160}
        height={2160}
      />
      <Composition
        id="social-square"
        component={SocialPost as any}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{ format: "square" } as any}
      />
      <Composition
        id="social-story"
        component={SocialPost as any}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ format: "story" } as any}
      />
    </>
  );
};
