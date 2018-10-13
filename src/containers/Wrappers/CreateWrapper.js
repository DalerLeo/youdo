import {pure, createEventHandler, compose, mapPropsStream} from 'recompose'
import {replaceUrl} from '../../helpers/changeUrl'
import {reset} from 'redux-form'
import {connect} from 'react-redux'
import _ from 'lodash'
import t from '../../helpers/translate'
import {openSnackbarAction} from '../../actions/snackbar'
import {formInlineValidate} from '../../helpers/formValidate'
import toBoolean from '../../helpers/toBoolean'

const createWrapper = params => {
  const {
    createAction,
    queryKey = 'openCreateDialog',
    formName,
    thenActionKey,
    storeName
  } = params

  return compose(
    connect((state) => {
      return {
        createForm: _.get(state, ['form', formName]),
        createLoading: _.get(state, [storeName, 'create', 'loading']),
        createData: _.get(state, [storeName, 'create', 'data'])
      }
    },
    {createAction, openSnackbarAction}),

    mapPropsStream(props$ => {
      const {handler: onOpenCreateDialog, stream: onOpenCreateDialog$} = createEventHandler()
      const {handler: onCloseCreateDialog, stream: onCloseCreateDialog$} = createEventHandler()
      const {handler: onSubmitCreateDialog, stream: onSubmitCreateDialog$} = createEventHandler()

      onOpenCreateDialog$
        .withLatestFrom(props$)
        .subscribe(([, {filter, location, ...props}]) => {
          replaceUrl(filter, location.pathname, {[queryKey]: true})
          props.dispatch(reset(formName))
        })

      onCloseCreateDialog$
        .withLatestFrom(props$)
        .subscribe(([, {filter, location, ...props}]) => {
          replaceUrl(filter, location.pathname, {[queryKey]: false})
        })

      onSubmitCreateDialog$
        .withLatestFrom(props$)
        .subscribe(([fieldNames, {filter, location, createForm, ...props}]) => {
          return props.createAction(_.get(createForm, ['values']))
            .then(() => props.openSnackbarAction({message: t('Успешно сохранено')}))
            .then(() => {
              replaceUrl(filter, location.pathname, {[queryKey]: false})
              props.listFetchAction(filter)
              thenActionKey && replaceUrl(filter, location.pathname, {[thenActionKey]: true, [queryKey]: false})
            })
            .catch(error => {
              formInlineValidate(fieldNames, props.dispatch, error, formName)
            })
        })

      return props$
        .combineLatest(({createData, createLoading, ...props}) => {
          return {
            createDialog: {
              open: toBoolean(_.get(props, ['location', 'query', queryKey])),
              onOpen: onOpenCreateDialog,
              onClose: onCloseCreateDialog,
              onSubmit: onSubmitCreateDialog,
              data: createData,
              loading: createLoading
            },
            ...props
          }
        })
    }),
    pure
  )
}

export default createWrapper
