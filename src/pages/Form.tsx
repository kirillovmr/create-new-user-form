import React, { Component } from 'react'
import { Eye, EyeOff } from 'react-feather'
import axios from 'axios'

import { 
    GenericInput, 
    GenericSelect, 
    SettingsToggle, 
    SubmitButton 
} from '../components'

import './Form.css'

type FormInputKeys = {
    'name': string
    'email': string
    'password': string
    'occupation': string
    'state': string
}

type FormProps = {}
type FormState = {
    occupations: string[]
    states: { name: string, abbreviation: string }[]

    loading: boolean
    submitting: boolean
    submissionResult: {
        success: boolean
        text: string
    }

    customValidation: boolean
    passwordHidden: boolean

    inputValues: FormInputKeys
    inputErrors: {
        [key in keyof FormInputKeys]: string
    }
}

export default class Form extends Component<FormProps, FormState> {
    constructor(props: FormProps) {
        super(props)

        this.state = {
            occupations: [],
            states: [],

            loading: true,
            submitting: false,
            submissionResult: {
                success: false,
                text: ''
            },

            customValidation: true,
            passwordHidden: true,

            // Input data from each field
            inputValues: {
                name: '',
                email: '',
                password: '',
                occupation: '',
                state: '',
            },

            // Errors for each field
            inputErrors: {
                name: '',
                email: '',
                password: '',
                occupation: '',
                state: '',
            },
        }
    }

    /**
     * Updates current input in the state
     *  and removes any error for the input field
     */
    onInputChange<K extends keyof FormInputKeys>(key: K, value: FormInputKeys[K]) {
        this.setState({
            ...this.state,
            inputValues: {
                ...this.state.inputValues,
                [key]: value
            },
            inputErrors: {
                ...this.state.inputErrors,
                [key]: ''
            }
        })
    }

    /**
     * Dynamically refresh select group elements
     */
    refreshSelectBoxes() {
        // @ts-ignore
        $('.selectpicker').selectpicker('refresh');
    }

    /**
     * 
     */
    togglePassword() {
        this.setState({
            ...this.state,
            passwordHidden: !this.state.passwordHidden,
        })
    }

    /**
     * Custom input validation
     *  returns true if all input fields are ok, otherwise false
     */
    validate() {
        const inputErrors = { ...this.state.inputErrors }
        let success = true

        const { inputValues } = this.state

        // Check for empty field
        Object.keys(inputValues).forEach(_field => {
            const field = _field as keyof FormInputKeys
            if (inputValues[field].length === 0) {
                success = false
                inputErrors[field] = `Please provide a ${field}`
            }
        })

        // Custom check for password
        if (inputValues.password.length < 8) {
            success = false
            inputErrors.password = 'Password must be at least 8 characters'
        }

        !success && this.setState({
            ...this.state,
            inputErrors,
        })

        return success
    }

    /**
     * Runs form validation and submits
     */
    async onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!this.validate()) return

        this.setState({
            ...this.state,
            submitting: true,
        })

        const { name, email, password, occupation, state } = this.state.inputValues

        try {
            const res = await axios.post('https://frontend-take-home.fetchrewards.com/form', {
                name,
                email,
                password,
                occupation,
                state,
            })

            // The form does not return anything besides the payload and request id, 
            //  so there is no usage for "res" variable.

            this.setState({
                ...this.state,
                submitting: false,
                submissionResult: {
                    success: true,
                    text: 'User created successfully. Reload the page to create a new user.'
                },
            })
        }
        catch (e) {
            this.setState({
                ...this.state,
                submitting: false,
                submissionResult: {
                    success: false,
                    text: 'Error during form submission. Please try again.'
                },
            })
        }
    }

    /**
     * Retrieves occupation and state form data
     */
    async componentDidMount() {
        try {
            const res = await axios('https://frontend-take-home.fetchrewards.com/form')

            this.setState({
                ...this.state,
                occupations: res.data.occupations,
                states: res.data.states,
            })
        }
        catch (e) {
            this.setState({
                ...this.state,
                submissionResult: {
                    success: false,
                    text: '⚠️ Unable to load Occupation and State fields data.'
                }
            })
        }

        setTimeout(() => {
            this.refreshSelectBoxes()
            this.setState({
                ...this.state,
                loading: false,
            })
        }, 100)
    }

    render() {
        const {
            customValidation, passwordHidden,
            inputValues, inputErrors,
            submissionResult, loading, submitting,
        } = this.state

        return (
            <section id="form">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 col-md-8">
                            <h1>Create new user</h1>

                            {/* Settings */}
                            <SettingsToggle
                                state={this.state}
                                setState={this.setState.bind(this)}
                            />

                            <form onSubmit={e => this.onSubmit(e)}>

                                {/* Full Name */}
                                <GenericInput
                                    id='name'
                                    type='text'
                                    label='Full Name'
                                    value={inputValues.name}
                                    error={inputErrors.name}
                                    placeholder='John Doe'
                                    required={!customValidation}
                                    disabled={submissionResult.success}
                                    onChange={v => this.onInputChange('name', v)}
                                />

                                {/* Email */}
                                <GenericInput
                                    id='email'
                                    type='email'
                                    label='Email'
                                    value={inputValues.email}
                                    error={inputErrors.email}
                                    placeholder='doe@example.com'
                                    required={!customValidation}
                                    disabled={submissionResult.success}
                                    onChange={v => this.onInputChange('email', v)}
                                />

                                {/* Password */}
                                <GenericInput
                                    id='password'
                                    type={passwordHidden ? 'password' : 'text'}
                                    label='Password'
                                    value={inputValues.password}
                                    error={inputErrors.password}
                                    placeholder='********'
                                    required={!customValidation}
                                    disabled={submissionResult.success}
                                    onChange={v => this.onInputChange('password', v)}
                                >
                                    <button
                                        className="btn btn-outline-secondary btn-radius-fix"
                                        type="button"
                                        onClick={() => this.togglePassword()}
                                    >
                                        {passwordHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </GenericInput>

                                <div className="form-row">
                                    {/* Occupation */}
                                    <GenericSelect
                                        id='occupation'
                                        label='Occupation'
                                        title='Choose occupation...'
                                        options={this.state.occupations.map(v => ({ value: v, tokens: v }))}
                                        value={inputValues.occupation}
                                        error={inputErrors.occupation}
                                        required={!customValidation}
                                        disabled={submissionResult.success}
                                        onChange={v => this.onInputChange('occupation', v)}
                                    />
                                    
                                    {/* State */}
                                    <GenericSelect
                                        id='state'
                                        label='State'
                                        title='Choose state...'
                                        options={this.state.states.map(v => ({ value: v.name, tokens: `${v.abbreviation} ${v.name}` }))}
                                        value={inputValues.state}
                                        error={inputErrors.state}
                                        required={!customValidation}
                                        disabled={submissionResult.success}
                                        onChange={v => this.onInputChange('state', v)}
                                    />
                                </div>

                                {/* Submisson result */}
                                <div className="mt-4">
                                    <p className={submissionResult.success ? 'text-success' : 'text-danger'}>
                                        {submissionResult.text}
                                    </p>
                                </div>

                                {/* Submission button */}
                                <SubmitButton
                                    loading={loading}
                                    submitting={submitting}
                                    submissionSuccess={submissionResult.success}
                                />
                            </form>
                        </div>
                    </div>
                </div >
            </section >
        )
    }
}