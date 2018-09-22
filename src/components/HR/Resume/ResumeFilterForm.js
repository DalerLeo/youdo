import _ from 'lodash'
import React from 'react'
import {compose, withHandlers} from 'recompose'
import {reduxForm, Field, FieldArray} from 'redux-form'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import BorderColorIcon from 'material-ui/svg-icons/editor/border-color'
import {TextField} from '../../ReduxForm'
import SphereSearchField from '../../ReduxForm/HR/Sphere/SphereSearchField'
import PositionSearchField from '../../ReduxForm/HR/Sphere/PositionSearchField'
import WorkScheduleMultiSearchField from '../../ReduxForm/HR/WorkScheduleMultiSearchField'
import GenderSearchField from '../../ReduxForm/GenderSearchField'
import EducationMultiSearchField from '../../ReduxForm/HR/EducationMultiSearchField'
import ComputerLevelSearchField from '../../ReduxForm/HR/ComputerLevelSearchField'
import SkillsTagSearchField from '../../ReduxForm/HR/SkillsTagSearchField'
import LanguageField from '../../ReduxForm/HR/LanguageField'
import CloseIcon from 'material-ui/svg-icons/action/highlight-off'
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import t from '../../../helpers/translate'
import normalizeNumber from '../../ReduxForm/normalizers/normalizeNumber'
import {COLOR_RED, LINK_COLOR} from '../../../constants/styleConstants'

export const RESUME_FILTER_OPEN = 'openFilterDialog'

export const RESUME_FILTER_KEY = {
  SPHERE: 'sphere',
  POSITION: 'position',
  MODE: 'mode',
  AGE_MIN: 'ageMin',
  AGE_MAX: 'ageMax',
  SEX: 'sex',
  EDUCATION: 'education',
  LEVEL_PC: 'levelPc',
  LANGUAGES: 'languages',
  EXPERIENCE: 'experience',
  SKILLS: 'skills',
  SEARCH: 'search',

  // FOR LONG LIST
  AGE_0: 'age0',
  AGE_1: 'age1',
  POSITIONS: 'positions',
  EDUCATIONS: 'educations',
  LANG_LEVEL: 'languagesLevel',
  TOTAL_EXP_0: 'totalExp0'
}

