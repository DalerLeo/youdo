import React from 'react'
import MUITextField from 'material-ui/TextField'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
const textFieldStyles = {
  error: {
    textAlign: 'left',
    bottom: '5px'
  },
  input: {
    fontSize: '13px'
  }
}
const style = {
  wrap: {
    '& hr': {
      borderBottom: 'none !important'
    }
  },
  active: {
    '& hr': {
      borderBottom: '1px !important'
    }
  }
}

const enhance = compose(
  injectSheet(style)
)

class TextFieldInlineEdit extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: '',
      hover: false
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const {meta: {active}, input: {value}, onSubmit} = this.props
    const focused = active !== prevProps.meta.active && active
    if (focused) {
      this.setState({value})
    }

    const blurred = active !== prevProps.meta.active && !active
    if (blurred && this.state.value !== value && value) {
      onSubmit(value)
    }
  }

  render () {
    const {
      input,
      fontSize,
      label,
      withoutErrorText,
      meta: {error, touched, active},
      ...defaultProps
    } = this.props
    return (
      (
        <div>
          <MUITextField
            name={input.name}
            style={{marginTop: '-8px'}}
            onMouseEnter={() => this.setState({hover: true})}
            onMouseLeave={() => this.setState({hover: false})}
            errorText={withoutErrorText ? ' ' : touched && error}
            errorStyle={textFieldStyles.error}
            underlineShow={this.state.hover || active}
            inputStyle={textFieldStyles.input}
            floatingLabelText={label}
            textareaStyle={{fontSize}}
            value={input.value}
            onChange={(ev, v) => input.onChange(v)}
            onFocus={input.onFocus}
            onBlur={input.onBlur}
            multiLine={true}
            {...defaultProps}
          />
        </div>
      )
    )
  }
}

export default enhance(TextFieldInlineEdit)
