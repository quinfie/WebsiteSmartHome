import { nanoid } from "nanoid";

interface TextAreaProps extends React.InputHTMLAttributes<HTMLSelectElement> {
  selectList: { value: string; label: string }[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
}

const SelectInput: React.FC<TextAreaProps> = ({ selectList, value, onChange, ...props }) => {
  return (
    <select
      value={value || ''}
      onChange={onChange}
      className="w-full h-10 dark:bg-blackPrimary bg-white border border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 pl-3 pr-8 cursor-pointer dark:hover:border-gray-500 hover:border-gray-400"
      {...props}
    >
      {selectList.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
};

export default SelectInput;
