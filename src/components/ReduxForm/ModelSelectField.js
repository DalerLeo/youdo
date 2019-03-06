import React from 'react'
import _ from 'lodash'
import {
  compose,
  mapPropsStream,
  withReducer,
  withHandlers
} from 'recompose'
import injectSheet from 'react-jss'
import fp from 'lodash/fp'
import propTypes from 'prop-types'
import classNames from 'classnames'
import Label2 from './Editor/FieldLabel/FieldLabel'
import Dialog from 'material-ui/Dialog'
import axios from 'helpers/axios'
import CheckBoxParent from './Basic/CheckBoxParent'
import MainStyles from 'components/Styles/MainStyles'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import FlatButton from 'material-ui/FlatButton'

const handleData = (dispatch, api) => {
  axios().get(api, {params: {page_size: 1000}})
    .then(response => {
      const data = fp.get('data.results', response)
      const parent = fp.filter(item => !item.parent, data)
      const children = fp.filter(item => item.parent, data)
      const allData = fp.map(item => {
        return {
          ...item,
          children: fp.filter(fp.flow(
            fp.get('parent.id'),
            fp.isEqual(item.id)
          ),
          children)
        }
      }, parent)
      dispatch({data: allData, loading: false})
      return response
    })
    .catch(er => console.warn(er))
}
const enhance = compose(
  withReducer(
    'state',
    'dispatch',
    (state, action) => ({...state, ...action}),
    {
      'open': false,
      data: [],
      loading: false,
      selected: []
    }
  ),
  mapPropsStream(props$ => {
    props$
      .distinctUntilChanged(null, fp.get('state.open'))
      .filter(fp.get('state.open'))
      .subscribe(({dispatch, api, input}) => {
        const initValues = fp.get('value', input)
        if (initValues) {
          dispatch({loading: true, selected: {1: [2]}})
        } else {
          dispatch({loading: true})
        }

        return handleData(dispatch, api)
      })

    return props$
  }),
  withHandlers({
    onOpen: props => (open) => {
      props.dispatch({open})
    },
    onChange: props => (values, id) => {
      console.warn(props.state.selected)

      props.dispatch({
        selected: {
          ...props.state.selected,
          [id]: values
        }})
    },
    onComplete: ({input, state, dispatch}) => () => {
      let ids = []
      fp.map(item => {
        ids = fp.union(item, ids)
        return item
      }, state.selected)
//      console.warn(ids)
      input.onChange(ids)
      dispatch({open: false})
    }
  }),
  injectSheet({
    ...MainStyles,
    wrapper: {
      marginBottom: '20px',
      '&:last-child': {
        marginBottom: '0'
      }
    },
    popUp: {
      maxHeight: 'unset!important',
      padding: '0 !important'
    },
    notSelected: {
      color: 'black',
      fontWeight: '500',
      fontSize: '14px',
      marginTop: '15px',
      lineHeight: 'normal',
      cursor: 'pointer',
      textDecoration: 'underline'
    },
    dialog: {
    },
    podlojkaScroll: {
      overflowY: 'auto !important',
      '& > div:first-child > div:first-child': {
        transform: 'translate(0px, 0px) !important'
      }
    },
    content: {
      margin: 'auto',
      padding: '0 30px'
    },
    iconClass: {
      top: '-47px',
      right: '-120px'
    },
    title: {

    },
    list: {
      maxHeight: 'calc(100vh - 220px)',
      overflow: 'hidden',
      overflowY: 'auto',
      marginTop: '18px'
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
    }
  })
)
const ModelSelectField = props => {
  const {
    onOpen,
    onChange,
    className,
    classes,
    onComplete,
    required,
    state: {loading, data, open},
    selectLabel
  } = props

  return (
    <div className={classNames(classes.wrapper, className)}>
      <div
        onClick={() => onOpen(true)}
        className={classes.notSelected}>
        <Label2 label={selectLabel} required={required}/>
      </div>
      <Dialog
        modal={true}
        open={open}
        onRequestClose={() => onOpen(false)}
        className={classes.podlojkaScroll}
        contentStyle={loading ? {width: '500px'} : {width: '600px'}}
        bodyStyle={{minHeight: 'auto', maxHeight: 'unset'}}
        bodyClassName={classes.popUp}>
        <div className={classes.titleContent}>
          <span>Сфера деятельности</span>
          <IconButton onClick={() => onOpen(false)}>
            <CloseIcon color="#666666"/>
          </IconButton>
        </div>
        <div className={classes.bodyContent}>
          <div className={classes.content}>
            {loading && 'LOADING .....'}
            <div className={classes.list}>
              {_.map(data, item => (
                <CheckBoxParent
                  key={item.id}
                  item={item}
                  onChange={(value) => {
                    console.warn(value)
                    onChange(value, item.id)
                  }}
                />
              ))}
            </div>

          </div>
        </div>
        <div className={classes.bottomButton}>
          <FlatButton
            label={'Сохранить'}
            className={classes.actionButton}
            labelStyle={{fontSize: '13px'}}
            primary={true}
            onClick={onComplete}
          />
        </div>
      </Dialog>

    </div>
  )
}

ModelSelectField.defaultProps = {
  withLabel: false
}
ModelSelectField.propTypes = {
  state: propTypes.shape({
    open: propTypes.bool.isRequired,
    loading: propTypes.bool.isRequired,
    data: propTypes.array.isRequired
  }),
  dispatch: propTypes.func.isRequired,
  onOpen: propTypes.func.isRequired,
  input: propTypes.object.isRequired,
  className: propTypes.string.isRequired,
  api: propTypes.string.isRequired,
  classes: propTypes.object.isRequired,
  required: propTypes.bool,
  label: propTypes.string,
  selectLabel: propTypes.string,
  onComplete: propTypes.func.isRequired,
  onChange: propTypes.func.isRequired
}

export default enhance(ModelSelectField)
