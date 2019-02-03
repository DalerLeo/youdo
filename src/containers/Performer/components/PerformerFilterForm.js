import _ from 'lodash'
import React from 'react'
import {compose, withHandlers} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {Link} from 'react-router'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import RaisedButton from 'material-ui/RaisedButton'
import BorderColorIcon from 'material-ui/svg-icons/editor/border-color'
import CloseIcon from 'material-ui/svg-icons/action/highlight-off'
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import t from '../../../helpers/translate'
import DatesField from '../../../components/ReduxForm/Basic/DatesField'
import {UsersSearchField} from '../../../components/ReduxForm'
import SkillsTagSearchField from '../../../components/ReduxForm/HR/SkillsTagSearchField'

export const APPLICANT_FILTER_OPEN = 'openFilterDialog'

export const APPLICANT_FILTER_KEY = {
  START_DATE: 'startDate',
  END_DATE: 'endDate',
  GROUP: 'group',
  USER: 'user',
  GENDER: 'gender'
}

const enhance = compose(
  injectSheet({
    wrapper: {
      position: 'absolute',
      minWidth: '300px',
      background: '#fff',
      zIndex: 99,
      top: 0,
      left: 0,
      borderRadius: 0,
      padding: '10px 20px 10px 20px'
    },
    afterFilter: {
      alignItems: 'center',
      display: 'flex',
      backgroundColor: '#efefef',
      position: 'relative',
      padding: '16px 30px',
      marginLeft: '-30px',
      '& > div:nth-child(2)': {
        position: 'absolute',
        right: '0'
      },
      '& > div:nth-child(1)': {
        color: '#666666'
      },
      '& button': {
        borderLeft: '1px solid white !important'
      }
    },
    icon: {
      color: '#8f8f8f !important'
    },
    arrow: {
      color: '#12aaeb',
      paddingRight: '14px',
      position: 'relative',
      '& svg': {
        position: 'absolute',
        width: '13px !important',
        height: '20px !important'
      }
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      '& button': {
        marginRight: '-12px !important'
      }
    },
    title: {
      fontSize: '15px',
      color: '#5d6474'
    },
    submit: {
      color: '#fff !important'
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
    }
  }),
  reduxForm({
    form: 'FilterForm',
    enableReinitialize: true
  }),
  withHandlers({
    getCount: props => () => {
      const {filter} = props
      return _(APPLICANT_FILTER_KEY)
        .values()
        .filter(item => item !== APPLICANT_FILTER_KEY.FROM_DATE)
        .filter(item => filter.getParam(item))
        .value()
        .length
    }
  })
)

const PerformerFilterForm = enhance((props) => {
  const {classes, filterDialog, getCount, handleSubmit, addButton} = props
  const filterCounts = getCount()

  if (!filterDialog.open) {
    if (filterCounts) {
      return (
        <div className={classes.afterFilter}>
          {addButton}
          <div>{t('Фильтр')}: {filterCounts} {t('элемента')}</div>
          <div>
            <IconButton onClick={filterDialog.onOpen}>
              <BorderColorIcon color="#8f8f8f" />
            </IconButton>
            <IconButton onClick={filterDialog.onClear}>
              <CloseIcon className={classes.icon}/>
            </IconButton>
          </div>
        </div>
      )
    }

    return (
      <div style={{display: 'flex'}}>
        <Link
          className={classes.arrow}
          onClick={filterDialog.onOpen}>
          <div style={{display: 'flex'}}>
            <span>{t('Показать фильтр')}</span>
            <KeyboardArrowDown color="#12aaeb" />
          </div>
        </Link>
        {addButton}
      </div>
    )
  }

  return (
    <div>
      <Paper className={classes.wrapper} zDepth={2}>
        <div className={classes.header}>
          <span className={classes.title}>Фильтр</span>
          <IconButton onClick={filterDialog.onClose}>
            <CloseIcon className={classes.icon} />
          </IconButton>
        </div>
        <form onSubmit={handleSubmit(filterDialog.onSubmit)}>
          <div>
            <Field
              name="date"
              component={DatesField}
            />
          </div>
          <div>
            <Field
              name="user"
              component={UsersSearchField}
              label={'User'}
            />
          </div>
          <div>
            <Field
              name="gender"
              component={SkillsTagSearchField}
              label={'Gentder'}
            />
          </div>
          <RaisedButton
            type="submit"
            primary={true}
            buttonStyle={{color: '#fff'}}
            labelStyle={{fontSize: '13px'}}
            label={t('Применить')}
            style={{marginTop: '15px'}}>
          </RaisedButton>
        </form>
      </Paper>
    </div>
  )
})

PerformerFilterForm.propTypes = {
  filter: PropTypes.object.isRequired,
  filterDialog: PropTypes.shape({
    filterLoading: PropTypes.bool.isRequired,
    openFilterDialog: PropTypes.bool.isRequired,
    handleOpenFilterDialog: PropTypes.func.isRequired,
    handleCloseFilterDialog: PropTypes.func.isRequired,
    handleSubmitFilterDialog: PropTypes.func.isRequired
  })
}

export default PerformerFilterForm
