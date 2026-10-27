export type AvatarBoneConfig = {
  head: string[];
  leftEye: string[];
  rightEye: string[];
};

export type AvatarBlendshapeConfig = {
  blink: string[];
};

export type AvatarConfig = {
  modelPath: string;
  bones: AvatarBoneConfig;
  blendshapes: AvatarBlendshapeConfig;
};

export const defaultAvatarConfig: AvatarConfig = {
  modelPath: "/models/sahithisri-avatar.glb",
  bones: {
    head: ["head", "Head", "neck", "Neck"],
    leftEye: ["eyeLeft", "EyeLeft", "leftEye", "LeftEye"],
    rightEye: ["eyeRight", "EyeRight", "rightEye", "RightEye"],
  },
  blendshapes: { blink: ["blink", "eyeBlinkLeft", "eyeBlinkRight"] },
};
