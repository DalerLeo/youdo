import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Field} from 'redux-form'
import t from '../../../../helpers/translate'
import FlatButton from 'material-ui/FlatButton'
import TextField from '../../Basic/TextField'
import {COLOR_RED, COLOR_WHITE} from '../../../../constants/styleConstants'

const enhance = compose(
  injectSheet({
    wrapper: {
      margin: '0 -30px',
      padding: '0 30px',
      position: 'relative',
      zIndex: '2'
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
      top: '-5px !important',
      lineHeight: '20px !important',
      fontSize: '13px !important'
    },
    subTitle: {
      fontWeight: '600'
    },
    flex: {
      display: 'flex',
      '& > div': {
        marginRight: '10px',
        width: '100% !important'
      }
    },
    detail: {
      marginTop: '10px',
      '&:first-child': {
        marginTop: '0'
      }
    },
    remove: {
      color: COLOR_RED,
      cursor: 'pointer',
      fontWeight: '600',
      textAlign: 'center',
      margin: '10px 0'
    }
  })
)

const ResumeNewQuestionsField = enhance((props) => {
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

  const flatButtonStyle = {
    label: {
      color: COLOR_WHITE,
      fontWeight: '600',
      textTransform: 'none',
      verticalAlign: 'baseline'
    }
  }

  const details = fields.map((detail, index) => {
    return (
      <div key={index} className={classes.detail}>
        <div>
          <Field
            label={t('Вопрос')}
            name={`${detail}.question`}
            component={TextField}
            className={classes.textFieldArea}
            multiLine
            rows={1}
            fullWidth={true}/>
          <Field
            label={t('Ответ')}
            name={`${detail}.answer`}
            component={TextField}
            className={classes.textFieldArea}
            multiLine
            rows={1}
            fullWidth/>
        </div>
        <div className={classes.remove} onClick={() => handleTouchTap(index, false)}>{t('Удалить')}</div>
      </div>
    )
  })

  return (
    <div className={classes.wrapper}>
      {details}
      <FlatButton
        label={'Добавить вопрос'}
        labelStyle={flatButtonStyle.label}
        backgroundColor={'#607D8B'}
        fullWidth={true}
        hoverColor={'#607D8B'}
        rippleColor={COLOR_WHITE}
        onClick={() => {
          handleTouchTap(null, true)
        }}/>
    </div>
  )
})

export default ResumeNewQuestionsField
