export type dropdownOptionType<T> = { label: string; value: T };

export type commonDropdownProps<T> = {
  options: dropdownOptionType<T>[];
  onSelectHandler: ({
    checked,
    label,
    value
  }: { checked: boolean } & dropdownOptionType<T>) => void;
};
