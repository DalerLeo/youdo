import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import {Field, reduxForm} from 'redux-form'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import formValidate from '../../../helpers/formValidate'
import {
  BORDER_STYLE,
  COLOR_WHITE,
  COLOR_DEFAULT
} from '../../../constants/styleConstants'
import Loader from '../../Loader'
import TextField from '../../ReduxForm/Basic/TextField'
import t from '../../../helpers/translate'
import FlatButton from 'material-ui/FlatButton'
export const JOB_SEARCH_CREATE_DIALOG_OPEN = 'openCreateDialog'

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
    datesField: {
      width: '100%!important'
    },
    textFieldArea: {
      top: '-20px !important',
      lineHeight: '20px !important',
      fontSize: '13px !important',
      marginBottom: '-22px'
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
    },
    container: {
      padding: '10px 30px 15px',
      borderTop: BORDER_STYLE,
      '&:first-child': {
        border: 'none'
      },
      '& h4': {
        fontSize: '13px',
        fontWeight: '600',
        padding: '10px 0'
      }
    },
    subTitle: {
      paddingBottom: '10px'
    }
  }),
  reduxForm({
    form: 'JobSearchCreateForm',
    enableReinitialize: true
  })
)

const JobSearchCreateDialog = enhance((props) => {
  const {
    dispatch,
    open,
    handleSubmit,
    onClose,
    classes,
    isUpdate
  } = props

  const formNames = [
    'name'
  ]
  const onSubmit = handleSubmit(() => props.onSubmit()
    .catch((error) => {
      formValidate(formNames, dispatch, error)
    }))

  return (
    <Dialog
      modal={true}
      open={open}
      onRequestClose={onClose}
      className={classes.dialog}
      contentStyle={{width: '400px', maxWidth: 'none'}}
      bodyClassName={classes.popUp}>

      <div className={classes.titleContent}>
        <span>{isUpdate ? 'Изменение плана' : 'Создание статуса'}</span>
        <IconButton onClick={onClose}>
          <CloseIcon color="#666666"/>
        </IconButton>
      </div>
      <div className={classes.bodyContent}>
        <form onSubmit={onSubmit} className={classes.form}>
          <div className={classes.loader}>
            <Loader size={0.75}/>
          </div>
          <div className={classes.inContent} style={{minHeight: '100px', padding: '5px 30px'}}>
            <div className={classes.field} style={{padding: '10px 0 0'}}>
              <Field
                name="name"
                component={TextField}
                className={classes.inputFieldCustom}
                label={'Статус'}
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

JobSearchCreateDialog.propTypes = {
  isUpdate: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

JobSearchCreateDialog.defaultProps = {
  isUpdate: false
}

export default JobSearchCreateDialog
