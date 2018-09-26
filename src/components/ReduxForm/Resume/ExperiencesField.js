import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Field} from 'redux-form'
import t from '../../../helpers/translate'
import {TextField, DateField, CheckBox} from '../index'
import SphereSearchField from '../HR/Sphere/SphereSearchField'
import PositionSearchField from '../HR/Sphere/PositionSearchField'
import {COLOR_RED} from '../../../constants/styleConstants'
import {connect} from 'react-redux'

const ONE = 1

const enhance = compose(
  injectSheet({
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
      padding: '5px 30px 10px',
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
    const allFields = _.get(state, ['form', 'ResumeExperienceForm', 'values', 'experiences'])
    return {
      allFields
    }
  })
)

const ExperiencesField = enhance((props) => {
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
    const checked = _.get(item, 'workTillNow') === true
    return checked ? index : null
  })
  const spheres = _.map(allFields, (item) => _.get(item, ['sphere', 'value']))
  const details = fields.map((detail, index) => {
    const hideWorkEnd = _.includes(indexesOfCheckedTillNow, index)
    const sphere = _.get(spheres, index)
    return (
      <div key={index} className={classes.detail}>
        <div className="exp-wrapper">
          <div className={classes.flexHalf + ' ' + classes.alignCenter}>
            <Field
              label={t('Начало работы')}
              name={`${detail}.workStart`}
              component={DateField}
              className={classes.inputDateCustom}
              errorStyle={{bottom: 2}}
              fullWidth={true}/>
            <Field
              label={t('По настоящее время')}
              name={`${detail}.workTillNow`}
              component={CheckBox}
              labelPosition={'left'}
              fullWidth={true}/>
          </div>
          {!hideWorkEnd &&
                        <div className={classes.half}>
                          <Field
                            label={t('Окончание')}
                            name={`${detail}.workEnd`}
                            component={DateField}
                            className={classes.inputDateCustom}
                            errorStyle={{bottom: 2}}
                            fullWidth={true}/>
                        </div>}
          <Field
            label={t('Организация')}
            name={`${detail}.organization`}
            component={TextField}
            className={classes.inputFieldCustom}
            fullWidth={true}/>
          <div style={{zIndex: 2}}>
            <Field
              label={t('Сфера')}
              name={`${detail}.sphere`}
              component={SphereSearchField}
              className={classes.inputFieldCustom}
              params={{only_parent: true, ordering: 'name'}}
              fullWidth={true}/>
            {sphere &&
                        <Field
                          name={`${detail}.position`}
                          label={t('Должность')}
                          component={PositionSearchField}
                          className={classes.inputFieldCustom}
                          params={{child: sphere, ordering: 'name'}}
                          fullWidth={true}/>}
          </div>
          <Field
            label={t('Обязанности')}
            name={`${detail}.responsibility`}
            component={TextField}
            className={classes.textFieldArea}
            multiLine={true}
            rows={1}
            fullWidth={true}/>
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
      <div className={classes.subTitle}>{t('Опыт работы')}</div>
      {details}
      <div className={classes.addAnother}>
        <a onClick={() => handleTouchTap(null, true)}>{t('Добавить опыт работы')}</a>
      </div>
      {nextButton}
    </div>
  )
})

export default ExperiencesField
