import React from "react";
import { Composition } from "remotion";
import "./index.css";
import { FPS, H, W } from "./kit";
import { DURATION, Exemplo } from "./exemplo/Exemplo";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Exemplo" component={Exemplo} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
  </>
);
