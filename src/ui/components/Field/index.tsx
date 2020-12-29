import * as React from "react"

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label: string
  as?: React.ElementType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: Record<string, any>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: () => void
} & React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >

export const Field: React.FC<InputProps> = ({
  name = "",
  label,
  children = null,
  required,
  errors = {},
  as = "input",
  onChange,
  onBlur,
  ...props
}) => {
  if (!name) {
    console.error("Provide a name for the input")
  }
  return (
    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
      >
        {label}
      </label>
      <div className="mt-1 sm:mt-0 sm:col-span-2">
        <div className="max-w-lg flex flex-col rounded-md shadow-sm">
          <input
            {...props}
            id={name}
            name={name}
            onChange={onChange}
            onBlur={onBlur}
          />
          {errors[name] && (
            <span className="hidden mt-2 text-sm text-red-600 sm:block">
              {errors[name]}
            </span>
          )}
        </div>
      </div>
      {errors[name] && (
        <span className="mt-2 text-sm text-red-600 sm:hidden">
          {errors[name]}
        </span>
      )}
      {children}
    </div>
  )
}
