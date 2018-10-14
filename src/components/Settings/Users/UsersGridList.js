import _ from 'lodash'
import fp from 'lodash/fp'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FlatButton from 'material-ui/FlatButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Edit from 'material-ui/svg-icons/image/edit'
import * as ROUTES from '../../../constants/routes'
import GridList from '../../GridList/index'
import Container from '../../Container/index'
import UsersCreateDialog from './UsersCreateDialog'
import ConfirmDialog from '../../ConfirmDialog/index'
import SideMenu from '../SideMenu'
import ToolTip from '../../Utils/ToolTip/index'
import t from '../../../helpers/translate'
import {USERS_STATUS} from '../../../constants/backendConstants'
import defaultPropTypes from '../../../constants/propTypes'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
const ZERO = 0

const listHeader = [
  {
    sorting: true,
    name: 'id',
    title: '№',
    xs: 1
  },
  {
    sorting: false,
    name: 'username',
    title: t('Пользователь'),
    xs: 3
  },
  {
    sorting: false,
    name: 'email',
    title: t('email'),
    xs: 2
  },
  {
    sorting: false,
    name: 'phone_number',
    title: t('Телефон'),
    xs: 2
  },
  {
    sorting: false,
    name: 'permissions',
    title: t('Роль'),
    xs: 2
  },
  {
    sorting: false,
    name: 'status',
    title: t('Статус'),
    xs: 2
  }
]

const enhance = compose(
  injectSheet({
    wrapper: {
      display: 'flex',
      margin: '0 -28px',
      height: 'calc(100% + 28px)'
    },
    addButton: {
      '& svg': {
        width: '14px !important',
        height: '14px !important'
      }
    },
    addButtonWrapper: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      marginLeft: '-18px'
    },
    rightPanel: {
      background: '#fff',
      flexBasis: '100%',
      width: '100%',
      paddingTop: '10px',
      overflowY: 'auto',
      overflowX: 'hidden'
    },
    iconBtn: {
      display: 'flex',
      justifyContent: 'flex-end',
      opacity: '0',
      transition: 'all 200ms ease-out'
    },
    listRow: {
      margin: '0 -30px !important',
      width: 'auto !important',
      padding: '0 30px',
      '&:hover > div:last-child > div ': {
        opacity: '1'
      },
      '& > div': {
        overflow: 'hidden',
        wordBreak: 'normal',
        textOverflow: 'ellipsis',
        '&:last-child': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }

      }
    }
  })
)

const iconStyle = {
  icon: {
    color: '#666',
    width: 22,
    height: 22
  },
  button: {
    width: 30,
    height: 30,
    padding: 0
  }
}
const findItem = (item) => _.find(USERS_STATUS, {value: _.get(item, 'status')})

const UsersGridList = enhance((props) => {
  const {
    filter,
    createDialog,
    updateDialog,
    confirmDialog,
    listData,
    detailData,
    classes
  } = props

  const usersList = _.map(_.get(listData, 'data'), (item) => {
    const id = _.get(item, 'id')
    const status = fp.flow(findItem, fp.get('name'))
    const username = _.get(item, 'email')
    const phone = _.get(item, 'phoneNumber')
    const firstName = _.get(item, 'fullName')
    const permissions = _.get(item, ['groups', '0', 'name'])
    return (
      <Row key={id} className={classes.listRow}>
        <Col xs={1}>{id}</Col>
        <Col xs={3}>{firstName}</Col>
        <Col xs={2}>{username}</Col>
        <Col xs={2} style={{textAlign: 'right'}}>{phone}</Col>
        <Col xs={2}>{permissions}</Col>
        <Col xs={2}>{status(item)}
          <div className={classes.iconBtn}>
            <ToolTip position="bottom" text={t('Изменить')}>
              <IconButton
                iconStyle={iconStyle.icon}
                style={iconStyle.button}
                disableTouchRipple={true}
                touch={true}
                onClick={() => { updateDialog.onOpen(id) }}>
                <Edit />
              </IconButton>
            </ToolTip>
            <ToolTip position="bottom" text={t('Удалить')}>
              <IconButton
                disableTouchRipple={true}
                iconStyle={iconStyle.icon}
                style={iconStyle.button}
                onClick={() => { confirmDialog.onOpen(id) }}
                touch={true}>
                <DeleteIcon />
              </IconButton>
            </ToolTip>
          </div>
        </Col>

      </Row>
    )
  })

  const list = {
    header: listHeader,
    list: usersList,
    loading: _.get(listData, 'listLoading')
  }

  const addButton = (
    <div className={classes.addButtonWrapper}>
      <FlatButton
        backgroundColor="#fff"
        labelStyle={{textTransform: 'none', paddingLeft: '2px', color: '#12aaeb'}}
        className={classes.addButton}
        label={t('добавить пользователя')}
        onClick={createDialog.onOpen}
        icon={<ContentAdd color="#12aaeb"/>}>
      </FlatButton>
    </div>
  )

  return (
    <Container>
      <div className={classes.wrapper}>
        <SideMenu currentUrl={ROUTES.USERS_LIST_URL}/>
        <div className={classes.rightPanel}>
          <GridList
            filter={filter}
            list={list}
            listShadow={false}
            detail={<span/>}
            actionsDialog={<span/>}
            addButton={addButton}
          />
        </div>
      </div>

      {createDialog.open &&
      <UsersCreateDialog
        detailData={_.get(detailData, 'data')}
        initialValues={updateDialog.initialValues}
        open={createDialog.open}
        loading={createDialog.loading}
        onClose={createDialog.onClose}
        onSubmit={createDialog.onSubmit}
        errorData={createDialog.errorData}
      />}

      {updateDialog.open &&
      <UsersCreateDialog
        detailData={_.get(detailData, 'data')}
        initialValues={updateDialog.initialValues}
        isUpdate={true}
        open={_.toInteger(updateDialog.open) > ZERO}
        loading={updateDialog.loading}
        onClose={updateDialog.onClose}
        onSubmit={updateDialog.onSubmit}
        errorData={updateDialog.errorData}
      />}
      {detailData.data && <ConfirmDialog
        type="delete"
        message={_.get(detailData, 'data.fullName')}
        loading={confirmDialog.loading}
        onClose={confirmDialog.onClose}
        onSubmit={confirmDialog.onSubmit}
        open={confirmDialog.open}
      />}
    </Container>
  )
})

UsersGridList.propTypes = {
  filter: PropTypes.object.isRequired,
  listData: PropTypes.object,
  detailData: PropTypes.object,
  createDialog: PropTypes.shape({
    ...defaultPropTypes
  }).isRequired,
  confirmDialog: PropTypes.shape({
    ...defaultPropTypes
  }).isRequired,
  updateDialog: PropTypes.shape({
    initialValues: PropTypes.object,
    ...defaultPropTypes
  }).isRequired,
  filterDialog: PropTypes.shape({
    initialValues: PropTypes.object,
    ...defaultPropTypes
  }).isRequired
}

export default UsersGridList
