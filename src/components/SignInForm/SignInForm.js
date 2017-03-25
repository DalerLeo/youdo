import React from 'react'
// import {reduxForm} from 'redux-form'
import {Form} from 'semantic-ui-react'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';

const style = {
    'margin-bottom':0
};
const checkboxStyle = {
    'text-align': 'left',
    'margin-bottom': '10px',
    'margin-top': '10px'
};

const inputStyle = {
    marginTop: -10
};

const LabelFocusStyle = {
    marginTop: 0,
    color:'#2196f3'
};

const SignInForm = (props) => {
    return (
        <Form loading={props.isLoading} onSubmit={props.onSubmit}>
            <div className="signInHeader">
                <div className="signInTitle">
                    ВХОД В СИСТЕМУ
                </div>
            </div>
            <div className="signInInputs">
                <TextField
                    floatingLabelText="Email"
                    name="username"
                    fullWidth="true"
                    style={{height:62}}
                    floatingLabelFocusStyle={LabelFocusStyle}
                    floatingLabelStyle={inputStyle}
                />
                <TextField
                    floatingLabelText="Пароль"
                    name="password"
                    fullWidth="true"
                    type="password"
                    style={{height:62}}
                    floatingLabelFocusStyle={LabelFocusStyle}
                    floatingLabelStyle={inputStyle}
                />

                <Checkbox
                    style={checkboxStyle}
                    name="rememberMe"
                    label="Запомнить меня"
                />

                <RaisedButton  type="submit" backgroundColor='#44637d' labelColor="#fff" label="Войти" fullWidth={true} />
            </div>
        </Form>
    )
}

export default SignInForm
