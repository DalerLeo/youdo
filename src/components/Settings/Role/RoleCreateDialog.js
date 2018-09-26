import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../../Loader/index'
import {Field, reduxForm} from 'redux-form'
import {TextField, CheckBox} from '../../ReduxForm/index'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../../Styles/MainStyles'
import userGroupFormat from '../../../helpers/userGroupFormat'
import t from '../../../helpers/translate'
import formValidate from '../../../helpers/formValidate'

export const ROLE_CREATE_DIALOG_OPEN = 'openCreateDialog'
const enhance = compose(
  injectSheet(_.merge(MainStyles, {
    dialog: {
      overflowY: 'auto'
    },
    load: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: '#fff',
      alignItems: 'center',
      zIndex: '999',
      display: 'flex',
      justifyContent: 'center'
    },
    perms: {
      display: 'flex',
      flexWrap: 'wrap',
      '& > div': {
        flexBasis: '50%',
        maxWidth: '50%',
        '&:nth-child(even)': {
          textAlign: 'right'
        }
      }
    }
  })),
  reduxForm({
    form: 'RoleCreateForm',
    enableReinitialize: true
  })
)
const RoleCreateDialog = enhance((props) => {
  const {open, loading, dispatch, handleSubmit, onClose, classes, isUpdate, data, dataLoading} = props
  const formNames = ['name', 'groups']
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
      contentStyle={loading ? {width: '500px'} : {width: '700px'}}
      bodyStyle={{minHeight: '100px !important'}}
      bodyClassName={classes.popUp}>
      <div className={classes.titleContent}>
        <span>{isUpdate ? t('ИЗМЕНИТЬ ДОЛЖНОСТЬ') : t('ДОБАВЛЕНИЕ ДОЛЖНОСТИ')}</span>
        <IconButton onClick={onClose}>
          <CloseIcon color="#666666"/>
        </IconButton>
      </div>
      <div className={classes.bodyContent}>
        <form onSubmit={onSubmit} className={classes.form} style={{minHeight: 'auto', position: 'relative'}}>
          {(loading || dataLoading) && <div className={classes.load}>
            <Loader size={0.75}/>
          </div>}
          <div className={classes.inContent} style={{minHeight: '120px', paddingTop: '15px'}}>
            <div className={classes.field}>
              <Field
                name="name"
                component={TextField}
                className={classes.inputFieldCustom}
                label={t('Наименование')}
                fullWidth={true}
              />
              <div className={classes.perms}>
                {_.map(data, (item) => {
                  const name = userGroupFormat(_.get(item, 'name'))
                  const id = _.get(item, 'id')
                  return (
                    <div key={id}>
                      <Field
                        name={'perms[' + id + ']'}
                        label={name}
                        component={CheckBox}/>
                    </div>
                  )
                })}
              </div>
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
      </div>
    </Dialog>
  )
})
RoleCreateDialog.propTypes = {
  isUpdate: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}
RoleCreateDialog.defaultProps = {
  isUpdate: false
}
export default RoleCreateDialog