const enhance = compose(
  injectSheet({
    wrapper: {
      position: 'absolute',
      width: '355px !important',
      display: 'block !important',
      background: '#fff',
      zIndex: 99,
      top: 0,
      left: 0,
      borderRadius: 0,
      padding: '10px 20px 10px 20px'
    },
    wrapperDialog: {
      width: '100%',
      padding: '20px 30px',
      boxShadow: 'none !important',
      zIndex: '2'
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
    titleDialog: {
      fontWeight: '600',
      marginBottom: '10px'
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
    },
    flexHalf: {
      display: 'flex',
      alignItems: 'baseline',
      '& > div': {
        width: '100px !important'
      },
      '& > span': {
        margin: '0 15px'
      }
    },
    buttons: {
      display: 'flex',
      marginTop: '15px',
      '& button': {
        width: '50% !important'
      }
    }
  }),
  reduxForm({
    form: 'ResumeFilterForm',
    enableReinitialize: true
  }),
  connect((state) => {
    const sphere = _.get(state, ['form', 'ResumeFilterForm', 'values', 'sphere', 'value'])
    return {
      sphere
    }
  }),
  withHandlers({
    getCount: props => () => {
      const {filter} = props
      return _(RESUME_FILTER_KEY)
        .values()
        .filter(item => item !== RESUME_FILTER_KEY.FROM_DATE)
        .filter(item => filter.getParam(item))
        .value()
        .length
    }
  })
)

const ResumeFilterForm = enhance((props) => {
  const {classes, filterDialog, getCount, handleSubmit, forDialog, sphere} = props
  const filterCounts = getCount()
  if (!filterDialog.openFilterDialog) {
    if (filterCounts) {
      return (
        <div className={classes.afterFilter}>
          <div>{t('Фильтр')}: {filterCounts} {t('элемента')}</div>
          <div>
            <IconButton onClick={filterDialog.handleOpenFilterDialog}>
              <BorderColorIcon color="#8f8f8f" />
            </IconButton>
            <IconButton onClick={filterDialog.handleClearFilterDialog}>
              <CloseIcon className={classes.icon}/>
            </IconButton>
          </div>
        </div>
      )
    }

    return (
      <div>
        <Link
          className={classes.arrow}
          onClick={filterDialog.handleOpenFilterDialog}>
          <div>{t('Показать фильтр')} <KeyboardArrowDown color="#12aaeb" /></div>
        </Link>
      </div>
    )
  }

  return (
    <Paper className={forDialog ? classes.wrapperDialog : classes.wrapper} zDepth={2}>
      <div className={classes.header}>
        <span className={forDialog ? classes.titleDialog : classes.title}>{t('Фильтр')}</span>
        {!forDialog &&
                <IconButton onClick={filterDialog.handleCloseFilterDialog}>
                  <CloseIcon className={classes.icon} />
                </IconButton>}
      </div>
      <form onSubmit={handleSubmit(filterDialog.handleSubmitFilterDialog)}>
        <Field
          name="search"
          className={classes.inputFieldCustom}
          component={TextField}
          label={t('Поиск')}
          fullWidth={true}/>
        <Field
          name="sphere"
          className={classes.inputFieldCustom}
          component={SphereSearchField}
          label={t('Специальность')}
          params={{only_parent: true, ordering: 'name'}}
          fullWidth={true}/>
        {sphere &&
                <Field
                  name="position"
                  className={classes.inputFieldCustom}
                  component={PositionSearchField}
                  label={t('Должность')}
                  params={{child: sphere, ordering: 'name'}}
                  fullWidth={true}/>}
        <Field
          name="mode"
          className={classes.inputFieldCustom}
          component={WorkScheduleMultiSearchField}
          label={t('Режим работы')}
          fullWidth={true}/>
        <div className={classes.flexHalf}>
          <Field
            name="age[min]"
            className={classes.inputFieldCustom}
            component={TextField}
            normalize={normalizeNumber}
            inputStyle={{textAlign: 'center'}}
            label={t('Возраст (мин)')}
            fullWidth={true}/>
          <span>-</span>
          <Field
            name="age[max]"
            className={classes.inputFieldCustom}
            component={TextField}
            normalize={normalizeNumber}
            inputStyle={{textAlign: 'center'}}
            label={t('Возраст (макс)')}
            fullWidth={true}/>
        </div>
        <Field
          name="sex"
          className={classes.inputFieldCustom}
          component={GenderSearchField}
          label={t('Пол')}
          fullWidth={true}/>
        <Field
          name="education"
          className={classes.inputFieldCustom}
          component={EducationMultiSearchField}
          label={t('Образование')}
          fullWidth={true}/>
        <Field
          name="levelPc"
          className={classes.inputFieldCustom}
          component={ComputerLevelSearchField}
          label={t('Знание ПК')}
          fullWidth={true}/>
        <FieldArray
          name="languages"
          component={LanguageField}/>
        <Field
          name="experience"
          className={classes.inputFieldCustom}
          component={TextField}
          normalize={normalizeNumber}
          label={t('Опыт работы')}
          fullWidth={true}/>
        <Field
          name="skills"
          className={classes.inputFieldCustom}
          component={SkillsTagSearchField}
          label={t('Навыки')}
          fullWidth={true}/>
        {forDialog
          ? <div className={classes.buttons}>
            <FlatButton
              label={t('Очистить')}
              labelStyle={{color: COLOR_RED, fontWeight: '600', verticalAlign: 'inherit'}}
              onClick={filterDialog.handleClearFilterDialog}/>
            <FlatButton
              label={t('Применить')}
              labelStyle={{color: LINK_COLOR, fontWeight: '600', verticalAlign: 'inherit'}}
              onClick={handleSubmit(filterDialog.handleSubmitFilterDialog)}/>
          </div>
          : <RaisedButton
            type="submit"
            primary={true}
            buttonStyle={{color: '#fff'}}
            label={t('Применить')}
            labelStyle={{fontSize: '13px'}}
            style={{marginTop: '15px'}}/>
        }
      </form>
    </Paper>
  )
})

ResumeFilterForm.propTypes = {
  filter: PropTypes.object.isRequired,
  filterDialog: PropTypes.shape({
    openFilterDialog: PropTypes.bool.isRequired,
    handleOpenFilterDialog: PropTypes.func.isRequired,
    handleCloseFilterDialog: PropTypes.func.isRequired,
    handleSubmitFilterDialog: PropTypes.func.isRequired
  })
}

export default ResumeFilterForm
