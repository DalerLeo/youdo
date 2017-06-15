import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Col} from 'react-flexbox-grid'
import CircularProgress from 'material-ui/CircularProgress'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import Tooltip from '../ToolTip'
import ContentAdd from 'material-ui/svg-icons/content/add'
import NotFound from '../Images/not-found.png'

const iconStyle = {
    icon: {
        color: '#666',
        width: 20,
        height: 20
    },
    addButton: {
        borderRadius: '50%',
        background: '#666666',
        height: 24,
        width: 24,
        padding: '2px 0 0 0'
    },
    button: {
        width: 48,
        height: 48,
        padding: 0
    }
}

const enhance = compose(
    injectSheet({
        dottedList: {
            padding: '20px 0'
        },
        wrapper: {
            width: '100%'
        },
        loader: {
            width: '100%',
            background: '#fff',
            height: '200px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '65px',
            padding: '0 30px',
            borderBottom: '1px #efefef solid'
        },
        titleLabel: {
            fontSize: '18px',
            color: '#333',
            fontWeight: '700'
        },
        materialsList: {
            padding: '0 30px'
        },
        rawMaterials: {
            '& .dottedList': {
                padding: '10px 0'
            },
            '& .dottedList:last-child:after': {
                backgroundImage: 'none'
            }
        },
        titleButtons: {
            display: 'flex',
            justifyContent: 'flex-end',
            '& svg': {
                color: '#fff !important'
            }
        },
        listButtons: {
            display: 'flex',
            justifyContent: 'flex-end',
            '& button': {
                height: '20px !important',
                width: '25px !important'
            }
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '285px',
            padding: '260px 0 0',
            textAlign: 'center',
            fontSize: '15px',
            color: '#666',
            '& svg': {
                width: '50px !important',
                height: '50px !important',
                color: '#999 !important'
            }
        }
    }),
)

const ManufactureDetails = enhance((props) => {
    const {
        classes,
        loading,
        data,
        handleOpenEditMaterials,
        handleOpenConfirmDialog,
        productTitle,
        createMaterials,
        handleDeleteAllIngredient
    } = props

    const id = _.get(data, 'id')
    if (loading) {
        return (
            <div className={classes.loader}>
                <div>
                    <CircularProgress size={100} thickness={6}/>
                </div>
            </div>
        )
    }
    const ingredientList = _.map(_.get(data, 'ingredient'), (item) => {
        const itemId = _.get(item, 'id')
        const ingredient = _.get(item, ['ingredient', 'name'])
        const amount = _.get(item, 'amount')
        const measurement = _.get(item, ['ingredient', 'measurement', 'name'])
        return (
            <li key={itemId} className="dottedList">
                <Col xs={7}>{ingredient}</Col>
                <Col xs={3}>{amount} {measurement}</Col>
                <Col xs={2}>
                    <div className={classes.listButtons}>
                        <Tooltip position="bottom" text="Изменить">
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                touch={true}
                                onClick={() => {
                                    handleOpenEditMaterials(itemId)
                                }}>
                                <ModEditorIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip position="bottom" text="Удалить">
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                touch={true}
                                onClick={() => {
                                    handleOpenConfirmDialog(itemId)
                                }}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </Col>
            </li>
        )
    })
    return (
        <div key={id} className={classes.wrapper}>
            <div className={classes.title}>
                <div className={classes.titleLabel}>{productTitle}</div>
                <div className={classes.titleButtons}>
                    <Tooltip position="bottom" text="Добавить сырье">
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.addButton}
                            onClick={() => { handleDeleteAllIngredient(id) }}>
                            <DeleteIcon />
                        </IconButton>
                        <IconButton
                        iconStyle={iconStyle.icon}
                        style={iconStyle.addButton}
                        onClick={createMaterials.handleOpen}>
                        <ContentAdd />
                    </IconButton>
                    </Tooltip>
                </div>
            </div>

            <div className={classes.materialsList}>
                {ingredientList.length > 0
                ? <div>
                        <ul className={classes.rawMaterials}>
                            <li key={id} className="dottedList">
                                <Col xs={7}>
                                    <strong>Сырье</strong>
                                </Col>
                                <Col xs={3}>
                                    <strong>Обьем</strong>
                                </Col>
                            </li>
                            {ingredientList}
                        </ul>
                    </div>
                : <div className={classes.emptyQuery}>
                    <div>По вашему запросу ничего не найдено</div>
                </div>}
            </div>
        </div>
    )
})

ManufactureDetails.propTypes = {
    handleOpenEditMaterials: PropTypes.func.isRequired,
    handleOpenConfirmDialog: PropTypes.func.isRequired
}

export default ManufactureDetails
