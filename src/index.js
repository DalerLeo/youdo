import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import Rx from 'rxjs'
import rxjsconfig from 'recompose/rxjsObservableConfig'
import {setObservableConfig} from 'recompose'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {Router, hashHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import injectTapEventPlugin from 'react-tap-event-plugin'
import createStore from './store/createStore'
import routes from './routes'
import './styles'

const store = createStore()
const history = syncHistoryWithStore(hashHistory, store)

injectTapEventPlugin()

setObservableConfig({
    // Converts a plain ES observable to an RxJS 5 observable
    fromESObservable: Rx.Observable.from
})
setObservableConfig(rxjsconfig)

const primaryColor = '#5d6474'
const secondaryColor = '#12aaeb'

const muiTheme = getMuiTheme({
    fontFamily: 'Open Sans, sans-serif',
    fontSize: '13px',
    palette: {
        primary1Color: secondaryColor,
        primary2Color: primaryColor,
        primary3Color: primaryColor,
        accent1Color: primaryColor,
        accent2Color: '#fff',
        accent3Color: '#fff',
        textColor: '#333'
    },
    appBar: {
        height: 50,
        textColor: 'white'
    },
    checkbox: {
        checkedColor: primaryColor
    },
    chip: {
        fontSize: 13
    },
    flatButton: {
        fontSize: 13,
        fontWeight: 400
    },
    datePicker: {
        color: secondaryColor,
        selectColor: secondaryColor
    },
    radioButton: {
        checkedColor: primaryColor
    },
    raisedButton: {
        fontSize: 13,
        fontWeight: 400,
        primaryColor: primaryColor
    },
    timePicker: {
        headerColor: '#2d3037'
    },
    textField: {
        focusColor: primaryColor
    },
    tabs: {
        backgroundColor: '#fff',
        selectedTextColor: secondaryColor,
        textColor: '#333'
    }
})

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
            <div style={{width: '100%', height: '100%'}}>
                <Router history={history} routes={routes} />
            </div>
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('wrapper')
)
