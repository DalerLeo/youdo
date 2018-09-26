import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import {connect} from 'react-redux'
import t from '../../../helpers/translate'

const enhance = compose(
  injectSheet({
    wrapper: {
      marginTop: '5px'
    },
    title: {
      fontWeight: '600',
      paddingBottom: '10px'
    },
    radioButton: {
      '& svg': {
        width: '20px !important',
        height: '20px !important'
      },
      '& label': {
        top: '-2px',
        marginLeft: '-7px'
      }
    }
  }),
  connect((state) => {
    const contacts = _.get(state, ['client', 'contacts', 'data'])
    const contactsLoading = _.get(state, ['client', 'contacts', 'loading'])
    return {
      contacts,
      contactsLoading
    }
  })
)

const ClientContactsField = enhance((props) => {
  const {classes, contacts, contactsLoading, input, meta: {error}, extraText} = props
  if (!contacts && !contactsLoading) {
    return null
  }
  return (
    <div className={classes.wrapper}>
      {extraText && <div className={classes.title}>{extraText}</div>}
      {contactsLoading && <div>{t('Загрузка')}...</div>}
      {error && <div className={classes.error}>{error}</div>}
      {!contactsLoading &&
            <RadioButtonGroup
              name="contact"
              className={classes.radioButton}
              onChange={input.onChange}
              defaultSelected={input.value} >
              {_.map(contacts, (item) => {
                const id = _.get(item, 'id')
                const value = _.get(item, 'name') + ' ' + _.get(item, 'telephone') + ' ' + _.get(item, 'email')
                return (
                  <RadioButton
                    key={id}
                    value={id}
                    label={value}
                    iconStyle={{width: 20, height: 20}}
                    disableTouchRipple={true}
                  />
                )
              })}
            </RadioButtonGroup>}
    </div>
  )
})

export default ClientContactsField
