import React from 'react'
import {compose, lifecycle} from 'recompose'
import injectSheet from 'react-jss'
import {Field} from 'redux-form'
import t from '../../../helpers/translate'
import LanguageLevelSearchField from './LanguageLevelSearchField'
import LanguageSearchField from './LanguageSearchField'
import ContentRemove from 'material-ui/svg-icons/content/remove-circle-outline'
import IconButton from 'material-ui/IconButton'
import CheckBox from '../Basic/CheckBox'
import ToolTip from '../../Utils/ToolTip'

const enhance = compose(
  injectSheet({
    salaryWrapper: {
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
    subTitle: {
      padding: '10px 0 5px'
    },
    flex: {
      display: 'flex',
      alignItems: 'center',
      '& > div': {
        marginRight: '10px'
      }
    },
    detail: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      '& > div:first-child': {
        width: 'calc(100% - 40px)'
      }
    },
    checkbox: {
      marginLeft: '10px',
      '& > div': {
        width: 'auto !important'
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
  }),
  lifecycle({
    componentWillReceiveProps (nextProps) {
      const props = this.props
      if ((props.invalid !== nextProps.invalid)) {
        nextProps.updateSkillsError(nextProps.invalid && nextProps.skillsError)
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

const LanguageField = enhance((props) => {
  const {
    fields,
    classes,
    required
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
        <div>
          <div className={classes.flex}>
            <Field
              label={t('Язык')}
              name={`${detail}.name`}
              component={LanguageSearchField}
              className={classes.inputFieldCustom}/>
            <Field
              label={t('Уровень')}
              name={`${detail}.level`}
              component={LanguageLevelSearchField}
              className={classes.inputFieldCustom}/>
            {required &&
                        <div className={classes.checkbox}>
                          <ToolTip position={'left'} text={t('Обязательный язык')}>
                            <Field
                              name={`${detail}.required`}
                              component={CheckBox}/>
                          </ToolTip>
                        </div>}
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
    <div className={classes.salaryWrapper}>
      <div className={classes.subTitle}>{t('Знание языков')}</div>
      {details}
      <div className={classes.addAnother}>
        <a onClick={() => handleTouchTap(null, true)}>{t('Добавить язык')}</a>
      </div>
    </div>
  )
})

export default LanguageField
