import {pure, createEventHandler, compose, mapPropsStream} from 'recompose'
import {replaceUrl} from '../../helpers/changeUrl'
import {connect} from 'react-redux'
import _ from 'lodash'
import {openSnackbarAction} from '../../actions/snackbar'
import toBoolean from '../../helpers/toBoolean'

const createWrapper = params => {
  const {
    confirmAction,
    queryKey = 'confirmDialog',
    thenActionKey = null,
    successMessage,
    failMessage
  } = params

  return compose(
    connect(() => ({}),
      {confirmAction, openSnackbarAction}),

    mapPropsStream(props$ => {
      const {handler: onOpen, stream: onOpen$} = createEventHandler()
      const {handler: onClose, stream: onClose$} = createEventHandler()
      const {handler: onSubmit, stream: onSubmit$} = createEventHandler()

      onOpen$
        .withLatestFrom(props$)
        .subscribe(([, {filter, location, ...props}]) => {
          replaceUrl(filter, location.pathname, {[queryKey]: true})
        })

      onClose$
        .withLatestFrom(props$)
        .subscribe(([, {filter, location, ...props}]) => {
          replaceUrl(filter, location.pathname, {[queryKey]: false})
        })

      onSubmit$
        .withLatestFrom(props$)
        .subscribe(([fieldNames, {filter, location, detail, ...props}]) => {
          return props.confirmAction(_.get(detail, 'id'))
            .then(() => props.openSnackbarAction({message: successMessage}))
            .then(() => {
              replaceUrl(filter, location.pathname, {[queryKey]: false})
              props.listFetchAction(filter)
              thenActionKey && replaceUrl(filter, location.pathname, {[thenActionKey]: true, [queryKey]: false})
            })
            .catch(() => {
              return props.openSnackbarAction({message: failMessage})
            })
        })

      return props$
        .combineLatest(({updateData, updateLoading, ...props}) => {
          return ({
            confirmDialog: {
              isOpen: toBoolean(_.get(props, ['location', 'query', queryKey])),
              onOpen,
              onClose,
              onSubmit
            },
            ...props
          })
        })
    }),
    pure
  )
}

export default createWrapper
