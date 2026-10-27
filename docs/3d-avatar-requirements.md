# 3D Avatar Requirements

## Recommended workflow

1. Create or commission a likeness-based model from Sahithisri’s own portrait references. Do not use a stock or generic face.
2. Build a neutral, professional head-and-shoulders model with realistic skin and hair materials.
3. Rig the neck/head and both eyes, then add facial blendshapes for blinking.
4. Export and validate the web-ready GLB before connecting it to the portfolio.

## Required format

- Preferred format: binary `.glb`.
- Expected location: `public/models/sahithisri-avatar.glb`.
- Keep the model upright, centered, with a neutral expression and consistent camera framing.
- Use compressed textures and keep texture dimensions appropriate for web delivery.

## Rigging and blendshapes

The model should expose:

- One head or neck bone for subtle rotation.
- Separate left and right eye bones for gaze movement.
- Blink morph targets named `blink`, `eyeBlinkLeft`, and/or `eyeBlinkRight`.
- Natural facial proportions, realistic skin and hair, and no exaggerated expression.

Names can be customized in `src/data/avatar-config.ts`. Missing bones and blendshapes are optional and are ignored safely.

## Validation checklist

- [ ] Model is based on Sahithisri’s supplied references and approved before publishing.
- [ ] Neutral expression and professional framing.
- [ ] Head rotation stays within approximately 6 degrees.
- [ ] Eye rotation stays within approximately 10 degrees.
- [ ] Blink morph targets animate naturally if present.
- [ ] No broken textures, missing materials, or console errors.
- [ ] GLB loads on desktop and mobile without horizontal overflow.
- [ ] Reduced-motion and touch behavior render a static model.
- [ ] Original portrait fallback remains available.

## Performance

- Prefer one optimized GLB over multiple model files.
- Resize textures to the display requirement and use compressed formats where supported.
- Keep draw calls, materials, and polygon count reasonable for a hero element.
- Use the existing Canvas DPR cap and avoid continuous effects beyond the required tracking.
- Test initial load and memory use on a mid-range mobile device.

## Connect the final model

Pass the validated model path to `AvatarScene`:

```tsx
<AvatarScene
  modelSrc="/models/sahithisri-avatar.glb"
  config={defaultAvatarConfig}
  altText="Interactive 3D avatar of Sahithisri Cheruku"
/>
```

Until that asset exists and passes validation, keep the existing `PortraitReveal` photo active in the hero.
