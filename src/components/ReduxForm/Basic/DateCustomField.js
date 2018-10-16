import React from 'react'
import _ from 'lodash'
import injectSheet from 'react-jss'
import DatePicker from 'material-ui/DatePicker'
import IntlPolyfill from 'intl'
import 'intl/locale-data/jsonp/ru'

const errorStyle = {
  textAlign: 'left'
}

class DateField extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: '',
      hover: false,
      focused: false
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const {input: {value}, onSubmit} = this.props
    if (this.state.value && prevProps.input.value !== value && this.state.focused) {
      onSubmit(value)
      this.setState({focused: false})
    }
  }
  render () {
    const {
      classes,
      input,
      label,
      meta: {error, touched, active},
      ...defaultProps
    } = this.props

    const {hover} = this.state
    _.unset(defaultProps, 'sheet')

    const DateTimeFormat = IntlPolyfill.DateTimeFormat

    return (
      <DatePicker
        locale={'ru'}
        okLabel="Ок"
        cancelLabel={'Отмена'}
        className={classes.date}
        errorStyle={errorStyle}
        floatingLabelText={label}
        errorText={touched && error}
        inputStyle={{fontSize: 13}}
        underlineShow={hover || active}
        DateTimeFormat={DateTimeFormat}
        formatDate={new DateTimeFormat('ru', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }).format}
        value={input.value}
        onFocus={() => {
          this.setState({focused: true})
          input.onFocus()
        }}
        onBlur={() => input.onBlur()}
        onShow={() => this.setState({value: input.value})}
        onMouseEnter={() => this.setState({hover: true})}
        onMouseLeave={() => this.setState({hover: false})}
        onChange={(event, value) => {
          input.onChange(value)
        }}
        {...defaultProps}
      />
    )
  }
}

export default injectSheet({
  date: {
    fontSize: '13px !important',
    height: '43px !important',
    '& div': {
      fontSize: '13px !important'
    },
    '& label': {
      top: '0 !important',
      color: '#777 !important',
      fontSize: '11px !important',
      transform: 'unset !important'
    },
    '& input': {
      marginTop: '0 !important',
      fontWeight: '600 !important',
      paddingTop: '12px !important'
    },
    '& div:first-child': {
      height: '43px !important',
      width: '135px !important'
    },
    '& hr': {
      bottom: '0 !important'
    },
    '& div:first-child div:first-child': {
      transform: 'translate(0px, 0px) !important'
    }
  }
})(DateField)
