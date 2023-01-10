/**
 * Settings Toggle
 */

type SettingsToggleProps = {
    state: any
    setState: (state: any) => void
}

/**
 * Returns setting block to toggle between custom and bootstrap's validation
 */
export default function SettingsToggle(props: SettingsToggleProps) {
    const {
        state, setState
    } = props

    return (
        <span
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => setState({
                ...state,
                customValidation: !state.customValidation,
                inputErrors: Object.keys(state.inputErrors).reduce((acc, cur) => ({ ...acc, [cur]: '' }), {})
            })}
        >
            {'Toggle: ' + (state.customValidation ? 'Custom input validation' : 'Bootstrap input validation')}
        </span>
    )
}