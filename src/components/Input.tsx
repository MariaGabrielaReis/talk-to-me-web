import { ForwardRefRenderFunction, forwardRef } from "react";

type InputProps = { placeholder: string; type: string };

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { placeholder, type, ...rest },
  ref,
) => {
  return (
    <div>
      <label>
        <input
          type={type}
          placeholder={placeholder}
          ref={ref}
          {...rest}
          className="px-3 py-2 bg-gray rounded-md w-full"
        />
      </label>
    </div>
  );
};

export const Input = forwardRef(InputBase);
