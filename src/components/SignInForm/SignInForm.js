import React from 'react'
// import {reduxForm} from 'redux-form'
import {Button, Checkbox, Form, Input} from 'semantic-ui-react'

const SignInForm = (props) => {
    return (
        <Form loading={props.isLoading} onSubmit={props.onSubmit}>
            <Form.Field>
                <label>Username</label>
                <Input icon="user" name="username" iconPosition="left" placeholder="Username" />
            </Form.Field>

            <Form.Field>
                <label>Password</label>
                <Input icon="lock" name="password" type="password" iconPosition="left" placeholder="Password" />
            </Form.Field>

            <Form.Field>
                <Checkbox name="rememberMe" label="Remember me" />
            </Form.Field>

            <Button type="submit">SignIn</Button>
        </Form>
    )
}

export default SignInForm
