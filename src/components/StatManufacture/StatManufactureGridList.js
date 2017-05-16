import _ from 'lodash'
import injectSheet from 'react-jss'
import React from 'react'
import {compose} from 'recompose'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import Paper from 'material-ui/Paper'
import {Row, Col} from 'react-flexbox-grid'
import GridList from '../GridList'
import Container from '../Container'
import StatManufactureOrderDetails from './StatManufactureOrderDetails'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import * as ROUTES from '../../constants/routes'
import StatManufactureCreateDialog from './StatManufactureCreateDialog'
import Glue from '../Images/glue.png'
import Cylindrical from '../Images/cylindrical.png'
import Press from '../Images/press.png'
import Cut from '../Images/cut.png'
import Badge from '../Images/badge.png'

const listHeader = [
    {
        sorting: true,
        name: 'name',
        xs: 6,
        title: 'Наименование'
    },
    {
        sorting: true,
        name: 'sum',
        xs: 3,
        title: 'Количество'
    },
    {
        sorting: true,
        xs: 3,
        name: 'time',
        title: 'Эффективность'
    }
]
const enhance = compose(
    injectSheet({
        infoBlock: {
            width: '25%',
            display: 'inline-block',
            color: '#999',
            fontWeight: '400',
            fontSize: '13px',
            lineHeight: '1.3',
            borderLeft: '1px solid #efefef',
            padding: '12px 15px 12px 15px',
            alignItems: 'center',
            '& span': {
                color: '#333',
                fontWeight: '700',
                fontSize: '24px !important'
            },
            '&:first-child': {
                border: 'none'
            }
        },
        typeListStock: {
            width: '100px',
            height: 'calc(100% + 16px)',
            marginTop: '-8px',
            float: 'left',
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            borderRight: '1px solid #fff',
            backgroundColor: '#eceff5',
            '& a': {
                display: 'block',
                width: '100%',
                fontWeight: '600'
            },
            '& a.active': {
                color: '#333',
                cursor: 'text'
            },
            '&:last-child': {
                border: 'none'
            },
            '&:first-child': {

                marginLeft: '-38px'
            }
        },
        titleLabel: {
            fontSize: '18px',
            color: '#333',
            fontWeight: '700'
        },
        bodyTitle: {
            fontWeight: '600',
            marginBottom: '10px'
        },
        link: {
            color: '#12aaeb !important',
            borderBottom: '1px dashed',
            fontWeight: '400 !important'
        },
        loader: {
            background: '#fff',
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        manufactures: {
            margin: '0 -28px',
            padding: '20px 28px 0',
            borderBottom: '1px #e0e0e0 solid'
        },
        tabWrapper: {
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between'
        },
        tab: {
            cursor: 'pointer',
            padding: '20px',
            height: '100%'
        },
        activeTab: {
            paddingBottom: '20px',
            flexBasis: '20%',
            marginRight: '15px',
            borderBottom: '3px transparent solid',
            '&:last-child': {
                margin: '0'
            }
        },
        tabTitle: {
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
            '& img': {
                width: '24px',
                marginRight: '10px'
            }
        },
        statTitle: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 'bold',
            padding: '20px 0',
            borderBottom: '1px #e0e0e0 solid',
            '& a': {
                fontWeight: '600'
            }
        },
        diagram: {
            padding: '20px 0'
        }
    }),
)

const StatManufactureGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        confirmDialog,
        listData,
        detailData,
        classes,
        orderData
    } = props

    const actions = (
        <div>

        </div>
    )
    const detailId = _.get(detailData, 'id')
    const glue = 3
    const cylindrical = 4
    const press = 6
    const cut = 7
    const badge = 8
    const manufactureList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const manufName = _.get(item, 'name')
        return (
        <div className={classes.activeTab} style={ detailId === id ? {backgroundColor: '#f2f5f8', borderBottom: '3px #12aaeb solid'} : {}}>
            <Paper key={id} zDepth={1} className={classes.tab}
                   style={ detailId === id ? {backgroundColor: '#f2f5f8', cursor: 'auto'} : {}}
                   onClick={() => {
                       listData.handleClickItem(id)
                   }}>
                <div className={classes.tabContent}>
                    <div className={classes.tabTitle}>
                        { id === glue ? <img src={Glue}/> : (
                            id === cylindrical ? <img src={Cylindrical}/> : (
                                id === press ? <img src={Press}/> : (
                                    id === cut ? <img src={Cut}/> : (
                                        id === badge ? <img src={Badge}/> : '')
                                )
                            )
                        )}
                        {manufName}
                    </div>
                    <div className={classes.tabText}>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad corporis et quibusdam quod repellendus tempora.
                    </div>
                </div>
            </Paper>
        </div>
        )
    })

    const statManufactureList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = 'Наименование продукта'
        const amount = '1000 шт'
        const efficency = '88%'
        return (
            <Row key={id}>
                <Col xs={6}>{name}</Col>
                <Col xs={3}>{amount}</Col>
                <Col xs={3}>
                    <a className={classes.link} onClick={createDialog.handleOpenCreateDialog}>{efficency}</a>
                </Col>
            </Row>
        )
    })
    const manufName = _.get(detailData, ['data', 'name'])

    const list = {
        header: listHeader,
        list: statManufactureList,
        loading: _.get(listData, 'listLoading')
    }
    return (
        <Container>
            <SubMenu url={ROUTES.STAT_MANUFACTURE_LIST_URL}/>
            <div className={classes.manufactures}>
                <div className={classes.tabWrapper}>
                    {manufactureList}
                </div>
            </div>

            <div className={classes.stats}>
                <div className={classes.statTitle}>
                    <div>{manufName}</div>
                    <div><a>6 мая 2017 г. - 12 мая 2017 г.</a></div>
                </div>
                <Row className={classes.diagram}>
                    <Col xs={9}>
                        312z
                    </Col>
                    <Col xs={3}>1456</Col>
                </Row>
            </div>
            <GridList
                key={_.get(detailData, 'id')}
                filter={filter}
                list={list}
                actionsDialog={actions}
            />
            <StatManufactureCreateDialog
                isUpdate={true}
                initialValues={updateDialog.initialValues}
                open={updateDialog.openUpdateDialog}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
            />

            <StatManufactureCreateDialog
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />

            <Dialog
                open={_.get(orderData, 'orderDetailOpen')}
                modal={true}
                onRequestClose={orderData.handleOrderDetailClose}
                bodyClassName={classes.popUp}
                autoScrollBodyContent={true}>
                <StatManufactureOrderDetails
                    key={_.get(orderData, 'id')}
                    data={_.get(orderData, 'orderDetail') || {}}
                    loading={_.get(orderData, 'detailLoading')}
                    handleOrderClick={orderData.handleOrderClick}
                    close={orderData.handleOrderDetailClose}
                />
            </Dialog>

            {detailData.data && <ConfirmDialog
                type="delete"
                message="adfdasf"
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSendConfirmDialog}
                open={confirmDialog.openConfirmDialog}
            />}
        </Container>
    )
})

StatManufactureGridList.propTypes = {
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
    }).isRequired,
    orderData: PropTypes.object
}

export default StatManufactureGridList
