"use client";
import Galaxy from "@/components/ui/Galaxy";

export default function JourneyPage() {
  return (
    <>
<div style={{ width: '100%', height: '100vh', position: 'relative' }}>
  <Galaxy 
  mouseRepulsion={false}
  mouseInteraction={false}
  transparent={false}
  density={0.3}              // Slightly less dense = more "void" feeling
  glowIntensity={0.1}        // Soft glow = misty effect
  saturation={0.3}           // Lower saturation = more ethereal/misty
  hueShift={220}             // Blue-purple cosmic hues
  twinkleIntensity={0.5}     // Gentle twinkling = alive but subtle
  rotationSpeed={0.03}       // Very slow rotation = cosmic drift
  speed={0.5}                // Slow, dreamy movement
/>
</div>
    </>
  );
}