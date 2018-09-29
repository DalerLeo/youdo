import {pure, createEventHandler, compose, mapPropsStream} from 'recompose'
import {replaceUrl} from '../../helpers/changeUrl'
import {reset} from 'redux-form'
import {connect} from 'react-redux'
import _ from 'lodash'
import t from '../../helpers/translate'
import {openSnackbarAction} from '../../actions/snackbar'
import {formInlineValidate} from '../../helpers/formValidate'
import toBoolean from '../../helpers/toBoolean'
import sprintf from 'sprintf'

const updateWrapper = params => {
  const {
    formName,
    storeName,
    updateAction,
    itemPath = null,
    listPath = null,
    updateKeys = {},
    createKeys = {},
    thenActionKey = null,
    queryKey = 'openUpdateDialog'
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
        .subscribe(([value, {filter, location, ...props}]) => {
          const pathname = itemPath ? sprintf(itemPath, value) : location.pathname
          replaceUrl(filter, pathname, {[queryKey]: true})
          props.dispatch(reset(formName))
        })

      onClose$
        .withLatestFrom(props$)
        .subscribe(([, {filter, location, ...props}]) => {
          const pathname = listPath || location.pathname
          replaceUrl(filter, pathname, {[queryKey]: false})
        })

      onSubmit$
        .withLatestFrom(props$)
        .subscribe(([fieldNames, {filter, location, createForm, detail, ...props}]) => {
          return props.updateAction(detail.id, _.get(createForm, ['values']))
            .then(() => props.openSnackbarAction({message: t('Успешно изменено')}))
            .then(() => {
              replaceUrl(filter, location.pathname, {[queryKey]: false})
              props.listFetchAction(filter)
              props.itemFetchAction(detail.id)
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
            if (!detail || _.get(props, 'createDialog.open')) {
              return createKeys
            }
            return _.chain(updateKeys)
              .mapValues(path => _.get(detail, path))
              .value()
          })()

          return ({
            updateDialog: {
              open: toBoolean(_.get(props, ['location', 'query', queryKey])),
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
