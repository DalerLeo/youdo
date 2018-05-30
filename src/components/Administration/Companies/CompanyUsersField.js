import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Field} from 'redux-form'
import t from '../../../helpers/translate'
import FlatButton from 'material-ui/FlatButton'
import {UsersSearchField} from '../../ReduxForm'
import {
  BORDER_STYLE,
  COLOR_RED,
  LINK_COLOR
} from '../../../constants/styleConstants'

const enhance = compose(
  injectSheet({
    wrapper: {
      marginTop: '20px'
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
    subTitle: {
      fontWeight: '600'
    },
    flex: {
      display: 'flex',
      alignItems: 'center',
      '& > div': {
        marginRight: '10px'
      }
    },
    detail: {
      borderBottom: BORDER_STYLE,
      margin: '0 -30px',
      padding: '10px 30px',
      '&:last-child': {
        borderBottom: 'none'
      }
    },
    remove: {
      marginTop: '10px'
    },
    addAnother: {
      width: '100%',
      marginTop: '5px'
    }
  })
)

const buttonStyle = {
  remove: {
    color: COLOR_RED,
    fontWeight: '600',
    textTransform: 'none',
    verticalAlign: 'baseline'
  },
  label: {
    color: LINK_COLOR,
    fontWeight: '600',
    textTransform: 'none',
    verticalAlign: 'baseline'
  }
}

const CompanyUsersField = enhance((props) => {
  const {fields, classes} = props

  const handleTouchTap = (index, addAnother) => {
    if (addAnother) {
      return fields.push({})
    }
    return fields.remove(index)
  }

  const details = fields.map((detail, index) => {
    return (
      <div key={index} className={classes.detail}>
        <Field
          label={t('Пользователь')}
          name={`${detail}.user`}
          component={UsersSearchField}
          className={classes.inputFieldCustom}
          fullWidth/>
        <div className={classes.remove}>
          <FlatButton
            label={t('Удалить пользователя')}
            labelStyle={buttonStyle.remove}
            fullWidth
            onClick={() => handleTouchTap(index, false)}/>
        </div>
      </div>
    )
  })

  return (
    <div className={classes.wrapper}>
      <div className={classes.subTitle}>{t('Пользователи')}</div>
      <div>{details}</div>
      <div className={classes.addAnother}>
        <FlatButton
          label={t('Добавить пользователя')}
          labelStyle={buttonStyle.label}
          fullWidth
          onClick={() => handleTouchTap(null, true)}/>
      </div>
    </div>
  )
})

export default CompanyUsersField
