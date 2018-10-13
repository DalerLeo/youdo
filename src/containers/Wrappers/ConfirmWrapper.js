import {pure, createEventHandler, compose, mapPropsStream} from 'recompose'
import {replaceUrl} from '../../helpers/changeUrl'
import {connect} from 'react-redux'
import _ from 'lodash'
import {openSnackbarAction} from '../../actions/snackbar'
import toBoolean from '../../helpers/toBoolean'
import sprintf from 'sprintf'

const confirmWrapper = params => {
  const {
    name = 'confirm',
    confirmAction,
    queryKey = 'confirmDialog',
    thenActionKey = null,
    successMessage,
    failMessage,
    itemPath = null,
    listPath = null
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
        .subscribe(([value, {filter, location, ...props}]) => {
          const pathname = itemPath ? sprintf(itemPath, value) : location.pathname
          replaceUrl(filter, pathname, {[queryKey]: true})
        })

      onClose$
        .withLatestFrom(props$)
        .subscribe(([, {filter, location, ...props}]) => {
          const pathname = listPath || location.pathname
          replaceUrl(filter, pathname, {[queryKey]: false})
        })

      onSubmit$
        .withLatestFrom(props$)
        .subscribe(([fieldNames, {filter, location, detail, ...props}]) => {
          return props.confirmAction(_.get(detail, 'id'))
            .then(() => props.openSnackbarAction({message: successMessage}))
            .then(() => {
              const pathname = listPath || location.pathname
              replaceUrl(filter, pathname, {[queryKey]: false})
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
            [`${name}Dialog`]: {
              open: toBoolean(_.get(props, ['location', 'query', queryKey])),
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

export default confirmWrapper
