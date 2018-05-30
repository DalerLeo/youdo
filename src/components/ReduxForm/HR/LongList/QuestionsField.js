import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Field} from 'redux-form'
import t from '../../../../helpers/translate'
import ContentRemove from 'material-ui/svg-icons/content/remove-circle-outline'
import IconButton from 'material-ui/IconButton'
import TextField from '../../Basic/TextField'

const enhance = compose(
  injectSheet({
    salaryWrapper: {
      position: 'relative',
      paddingBottom: '36px',
      zIndex: '2'
    },
    usersLoader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%'
    },
    textFieldArea: {
      top: '-20px !important',
      lineHeight: '20px !important',
      fontSize: '13px !important',
      marginBottom: '-22px'
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
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: '10px',
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

const QuestionsField = enhance((props) => {
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
    const ONE = 1
    const count = index + ONE
    return (
      <div key={index} className={classes.detail}>
        <div>
          <Field
            label={t('Вопрос') + ' №' + count}
            name={`${detail}.question`}
            component={TextField}
            className={classes.textFieldArea}
            multiLine
            rows={1}
            fullWidth={true}/>
        </div>
        <IconButton
          onTouchTap={() => handleTouchTap(index, false)}
          iconStyle={iconStyle.icon}
          style={iconStyle.button}>
          <ContentRemove/>
        </IconButton>
      </div>
    )
  })

  return (
    <div className={classes.salaryWrapper}>
      <div className={classes.subTitle}>{t('Список вопросов')}</div>
      {details}
      <div className={classes.addAnother}>
        <a onClick={() => handleTouchTap(null, true)}>{t('Добавить вопрос')}</a>
      </div>
    </div>
  )
})

export default QuestionsField
