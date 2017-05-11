import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import * as ROUTES from '../../constants/routes'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import Paper from 'material-ui/Paper'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Edit from 'material-ui/svg-icons/image/edit'
import CurrencyCreateDialog from './CurrencyCreateDialog'
import SetCurrencyDialog from './SetCurrencyDialog'
import PrimaryCurrencyDialog from './PrimaryCurrencyDialog'
import SubMenu from '../SubMenu'
import ConfirmDialog from '../ConfirmDialog'
import GridList from '../GridList'
import Container from '../Container'
import Tooltip from '../ToolTip'
import InfoIcon from '../InfoIcon'

const listHeader = [
    {
        name: '',
        xs: 1,
        title: ''
    },
    {
        sorting: true,
        name: 'name',
        xs: 2,
        title: 'Аббревиатура'
    },
    {
        sorting: true,
        name: 'name',
        xs: 2,
        title: 'Курс'
    },
    {
        sorting: true,
        xs: 2,
        name: 'created_date',
        title: 'Дата обновления'
    },
    {
        sorting: false,
        xs: 1,
        name: 'actions',
        title: ''
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
        semibold: {
            fontWeight: '600'
        },
        editContent: {
            width: '100%',
            backgroundColor: '#fff',
            color: '#333',
            padding: '20px 30px',
            boxSizing: 'border-box',
            marginBottom: '30px',
            '&>div': {
                marginBottom: '10px',
                '&:last-child': {
                    margin: '0'
                }
            }
        },
        information: {
            display: 'flex',
            alignItems: 'center'
        },
        link: {
            color: '#12aaeb !important',
            borderBottom: '1px dashed #12aaeb',
            fontWeight: '600'
        }
    })
)
const iconStyle = {
    icon: {
        color: '#666',
        width: 24,
        height: 24
    },
    button: {
        width: 48,
        height: 48,
        padding: 0
    }
}

const tooltipPosition = 'bottom-center'

const CurrencyGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        primaryDialog,
        actionsDialog,
        confirmDialog,
        listData,
        detailData,
        classes,

        setCurrencyUpdateDialog,
        currencyData
    } = props

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

    const currencyDetail = (
        <span>a</span>
    )

    const currentCurrency = _.get(primaryDialog.primaryCurrency, 'name')

    const currencyList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
        return (
            <Row key={id}>
                <Col xs={1}></Col>
                <Col xs={2}>{name}</Col>
                <Col xs={2}>1 {currentCurrency} = 8050 {name}</Col>
                <Col xs={2}>{createdDate}</Col>
                <Col xs={2}><a onClick={() => { setCurrencyUpdateDialog.handleOpenSetCurrencyDialog(id) }} className={classes.link}>Установить курс</a></Col>
                <Col xs={3} style={{textAlign: 'right'}}>
                    <div className={classes.titleButtons}>
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            disableTouchRipple={true}
                            onTouchTap={() => { updateDialog.handleOpenUpdateDialog(id) }}
                            tooltipPosition={tooltipPosition}
                            tooltip="Изменить">
                            <Edit />
                        </IconButton>
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            disableTouchRipple={true}
                            onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(id) }}
                            tooltipPosition={tooltipPosition}
                            tooltip="Удалить">
                            <DeleteIcon />
                        </IconButton>
                    </div>
                </Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: currencyList,
        loading: _.get(listData, 'listLoading')
    }

    return (
        <Container>
            <SubMenu url={ROUTES.CURRENCY_LIST_URL}/>
            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Добавить валюту">
                    <FloatingActionButton
                        mini={true}
                        className={classes.addButton}
                        onTouchTap={createDialog.handleOpenCreateDialog}>
                        <ContentAdd />
                    </FloatingActionButton>
                </Tooltip>
            </div>

            <Paper zDepth={2}>
                <div className={classes.editContent}>
                    <div className={classes.semibold}>Основная валюта</div>
                    <div className={classes.information}>
                        <div style={{marginRight: '10px'}}>Выбранная валюта: <span className={classes.semibold}>{currentCurrency}</span></div>
                        <a className={classes.link} onClick={primaryDialog.handlePrimaryOpenDialog}>Изменить</a>
                    </div>
                    <div className={classes.information}>
                        <InfoIcon color="#333" style={{marginRight: '10px'}}/>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum laudantium quam tempora temporibus voluptas! Atque eius hic mollitia nam nisi!
                    </div>
                </div>
            </Paper>

            <PrimaryCurrencyDialog
                open={primaryDialog.openPrimaryDialog}
                onClose={primaryDialog.handlePrimaryCloseDialog}
                initialValues={primaryDialog.initialValues}
                loading={primaryDialog.primaryCurrencyLoading}
                onSubmit={primaryDialog.handleSubmitPrimaryDialog}
            />

            <GridList
                filter={filter}
                list={list}
                detail={currencyDetail}
                actionsDialog={actions}
            />

            <SetCurrencyDialog
                initialValues={setCurrencyUpdateDialog.initialValues}
                open={setCurrencyUpdateDialog.openSetCurrencyDialog}
                loading={setCurrencyUpdateDialog.setCurrencyLoading}
                onClose={setCurrencyUpdateDialog.handleCloseSetCurrencyDialog}
                onSubmit={setCurrencyUpdateDialog.handleSubmitSetCurrencyDialog}
                currencyData={currencyData}
                currentCurrency={currentCurrency}
            />

            <CurrencyCreateDialog
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />

            <CurrencyCreateDialog
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

CurrencyGridList.propTypes = {
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
    setCurrencyUpdateDialog: PropTypes.shape({
        setCurrencyLoading: PropTypes.bool.isRequired,
        openSetCurrencyDialog: PropTypes.bool.isRequired,
        handleOpenSetCurrencyDialog: PropTypes.func.isRequired,
        handleCloseSetCurrencyDialog: PropTypes.func.isRequired,
        handleSubmitSetCurrencyDialog: PropTypes.func.isRequired
    }),
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
    primaryDialog: PropTypes.shape({
        primaryCurrency: PropTypes.object,
        primaryCurrencyLoading: PropTypes.bool.isRequired,
        openPrimaryDialog: PropTypes.bool.isRequired,
        handlePrimaryOpenDialog: PropTypes.func.isRequired,
        handleSubmitPrimaryDialog: PropTypes.func.isRequired
    }).isRequired,
    actionsDialog: PropTypes.shape({
        handleActionEdit: PropTypes.func.isRequired,
        handleActionDelete: PropTypes.func.isRequired
    }).isRequired,
    currencyData: PropTypes.object.isRequired
}

export default CurrencyGridList
