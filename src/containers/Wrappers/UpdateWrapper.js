import {pure, createEventHandler, compose, mapPropsStream} from 'recompose'
import {replaceUrl} from '../../helpers/changeUrl'
import {reset} from 'redux-form'
import {connect} from 'react-redux'
import _ from 'lodash'
import t from '../../helpers/translate'
import {openSnackbarAction} from '../../actions/snackbar'
import {formInlineValidate} from '../../helpers/formValidate'
import toBoolean from '../../helpers/toBoolean'

const updateWrapper = params => {
  const {
    updateAction,
    queryKey = 'openUpdateDialog',
    formName,
    thenActionKey = null,
    storeName,
    updateKeys
  } = params

  return compose(
    connect((state) => {
      return {
        updateLoading: _.get(state, [storeName, 'update', 'loading']),
        updateData: _.get(state, [storeName, 'update', 'data'])
      }
    },
    {updateAction, openSnackbarAction}),

    mapPropsStream(props$ => {
      const {handler: onOpen, stream: onOpen$} = createEventHandler()
      const {handler: onClose, stream: onClose$} = createEventHandler()
      const {handler: onSubmit, stream: onSubmit$} = createEventHandler()

      onOpen$
        .withLatestFrom(props$)
        .subscribe(([, {filter, location, ...props}]) => {
          replaceUrl(filter, location.pathname, {[queryKey]: true})
          props.dispatch(reset(formName))
        })

      onClose$
        .withLatestFrom(props$)
        .subscribe(([, {filter, location, ...props}]) => {
          replaceUrl(filter, location.pathname, {[queryKey]: false})
        })

      onSubmit$
        .withLatestFrom(props$)
        .subscribe(([fieldNames, {filter, location, createForm, detail, ...props}]) => {
          return props.updateAction(detail.id, _.get(createForm, ['values']))
            .then(() => props.openSnackbarAction({message: t('Успешно изменено')}))
            .then(() => {
              replaceUrl(filter, location.pathname, {[queryKey]: false})
              props.listFetchAction(filter)
              thenActionKey &&
              replaceUrl(filter, location.pathname, {[thenActionKey]: true, [queryKey]: false})
            })
            .catch(error => {
              formInlineValidate(fieldNames, props.dispatch, error, formName)
            })
        })

      return props$
        .combineLatest(({updateData, updateLoading, detailLoading, detail, ...props}) => {
          const initialValues = (() => {
            if (!detail || _.get(props, 'createDialog.isOpen')) {
              return {
              }
            }
            return _.chain(updateKeys)
              .mapValues(path => _.get(detail, path))
              .value()
          })()

          return ({
            updateDialog: {
              isOpen: toBoolean(_.get(props, ['location', 'query', queryKey])),
              onOpen,
              onClose,
              onSubmit,
              initialValues,
              data: updateData,
              loading: updateLoading || detailLoading

            },
            detailLoading,
            detail,
            ...props
          })
        })
    }),
    pure
  )
}

export default updateWrapper
