import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import {Link} from 'react-router'
import sprintf from 'sprintf'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ClientDetails from './ClientDetails'
import ClientCreateDialog from './ClientCreateDialog'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import ClientFilterDialog from './ClientFilterDialog'
import Container from '../Container'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import ToolTip from '../Utils/ToolTip'
import dateFormat from '../../helpers/dateFormat'
import t from '../../helpers/translate'
const colorBlue = '#12aaeb !important'
const enhance = compose(
  injectSheet({
    addButtonWrapper: {
      position: 'absolute',
      top: '10px',
      right: '0',
      marginBottom: '0px'
    },
    actionBtn: {
      height: '48px'
    },
    wrapper: {
      color: '#333 !important',
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      '& a': {
        color: colorBlue
      }
    },
    title: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      height: '65px',
      padding: '0 30px',
      borderBottom: '1px #efefef solid'
    },
    container: {
      display: 'flex',
      width: '100%'
    },
    sides: {
      flexBasis: '27%'
    },
    leftSide: {
      extend: 'sides',
      borderRight: '1px #efefef solid',
      padding: '20px 30px'
    },
    rightSide: {
      extend: 'sides',
      borderLeft: '1px #efefef solid',
      padding: '20px 30px'
    },
    body: {
      flexBasis: '66%',
      padding: '20px 30px',
      '& .dottedList': {
        padding: '10px 0',
        '&:after': {
          left: '0.5rem',
          right: '0.5rem'
        },
        '&:first-child': {
          padding: '0 0 10px'
        },
        '&:last-child': {
          padding: '10px 0 0',
          '&:after': {
            display: 'none'
          }
        }
      }
    },
    titleLabel: {
      fontSize: '18px',
      color: '#333',
      fontWeight: '700'
    },
    titleButtons: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    bodytitle: {
      fontWeight: '600',
      marginBottom: '10px'
    },
    listRow: {
      position: 'relative',
      '& > a': {
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        top: '0',
        left: '-30px',
        right: '-30px',
        bottom: '0',
        padding: '0 30px',
        '& > div': {
          '&:first-child': {
            paddingLeft: '0'
          },
          '&:last-child': {
            paddingRight: '0'
          }
        }
      }
    },
    blacklistRow: {
      extend: 'listRow',
      background: '#eceff1',
      margin: '0 -30px !important',
      width: 'auto !important',
      padding: '0 30px',
      '& > a': {
        borderLeft: '3px #ff4747 solid',
        left: '0',
        right: '0'
      }
    }
  })
)
const ClientGridList = enhance((props) => {
  const {
    filter,
    filterDialog,
    createDialog,
    updateDialog,
    confirmDialog,
    listData,
    detailData,
    classes
  } = props
  const listHeader = [
    {
      sorting: true,
      name: 'id',
      xs: 1,
      title: 'Id'
    },
    {
      sorting: false,
      name: 'name',
      xs: 5,
      title: t('Наименование')
    },
    {
      sorting: true,
      xs: 4,
      name: 'address',
      title: t('Адрес')
    },
    {
      sorting: false,
      xs: 2,
      name: 'createdDate',
      title: t('Дата добавления')
    }
  ]

  const clientFilterDialog = (
    <ClientFilterDialog
      initialValues={filterDialog.initialValues}
      filter={filter}
      filterDialog={filterDialog}
    />
  )

  const clientDetail = (
    <ClientDetails
      key={_.get(detailData, 'id')}
      data={_.get(detailData, 'data') || {}}
      confirmDialog={confirmDialog}
      loading={_.get(detailData, 'detailLoading')}
      updateDialog={updateDialog}
      handleCloseDetail={_.get(detailData, 'handleCloseDetail')}
    />
  )

  const clientList = _.map(_.get(listData, 'data'), (item) => {
    const id = _.get(item, 'id')
    const name = _.get(item, 'name')
    const address = _.get(item, 'address')
    const inBlacklist = _.get(item, 'inBlacklist')
    const createdDate = dateFormat(_.get(item, 'createdDate'))
    return (
      <Row key={id} className={inBlacklist ? classes.blacklistRow : classes.listRow}>
        <Col xs={1}>{id}</Col>
        <Col xs={5}>{name}</Col>
        <Link to={{
          pathname: sprintf(ROUTES.CLIENT_ITEM_PATH, id),
          query: filter.getParams()
        }}/>
        <Col xs={4}>{address}</Col>
        <Col xs={2}>{createdDate}</Col>
      </Row>
    )
  })

  const list = {
    header: listHeader,
    list: clientList,
    loading: _.get(listData, 'listLoading')
  }

  return (
    <Container>
      <SubMenu url={ROUTES.CLIENT_LIST_URL}/>
      <div className={classes.addButtonWrapper}>
        <ToolTip position="left" text={t('Добавить клиента')}>
          <FloatingActionButton
            mini={true}
            zDepth={1}
            backgroundColor="#12aaeb"
            onClick={createDialog.handleOpenCreateDialog}>
            <ContentAdd />
          </FloatingActionButton>
        </ToolTip>
      </div>

      <GridList
        filter={filter}
        filterDialog={clientFilterDialog}
        list={list}
        detail={clientDetail}
      />

      <ClientCreateDialog
        open={createDialog.openCreateDialog}
        loading={createDialog.createLoading}
        onClose={createDialog.handleCloseCreateDialog}
        onSubmit={createDialog.handleSubmitCreateDialog}
      />

      <ClientCreateDialog
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
        onClose={confirmDialog.handleCloseConfirmDialog}
        onSubmit={confirmDialog.handleSendConfirmDialog}
        open={confirmDialog.openConfirmDialog}
      />}
    </Container>
  )
})

ClientGridList.propTypes = {
  filter: PropTypes.object.isRequired,
  listData: PropTypes.object,
  detailData: PropTypes.object,
  tabData: PropTypes.object.isRequired,
  createDialog: PropTypes.shape({
    createLoading: PropTypes.bool.isRequired,
    openCreateDialog: PropTypes.bool.isRequired,
    handleOpenCreateDialog: PropTypes.func.isRequired,
    handleCloseCreateDialog: PropTypes.func.isRequired,
    handleSubmitCreateDialog: PropTypes.func.isRequired
  }).isRequired,
  confirmDialog: PropTypes.shape({
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

export default ClientGridList
