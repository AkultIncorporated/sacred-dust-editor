"use client";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function ColorPicker({ label, value, onChange }: Props) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_74px] items-center gap-x-2.5 gap-y-2">
      <label className="min-w-0 text-[13px] text-sd-text" htmlFor={label}>
        {label}
      </label>
      <div className="font-mono text-xs text-sd-muted text-right">{value.toLowerCase()}</div>
      <input
        id={label}
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="col-span-2 h-[34px] w-full cursor-pointer rounded-md border border-sd-line bg-[#0f0f0f]"
      />
    </div>
  );
}
