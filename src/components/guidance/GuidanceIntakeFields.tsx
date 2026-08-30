"use client";

import {
  GUIDANCE_INTAKE_LIFE_AREAS,
  GUIDANCE_INTAKE_LIFE_FEELINGS,
  GUIDANCE_INTAKE_ON_MIND_DURATIONS,
  GUIDANCE_INTAKE_SOMETHING_ELSE,
} from "@/config/guidance";

export type GuidanceIntakeFormValues = {
  lifeArea: string;
  lifeAreaFeeling: string;
  lifeAreaFeelingOther: string;
  onMindDuration: string;
};

type GuidanceIntakeFieldsProps = {
  values: GuidanceIntakeFormValues;
  onChange: (field: keyof GuidanceIntakeFormValues, value: string) => void;
};

function QuestionBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-2.5">
      <legend className="text-[#F5E6D3]/90 text-sm lg:text-base font-medium leading-snug mb-1">
        {title}
      </legend>
      <div className="space-y-2">{children}</div>
    </fieldset>
  );
}

function RadioOption({
  name,
  value,
  checked,
  label,
  onChange,
}: {
  name: string;
  value: string;
  checked: boolean;
  label: string;
  onChange: (value: string) => void;
}) {
  return (
    <label
      className={`flex items-start gap-3 cursor-pointer rounded-lg border px-3 py-2.5 transition-colors ${
        checked
          ? "border-[#BD9958]/50 bg-[#BD9958]/10"
          : "border-[#BD9958]/15 bg-white/5 hover:border-[#BD9958]/30"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="mt-1 shrink-0 accent-[#BD9958]"
      />
      <span className="text-[#F5E6D3]/95 text-sm lg:text-base leading-snug">{label}</span>
    </label>
  );
}

export default function GuidanceIntakeFields({ values, onChange }: GuidanceIntakeFieldsProps) {
  return (
    <div className="space-y-5 pt-1 border-t border-[#BD9958]/20">
      <p className="text-[#BD9958]/90 text-xs uppercase tracking-[0.2em] pt-2">
        Before your call
      </p>

      <QuestionBlock title="What area of life is this about?">
        {GUIDANCE_INTAKE_LIFE_AREAS.map((option) => (
          <RadioOption
            key={option}
            name="lifeArea"
            value={option}
            checked={values.lifeArea === option}
            label={option}
            onChange={(value) => onChange("lifeArea", value)}
          />
        ))}
      </QuestionBlock>

      <QuestionBlock title="How does this area of your life feel right now?">
        {GUIDANCE_INTAKE_LIFE_FEELINGS.map((option) => (
          <RadioOption
            key={option}
            name="lifeAreaFeeling"
            value={option}
            checked={values.lifeAreaFeeling === option}
            label={option}
            onChange={(value) => onChange("lifeAreaFeeling", value)}
          />
        ))}
        {values.lifeAreaFeeling === GUIDANCE_INTAKE_SOMETHING_ELSE && (
          <input
            name="lifeAreaFeelingOther"
            placeholder="Tell us more *"
            value={values.lifeAreaFeelingOther}
            onChange={(e) => onChange("lifeAreaFeelingOther", e.target.value)}
            className="w-full bg-white/90 rounded-lg px-4 py-3 text-[#27190B] text-sm lg:text-base mt-1"
          />
        )}
      </QuestionBlock>

      <QuestionBlock title="How long has this been on your mind?">
        {GUIDANCE_INTAKE_ON_MIND_DURATIONS.map((option) => (
          <RadioOption
            key={option}
            name="onMindDuration"
            value={option}
            checked={values.onMindDuration === option}
            label={option}
            onChange={(value) => onChange("onMindDuration", value)}
          />
        ))}
      </QuestionBlock>
    </div>
  );
}

export function validateGuidanceIntake(values: GuidanceIntakeFormValues): string | null {
  if (!values.lifeArea) return "Please select what area of life this is about";
  if (!values.lifeAreaFeeling) return "Please select how this area feels right now";
  if (
    values.lifeAreaFeeling === GUIDANCE_INTAKE_SOMETHING_ELSE &&
    !values.lifeAreaFeelingOther.trim()
  ) {
    return "Please tell us more about how this area feels";
  }
  if (!values.onMindDuration) return "Please select how long this has been on your mind";
  return null;
}
