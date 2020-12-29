interface FormLayoutProps {
  onSubmit: (e: React.FormEvent) => void
}
export const FormLayout: React.FC<FormLayoutProps> = ({
  children,
  onSubmit,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 h-full overflow-auto space-y-8 divide-y divide-gray-200 w-full"
    >
      {children}
    </form>
  )
}

export const FormFieldLayout: React.FC = ({ children }) => {
  return (
    <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
      <div>{children}</div>
    </div>
  )
}

export const FormInputsLayout: React.FC = ({ children }) => {
  return <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">{children}</div>
}
