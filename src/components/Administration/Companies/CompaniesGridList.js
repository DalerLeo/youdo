import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import * as ROUTES from '../../../constants/routes'
import GridList from '../../GridList'
import Container from '../../Container'
import CompaniesCreateDialog from './CompaniesCreateDialog'
import CompaniesDetails from './CompaniesDetails'
import ConfirmDialog from '../../ConfirmDialog'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FlatButton from 'material-ui/FlatButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import SubMenu from '../../SubMenu'
import Edit from 'material-ui/svg-icons/image/edit'
import ToolTip from '../../Utils/ToolTip'
import {Link} from 'react-router'
import dateFormat from '../../../helpers/dateFormat'
import t from '../../../helpers/translate'
import {COLOR_WHITE, LINK_COLOR} from '../../../constants/styleConstants'
import sprintf from 'sprintf'
import numberFormat from '../../../helpers/numberFormat'

const listHeader = [
  {
    sorting: false,
    name: 'name',
    xs: 3,
    title: t('Название')
  },
  {
    sorting: true,
    xs: 3,
    name: 'sphere',
    title: t('Сфера деятельности')
  },
  {
    sorting: true,
    xs: 2,
    name: 'language',
    title: t('Язык профиля')
  },
  {
    sorting: true,
    xs: 2,
    name: 'balance',
    title: t('Баланс')
  },
  {
    sorting: true,
    xs: 2,
    name: 'created_at',
    title: t('Дата регистрации')
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
      height: 'calc(100% + 28px)'
    },
    addButtonWrapper: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      marginLeft: '-18px'
    },
    rightPanel: {
      background: COLOR_WHITE,
      width: '100%',
      overflowY: 'auto',
      boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
      overflowX: 'hidden'
    },
    listRow: {
      margin: '0 -30px !important',
      width: 'auto !important',
      padding: '0 30px',
      position: 'relative',
      '&:hover > div:last-child > div ': {
        opacity: '1'
      }
    },
    link: {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      zIndex: '1'
    },
    iconBtn: {
      opacity: '0',
      transition: 'all 200ms ease-out'
    },
    actionButtons: {
      display: 'flex',
      justifyContent: 'flex-end',
      zIndex: '2'
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
    height: 25,
    padding: 0
  }
}

