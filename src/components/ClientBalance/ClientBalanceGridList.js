import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import ClientBlanceFilterForm from './ClientBalanceFilterForm'
import ClientBlanceCreateDialog from './ClientBalanceCreateDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import AddPayment from 'material-ui/svg-icons/av/playlist-add-check'

const listHeader = [
    {
        sorting: true,
        name: 'client',
        title: 'Клиент',
        xs: 3
    },
    {
        sorting: true,
        name: 'created_date',
        title: 'Дата созданияt',
        xs: 2
    },
    {
        sorting: true,
        name: 'number_of_orders',
        title: 'Кол-во заказов',
        xs: 4
    },
    {
        sorting: true,
        name: 'balance',
        title: 'Баланс',
        xs: 3
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
        }
    })
)

const iconStyle = {
    icon: {
        color: '#12aaeb',
        width: 24,
        height: 24
    },
    button: {
        width: 48,
        height: 48,
        padding: 0
    }
}

const ClientBlanceGridList = enhance((props) => {
    const {
        filter,
        infoDialog,
        filterDialog,
        listData,
        detailData
    } = props

    const clientBalanceFilterDialog = (
        <ClientBlanceFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const clientBalanceDetail = (
        <span>a</span>
    )
    const clientBalanceList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
        const address = _.get(item, 'address')
        const clientName = _.get(item, 'name')
        return (
            <Row key={id}>
                <Col xs={3}>{clientName}</Col>
                <Col xs={2}>{createdDate}</Col>
                <Col xs={4}>{id}</Col>
                <Col xs={2}>{address}</Col>
                <Col xs={1} style={{textAlign: 'right', padding: '0'}}>
                    <IconButton
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}
                        touch={true}
                        onTouchTap={() => { infoDialog.handleOpenInfoDialog(id) }}>
                        <AddPayment />
                    </IconButton>
                </Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: clientBalanceList,
        loading: _.get(listData, 'listLoading')
    }

    return (
        <Container>
            <SubMenu url={ROUTES.PENDING_EXPENSES_LIST_URL}/>

            <GridList
                filter={filter}
                list={list}
                detail={clientBalanceDetail}
                filterDialog={clientBalanceFilterDialog}
            />

            <ClientBlanceCreateDialog
                open={infoDialog.openInfoDialog}
                detailData={detailData}
                onClose={infoDialog.handleCloseInfoDialog}
                filter={filter}
            />
        </Container>
    )
})

ClientBlanceGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    infoDialog: PropTypes.shape({
        updateLoading: PropTypes.bool.isRequired,
        openInfoDialog: PropTypes.bool.isRequired,
        handleOpenInfoDialog: PropTypes.func.isRequired,
        handleCloseInfoDialog: PropTypes.func.isRequired
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

export default ClientBlanceGridList
