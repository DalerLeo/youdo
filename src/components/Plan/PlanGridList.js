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
import PlanCreateDialog from './PlanCreateDialog'
import PlanDetails from './PlanDetails'
import ConfirmDialog from '../ConfirmDialog/index'
import ToolTip from '../ToolTip'
import SubMenu from '../SubMenu'
import sprintf from 'sprintf'
import t from '../../helpers/translate'
import dateFormat from '../../helpers/dateFormat'
import {replaceUrl} from '../../helpers/changeUrl'
import IconButton from 'material-ui/IconButton'
import EditIcon from 'material-ui/svg-icons/content/create'
import PlanFilterForm from './PlanFilterForm'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import defaultsPropTypes from '../../constants/propTypes'

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
    },
    addButtonWrapper: {
      position: 'absolute',
      top: '10px',
      right: '0',
      marginBottom: '0px'
    }

  })
)

const PlanGridList = enhance((props) => {
  const {
    filter,
    createDialog,
    updateDialog,
    confirmDialog,
    listData,
    detailData,
    filterDialog,
    classes
  } = props

  const confirmDetails = _.get(detailData, 'data.id')
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
            onClick={confirmDialog.onOpen}
            touch={true}>
            <EditIcon />
          </IconButton>
        </ToolTip>
      </div>
    )
  }

  const detail = (
    <PlanDetails
      initialValues={updateDialog.initialValues}
      filter={filter}
      key={_.get(detailData, 'id')}
      updateLoading={_.get(updateDialog, 'updateLoading')}
      handleSubmitUpdateDialog={updateDialog.handleSubmitUpdateDialog}
      data={_.get(detailData, 'data') || {}}
      loading={_.get(detailData, 'detailLoading')}
      onDeleteOpen={confirmDialog.onOpen}
      onUpdateOpen={updateDialog.onOpen}
      actionButtons={actionButtons}
    />
  )

  const planFilterDialog = (
    <PlanFilterForm
      filter={filter}
      filterDialog={filterDialog}
      initialValues={filterDialog.initialValues}
    />
  )

  const planList = _.map(_.get(listData, 'data'), (item, index) => {
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
          onClick={() => replaceUrl(filter, sprintf(ROUTES.PLAN_ITEM_PATH, id), {})}
          className={classes.link}/>
        <Col xs={3}>{name}</Col>
        <Col xs={2}>{resumeNum}</Col>
        <Col xs={3}>{modifiedDate}</Col>
        <Col xs={2}>{createdDate}</Col>
        <Col xs={2}>{balance}
        </Col>

      </Row>
    )
  })

  const list = {
    header: listHeader,
    list: planList,
    loading: _.get(listData, 'listLoading')
  }

  const addButton = (
    <div className={classes.addButtonWrapper}>
      <FlatButton
        backgroundColor="#fff"
        labelStyle={{textTransform: 'none', paddingLeft: '2px', color: '#12aaeb'}}
        className={classes.addButton}
        label={t('добавить соискателя')}
        onClick={createDialog.onOpen}
        icon={<ContentAdd color="#12aaeb"/>}>
      </FlatButton>
    </div>
  )

  return (
    <Container>
      <div className={classes.wrapper}>
        <SubMenu url={ROUTES.PLAN_LIST_URL}/>
        <div className={classes.addButtonWrapper}>
          <ToolTip position="left" text={'добавить соискателя'}>
            <FloatingActionButton
              mini={true}
              zDepth={1}
              backgroundColor="#12aaeb"
              onClick={createDialog.onOpen}>
              <ContentAdd/>
            </FloatingActionButton>
          </ToolTip>
        </div>

        <GridList
          filter={filter}
          filterDialog={planFilterDialog}
          list={list}
          detail={detail}
          actionsDialog={<span/>}
          addButton={addButton}
        />
      </div>

      {createDialog.open &&
      <PlanCreateDialog
        detailData={_.get(detailData, 'data')}
        initialValues={updateDialog.initialValues}
        open={createDialog.open}
        loading={createDialog.loading}
        onClose={createDialog.onClose}
        onSubmit={createDialog.onSubmit}
        errorData={createDialog.errorData}
      />}

      {updateDialog.open &&
      <PlanCreateDialog
        detailData={_.get(detailData, 'data')}
        initialValues={updateDialog.initialValues}
        isUpdate={true}
        open={updateDialog.open}
        loading={updateDialog.loading}
        onClose={updateDialog.onClose}
        onSubmit={updateDialog.onSubmit}
        errorData={updateDialog.errorData}
      />}

      {detailData.data &&
      <ConfirmDialog
        type="delete"
        message={confirmDetails}
        loading={confirmDialog.confirmLoading}
        onClose={confirmDialog.onClose}
        onSubmit={confirmDialog.onSubmit}
        open={confirmDialog.open}
      />}

    </Container>
  )
})

PlanGridList.propTypes = {
  filter: PropTypes.object.isRequired,
  listData: PropTypes.object,
  detailData: PropTypes.object,
  createDialog: PropTypes.shape({
    ...defaultsPropTypes
  }).isRequired,
  confirmDialog: PropTypes.shape({
    ...defaultsPropTypes
  }).isRequired,
  updateDialog: PropTypes.shape({
    ...defaultsPropTypes,
    initialValues: PropTypes.object
  }).isRequired,
  filterDialog: PropTypes.shape({
    ...defaultsPropTypes,
    initialValues: PropTypes.object
  }).isRequired
}

export default PlanGridList
