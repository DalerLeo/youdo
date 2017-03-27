import React from 'react'
// import {reduxForm} from 'redux-form'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper'


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

const SignInForm = (props) => {
    if (props.isLoading) {
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
            <form onSubmit={props.onSubmit}>
                <div className="signInHeader">
                    <div className="signInTitle">
                        ВХОД В СИСТЕМУ
                    </div>
                </div>
                <div className="signInInputs">
                    <TextField
                        floatingLabelText="Email"
                        name="username"
                        fullWidth={true}
                        style={{height: 62}}
                        floatingLabelFocusStyle={LabelFocusStyle}
                        floatingLabelStyle={inputStyle}
                    />
                    <TextField
                        floatingLabelText="Пароль"
                        name="password"
                        fullWidth={true}
                        type="password"
                        style={{height: 62}}
                        floatingLabelFocusStyle={LabelFocusStyle}
                        floatingLabelStyle={inputStyle}
                    />

                    <Checkbox
                        style={checkboxStyle}
                        name="rememberMe"
                        label="Запомнить меня"
                    />

                    <RaisedButton type="submit" backgroundColor='#44637d' labelColor="#fff" label="Войти"
                                  fullWidth={true}/>
                </div>
            </form>
        </Paper>
    )
}

export default SignInForm
