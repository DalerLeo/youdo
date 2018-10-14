import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Field} from 'redux-form'
import t from '../../../../helpers/translate'
import ContentRemove from 'material-ui/svg-icons/content/remove-circle-outline'
import IconButton from 'material-ui/IconButton'
import TextField from '../../Basic/TextField'
import CheckBox from '../../Basic/CheckBox'
import ToolTip from '../../../Utils/ToolTip'

const enhance = compose(
  injectSheet({
    wrapper: {
      position: 'relative',
      paddingBottom: '36px'
    },
    usersLoader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%'
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
    textFieldArea: {
      lineHeight: '20px !important',
      fontSize: '13px !important'
    },
    subTitle: {
      padding: '10px 0 5px'
    },
    flex: {
      display: 'flex',
      alignItems: 'flex-start'
    },
    checkbox: {
      marginLeft: '10px',
      '& > div': {
        width: 'auto !important'
      }
    },
    detail: {
      display: 'flex',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      '& > div:first-child': {
        width: 'calc(100% - 40px)'
      }
    },
    addAnother: {
      width: '100%',
      margin: '10px 0',
      position: 'absolute',
      bottom: '0',
      zIndex: '5',
      '& a': {
        fontWeight: '600'
      }
    }
  })
)

const iconStyle = {
  icon: {
    color: '#666',
    width: 22,
    height: 22
  },
  button: {
    width: 40,
    height: 40,
    padding: 9
  }
}

const RequirementsField = enhance((props) => {
  const {
    fields,
    classes
  } = props

  const handleTouchTap = (index, addAnother) => {
    if (addAnother) {
      return fields.push({})
    }
    return fields.remove(index)
  }

  const details = fields.map((detail, index) => {
    return (
      <div key={index} className={classes.detail}>
        <div className={classes.flex}>
          <Field
            name={`${detail}.text`}
            component={TextField}
            className={classes.textFieldArea}
            fullWidth
            multiLine
            rows={1}/>
          <div className={classes.checkbox}>
            <ToolTip position={'left'} text={t('Обязательное требование')}>
              <Field
                name={`${detail}.required`}
                component={CheckBox}/>
            </ToolTip>
          </div>
        </div>
        <IconButton
          onTouchTap={() => handleTouchTap(index, false)}
          disableTouchRipple={true}
          iconStyle={iconStyle.icon}
          style={iconStyle.button}>
          <ContentRemove/>
        </IconButton>
      </div>
    )
  })

  return (
    <div className={classes.wrapper}>
      <div className={classes.subTitle}>{t('Дополнительные требования')}</div>
      {details}
      <div className={classes.addAnother}>
        <a onClick={() => handleTouchTap(null, true)}>{t('Добавить требование')}</a>
      </div>
    </div>
  )
})

export default RequirementsField
