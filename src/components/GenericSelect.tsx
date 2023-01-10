/**
 * Generic Select
 */

type GenericSelectProps = {
    id: string
    label: string
    title: string
    options: { value: string, tokens: string }[]
    value: string
    error: string
    required: boolean
    disabled: boolean
    onChange: (value: string) => void
}

export default function GenericSelect(props: GenericSelectProps) {
    const {
        id, label, title, options, value, 
        error, required, disabled, onChange, 
    } = props

    return (
        <div className='col-6'>
            <label className='mt-3' htmlFor={id}>{label}</label>
            <select
                id={id}
                className='selectpicker form-control'
                title={title}
                data-live-search="true"
                value={value}
                onChange={e => onChange(e.target.value)}
                required={required}
                disabled={disabled}
            >
                {options.map(opt => <option key={opt.value} data-tokens={opt.tokens}>{opt.value}</option>)}
            </select>
            <div className={`form-control d-none ${error ? 'is-invalid' : ''}`}></div>
            <div className="invalid-feedback">
                {error}
            </div>
        </div>
    )
}