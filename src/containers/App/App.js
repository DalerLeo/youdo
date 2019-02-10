/* eslint class-methods-use-this: 0 */
import React from 'react'
import {Provider} from 'react-redux'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {Router} from 'react-router'
import moment from 'moment'
import routes from '../../routes'
const primaryColor = '#78909C'
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

const locale = 'ru'
moment.locale(locale)

class App extends React.Component {
  shouldComponentUpdate () {
    return false
  }

  render () {
    return (
      <Provider store={this.props.store}>
        <MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
          <Router history={this.props.history} routes={routes} />
        </MuiThemeProvider>
      </Provider>
    )
  }
}

// Class App extends React.Component {
//   ShouldComponentUpdate () {
//     Return false
//   }
//
//   Render () {
//     Return <div style={{color: 'white'}}>
//       <Hello />
//     </div>
//   }
// }

export default App
