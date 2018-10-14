import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import * as ROUTES from '../../../constants/routes'
import GridList from '../../GridList/index'
import Container from '../../Container/index'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import SettingSideMenu from '../SideMenu'
import SetDateDialog from './SetDateDialog'
import ToolTip from '../../Utils/ToolTip/index'
import toBoolean from '../../../helpers/toBoolean'
import {
  getPermName,
  ON_TIME,
  OFF_TIME
} from '../../../constants/permissionTime'
import t from '../../../helpers/translate'

const listHeader = [
  {
    sorting: false,
    name: 'name',
    xs: 5,
    title: t('Наименование')
  },
  {
    sorting: false,
    name: 'toTime',
    xs: 5,
    title: t('Время работы')
  },
  {
    sorting: false,
    name: 'edit',
    xs: 2,
    title: ''
  }
]

const enhance = compose(
  injectSheet({
    addButton: {
      '& svg': {
        width: '14px !important',
        height: '14px !important'
      }
    },
    wrapper: {
      display: 'flex',
      margin: '0 -28px',
      height: 'calc(100% + 28px)'
    },
    addButtonWrapper: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      marginLeft: '-18px'
    },
    rightPanel: {
      background: '#fff',
      flexBasis: 'calc(100% - 225px)',
      maxWidth: 'calc(100% - 225px)',
      paddingTop: '10px',
      overflowY: 'auto',
      overflowX: 'hidden'
    },
    verticalButton: {
      border: '2px #dfdfdf solid !important',
      borderRadius: '50%',
      opacity: '0',
      '& > div': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    },
    listRow: {
      margin: '0 -30px !important',
      width: 'auto !important',
      padding: '0 30px'
    },
    iconBtn: {
      display: 'inline-flex'
    }
  }),
)
const iconStyle = {
  icon: {
    color: '#666',
    width: 22,
    height: 22
  },
  button: {
    width: 30,
    height: 26,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
}
const ZERO = 0
const PermissionGridList = enhance((props) => {
  const {
    filter,
    listData,
    setDateDialog,
    classes
  } = props

  const permissionDetail = (
    <span>a</span>
  )

  const permissionList = _.map(_.get(listData, 'data'), (item) => {
    const id = _.get(item, 'id')
    const name = _.get(item, 'name')
    const fromTime = _.get(item, 'fromTime') || (<span style={{fontSize: 22}}>∞</span>)
    const toTime = _.get(item, 'toTime') || (<span style={{fontSize: 22}}>∞</span>)
    const status = _.toInteger(_.get(item, 'status'))

    return (
      <Row key={id} className={classes.listRow}>
        <Col xs={5}>{name}</Col>
        <Col xs={5}>
          {getPermName[status]}
          {(status === ON_TIME || status === OFF_TIME) && ': ' + fromTime + ' - ' + toTime}
        </Col>
        <Col xs={2} style={{textAlign: 'right'}}>
          <div className={classes.iconBtn}>
            <ToolTip position="bottom" text={t('Изменить')}>
              <IconButton
                iconStyle={iconStyle.icon}
                style={iconStyle.button}
                disableTouchRipple={true}
                touch={true}
                onClick={() => { setDateDialog.handleOpenSetDateDialog(id) }}>
                <ModEditorIcon color='#5d6474'/>
              </IconButton>
            </ToolTip>
          </div>
        </Col>
      </Row>
    )
  })

  const list = {
    header: listHeader,
    list: permissionList,
    loading: _.get(listData, 'listLoading')
  }

  return (
    <Container>
      <div className={classes.wrapper}>
        <SettingSideMenu currentUrl={ROUTES.PERMISSION_LIST_URL}/>
        <div className={classes.rightPanel}>
          <GridList
            filter={filter}
            list={list}
            detail={permissionDetail}
            listShadow={false}
          />
        </div>
      </div>
      <SetDateDialog
        initialValues={setDateDialog.initialValues}
        open={_.toInteger(setDateDialog.open) > ZERO ? true : toBoolean(setDateDialog.open)}
        onClose={setDateDialog.handleCloseSetDateDialog}
        onSubmit={setDateDialog.handleSubmitSetDateDialog}
      />
    </Container>
  )
})

PermissionGridList.propTypes = {
  filter: PropTypes.object.isRequired,
  listData: PropTypes.object,
  setDateDialog: PropTypes.shape({
    open: PropTypes.number,
    handleOpenSetDateDialog: PropTypes.func.isRequired,
    handleCloseSetDateDialog: PropTypes.func.isRequired,
    handleSubmitSetDateDialog: PropTypes.func.isRequired
  }).isRequired
}

export default PermissionGridList
