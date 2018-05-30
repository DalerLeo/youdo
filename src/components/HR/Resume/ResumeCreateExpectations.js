import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Field} from 'redux-form'
import t from '../../../helpers/translate'
import {HR_WORK_SCHEDULE} from '../../../constants/backendConstants'
import {TextField, CheckBox} from '../../ReduxForm'
import normalizeNumber from '../../ReduxForm/normalizers/normalizeNumber'

const enhance = compose(
  injectSheet()
)

const ResumeCreateExpectations = enhance((props) => {
  const {
    classes,
    nextButton
  } = props

  return (
    <div>
      <h4>{t('Профессиональные ожидания')}</h4>
      <div>
        <div className={classes.subTitle}>{t('График работы')}</div>
        <div className={classes.flex + ' ' + classes.halfChild}>
          {_.map(HR_WORK_SCHEDULE, (item, index) => {
            return (
              <Field
                key={item.id}
                name={'modes[' + index + '][selected]'}
                label={item.name}
                component={CheckBox}/>
            )
          })}
        </div>
      </div>
      <div className={classes.readyFor}>
        <div className={classes.flex + ' ' + classes.halfChild}>
          <Field
            name="relocation"
            label={t('Готовность к переезду')}
            component={CheckBox}/>
          <Field
            name="businessTrip"
            label={t('Готовность к командировкам')}
            component={CheckBox}/>
        </div>
      </div>
      <div>
        <div className={classes.subTitle}>{t('Желаемая заработная плата')}</div>
        <div className={classes.flexBetween + ' ' + classes.halfChild}>
          <div>
            <Field
              name="salary[min]"
              component={TextField}
              className={classes.inputFieldCustom}
              normalize={normalizeNumber}
              label={t('Мин') + '.'}
              fullWidth={true}/>
          </div>
          <div>
            <Field
              name="salary[max]"
              component={TextField}
              className={classes.inputFieldCustom}
              normalize={normalizeNumber}
              label={t('Макс') + '.'}
              fullWidth={true}/>
          </div>
        </div>
      </div>
      {nextButton}
    </div>
  )
})

export default ResumeCreateExpectations
