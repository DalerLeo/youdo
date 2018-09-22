import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FlatButton from 'material-ui/FlatButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList/index'
import Container from '../Container/index'
import ApplicantCreateDialog from './ApplicantCreateDialog'
import ApplicationTabs from './ApplicantTabs'
import ApplicantDetails from './ApplicantDetails'
import ConfirmDialog from '../ConfirmDialog/index'
import ToolTip from '../ToolTip'
import SubMenu from '../SubMenu'
import sprintf from 'sprintf'
import t from '../../helpers/translate'
import dateFormat from '../../helpers/dateFormat'
import {replaceUrl} from '../../helpers/changeUrl'
// .import {APPLICANT_STATUS} from '../../../constants/backendConstants'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import DoneIcon from 'material-ui/svg-icons/action/done'
import BlockIcon from 'material-ui/svg-icons/content/block'
import EditIcon from 'material-ui/svg-icons/content/create'
import ApplicantMailDialog from './ApplicantMailDialog'

const listHeader = [
  {
    sorting: false,
    name: 'name',
    title: 'ФИО',
    xs: 3
  },
  {
    sorting: false,
    name: 'resume_num',
    title: t('Кол-во резюме'),
    xs: 2
  },
  {
    sorting: false,
    name: 'modified_date',
    title: t('Дата обновления'),
    xs: 3
  },
  {
    sorting: false,
    name: 'created_date',
    title: t('Дата создания'),
    xs: 2
  },
  {
    sorting: false,
    name: 'balance',
    title: t('Балансе'),
    xs: 2
  }
]

const enhance = compose(
  injectSheet({
    wrapper: {
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
      overflowY: 'auto',
      overflowX: 'hidden'
    },
    iconBtn: {
      display: 'flex',
      justifyContent: 'flex-end',
      transition: 'all 200ms ease-out'
    },
    listRow: {
      margin: '0 -30px !important',
      width: 'auto !important',
      padding: '0 30px',
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
    },
    link: {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      zIndex: '1'
    }
  })
)

