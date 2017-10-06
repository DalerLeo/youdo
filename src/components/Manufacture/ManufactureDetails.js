import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Col} from 'react-flexbox-grid'
import LinearProgress from '../LinearProgress'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import ContentAdd from 'material-ui/svg-icons/av/playlist-add'
import Map from 'material-ui/svg-icons/maps/map'
import Tooltip from '../ToolTip'
import NotFound from '../Images/not-found.png'
import numberFormat from '../../helpers/numberFormat'

const ZERO = 0
const iconStyle = {
    icon: {
        color: '#666',
        width: 20,
        height: 20
    },
    iconCustom: {
        color: '#666',
        width: 24,
        height: 24
    },
    addButton: {
        height: 48,
        width: 48,
        padding: 0
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
            position: 'relative',
            padding: '0 30px',
            borderBottom: '1px #efefef solid'
        },
        closeDetail: {
            cursor: 'pointer',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0'
        },
        titleLabel: {
            fontSize: '18px',
            color: '#333',
            fontWeight: '600',
            cursor: 'pointer'
        },
        materialsList: {
            padding: '0 30px'
        },
        rawMaterials: {
            '& .dottedList': {
                padding: '10px 0',
                margin: '0',
                minHeight: '50px',
                alignItems: 'center',
                '& > div:first-child': {
                    paddingLeft: '0'
                },
                '& > div:last-child': {
                    paddingRight: '0'
                }
            },
            '& .dottedList:last-child:after': {
                display: 'none'
            }
        },
        titleButtons: {
            display: 'flex',
            justifyContent: 'flex-end'
        },
        listButtons: {
            display: 'flex',
            justifyContent: 'flex-end',
            '& > div': {
                marginLeft: '10px'
            },
            '& button': {
                height: '20px !important',
                width: '25px !important'
            }
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '225px',
            padding: '205px 0 20px',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666'
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
        handleDeleteAllIngredient,
        handleOpenChangeManufacture,
        handleCloseDetail
    } = props

    const id = _.get(data, 'id')
    if (loading) {
        return (
            <div className={classes.loader}>
                <div>
                    <LinearProgress/>
                </div>
            </div>
        )
    }
    const ingredientList = _.map(_.get(data, 'ingredient'), (item) => {
        const itemId = _.get(item, 'id')
        const ingredient = _.get(item, ['ingredient', 'name'])
        const measurement = _.get(item, ['ingredient', 'measurement', 'name'])
        const amount = numberFormat(_.get(item, 'amount'), measurement)
        return (
            <li key={itemId} className="dottedList">
                <Col xs={7}>{ingredient}</Col>
                <Col xs={3}>{amount}</Col>
                <Col xs={2}>
                    <div className={classes.listButtons}>
                        <Tooltip position="bottom" text="Изменить">
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                touch={true}
                                disableTouchRipple={true}
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
                                disableTouchRipple={true}
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
                <div className={classes.closeDetail} onClick={handleCloseDetail}> </div>
                <div className={classes.titleLabel}>{productTitle}</div>
                <div className={classes.titleButtons}>
                    <Tooltip position="bottom" text="Изменить производство">
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.addButton}
                            onClick={handleOpenChangeManufacture}>
                            <Map />
                        </IconButton>
                    </Tooltip>
                    <Tooltip position="bottom" text="Удалить продукт">
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.addButton}
                            onClick={() => { handleDeleteAllIngredient(id) }}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip position="bottom" text="Добавить сырье">
                        <IconButton
                            iconStyle={iconStyle.iconCustom}
                            style={iconStyle.addButton} onClick={ createMaterials.handleOpen }>
                            <ContentAdd />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <div className={classes.materialsList}>
                {ingredientList.length > ZERO
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
                        <div>В данном продукте нет сырья</div>
                    </div>}
            </div>
        </div>
    )
})

ManufactureDetails.propTypes = {
    handleOpenEditMaterials: PropTypes.func.isRequired,
    handleOpenConfirmDialog: PropTypes.func.isRequired,
    handleOpenChangeManufacture: PropTypes.func.isRequired
}

export default ManufactureDetails