const CompaniesGridList = enhance((props) => {
  const {
    filter,
    createDialog,
    updateDialog,
    confirmDialog,
    listData,
    detailData,
    classes
  } = props

  const actionButtons = (id) => {
    return (
      <div className={classes.actionButtons}>
        <ToolTip position="bottom" text={t('Изменить')}>
          <IconButton
            iconStyle={iconStyle.icon}
            style={iconStyle.button}
            disableTouchRipple={true}
            touch={true}
            onClick={() => { updateDialog.handleOpenUpdateDialog(id) }}>
            <Edit />
          </IconButton>
        </ToolTip>
        <ToolTip position="bottom" text={t('Удалить')}>
          <IconButton
            disableTouchRipple={true}
            iconStyle={iconStyle.icon}
            style={iconStyle.button}
            onClick={() => { confirmDialog.handleOpenConfirmDialog(id) }}
            touch={true}>
            <DeleteIcon />
          </IconButton>
        </ToolTip>
      </div>
    )
  }

  const companiesDetail = (
    <CompaniesDetails
      filter={filter}
      key={_.get(detailData, 'id')}
      data={_.get(detailData, 'data') || {}}
      loading={_.get(detailData, 'detailLoading')}
      actionButtons={actionButtons}/>
  )

  const companiesList = _.map(_.get(listData, 'data'), (item) => {
    const id = _.get(item, 'id')
    const name = _.get(item, 'name')
    const sphere = _.get(item, 'sphere')
    const language = _.get(item, 'profileLanguage')
    const balance = numberFormat(_.get(item, 'balance'))
    const kind = _.toUpper(_.get(item, 'kind'))
    const createdDate = dateFormat(_.get(item, 'createdAt'))
    return (
      <Row key={id} className={classes.listRow}>
        <Col xs={3}>{kind} {name}</Col>
        <Link className={classes.link} to={{
          pathname: sprintf(ROUTES.COMPANIES_ITEM_PATH, id),
          query: filter.getParams()
        }}/>
        <Col xs={3}>{sphere}</Col>
        <Col xs={2}>{language}</Col>
        <Col xs={2}>{balance}</Col>
        <Col xs={2}>{createdDate}</Col>
      </Row>
    )
  })

  const list = {
    header: listHeader,
    list: companiesList,
    loading: _.get(listData, 'listLoading')
  }

  const addButton = (
    <div className={classes.addButtonWrapper}>
      <FlatButton
        backgroundColor={COLOR_WHITE}
        labelStyle={{textTransform: 'none', paddingLeft: '2px', color: LINK_COLOR, fontSize: '13px'}}
        className={classes.addButton}
        label={t('добавить команию')}
        onClick={createDialog.handleOpenCreateDialog}
        icon={<ContentAdd color={LINK_COLOR}/>}>
      </FlatButton>
    </div>
  )
  return (
    <Container>
      <div className={classes.wrapper}>
        <SubMenu url={ROUTES.COMPANIES_LIST_URL}/>
        <div className={classes.rightPanel}>
          <GridList
            filter={filter}
            list={list}
            detail={companiesDetail}
            addButton={addButton}
            listShadow={false}
            detailTransform={false}
          />
        </div>
      </div>

      <CompaniesCreateDialog
        open={createDialog.openCreateDialog}
        loading={createDialog.createLoading}
        onClose={createDialog.handleCloseCreateDialog}
        onSubmit={createDialog.handleSubmitCreateDialog}
      />

      <CompaniesCreateDialog
        isUpdate={true}
        initialValues={updateDialog.initialValues}
        open={updateDialog.openUpdateDialog}
        loading={updateDialog.updateLoading}
        onClose={updateDialog.handleCloseUpdateDialog}
        onSubmit={updateDialog.handleSubmitUpdateDialog}
      />

      {detailData.data && <ConfirmDialog
        type="delete"
        message={_.get(detailData, ['data', 'name'])}
        loading={confirmDialog.confirmLoading}
        onClose={confirmDialog.handleCloseConfirmDialog}
        onSubmit={confirmDialog.handleSendConfirmDialog}
        open={confirmDialog.openConfirmDialog}
      />}
    </Container>
  )
})

CompaniesGridList.propTypes = {
  filter: PropTypes.object.isRequired,
  listData: PropTypes.object,
  detailData: PropTypes.object,
  createDialog: PropTypes.shape({
    createLoading: PropTypes.bool.isRequired,
    openCreateDialog: PropTypes.bool.isRequired,
    handleOpenCreateDialog: PropTypes.func.isRequired,
    handleCloseCreateDialog: PropTypes.func.isRequired,
    handleSubmitCreateDialog: PropTypes.func.isRequired
  }).isRequired,
  confirmDialog: PropTypes.shape({
    confirmLoading: PropTypes.bool.isRequired,
    openConfirmDialog: PropTypes.bool.isRequired,
    handleOpenConfirmDialog: PropTypes.func.isRequired,
    handleCloseConfirmDialog: PropTypes.func.isRequired,
    handleSendConfirmDialog: PropTypes.func.isRequired
  }).isRequired,
  updateDialog: PropTypes.shape({
    updateLoading: PropTypes.bool.isRequired,
    openUpdateDialog: PropTypes.bool.isRequired,
    handleOpenUpdateDialog: PropTypes.func.isRequired,
    handleCloseUpdateDialog: PropTypes.func.isRequired,
    handleSubmitUpdateDialog: PropTypes.func.isRequired
  }).isRequired
}

export default CompaniesGridList
