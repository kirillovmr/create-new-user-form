/**
 * Generic Input 
 */

type InputType = string | number

type GenericInputProps<T extends InputType> = {
    id: string
    type: React.InputHTMLAttributes<HTMLInputElement>['type']
    label: string
    value: T
    error: string
    placeholder: string
    required: boolean
    disabled: boolean
    onChange: (value: T) => void
    children?: JSX.Element
}

/**
 * Returns a label input
 */
function Label<T extends InputType>(props: GenericInputProps<T>) {
    const { id, label } = props

    return (
        <label className="mt-3" htmlFor={id}>
            {label}
        </label>
    )
}

/**
 * Returns the input component
 */
function Input<T extends InputType>(props: GenericInputProps<T>) {
    const {
        id, type, value, error,
        placeholder, required, disabled, onChange
    } = props

    return (
        <input
            id={id}
            type={type}
            className={`form-control ${error ? 'is-invalid' : ''}`}
            value={value}
            placeholder={placeholder}
            onChange={e => onChange(e.target.value as T)}
            required={required}
            disabled={disabled}
        />
    )
}

/**
 * Returns a section with the error message
 */
function Feedback<T extends InputType>(props: GenericInputProps<T>) {
    const { error } = props

    return (
        <div className="invalid-feedback">
            {error}
        </div>
    )
}

/**
 * Returns a single or grouped input depending on the children prop
 */
export default function GenericInput<T extends InputType>(props: GenericInputProps<T>) {
    const { children } = props

    if (children) {
        return (
            <div className="form-row">
                <div className='col-12'>
                    {Label(props)}
                    <div className="input-group mb-3">
                        {Input(props)}
                        <div className="input-group-append">
                            {children}
                        </div>
                        {Feedback(props)}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="form-row">
            <div className='col-12'>
                {Label(props)}
                {Input(props)}
                {Feedback(props)}
            </div>
        </div>
    )
}