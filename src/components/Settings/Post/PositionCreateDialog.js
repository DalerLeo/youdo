import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../../Loader'
import {Field, reduxForm} from 'redux-form'
import {TextField} from '../../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../../Styles/MainStyles'
import t from '../../../helpers/translate'

export const POST_CREATE_DIALOG_OPEN = 'openCreateDialog'

const enhance = compose(
  injectSheet(_.merge(MainStyles, {
    loading: {
      width: '100%',
      height: '100px',
      background: '#fff',
      alignItems: 'center',
      zIndex: '999',
      justifyContent: 'center',
      textAlign: 'center',
      display: 'flex'
    }
  })),
  reduxForm({
    form: 'PostCreateForm',
    enableReinitialize: true
  })
)

const PostCreateDialog = enhance((props) => {
  const {open, loading, handleSubmit, onClose, classes, isUpdate} = props
  const formNames = ['name', 'beginTime', 'endTime']
  const onSubmit = handleSubmit(() => props.onSubmit(formNames))

  return (
    <Dialog
      modal={true}
      open={open}
      onRequestClose={onClose}
      className={classes.dialog}
      contentStyle={loading ? {width: '300px'} : {width: '500px'}}
      bodyStyle={{minHeight: 'auto'}}
      bodyClassName={classes.popUp}>
      <div className={classes.titleContent}>
        <span>{isUpdate ? t('Изменить должность') : t('Добавить должность')}</span>
        <IconButton onClick={onClose}>
          <CloseIcon color="#666666"/>
        </IconButton>
      </div>
      {loading
        ? <div className={classes.loading}>
          <Loader size={0.75}/>
        </div>
        : <div className={classes.bodyContent}>
          <form onSubmit={onSubmit} className={classes.form} style={{minHeight: 'auto'}}>

            <div className={classes.inContent} style={{minHeight: '100px', paddingTop: '15px'}}>
              <div className={classes.field}>
                <Field
                  name="name"
                  component={TextField}
                  className={classes.inputFieldCustom}
                  label={t('Наименование')}
                  fullWidth={true}
                />
              </div>
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
        </div>}

    </Dialog>
  )
})

PostCreateDialog.propTypes = {
  isUpdate: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

PostCreateDialog.defaultProps = {
  isUpdate: false
}

export default PostCreateDialog
