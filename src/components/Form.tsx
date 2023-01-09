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
     * Retrieves occupation and state form data
     */
    retrieveInitialData() {
        axios('https://frontend-take-home.fetchrewards.com/form').then(res => {
            this.setState({
                ...this.state,
                occupations: res.data.occupations,
                states: res.data.states,
            })
            setTimeout(() => {
                this.refreshSelectBoxes()
                this.setState({
                    ...this.state,
                    loading: false,
                })
            }, 100)
        })
    }

    /**
     * Custom input validation
     *  returns true if all input fields are ok, otherwise false
     */
    validate() {
        const inputErrors = { ...this.state.inputErrors }
        let error = false

        if (this.state.inputValues.name.length === 0) {
            error = true
            inputErrors.name = 'Please provide a name'
        }

        if (this.state.inputValues.email.length === 0) {
            error = true
            inputErrors.email = 'Please provide an email'
        }

        if (this.state.inputValues.password.length < 8) {
            error = true
            inputErrors.password = 'Password must be at least 8 characters'
        }

        if (this.state.inputValues.password.length === 0) {
            error = true
            inputErrors.password = 'Please provide a password'
        }

        if (this.state.inputValues.occupation.length === 0) {
            error = true
            inputErrors.occupation = 'Please provide an occupation'
        }

        if (this.state.inputValues.state.length === 0) {
            error = true
            inputErrors.state = 'Please provide a state'
        }

        error && this.setState({
            ...this.state,
            inputErrors,
        })

        return !error
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

        try {
            const res = await axios.post('https://frontend-take-home.fetchrewards.com/form', {
                'name': this.state.inputValues.name,
                'email': this.state.inputValues.email,
                'password': this.state.inputValues.password,
                'occupation': this.state.inputValues.occupation,
                'state': this.state.inputValues.state,
            })

            this.setState({
                ...this.state,
                submitting: false,
                submissionResult: {
                    success: true,
                    text: 'User created successfully. Reload the page to create a new user.'
                },
            })
        }
        catch(e) {
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

    componentDidMount() {
        this.retrieveInitialData()
    }

    render() {
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
                                        customValidation: !this.state.customValidation,
                                        inputErrors: Object.keys(this.state.inputErrors).reduce((acc, cur) => ({ ...acc, [cur]: '' }), {}) as FormState['inputErrors']
                                    }) 
                                }}
                            >
                                {'Toggle: ' + (this.state.customValidation ? 'Custom input validation' : 'Bootstrap input validation')}
                            </p>

                            <form onSubmit={this.onSubmit.bind(this)}>

                                {/* Full name */}
                                <div className="form-row">
                                    <div className='col-12'>
                                        <label htmlFor='input-name'>Full Name</label>
                                        <input
                                            type='text'
                                            id='input-name'
                                            className={'form-control' + (this.state.inputErrors.name ? ' is-invalid' : '')}
                                            value={this.state.inputValues.name}
                                            placeholder='John Doe'
                                            onChange={this.onInputChange.bind(this, 'name')}
                                            required={!this.state.customValidation}
                                        />
                                        <div className="invalid-feedback">
                                            {this.state.inputErrors.name}
                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="form-row">
                                    <div className='col-12'>
                                        <label className='mt-3' htmlFor='input-email'>Email</label>
                                        <input
                                            type='email'
                                            id='input-email'
                                            className={'form-control' + (this.state.inputErrors.email ? ' is-invalid' : '')}
                                            value={this.state.inputValues.email}
                                            placeholder='doe@example.com'
                                            onChange={this.onInputChange.bind(this, 'email')}
                                            required={!this.state.customValidation}
                                        />
                                        <div className="invalid-feedback">
                                            {this.state.inputErrors.email}
                                        </div>
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="form-row">
                                    <div className='col-12'>
                                        <label className='mt-3' htmlFor='input-password'>Password</label>
                                        <div className="input-group mb-3">
                                            <input
                                                type={this.state.passwordHidden ? 'password' : 'text'}
                                                id='input-password'
                                                className={'form-control' + (this.state.inputErrors.password ? ' is-invalid' : '')}
                                                value={this.state.inputValues.password}
                                                placeholder='********'
                                                onChange={this.onInputChange.bind(this, 'password')}
                                                autoComplete='on'
                                                required={!this.state.customValidation}
                                            />
                                            <div className="input-group-append">
                                                <button
                                                    className="btn btn-outline-secondary"
                                                    type="button"
                                                    style={{ borderTopRightRadius: '0.25rem', borderBottomRightRadius: '0.25rem' }}
                                                    onClick={this.togglePassword.bind(this)}
                                                >
                                                    {this.state.passwordHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                            <div className="invalid-feedback">
                                                {this.state.inputErrors.password}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row">

                                    {/* Occupation */}
                                    <div className='col-6'>
                                        <label className='mt-3' htmlFor='input-occupation'>Occupation</label>
                                        <select
                                            id='input-occupation'
                                            className='selectpicker form-control'
                                            title="Choose occupation..."
                                            data-live-search="true"
                                            value={this.state.inputValues.occupation}
                                            onChange={this.onInputChange.bind(this, 'occupation')}
                                            required={!this.state.customValidation}
                                        >
                                            {this.state.occupations.map(occ => (
                                                <option key={occ}>{occ}</option>
                                            ))}
                                        </select>
                                        <div style={{ display: 'none' }} className={'form-control' + (this.state.inputErrors.occupation ? ' is-invalid' : '')}></div>
                                        <div className="invalid-feedback">
                                            {this.state.inputErrors.occupation}
                                        </div>
                                    </div>

                                    {/* State */}
                                    <div className='col-6'>
                                        <label className='mt-3' htmlFor='input-state'>State</label>
                                        <select
                                            id='input-state'
                                            className='selectpicker form-control'
                                            title="Choose state..."
                                            data-live-search="true"
                                            value={this.state.inputValues.state}
                                            onChange={this.onInputChange.bind(this, 'state')}
                                            required={!this.state.customValidation}
                                        >
                                            {this.state.states.map(({ name, abbreviation }) => (
                                                <option key={name} data-tokens={`${abbreviation} ${name}`}>{name}</option>
                                            ))}
                                        </select>
                                        <div style={{ display: 'none' }} className={'form-control' + (this.state.inputErrors.state ? ' is-invalid' : '')}></div>
                                        <div className="invalid-feedback">
                                            {this.state.inputErrors.state}
                                        </div>
                                    </div>

                                </div>

                                {/* Submisson result */}
                                <div className="mt-4">
                                    <p className={this.state.submissionResult.success ? 'text-success' : 'text-danger'}>
                                        {this.state.submissionResult.text}
                                    </p>
                                </div>

                                {/* Submit */}
                                <div className="form-row">
                                    <button className={'btn mt-3 w-100 btn-' + (this.state.submissionResult.success ? 'success' : 'primary')} type="submit" disabled={this.state.loading || this.state.submitting || this.state.submissionResult.success}>
                                        {(this.state.loading || this.state.submitting) && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>}
                                        {this.state.loading ? 'Loading' : this.state.submitting ? 'Submitting' : 'Create user'}
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