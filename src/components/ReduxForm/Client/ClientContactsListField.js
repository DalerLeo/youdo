import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ContentRemove from 'material-ui/svg-icons/content/remove'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import {Field} from 'redux-form'
import TextField from '../Basic/TextField'
import t from '../../../helpers/translate'

/**
 * {['contacts', 'contactName', 'email', 'phoneNumber']}
 */

const enhance = compose(
  injectSheet({
    wrapper: {
      marginTop: '20px',
      display: 'flex',
      flexDirection: 'column'
    },
    title: {
      paddingTop: '15px',
      fontWeight: 'bold',
      color: 'black !important'
    },
    headers: {
      height: '0',
      position: 'relative',
      top: '-30px',
      '& button': {
        position: 'absolute !important',
        right: '0 !important'
      }
    },
    inputFieldCustom: {
      fontSize: '13px !important',
      height: '45px !important',
      marginTop: '7px',
      '& div': {
        fontSize: '13px !important'
      },
      '& label': {
        top: '20px !important',
        lineHeight: '5px !important'
      },
      '& input': {
        marginTop: '0 !important'
      }
    },
    flex: {
      display: 'flex',
      '& div:first-child': {
        marginRight: '10px'
      }
    },
    contactBlock: {
      marginTop: '10px',
      marginBottom: '15px',
      paddingBottom: '15px',
      '&:last-child': {
        margin: '0'
      }
    }
  })
)

const ClientContactsListField = (props) => {
  const {classes, fields} = props
  const ONE = 1
  const handleTouchTap = (index) => {
    const LAST_INDEX = index + ONE

    if (fields.length === LAST_INDEX) {
      return fields.push({})
    }

    return fields.remove(index)
  }
  return (
    <div>
      {fields.map((contact, index) => {
        return (
          <div className={classes.contactBlock}>
            <div className={classes.headers}>
              <FloatingActionButton
                backgroundColor="#12aaeb"
                onClick={() => handleTouchTap(index)}
                mini={true}>
                {fields.length !== index + ONE ? <ContentRemove/> : <ContentAdd />}
              </FloatingActionButton>
            </div>
            <div key={index}>
              <Field
                label={t('Контактное лицо')}
                name={`${contact}.name`}
                component={TextField}
                className={classes.inputFieldCustom}
                fullWidth={true}
              />
              <div className={classes.flex}>
                <Field
                  label={t('Email')}
                  name={`${contact}.email`}
                  component={TextField}
                  className={classes.inputFieldCustom}
                  fullWidth={true}
                />

                <Field
                  label={t('Телефон номер')}
                  name={`${contact}.telephone`}
                  component={TextField}
                  className={classes.inputFieldCustom}
                  fullWidth={true}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default enhance(ClientContactsListField)
