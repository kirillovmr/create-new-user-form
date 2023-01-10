## Form Component
This is a class-based React component for a form that gathers user information such as name, email, password, occupation, and state.

<img width="1572" alt="Screen Shot 2023-01-09 at 8 00 49 PM" src="https://user-images.githubusercontent.com/28753370/211444931-eebf3c09-284a-4065-85e4-035c5ee76f1f.png">

### Features
- Uses generic types for props and state for flexibility
- Validates input fields and displays errors
- Supports both Bootstrap's and custom validation
- Makes HTTP requests using the axios library
- Toggles password field visibility

### Process
I was tasked with creating a form for a client's website. The form should gather user information such as name, email, password, occupation, and state. I decided to use the React library to build the form because of its efficiency and ease of use.

First, I created a new project using `npx create-react-app`, installed `axios` for making http requests and `react-feather` for custom icons. I decided to use typescript to provide type checking and type annotations, since it can lead to more robust and reliable code.

Next, I defined the types for the form's props and state. I wanted to use generic types to make the code more flexible, so I created a type called FormInputKeys that listed the keys for the form's input fields. I also created a generic type called FormState that represented the structure of the form's internal state.

I then set up the class for the form component, extending the Component class from the react library and using the generic types that I had defined earlier. In the constructor method, I initialized the state with default values for each field.

I created several methods to handle different tasks in the form. One method updated the state when the input fields changed, another refreshed the select boxes, and another toggled the visibility of the password field. I also created a validate method that checked the input fields for errors and a onSubmit method that submitted the form to a specified URL using the axios library.

Finally, I rendered the form with all of the necessary input fields and buttons, utilizing the custom form components that I had imported at the beginning of the file. I also added event listeners to the input fields and submit button, calling the appropriate methods when necessary.

With all of the pieces in place, I was able to create a fully functional form that collected user information, POST'ed it to the given endpoint and displayed any errors or success messages.

### State
| Property | Type | Description |
| -------- | ---- | ----------- |
| `occupations` |	`string[]` | List of occupations to populate the occupation select box
| `states` | `{ name: string, abbreviation: string }[]` | List of states to populate the state select box
| `loading` |	`boolean` |	Indicates whether the form is currently loading data
| `submitting` |	`boolean` |	Indicates whether the form is currently being submitted
| `submissionResult` |	`{ success: boolean, text: string }` |	Result of the form submission, including success status and message text
| `customValidation` |	`boolean` |	Indicates whether to use custom input validation (set to true by default)
| `passwordHidden` |	`boolean` |	Indicates whether the password field is currently hidden
| `inputValues` |	`FormInputKeys` |	Object containing the current values of the input fields
| `inputErrors` |	`{ [key in keyof FormInputKeys]: string }` |	Object containing any errors for the input fields

### Methods
| Method |	Parameters |	Description |
| ------ | ----------- | ------------ |
| `onInputChange` |	key: K (K extends keyof FormInputKeys), value: FormInputKeys[K] |	Updates the current value of an input field in the state and removes any errors for the field
| `refreshSelectBoxes` | None |	Dynamically refreshes the select boxes in the form
| `togglePassword` | None | Toggles the visibility of the password field
| `validate` | None | Validates the input fields and returns true if all fields are valid, false otherwise. Updates the state with any errors that are found.
| `onSubmit` | e: React.FormEvent<HTMLFormElement> | Prevents the default form submission behavior and runs form validation. If the form is valid, makes an HTTP POST request to the specified URL with the input field values as the body.
