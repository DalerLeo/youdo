import _ from 'lodash'
import React from 'react'
import {compose, withPropsOnChange, withState} from 'recompose'
import injectSheet from 'react-jss'
import {HR_DRIVER_LICENSE} from '../../../constants/backendConstants'
import {COLOR_GREY, LINK_COLOR, COLOR_WHITE, BORDER_COLOR} from '../../../constants/styleConstants'
import t from '../../../helpers/translate'

const enhance = compose(
  injectSheet({
    licenses: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
      '& h4': {
        fontWeight: 'normal !important',
        width: '150px'
      }
    },
    license: {
      color: COLOR_GREY,
      width: '32px',
      height: '32px',
      display: 'flex',
      background: BORDER_COLOR,
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 200ms ease'
    },
    licenseActive: {
      extend: 'license',
      background: LINK_COLOR,
      color: COLOR_WHITE,
      fontWeight: '600'
    },
    items: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '360px'
    }
  }),
  withState('activeLicense', 'updateLicense', HR_DRIVER_LICENSE),
  withPropsOnChange((props, nextProps) => {
    const value = _.get(props, ['input', 'value'])
    const nextValue = _.get(nextProps, ['input', 'value'])
    return value !== nextValue
  }, (props) => {
    _.map(HR_DRIVER_LICENSE, (item) => {
      item.active = false
    })
    _.map(_.get(props, ['input', 'value']), (obj) => {
      _.map(HR_DRIVER_LICENSE, (item) => {
        if (obj.id === item.id) {
          item.active = true
        }
      })
    })
  })
)

const DriverLicenceCheck = enhance((props) => {
  const {
    activeLicense,
    updateLicense,
    classes,
    input
  } = props

  const func = (day) => {
    const weekToActive = _.find(activeLicense, {'id': day})
    weekToActive.active = !weekToActive.active
    updateLicense(HR_DRIVER_LICENSE)
    input.onChange(_.filter(activeLicense, (w) => {
      return w.active === true
    }))
  }
  return (
    <div className={classes.licenses}>
      <h4>{t('Водительские права')}</h4>
      <div className={classes.items}>{_.map(activeLicense, (w) => {
        const id = _.get(w, 'id')
        const name = _.get(w, 'name')
        const active = _.get(w, 'active')
        return (
          <div
            key={id}
            onClick={() => { func(id) }}
            className={active ? classes.licenseActive : classes.license}>
            {name}
          </div>
        )
      })}
      </div>
    </div>
  )
})

export default DriverLicenceCheck
