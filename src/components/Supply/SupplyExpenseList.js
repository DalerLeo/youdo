import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import DeleteDialog from '../DeleteDialog'
import ConfirmDialog from '../ConfirmDialog'
import injectSheet from 'react-jss'
import {compose} from 'recompose'

const listHeader = [
    {
        sorting: true,
        name: 'id',
        title: '№',
        xs: 1
    },
    {
        sorting: true,
        name: 'comment',
        title: 'Поставщик',
        xs: 5
    },
    {
        sorting: true,
        name: 'amount',
        title: 'Склад',
        xs: 3
    },
    {
        sorting: true,
        name: 'currency',
        title: 'Дата поставки',
        xs: 2
    },
    {
        sorting: true,
        name: 'actions',
        title: 'Цена заказа',
        xs: 1
    }
]

const enhance = compose(
    injectSheet({
        addButton: {
            '& button': {
                backgroundColor: '#275482 !important'
            }
        }
    })
)

const SupplyExpenseGridList = enhance((props) => {
    const {
        filter,
        updateDialog,
        confirmDialog,
        deleteDialog,
        listData,
        detailData,
        classes,
    } = props

    const supplyExpenseExpenseList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const comment = _.get(item, 'comment')
        const amount = _.get(item, 'amount') || 'N/A'
        const currency = _.get(item, 'currency') || 'N/A'

        return (
            <Row key={id}>
                <Col xs={1}>{id}</Col>
                <Col xs={5}>{comment}</Col>
                <Col xs={3}>{amount}</Col>
                <Col xs={2}>{currency}</Col>
                <Col xs={1}>
                    <IconButton onTouchTap={updateDialog.handleOpenUpdateDialog(id) }>
                        <ModEditorIcon />
                    </IconButton>
                    <IconButton onTouchTap={confirmDialog.handleOpenConfirmDialog}>
                        <DeleteIcon />
                    </IconButton>
                </Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: supplyExpenseExpenseList,
        loading: _.get(listData, 'listLoading')
    }

    return (
        <Container>
            <GridList
                list={list}
            />

            <DeleteDialog
                filter={filter}
                open={deleteDialog.openDeleteDialog}
                onClose={deleteDialog.handleCloseDeleteDialog}
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

SupplyExpenseGridList.propTypes = {
    listData: PropTypes.object,
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
    deleteDialog: PropTypes.shape({
        openDeleteDialog: PropTypes.bool.isRequired,
        handleOpenDeleteDialog: PropTypes.func.isRequired,
        handleCloseDeleteDialog: PropTypes.func.isRequired
    }).isRequired,
    updateDialog: PropTypes.shape({
        updateLoading: PropTypes.bool.isRequired,
        openUpdateDialog: PropTypes.bool.isRequired,
        handleOpenUpdateDialog: PropTypes.func.isRequired,
        handleCloseUpdateDialog: PropTypes.func.isRequired,
        handleSubmitUpdateDialog: PropTypes.func.isRequired
    }),
    actionsDialog: PropTypes.shape({
        handleActionEdit: PropTypes.func.isRequired,
        handleActionDelete: PropTypes.func.isRequired
    }).isRequired
}

export default SupplyExpenseGridList
