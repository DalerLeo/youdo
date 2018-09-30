import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import Loader from '../../Loader/index'
import {Field, reduxForm} from 'redux-form'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import t from '../../../helpers/translate'
import {TextField} from '../../ReduxForm/index'

export const SKILLS_CREATE_DIALOG_OPEN = 'openCreateDialog'

const enhance = compose(
  injectSheet({
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
      background: '#fff',
      color: '#333',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #efefef',
      padding: '0 10px 0 30px',
      height: '60px',
      zIndex: '999'
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
    bodyContent: {
      width: '100%'
    },
    form: {
      position: 'relative'
    },
    field: {
      width: '100%'
    },
    loader: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: '#fff',
      top: '0',
      left: '0',
      alignItems: 'center',
      zIndex: '999',
      justifyContent: 'center',
      display: ({loading}) => loading ? 'flex' : 'none'
    },
    dialogAddUser: {
      overflowY: 'auto !important'
    },
    inContent: {
      padding: '10px 30px'
    },
    bottomButton: {
      bottom: '0',
      left: '0',
      right: '0',
      padding: '10px',
      zIndex: '999',
      borderTop: '1px solid #efefef',
      background: '#fff',
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
    subTitle: {
      fontStyle: 'italic',
      margin: '15px 0 10px'
    }
  }),
  reduxForm({
    form: 'SkillsCreateForm',
    enableReinitialize: true
  })
)

const SkillsCreateDialog = enhance((props) => {
  const {
    open,
    loading,
    handleSubmit,
    onClose,
    classes,
    isUpdate
  } = props

  const formNames = ['name']
  const onSubmit = handleSubmit(() => props.onSubmit(formNames))
  return (
    <Dialog
      modal={true}
      open={open}
      onRequestClose={onClose}
      className={classes.dialogAddUser}
      contentStyle={loading ? {width: '400px'} : {width: '600px'}}
      bodyClassName={classes.popUp}>
      <div className={classes.titleContent}>
        <span>{isUpdate ? t('Изменить навык') : t('Добавить навык')}</span>
        <IconButton onClick={onClose}>
          <CloseIcon color="#666666"/>
        </IconButton>
      </div>
      <div className={classes.bodyContent}>
        <form onSubmit={onSubmit} className={classes.form}>
          <div className={classes.loader}>
            <Loader size={0.75}/>
          </div>
          <div className={classes.inContent}>
            <Field
              name="name"
              component={TextField}
              label={t('Название')}
              className={classes.inputFieldCustom}
              fullWidth={true}/>
          </div>
          <div className={classes.bottomButton}>
            <FlatButton
              label={t('Сохранить')}
              className={classes.actionButton}
              labelStyle={{fontSize: '13px'}}
              primary={true}
              type="submit"
            />
          </div>
        </form>
      </div>
    </Dialog>
  )
})

SkillsCreateDialog.propTyeps = {
  isUpdate: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

export default SkillsCreateDialog
