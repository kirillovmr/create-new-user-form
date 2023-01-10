import React, { Component } from 'react'
import { Eye, EyeOff } from 'react-feather'
import axios from 'axios'

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
    onInputChange<K extends keyof FormInputKeys>(inputKey: K, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        this.setState({
            ...this.state,
            inputValues: {
                ...this.state.inputValues,
                [inputKey]: event.target.value
            },
            inputErrors: {
                ...this.state.inputErrors,
                [inputKey]: ''
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
        catch(e) {
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
                    <div className="row" style={{ justifyContent: 'center' }}>
                        <div className="col-sm-12 col-md-8">
                            <h1>Create new user</h1>

                            {/* Demo setting to toggle between custom and bootstrap's validation */}
                            <p
                                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                                onClick={() => {
                                    this.setState({
                                        ...this.state,
                                        customValidation: !customValidation,
                                        inputErrors: Object.keys(inputErrors).reduce((acc, cur) => ({ ...acc, [cur]: '' }), {}) as FormState['inputErrors']
                                    })
                                }}
                            >
                                {'Toggle: ' + (customValidation ? 'Custom input validation' : 'Bootstrap input validation')}
                            </p>

                            <form onSubmit={e => this.onSubmit(e)}>

                                { // Full Name
                                    <div className="form-row">
                                        <div className='col-12'>
                                            <label htmlFor='input-name'>Full Name</label>
                                            <input
                                                type='text'
                                                id='input-name'
                                                className={`form-control ${inputErrors.name ? 'is-invalid' : ''}`}
                                                value={inputValues.name}
                                                placeholder='John Doe'
                                                onChange={e => this.onInputChange('name', e)}
                                                required={!customValidation}
                                                disabled={submissionResult.success}
                                            />
                                            <div className="invalid-feedback">
                                                {inputErrors.name}
                                            </div>
                                        </div>
                                    </div>
                                }

                                { // Email
                                    <div className="form-row">
                                        <div className='col-12'>
                                            <label className='mt-3' htmlFor='input-email'>Email</label>
                                            <input
                                                type='email'
                                                id='input-email'
                                                className={`form-control ${inputErrors.email ? 'is-invalid' : ''}`}
                                                value={inputValues.email}
                                                placeholder='doe@example.com'
                                                onChange={e => this.onInputChange('email', e)}
                                                required={!customValidation}
                                                disabled={submissionResult.success}
                                            />
                                            <div className="invalid-feedback">
                                                {inputErrors.email}
                                            </div>
                                        </div>
                                    </div>
                                }

                                { // Password
                                    <div className="form-row">
                                        <div className='col-12'>
                                            <label className='mt-3' htmlFor='input-password'>Password</label>
                                            <div className="input-group mb-3">
                                                <input
                                                    type={passwordHidden ? 'password' : 'text'}
                                                    id='input-password'
                                                    className={`form-control ${inputErrors.password ? 'is-invalid' : ''}`}
                                                    value={inputValues.password}
                                                    placeholder='********'
                                                    onChange={e => this.onInputChange('password', e)}
                                                    autoComplete='on'
                                                    required={!customValidation}
                                                    disabled={submissionResult.success}
                                                />
                                                <div className="input-group-append">
                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        type="button"
                                                        style={{ borderTopRightRadius: '0.25rem', borderBottomRightRadius: '0.25rem' }}
                                                        onClick={() => this.togglePassword()}
                                                    >
                                                        {passwordHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                                <div className="invalid-feedback">
                                                    {inputErrors.password}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                <div className="form-row">

                                    { // Occupation
                                        <div className='col-6'>
                                            <label className='mt-3' htmlFor='input-occupation'>Occupation</label>
                                            <select
                                                id='input-occupation'
                                                className='selectpicker form-control'
                                                title="Choose occupation..."
                                                data-live-search="true"
                                                value={inputValues.occupation}
                                                onChange={e => this.onInputChange('occupation', e)}
                                                required={!customValidation}
                                                disabled={submissionResult.success}
                                            >
                                                {this.state.occupations.map(occ => (
                                                    <option key={occ}>{occ}</option>
                                                ))}
                                            </select>
                                            <div style={{ display: 'none' }} className={`form-control ${inputErrors.occupation ? 'is-invalid' : ''}`}></div>
                                            <div className="invalid-feedback">
                                                {inputErrors.occupation}
                                            </div>
                                        </div>
                                    }

                                    { // State
                                        <div className='col-6'>
                                            <label className='mt-3' htmlFor='input-state'>State</label>
                                            <select
                                                id='input-state'
                                                className='selectpicker form-control'
                                                title="Choose state..."
                                                data-live-search="true"
                                                value={inputValues.state}
                                                onChange={e => this.onInputChange('state', e)}
                                                required={!customValidation}
                                                disabled={submissionResult.success}
                                            >
                                                {this.state.states.map(({ name, abbreviation }) => (
                                                    <option key={name} data-tokens={`${abbreviation} ${name}`}>{name}</option>
                                                ))}
                                            </select>
                                            <div style={{ display: 'none' }} className={`form-control ${inputErrors.state ? 'is-invalid' : ''}`}></div>
                                            <div className="invalid-feedback">
                                                {inputErrors.state}
                                            </div>
                                        </div>
                                    }

                                </div>

                                {/* Submisson result */}
                                <div className="mt-4">
                                    <p className={submissionResult.success ? 'text-success' : 'text-danger'}>
                                        {submissionResult.text}
                                    </p>
                                </div>

                                {/* Submission button */}
                                <div className="form-row">
                                    <button 
                                        className={`btn mt-3 w-100 btn-${submissionResult.success ? 'success' : 'primary'}`}
                                        type="submit" 
                                        disabled={loading || submitting || submissionResult.success}
                                    >
                                        {(loading || submitting) && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>}
                                        {loading ? 'Loading' : submitting ? 'Submitting' : 'Create user'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div >
            </section >
        )
    }
}