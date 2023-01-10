/**
 * Submit Button
 */

type SubmitButtonProps = {
    loading: boolean
    submitting: boolean
    submissionSuccess: boolean
}

function getLoader(props: SubmitButtonProps) {
    const {
        loading, submitting
    } = props

    if (loading || submitting) 
        return <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>

    return <></>
}

function getButtonText(props: SubmitButtonProps) {
    const {
        loading, submitting
    } = props

    if (loading) return 'Loading'
    if (submitting) return 'Submitting'
    return 'Create user'
}

export default function SubmitButton(props: SubmitButtonProps) {
    const {
        loading, submitting, submissionSuccess
    } = props

    const isDisabled = loading || submitting || submissionSuccess

    return (
        <div className="form-row">
            <button
                className={`btn mt-3 w-100 btn-${submissionSuccess ? 'success' : 'primary'}`}
                type="submit"
                disabled={isDisabled}
            >
                {getLoader(props)}
                {getButtonText(props)}
            </button>
        </div>
    )
}