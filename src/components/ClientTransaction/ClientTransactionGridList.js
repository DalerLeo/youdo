import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import Paper from 'material-ui/Paper'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import ClientTransactionFilterForm from './ClientTransactionFilterForm'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'
import Accepted from 'material-ui/svg-icons/action/done-all'
import Rejected from 'material-ui/svg-icons/content/block'
import Requested from 'material-ui/svg-icons/action/schedule'
import AutoAccepted from 'material-ui/svg-icons/action/spellcheck'

const listHeader = [
    {
        sorting: false,
        name: 'icon',
        title: '',
        xs: 1
    },
    {
        sorting: true,
        name: 'comment',
        title: 'Описание',
        xs: 4
    },
    {
        sorting: true,
        name: 'date',
        title: 'Дата',
        xs: 3
    },
    {
        sorting: true,
        alignRight: true,
        name: 'amount',
        title: 'Сумма',
        xs: 3
    },
    {
        sorting: false,
        name: 'actions',
        title: '',
        xs: 1
    }
]

const iconsArray = [
    <Accepted color={'#81c784'}/>,
    <Rejected color={'#e57373'}/>,
    <Requested color={'#f0ad4e'}/>,
    <AutoAccepted color={'#12aaeb'}/>
]

const enhance = compose(
    injectSheet({
        flex: {
            display: 'flex',
            alignItems: 'center'
        },
        summaryWrapper: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 30px',
            marginBottom: '15px'
        },
        summary: {
            '& > div:first-child': {},
            '& > div:last-child': {fontSize: '17px', fontWeight: '600'},
            '&:last-child': {
                textAlign: 'right'
            }
        },
        listRow: {
            '& svg': {
                width: '20px !important',
                height: '20px !important'
            }
        }
    }),
)

const ClientTransactionGridList = enhance((props) => {
    const {
        filter,
        filterDialog,
        actionsDialog,
        confirmDialog,
        listData,
        detailData,
        classes
    } = props

    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const actions = (
        <div>
            <IconButton onTouchTap={actionsDialog.handleActionEdit}>
                <ModEditorIcon />
            </IconButton>

            <IconButton onTouchTap={actionsDialog.handleActionDelete}>
                <DeleteIcon />
            </IconButton>
        </div>
    )

    const clientTransactionFilterDialog = (
        <ClientTransactionFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const clientTransactionDetail = (
        <span>a</span>
    )

    const clientTransactionList = _.map(_.get(listData, 'data'), (item) => {
        const ZERO = 0
        const RANDOM = 3
        const id = _.get(item, 'id')
        const comment = _.get(item, 'comment')
        const type = _.get(item, 'amount') || 'N/A'
        const amount = numberFormat(_.get(item, 'amount')) || 'N/A'
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY HH:mm')
        const currency = _.get(item, ['currency', 'name']) || 'N/A'
        const status = _.get(iconsArray, _.random(RANDOM))

        return (
            <Row key={id} className={classes.listRow}>
                <Col xs={1}>{status}</Col>
                <Col xs={4}>{comment}</Col>
                <Col xs={3}>{createdDate}</Col>
                <Col xs={1}></Col>
                <Col style={{textAlign: 'right'}} className={type >= ZERO ? classes.green : classes.red} xs={3}>{amount} {currency}</Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: clientTransactionList,
        loading: _.get(listData, 'listLoading')
    }

    return (
        <Container>
            <SubMenu url={ROUTES.CLIENT_TRANSACTION_LIST_URL}/>
            <Paper zDepth={1} className={classes.summaryWrapper}>
                <div className={classes.summary}>
                    <div>Сумма принятых оплат</div>
                    <div>{numberFormat('145323', primaryCurrency)}</div>
                </div>
                <div className={classes.summary}>
                    <div>Сумма отклоненных оплат</div>
                    <div>{numberFormat('22451', primaryCurrency)}</div>
                </div>
                <div className={classes.summary}>
                    <div>Сумма ожидаемых оплат</div>
                    <div>{numberFormat('86541', primaryCurrency)}</div>
                </div>
                <div className={classes.summary}>
                    <div>Сумма автоматически принятых оплат</div>
                    <div>{numberFormat('6548', primaryCurrency)}</div>
                </div>
            </Paper>

            <GridList
                filter={filter}
                list={list}
                detail={clientTransactionDetail}
                actionsDialog={actions}
                filterDialog={clientTransactionFilterDialog}
            />

            {detailData.data && <ConfirmDialog
                type="delete"
                message={_.get(detailData, ['data', 'comment'])}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleExpenseConfirmDialog}
                open={confirmDialog.open}
            />}
        </Container>
    )
})

ClientTransactionGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    clientData: PropTypes.object,
    detailData: PropTypes.object,
    confirmDialog: PropTypes.shape({
        open: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleExpenseConfirmDialog: PropTypes.func.isRequired
    }).isRequired,
    actionsDialog: PropTypes.shape({
        handleActionEdit: PropTypes.func.isRequired,
        handleActionDelete: PropTypes.func.isRequired
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

export default ClientTransactionGridList
