import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import PricesFilterForm from './PricesFilterForm'
import PricesDetails from './PricesDetails'
import PricesCreateDialog from './PricesCreateDialog'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Tooltip from '../ToolTip'
import dateFormat from '../../helpers/dateFormat'

const listHeader = [
    {
        sorting: true,
        name: 'id',
        title: '№ акции',
        xs: 1
    },
    {
        sorting: false,
        name: 'name',
        title: 'Наименование',
        xs: 5
    },
    {
        sorting: true,
        name: 'beginDate',
        title: 'Дата начала',
        xs: 2
    },
    {
        sorting: true,
        name: 'tillDate',
        title: 'Дата завершения',
        xs: 2
    },
    {
        sorting: false,
        name: 'discount',
        title: 'Мар. акция',
        xs: 2
    }
]

const enhance = compose(
    injectSheet({
        addButton: {
            '& button': {
                backgroundColor: '#275482 !important'
            }
        },
        addButtonWrapper: {
            position: 'absolute',
            top: '10px',
            right: '0',
            marginBottom: '0px'
        },
        dot: {
            display: 'inline-block',
            height: '7px',
            width: '7px',
            borderRadius: '50%',
            marginRight: '6px'
        },
        success: {
            extend: 'dot',
            backgroundColor: '#81c784'
        },
        begin: {
            extend: 'dot',
            backgroundColor: '#f0ad4e'
        },
        error: {
            extend: 'dot',
            backgroundColor: '#e57373'
        },
        waiting: {
            extend: 'dot',
            backgroundColor: '#64b5f6'
        }
    })
)

const PricesGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        filterDialog,
        confirmDialog,
        listData,
        detailData,
        classes
    } = props

    const pricesFilterDialog = (
        <PricesFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const pricesDetail = (
        <PricesDetails
            key={_.get(detailData, 'id')}
            data={_.get(detailData, 'data') || {}}
            confirmDialog={confirmDialog}
            updateDialog={updateDialog}
            loading={_.get(detailData, 'detailLoading')}
            handleCloseDetail={_.get(detailData, 'handleCloseDetail')}
        />
    )

    const pricesList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const beginDate = dateFormat(_.get(item, 'beginDate'))
        const tillDate = dateFormat(_.get(item, 'tillDate'))
        const type = _.get(item, 'type')
        const discount = _.toNumber(_.get(item, 'discount'))

        return (
            <Row key={id} style={{cursor: 'pointer'}} onTouchTap = {() => { listData.handleClickDetail(id) }}>
                <Col xs={1}>{id}</Col>
                <Col xs={5} >{name}</Col>
                <Col xs={2}>{beginDate}</Col>
                <Col xs={2}>{tillDate}</Col>
                <Col xs={2}>
                    {(type === 'bonus') ? <span>Бонус</span> : <span>Скидка - {discount}%</span>}
                </Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: pricesList,
        loading: _.get(listData, 'listLoading')
    }

    return (
        <Container>
            <SubMenu url={ROUTES.PRICES_LIST_URL}/>

            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Добавить акцию">
                    <FloatingActionButton
                        mini={true}
                        className={classes.addButton}
                        onTouchTap={createDialog.handleOpenCreateDialog}>
                        <ContentAdd />
                    </FloatingActionButton>
                </Tooltip>
            </div>

            <GridList
                filter={filter}
                list={list}
                detail={pricesDetail}
                filterDialog={pricesFilterDialog}
            />

            <PricesCreateDialog
                openDialog={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />

            <PricesCreateDialog
                isUpdate={true}
                initialValues={updateDialog.initialValues}
                openDialog={updateDialog.openUpdateDialog}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
            />

            {detailData.id && <ConfirmDialog
                type="delete"
                message={_.get(detailData, ['data', 'name'])}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSendConfirmDialog}
                open={confirmDialog.openConfirmDialog}
            />}

        </Container>
    )
})

PricesGridList.propTypes = {
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
    filterDialog: PropTypes.shape({
        initialValues: PropTypes.object,
        filterLoading: PropTypes.bool,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired
}

export default PricesGridList
