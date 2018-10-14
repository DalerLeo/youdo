import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import ContentAdd from 'material-ui/svg-icons/content/add'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList/index'
import Container from '../Container/index'
import PlanCreateDialog from './PlanCreateDialog'
import ConfirmDialog from '../ConfirmDialog/index'
import ToolTip from '../Utils/ToolTip'
import SubMenu from '../SubMenu'
import t from '../../helpers/translate'
import dateFormat from '../../helpers/dateFormat'
import numberFormat from '../../helpers/numberFormat'
import IconButton from 'material-ui/IconButton'
import PlanFilterForm from './PlanFilterForm'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import defaultsPropTypes from '../../constants/propTypes'
import {Tabs, Tab} from 'material-ui/Tabs'
import {hashHistory} from 'react-router'
import Edit from 'material-ui/svg-icons/image/edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete'

const listHeader = [
  {
    sorting: false,
    name: 'name',
    title: 'ФИО',
    xs: 2
  },
  {
    sorting: false,
    name: 'amount',
    title: 'Сумма плана',
    xs: 2
  },
  {
    sorting: false,
    name: 'modified_date',
    title: 'Кол-во обработанных заказов',
    xs: 3
  },
  {
    sorting: false,
    name: 'sales_amount',
    title: 'Сумма от продаж',
    xs: 2
  },
  {
    sorting: false,
    name: 'till_end',
    title: 'До выполнения плана',
    xs: 2
  },
  {
    sorting: false,
    name: '',
    title: '',
    xs: 1
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
      },
      '&:hover > div:last-child > div ': {
        opacity: '1'
      }
    },
    tabs: {
      marginBottom: '20px',
      width: '100%',
      '& > div': {
        boxSizing: 'content-box',
        width: '100% !important',
        '&:first-child': {
          boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
          borderRadius: '2px',
          height: '52px',
          alignItems: 'center'
        },
        '&:nth-child(2)': {
          marginTop: '-3px'
        },
        '&:last-child': {
          width: '100% !important',
          padding: '0'
        }
      },
      '& button div div': {
        textTransform: 'initial',
        height: '52px !important'
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
    },
    iconBtn: {
      display: 'flex',
      justifyContent: 'flex-end',
      opacity: '0',
      transition: 'all 200ms ease-out'
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
  const tabbed = filter.getParam('status')

  const confirmDetails = _.get(detailData, 'data.id')

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
    const fullName = _.get(item, 'manager.fullName')
    const salesAmount = numberFormat(_.get(item, 'salesAmount'), 'сум')
    const modifiedDate = dateFormat(_.get(item, 'toDate'))

    return (
      <Row key={id} className={classes.listRow}>
        <Col xs={2}>{fullName}</Col>
        <Col xs={2}>{salesAmount}</Col>
        <Col xs={3}>{modifiedDate}</Col>
        <Col xs={2}>{salesAmount}</Col>
        <Col xs={2}>{modifiedDate}</Col>
        <Col xs={1}>
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
    list: planList,
    loading: _.get(listData, 'listLoading')
  }

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

        <Tabs
          inkBarStyle={{backgroundColor: '#12aaeb', height: '3px'}}
          tabItemContainerStyle={{backgroundColor: '#fff', color: '#333'}}
          className={classes.tabs}
          value={tabbed}
          onChange={status => hashHistory.push({pathname: '/plan', query: {status}})}>
          <Tab label={'Текущий план'} value={'active'}/>
          <Tab label={'Архив'} value={'paid'}/>
        </Tabs>

        <GridList
          filter={filter}
          filterDialog={planFilterDialog}
          list={list}
          detail={<span/>}
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
