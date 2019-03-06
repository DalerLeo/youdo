import _ from 'lodash'
import React from 'react'
import MUICheckbox from 'material-ui/Checkbox'
import Iconic from 'material-ui/svg-icons/navigation/chevron-right'
import IndeterIcon from 'material-ui/svg-icons/toggle/indeterminate-check-box'
import CheckedIcon from 'material-ui/svg-icons/toggle/check-box'
import {compose, withHandlers, withState} from 'recompose'
import injectSheet from 'react-jss'
import classNames from 'classnames'
import CheckBoxSimpleGroup from './CheckBoxSimpleGroup'

const enhance = compose(
  withState(
    'childOpen',
    'setChildOpen',
    false
  ),
  withState(
    'inter',
    'setInter',
    false
  ),
  withState(
    'parentChecked',
    'setParent',
    false
  ),
  withState(
    'childValues',
    'setChild',
    false
  ),
  withHandlers({
    onChildChange: props => (v) => {
      const {setChild, setParent, setInter, onChange, item} = props
      setChild(v)
      if (_.size(v) === _.size(item.children)) {
        onChange(v)
        setParent(true)
        setInter(false)
      } else if (_.isEmpty(v)) {
        setInter(false)
        setParent(false)
        onChange([])
      } else {
        setInter(true)
        setParent(false)
        onChange(v)
      }
    },
    onParentChange: props => (ev) => {
      const children = _.get(props, 'item.children')
      const parentId = _.get(props, 'item.id')
      const isTrue = _.get(ev, 'target.checked')

      props.setParent(isTrue)
      if (isTrue) {
        const childIds = _.map(children, child => child.id)
        props.onChange(_.union(childIds, [parentId]))
        props.setChild(childIds)
        props.setInter(false)
      } else {
        props.setInter(false)
        props.onChange([])
        props.setChild([])
      }
    }
  }),
  injectSheet({
    checkBox: {
      textAlign: 'left',
      marginBottom: '10px',
      marginTop: '10px',
      '& svg:first-child': {
        fill: '#666666 !important',
        color: '#666666 !important'
      },
      '& svg:last-child': {
        fill: '#666666 !important',
        color: '#666666 !important'
      },
      '& span': {
        top: '-10px !important',
        left: '-10px !important'
      }
    },
    parent: {
      display: 'flex',
      alignItems: 'center'
    },
    children: {
      background: '#efefef',
      margin: '0 20px 0 26px',
      paddingLeft: '10px',
      overflow: 'hidden'
    },
    chev: {
      transition: 'transform 300ms',
      transform: 'rotate(0deg)'
    },
    childOpen: {
      transform: 'rotate(90deg)'
    }
  })
)

const Checkbox = props => {
  const {
    onParentChange,
    onChildChange,
    childValues,
    classes,
    inter,
    item,
    parentChecked,
    childOpen,
    setChildOpen
  } = props
  return (
    <React.Fragment>
      <div className={classes.parent}>
        <Iconic
          className={classNames(classes.chev, childOpen && classes.childOpen)}
          onClick={() => setChildOpen(!childOpen)}/>
        <MUICheckbox
          label={item.name}
          checkedIcon={inter ? <IndeterIcon/> : <CheckedIcon />}
          className={classes.checkBox}
          iconStyle={{width: '20px', height: '20px'}}
          labelStyle={{lineHeight: '20px', left: '-10px'}}
          checked={parentChecked || inter}
          onCheck={onParentChange}
        />
      </div>
      <div className={classes.children}>
        {childOpen && <CheckBoxSimpleGroup
          onChange={onChildChange}
          values={childValues}
          items={item.children}
        />}
      </div>
    </React.Fragment>
  )
}

export default enhance(Checkbox)
