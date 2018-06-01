import {pure, createEventHandler, compose, mapPropsStream} from 'recompose'
import {replaceUrl} from '../../helpers/changeUrl'
import {reset} from 'redux-form'
import {connect} from 'react-redux'
import _ from 'lodash'
import t from '../../helpers/translate'
import {openSnackbarAction} from '../../actions/snackbar'
import formValidate from '../../helpers/formValidate'

const createWrapper = (createAction, queryKey, formName) => {
  return compose(
    connect((state) => {
      return {
        createForm: _.get(state, ['form', formName]),
        createLoading: _.get(state, [formName, 'create', 'loading'])
      }
    },
    {createAction, openSnackbarAction}),
    mapPropsStream(props$ => {
      const {handler: onOpenCreateDialog, stream: onOpenCreateDialog$} = createEventHandler()
      const {handler: onCloseCreateDialog, stream: onCloseCreateDialog$} = createEventHandler()
      const {handler: onSubmitCreateDialog, stream: onSubmitCreateDialog$} = createEventHandler()

      onOpenCreateDialog$
        .withLatestFrom(props$)
        .subscribe(([, {filter, location, ...props}, ...def]) => {
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
            })
            .catch(error => {
              formValidate(fieldNames, props.dispatch, error)
            })
        })

      return props$
        .combineLatest(({...props}) => ({
          createDialog: {
            onOpenCreateDialog,
            onCloseCreateDialog,
            onSubmitCreateDialog
          },
          ...props
        }))
    }),
    pure
  )
}

export default createWrapper
