import React from 'react'
import injectSheet from 'react-jss'
import TimePicker from 'material-ui/TimePicker'
import t from '../../../helpers/translate'

const errorStyle = {
  textAlign: 'left'
}

const TimeField = ({classes, input, label, meta: {error}, ...defaultProps}) => {
  return (
    <div className={classes.wrapper}>
      <div>
        <TimePicker
          format="24hr"
          errorText={error}
          errorStyle={errorStyle}
          floatingLabelText={label}
          cancelLabel={t('Отмена')}
          {...input}
          onChange={(event, value) => input.onChange(value)}
          {...defaultProps}
        />
      </div>
      {error && <span>{error}</span>}
    </div>
  )
}

export default injectSheet({
})(TimeField)