const ApplicantGridList = enhance((props) => {
  const {
    filter,
    createDialog,
    updateDialog,
    confirmDialog,
    listData,
    detailData,
    confirmMailDialog,
    classes
  } = props

  const actionButtons = (id) => {
    return (
      <div className={classes.actionButtons}>
        <ToolTip position="bottom" text={t('Изменить')}>
          <IconButton
            disableTouchRipple={true}
            touch={true}
            onClick={() => { updateDialog.handleOpenUpdateDialog(id) }}>
            <EditIcon />
          </IconButton>
        </ToolTip>
        <ToolTip position="bottom" text={t('Удалить')}>
          <IconButton
            disableTouchRipple={true}
            onClick={() => { confirmDialog.handleOpenConfirmDialog(id) }}
            touch={true}>
            <EditIcon />
          </IconButton>
        </ToolTip>
      </div>
    )
  }

  const detail = (
    <ApplicantDetails
      initialValues={updateDialog.initialValues}
      filter={filter}
      key={_.get(detailData, 'id')}
      updateLoading={_.get(updateDialog, 'updateLoading')}
      handleSubmitUpdateDialog={updateDialog.handleSubmitUpdateDialog}
      data={_.get(detailData, 'data') || {}}
      loading={_.get(detailData, 'detailLoading')}
      actionButtons={actionButtons}
    />
  )

  const applicantList = _.map(_.get(listData, 'data'), (item, index) => {
    const id = _.toNumber(_.get(item, 'id'))
    //    Const status = fp.flow(findItem, fp.get('name'))
    const firstName = _.get(item, 'firstName')
    const lastName = _.get(item, 'lastName')
    const resumeNum = _.get(item, 'resumeNum')
    const modifiedDate = dateFormat(_.get(item, 'modifiedAt'))
    const createdDate = dateFormat(_.get(item, 'createdAt'))
    const balance = _.get(item, 'balance')
    const name = firstName + ' ' + lastName
    return (
      <Row key={id} className={classes.listRow}>
        <div
          onClick={() => replaceUrl(filter, sprintf(ROUTES.APPLICANT_ITEM_PATH, id), {})}
          className={classes.link}/>
        <Col xs={3}>{name}</Col>
        <Col xs={2}>{resumeNum}</Col>
        <Col xs={3}>{modifiedDate}</Col>
        <Col xs={2}>{createdDate}</Col>
        <Col xs={2}>{balance}
          <div className={classes.iconBtn}>
            <IconMenu
              menuItemStyle={{fontSize: '13px'}}
              className={classes.iconBtn}
              iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
            >
              <MenuItem
                primaryText={t('изменить')}
                leftIcon={<EditIcon/>}
                onClick={() => { updateDialog.handleOpenUpdateDialog(id) }}/>
              <MenuItem
                primaryText={t('одобрить')}
                leftIcon={<DoneIcon/>}/>
              <MenuItem
                primaryText={t('заблокировать')}
                leftIcon={<BlockIcon/>}/>
            </IconMenu>
          </div>
        </Col>

      </Row>
    )
  })

  const list = {
    header: listHeader,
    list: applicantList,
    loading: _.get(listData, 'listLoading')
  }

  const addButton = (
    <div className={classes.addButtonWrapper}>
      <FlatButton
        backgroundColor="#fff"
        labelStyle={{textTransform: 'none', paddingLeft: '2px', color: '#12aaeb'}}
        className={classes.addButton}
        label={t('добавить соискателя')}
        onClick={createDialog.onOpenCreateDialog}
        icon={<ContentAdd color="#12aaeb"/>}>
      </FlatButton>
    </div>
  )

  const currentDetail = _.find(_.get(listData, 'data'), {'id': _.toInteger(_.get(detailData, 'id'))})
  const currentName = `${_.get(currentDetail, 'firstName')} ${_.get(currentDetail, 'lastName')}`
  return (
    <Container>
      <div className={classes.wrapper}>
        <SubMenu url={ROUTES.APPLICANT_LIST_URL}/>
        <ApplicationTabs/>
        <GridList
          filter={filter}
          list={list}
          //          ListShadow={false}
          detail={detail}
          actionsDialog={<span/>}
          addButton={addButton}
        />
      </div>

      {createDialog.openCreateDialog &&
      <ApplicantCreateDialog
        onOpenMailDialog={confirmDialog.handleOpenConfirmDialog}
        detailData={_.get(detailData, 'data')}
        initialValues={updateDialog.initialValues}
        open={createDialog.openCreateDialog}
        loading={createDialog.createLoading}
        onClose={createDialog.onCloseCreateDialog}
        onSubmit={createDialog.onSubmitCreateDialog}
        errorData={createDialog.errorData}
      />}

      {updateDialog.openUpdateDialog &&
      <ApplicantCreateDialog
        detailData={_.get(detailData, 'data')}
        initialValues={updateDialog.initialValues}
        isUpdate={true}
        open={updateDialog.openUpdateDialog}
        loading={updateDialog.updateLoading}
        onClose={updateDialog.handleCloseUpdateDialog}
        onSubmit={updateDialog.handleSubmitUpdateDialog}
        errorData={updateDialog.errorData}
      />}

      {detailData.data && <ConfirmDialog
        type="delete"
        message={currentName}
        loading={confirmDialog.confirmLoading}
        onClose={confirmDialog.handleCloseConfirmDialog}
        onSubmit={confirmDialog.handleDeleteConfirmDialog}
        open={confirmDialog.openConfirmDialog}
      />}

      {confirmMailDialog.open && <ApplicantMailDialog
        data={createDialog.createData}
        loading={confirmDialog.confirmLoading}
        onClose={confirmMailDialog.handleClose}
        onSubmit={confirmDialog.handleDeleteConfirmDialog}
        open={confirmMailDialog.open}
      />}
    </Container>
  )
})

ApplicantGridList.propTypes = {
  filter: PropTypes.object.isRequired,
  listData: PropTypes.object,
  detailData: PropTypes.object,
  createDialog: PropTypes.shape({
    createLoading: PropTypes.bool.isRequired,
    openCreateDialog: PropTypes.bool.isRequired,
    onOpenCreateDialog: PropTypes.func.isRequired,
    onCloseCreateDialog: PropTypes.func.isRequired,
    onSubmitCreateDialog: PropTypes.func.isRequired
  }).isRequired,
  confirmDialog: PropTypes.shape({
    confirmLoading: PropTypes.bool.isRequired,
    openConfirmDialog: PropTypes.bool.isRequired,
    handleOpenConfirmDialog: PropTypes.func.isRequired,
    handleCloseConfirmDialog: PropTypes.func.isRequired,
    handleDeleteConfirmDialog: PropTypes.func.isRequired
  }).isRequired,
  updateDialog: PropTypes.shape({
    updateLoading: PropTypes.bool.isRequired,
    openUpdateDialog: PropTypes.bool.isRequired,
    handleOpenUpdateDialog: PropTypes.func.isRequired,
    handleCloseUpdateDialog: PropTypes.func.isRequired,
    handleSubmitUpdateDialog: PropTypes.func.isRequired
  }).isRequired,
  filterDialog: PropTypes.shape({
    initialValues: PropTypes.object,
    filterLoading: PropTypes.bool,
    openFilterDialog: PropTypes.bool.isRequired,
    handleOpenFilterDialog: PropTypes.func.isRequired,
    handleCloseFilterDialog: PropTypes.func.isRequired,
    handleSubmitFilterDialog: PropTypes.func.isRequired
  }).isRequired
}

export default ApplicantGridList
