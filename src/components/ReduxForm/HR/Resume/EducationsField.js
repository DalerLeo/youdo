import _ from 'lodash'
import React from 'react'
import {compose, lifecycle} from 'recompose'
import injectSheet from 'react-jss'
import {Field} from 'redux-form'
import t from '../../../../helpers/translate'
import {TextField, DateField, CheckBox} from '../../index'
import EducationSearchField from '../EducationSearchField'
import CountrySearchField from '../CountrySearchField'
import CitySearchField from '../CitySearchField'
import {COLOR_RED} from '../../../../constants/styleConstants'
import {connect} from 'react-redux'

const ONE = 1

const enhance = compose(
  injectSheet({
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
    inputDateCustom: {
      fontSize: '13px !important',
      height: '45px !important',
      marginTop: '7px',
      '& > div:first-child': {
        fontSize: '13px !important'
      },
      '& label': {
        top: '20px !important',
        lineHeight: '5px !important'
      },
      '& input': {
        marginTop: '0 !important'
      },
      '& div:first-child': {
        height: '45px !important'
      }
    },
    textFieldArea: {
      top: '-20px !important',
      lineHeight: '20px !important',
      fontSize: '13px !important',
      marginBottom: '-22px'
    },
    subTitle: {
      padding: '10px 0',
      fontWeight: '600'
    },
    flex: {
      display: 'flex'
    },
    flexHalf: {
      extend: 'flex',
      justifyContent: 'space-between',
      '& > div': {
        width: '48% !important'
      }
    },
    alignBaseline: {
      alignItems: 'baseline'
    },
    alignCenter: {
      alignItems: 'center'
    },
    alignEnd: {
      alignItems: 'flex-end'
    },
    detail: {
      margin: '0 -30px',
      padding: '0 30px 10px',
      transition: 'all 200ms ease',
      '&:hover': {
        background: 'rgba(242, 245, 248, 0.5)'
      }
    },
    delete: {
      width: '100%',
      margin: '10px 0',
      '& a': {
        color: COLOR_RED,
        fontWeight: '600'
      }
    },
    addAnother: {
      width: '100%',
      margin: '10px 0',
      zIndex: '5',
      '& a': {
        fontWeight: '600'
      }
    },
    half: {
      width: '48%'
    }
  }),
  connect((state) => {
    const allFields = _.get(state, ['form', 'ResumeEducationForm', 'values', 'educations'])
    return {
      allFields
    }
  }),
  lifecycle({
    componentWillReceiveProps (nextProps) {
      const props = this.props
      if ((props.invalid !== nextProps.invalid)) {
        nextProps.updateEducationError(nextProps.invalid)
      }
    }
  })
)

const EducationsField = enhance((props) => {
  const {
    fields,
    allFields,
    classes,
    nextButton
  } = props

  const handleTouchTap = (index, addAnother) => {
    if (addAnother) {
      return fields.push({})
    }
    return fields.remove(index)
  }

  const arrayLength = _.get(allFields, 'length')
  const indexesOfCheckedTillNow = _.map(allFields, (item, index) => {
    const checked = _.get(item, 'studyTillNow') === true
    return checked ? index : null
  })
  const indexesWhereExistCountry = _.map(allFields, (item, index) => {
    const country = _.isNumber(_.get(item, ['country', 'value']))
    return country ? index : null
  })
  const details = fields.map((detail, index) => {
    const hideWorkEnd = _.includes(indexesOfCheckedTillNow, index)
    const showCity = _.includes(indexesWhereExistCountry, index)
    return (
      <div key={index} className={classes.detail}>
        <div className="edu-wrapper">
          <Field
            label={t('Уровень образования')}
            name={`${detail}.education`}
            component={EducationSearchField}
            className={classes.inputFieldCustom}
            removeNoMatter={true}
            fullWidth={true}/>
          <div className={classes.flexHalf + ' ' + classes.alignEnd}>
            <Field
              label={t('Начало обучения')}
              name={`${detail}.studyStart`}
              component={DateField}
              className={classes.inputDateCustom}
              errorStyle={{bottom: 2}}
              fullWidth={true}/>
            <Field
              label={t('По настоящее время')}
              name={`${detail}.studyTillNow`}
              component={CheckBox}
              labelPosition={'left'}
              fullWidth={true}/>
          </div>
          {!hideWorkEnd &&
                        <div className={classes.half}>
                          <Field
                            label={t('Окончание')}
                            name={`${detail}.studyEnd`}
                            component={DateField}
                            className={classes.inputDateCustom}
                            errorStyle={{bottom: 2}}
                            fullWidth={true}/>
                        </div>}
          <Field
            label={t('Учебное заведение')}
            name={`${detail}.institution`}
            component={TextField}
            className={classes.inputFieldCustom}
            fullWidth={true}/>
          <Field
            label={t('Специальность')}
            name={`${detail}.speciality`}
            component={TextField}
            className={classes.inputFieldCustom}
            fullWidth={true}/>
          <Field
            label={t('Страна обучения')}
            name={`${detail}.country`}
            component={CountrySearchField}
            className={classes.inputFieldCustom}
            fullWidth={true}/>
          {showCity &&
                    <Field
                      label={t('Город')}
                      name={`${detail}.city`}
                      component={CitySearchField}
                      className={classes.inputFieldCustom}
                      fullWidth={true}/>}
        </div>
        {arrayLength > ONE &&
                <div className={classes.delete}>
                  <a onClick={() => handleTouchTap(index, false)}>{t('Удалить')}</a>
                </div>}
      </div>
    )
  })

  return (
    <div>
      <div className={classes.subTitle}>{t('Образование')}</div>
      {details}
      <div className={classes.addAnother}>
        <a onClick={() => handleTouchTap(null, true)}>{t('Добавить образование')}</a>
      </div>
      {nextButton}
    </div>
  )
})

export default EducationsField
