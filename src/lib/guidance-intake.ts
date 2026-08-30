import type { GuidanceIntakeResponses } from '@/config/guidance';
import { GUIDANCE_INTAKE_SOMETHING_ELSE } from '@/config/guidance';

export function formatGuidanceIntakeResponses(intake: GuidanceIntakeResponses | null | undefined) {
  if (!intake) return null;

  const feeling =
    intake.lifeAreaFeeling === GUIDANCE_INTAKE_SOMETHING_ELSE && intake.lifeAreaFeelingOther
      ? intake.lifeAreaFeelingOther
      : intake.lifeAreaFeeling;

  return [
    { label: 'Area of life', value: intake.lifeArea },
    { label: 'How it feels right now', value: feeling },
    { label: 'How long on your mind', value: intake.onMindDuration },
  ];
}

export function parseGuidanceIntakeResponses(value: unknown): GuidanceIntakeResponses | null {
  if (!value || typeof value !== 'object') return null;

  const intake = value as Partial<GuidanceIntakeResponses>;
  if (!intake.lifeArea || !intake.lifeAreaFeeling || !intake.onMindDuration) return null;

  return {
    lifeArea: intake.lifeArea,
    lifeAreaFeeling: intake.lifeAreaFeeling,
    lifeAreaFeelingOther: intake.lifeAreaFeelingOther,
    onMindDuration: intake.onMindDuration,
  };
}
