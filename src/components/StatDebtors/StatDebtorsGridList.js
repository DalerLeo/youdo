import _ from 'lodash'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import GridList from '../GridList'
import Container from '../Container'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import {compose} from 'recompose'
import PropTypes from 'prop-types'
import * as ROUTES from '../../constants/routes'
import StatDebtorsCreateDialog from './StatDebtorsCreateDialog'
import sprintf from 'sprintf'
import injectSheet from 'react-jss'
import MainStyles from '../Styles/MainStyles'
import {Link} from 'react-router'
import StatDebtorsFilterForm from './StatDebtorsFilterForm'
import StatDebtorsDetail from './StatDebtorsDetail'

const listHeader = [
    {
        sorting: true,
        name: 'name',
        xs: 6,
        title: 'Клиент'
    },
    {
        sorting: true,
        name: 'sum',
        xs: 3,
        title: 'Сумма долга'
    },
    {
        sorting: true,
        xs: 3,
        name: 'time',
        title: 'Прошло дней'
    }
]

const enhance = compose(
    injectSheet(_.merge(MainStyles, {
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
        }
    })),
)

const StatDebtorsGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        confirmDialog,
        filterDialog,
        listData,
        detailData,
        classes,
        orderData
    } = props

    const actions = (
        <div>

        </div>
    )

    const statDebtorsFilterDialog = (
        <StatDebtorsFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const statDebtorsList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = 'Наименование фирмы клиента или его имя'
        const debt = '3 000 000 UZS'
        const time = '25 дней'
        return (
            <Row key={id}>
                <Col xs={6}>
                    <Link to={{
                        pathname: sprintf(ROUTES.STATDEBTORS_ITEM_PATH, id),
                        query: filter.getParams()
                    }}>{name}</Link>
                </Col>
                <Col xs={3}>{debt}</Col>
                <Col xs={3}>{time}</Col>
            </Row>
        )
    })
    const statDebtorsDetail = (
        <StatDebtorsDetail
            data={_.get(orderData, 'orderList')}
            loding={_.get(orderData, 'orderLoading')}
        />
    )

    const list = {
        header: listHeader,
        list: statDebtorsList,
        loading: _.get(listData, 'listLoading')
    }
    return (
        <Container>
            <SubMenu url={ROUTES.STATDEBTORS_LIST_URL}/>
            <Row style={{margin: '0 0 20px', padding: '8px 30px', background: '#fff', boxShadow: 'rgba(0, 0, 0, 0.1) 0 3px 10px'}}>
                <Col xs={3}>
                    &nbsp;
                </Col>
                <Col xs={9} style={{textAlign: 'right'}}>
                    <div className={classes.infoBlock}>
                        Всего должников:<br />
                        <span>100</span>
                    </div>
                    <div className={classes.infoBlock}>
                        Общий долг:<br />
                        <span>1 000 000 UZS</span>
                    </div>
                </Col>
            </Row>

            <GridList
                filter={filter}
                filterDialog={statDebtorsFilterDialog}
                list={list}
                detail={statDebtorsDetail}
                actionsDialog={actions}
            />
            <StatDebtorsCreateDialog
                isUpdate={true}
                initialValues={updateDialog.initialValues}
                open={updateDialog.openUpdateDialog}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
            />

            <StatDebtorsCreateDialog
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />

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

StatDebtorsGridList.propTypes = {
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

export default StatDebtorsGridList
