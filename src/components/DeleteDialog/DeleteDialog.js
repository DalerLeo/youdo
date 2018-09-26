import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {reduxForm} from 'redux-form'
import t from '../../helpers/translate'

export const DELETE_DIALOG_OPEN = 'openDeleteDialog'

const enhance = compose(
  injectSheet({
    dialog: {
      '& div:last-child': {
        textAlign: 'left !important',
        '& button': {
          marginLeft: '50px !important',
          marginBottom: '5px !important',
          color: '#12aaeb !important'
        }
      }
    },

    body: {
      maxHeight: '600px !important',
      padding: '0 0 0 15px !important',
      overflow: 'hidden !important'
    },

    title: {
      width: '220px',
      margin: '0 auto',
      padding: '10px 0',
      textAlign: 'center',
      background: '#12aaeb',
      color: '#fff',
      position: 'relative'
    },

    form: {
      display: 'flex'
    },

    map: {
      height: '600px',
      paddingRight: '0'
    }
  }),
  reduxForm({
    form: 'ShopCreateForm'
  })
)

const DeleteDialog = enhance((props) => {
  const {open, onClose, classes, filter} = props

  const selects = filter.getSelects()

  return (
    <Dialog
      modal={true}
      open={open}
      onRequestClose={onClose}
      className={classes.dialog}
      bodyClassName={classes.body}>
      <div>
        <h4 className={classes.title}>{t('ПОДТВЕРЖДЕНИЕ УДАЛЕНИЯ')}</h4>
      </div>
                        IDS: {selects}
      <div>
        <div>
          <FlatButton
            label={t('СВЕРНУТЬ')}
            primary={true}
            labelStyle={{fontSize: '13px'}}
            onClick={onClose}
          />

          <FlatButton
            label={t('УДАЛИТЬ')}
            labelStyle={{fontSize: '13px'}}
            primary={true}
            type="submit"
          />
        </div>
      </div>
    </Dialog>
  )
})

DeleteDialog.propTyeps = {
  filter: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
}

export default DeleteDialog
