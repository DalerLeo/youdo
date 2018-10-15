import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import {Field, reduxForm} from 'redux-form'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import {
  BORDER_STYLE,
  COLOR_WHITE,
  COLOR_DEFAULT
} from '../../constants/styleConstants'
import Loader from '../Loader'
import {
  TextField,
  UsersSearchField,
  UsersMultiSearchField
} from '../ReduxForm'
import t from '../../helpers/translate'
import FlatButton from 'material-ui/FlatButton'
import StaticUniversalSearchField from 'components/ReduxForm/StaticUniversalSearchField'
import {PROJECT_VISIBILITY} from 'constants/backendConstants'
export const PROJECT_CREATE_DIALOG_OPEN = 'openCreateDialog'

const enhance = compose(
  injectSheet({
    dialog: {
      overflowY: 'auto',
      paddingTop: '0 !important'
    },
    loader: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: COLOR_WHITE,
      top: '0',
      left: '0',
      alignItems: 'center',
      zIndex: '999',
      justifyContent: 'center',
      display: ({loading}) => loading ? 'flex' : 'none'
    },
    customLoader: {
      background: COLOR_WHITE,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 0'
    },
    popUp: {
      color: '#333 !important',
      overflowY: 'unset !important',
      overflowX: 'unset !important',
      fontSize: '13px !important',
      position: 'relative',
      padding: '0 !important',
      height: '100%',
      maxHeight: 'none !important',
      marginBottom: '64px'
    },
    titleContent: {
      background: COLOR_WHITE,
      color: COLOR_DEFAULT,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: BORDER_STYLE,
      padding: '0 10px 0 30px',
      height: '60px',
      zIndex: '999'
    },
    isGlobal: {marginTop: '10px'},

    inputFieldCustom: {
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
      }
    },
    bottomButton: {
      bottom: '0',
      left: '0',
      right: '0',
      padding: '10px',
      zIndex: '999',
      borderTop: BORDER_STYLE,
      background: COLOR_WHITE,
      textAlign: 'right',
      '& span': {
        fontSize: '13px !important',
        fontWeight: '600 !important',
        color: '#129fdd',
        verticalAlign: 'inherit !important'
      }
    },
    actionButton: {
      fontSize: '13px !important',
      margin: '0 !important'
    }
  }),
  reduxForm({
    form: 'ProjectCreateForm',
    enableReinitialize: true
  })
)

const ProjectCreateDialog = enhance((props) => {
  const {
    open,
    handleSubmit,
    onClose,
    classes,
    isUpdate
  } = props

  const formNames = [
    'manager',
    'salesAmount',
    'comment'
  ]
  const onSubmit = handleSubmit(() => props.onSubmit(formNames))

  return (
    <Dialog
      modal={true}
      open={open}
      onRequestClose={onClose}
      className={classes.dialog}
      contentStyle={{width: '500px', maxWidth: 'none'}}
      bodyClassName={classes.popUp}>

      <div className={classes.titleContent}>
        <span>{isUpdate ? 'Изменение плана' : 'Создание плана'}</span>
        <IconButton onClick={onClose}>
          <CloseIcon color="#666666"/>
        </IconButton>
      </div>
      <div className={classes.bodyContent}>
        <form onSubmit={onSubmit} className={classes.form}>
          <div className={classes.loader}>
            <Loader size={0.75}/>
          </div>
          <div className={classes.inContent} style={{minHeight: '260px', padding: '5px 30px 20px'}}>
            <div className={classes.field} style={{padding: '10px 0 0'}}>
              <Field
                name="title"
                component={TextField}
                className={classes.inputFieldCustom}
                label={'Наименование'}
                fullWidth={true}/>
              <Field
                name="description"
                component={TextField}
                multiLine={true}
                rows={1}
                rowsMax={4}
                label={'Описание'}
                fullWidth={true}/>
              <Field
                name="leader"
                component={UsersSearchField}
                label={t('Лидер')}
                fullWidth={true}/>
              <Field
                name="workers"
                component={UsersMultiSearchField}
                label={'Рабочая группа'}
                fullWidth={true}/>
              <Field
                name="isGlobal"
                className={classes.isGlobal}
                component={StaticUniversalSearchField}
                items={PROJECT_VISIBILITY}
                label={'Видимость проекта'}
                fullWidth={true}/>
            </div>
          </div>
          <div className={classes.bottomButton}>
            <FlatButton
              label={t('Сохранить')}
              className={classes.actionButton}
              primary={true}
              type="submit"
            />
          </div>
        </form>
      </div>
    </Dialog>
  )
})

ProjectCreateDialog.propTypes = {
  isUpdate: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

ProjectCreateDialog.defaultProps = {
  isUpdate: false
}

export default ProjectCreateDialog
