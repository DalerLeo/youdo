import React from 'react'
import _ from 'lodash'
import injectSheet from 'react-jss'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import t from '../../../helpers/translate'
import {APPLICANT_STATUS} from '../../../constants/backendConstants'
const style = {
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginLeft: '20px',
    '& > div > div > div': {
      marginRight: '5px !important'
    }
  },
  main: {
    width: '350px',
    alignItems: 'center',
    display: 'flex',
    margin: '15px 0'
  }

}
const UserStatusRadioButton = (props) => {
  const {input, classes} = props
  return (
    <div className={classes.main}>{t('Статус')}:
      <RadioButtonGroup name="status" className={classes.buttons} onChange={input.onChange} valueSelected={input.value}>
        {_.map(APPLICANT_STATUS, (item) => {
          return (
            <RadioButton
              style={{width: 'auto'}}
              label={_.get(item, 'name')}
              labelStyle={{color: '#666'}}
              iconStyle={{fill: '#666'}}
              key={item.value}
              value={_.get(item, 'value')}/>
          )
        })}
      </RadioButtonGroup>
    </div>
  )
}

export default injectSheet(style)(UserStatusRadioButton)
