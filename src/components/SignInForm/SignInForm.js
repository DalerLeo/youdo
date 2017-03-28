import React from 'react'
// import {reduxForm} from 'redux-form'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper'
import { Field, reduxForm } from 'redux-form'

const checkboxStyle = {
    textAlign: 'left',
    marginBottom: '10px',
    marginTop: '10px'
};

const inputStyle = {
    marginTop: -10
};


const LabelFocusStyle = {
    marginTop: 0,
    color: '#2196f3',
    borderColor: '#2196f3'
};

const renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
    <TextField floatingLabelText={label}
               errorText={error}
               style={{height: 62}}
               floatingLabelFocusStyle={LabelFocusStyle}
               floatingLabelStyle={inputStyle}
               {...input}
               {...custom}
    />
);

const renderCheckbox = ({ input, label }) => (
    <Checkbox label={label}
              style={checkboxStyle}
              checked={!!input.value}
              onCheck={input.onChange}/>
);




const SignInForm = (props) => {

    const { onSubmit, loading} = props;

    if (loading) {
        return (
            <Paper style={{
                width: '120px',
                margin: '0 auto',
                padding: '15px',
                textAlign: 'center',
                display: 'inline-block',
            }} zDepth={2}>
                <CircularProgress size={80} thickness={5}/>
            </Paper>
        )
    }

    return (
        <Paper style={{
            width: '300px',
            margin: '0 auto',
            padding: '15px',
            textAlign: 'center',
            display: 'inline-block',
        }} zDepth={2}>
            <form onSubmit={onSubmit}>
                <div className="signInHeader">
                    <div className="signInTitle">
                        ВХОД В СИСТЕМУ
                    </div>
                </div>
                <div className="signInInputs">
                    <Field name="username" component={renderTextField} label="Email"/>
                    <Field name="password" component={renderTextField} label="Пароль"  type="password"/>
                    <Field name="rememberMe" component={renderCheckbox} label="Запомнить меня" style={checkboxStyle}/>

                    <RaisedButton type="submit" backgroundColor='#44637d' labelColor="#fff" label="Войти"
                                  fullWidth={true}/>
                </div>
            </form>
        </Paper>
    )
}


export default reduxForm({
    form: 'SignInForm',  // a unique identifier for this form
    // asyncValidate
})(SignInForm)
