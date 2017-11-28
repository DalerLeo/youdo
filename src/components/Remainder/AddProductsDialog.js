import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState, withHandlers} from 'recompose'
import injectSheet from 'react-jss'
import {Row, Col} from 'react-flexbox-grid'
import {Field, reduxForm} from 'redux-form'
import {hashHistory} from 'react-router'
import Loader from '../Loader'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import Pagination from '../GridList/GridListNavPagination'
import TextFieldSearch from 'material-ui/TextField'
import Paper from 'material-ui/Paper'
import SearchIcon from 'material-ui/svg-icons/action/search'
import NotFound from '../Images/not-found.png'
import Tooltip from '../ToolTip'
import numberFormat from '../../helpers/numberFormat'
import {
    TextField,
    ProductTypeSearchField
} from '../ReduxForm'

const enhance = compose(
    injectSheet({
        loader: {
            position: 'absolute',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            textAlign: 'center',
            justifyContent: 'center',
            display: 'flex',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0'
        },
        confirm: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            background: 'rgba(0,0,0, 0.3)',
            width: '100%',
            height: '100%',
            zIndex: '2100'
        },
        confirmContent: {
            width: '500px',
            '& > header': {
                padding: '24px 30px'
            },
            '& > div': {
                textAlign: 'right',
                padding: '8px'
            }
        },
        popUp: {
            display: 'flex',
            flexDirection: 'column',
            background: '#fff',
            overflow: 'unset',
            fontSize: '13px',
            position: 'fixed',
            padding: '0',
            height: '100%',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '2000'
        },
        titleContent: {
            background: '#fff',
            color: '#333',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #efefef',
            padding: '20px 30px',
            minHeight: '60px',
            zIndex: '999',
            '& button': {
                right: '13px',
                padding: '0 !important',
                position: 'absolute !important'
            }
        },
        bodyContent: {
            color: '#333',
            width: '100%',
            height: '100%'
        },
        form: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
        },
        inContent: {
            color: '#333',
            height: 'calc(100vh - 120px)',
            position: 'relative',
            '& header': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px #efefef solid',
                height: '56px',
                padding: '0 30px',
                position: 'relative'
            }
        },
        field: {
            width: '100%'
        },
        search: {
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            border: '1px #d9e0e5 solid',
            borderRadius: '2px',
            background: '#f2f5f8',
            width: '280px',
            left: 'calc(50% - 140px)',
            '& > div': {
                height: '40px !important',
                padding: '0 35px 0 10px'
            }
        },
        searchField: {
            fontSize: '13px !important',
            width: '100%',
            '& > div:first-child': {
                bottom: '8px !important'
            },
            '& hr': {
                display: 'none'
            }
        },
        searchButton: {
            position: 'absolute !important',
            alignItems: 'center',
            justifyContent: 'center',
            right: '0'
        },
        productsList: {
            padding: '0 30px',
            height: 'calc(100% - 56px)',
            overflowY: 'auto',
            '& .dottedList': {
                margin: '0 -30px',
                padding: '15px 30px',
                height: '50px',
                transition: 'all 150ms ease',
                '&:first-child': {
                    fontWeight: '600',
                    borderBottom: '1px #efefef solid',
                    '&:hover': {
                        background: 'transparent'
                    }
                },
                '&:hover': {
                    background: '#f2f5f8'
                },
                '&:after': {
                    display: 'none'
                },
                '& > div': {
                    '&:first-child': {
                        paddingLeft: '0'
                    },
                    '&:last-child': {
                        paddingRight: '0'
                    }
                }
            }
        },
        flex: {
            display: 'flex',
            alignItems: 'baseline',
            '& > span': {
                marginLeft: '10px'
            }
        },
        rightAlign: {
            textAlign: 'right'
        },
        bottomButton: {
            height: '60px',
            padding: '10px',
            zIndex: '999',
            borderTop: '1px solid #efefef',
            background: '#fff',
            textAlign: 'right',
            '& span': {
                fontSize: '13px !important',
                fontWeight: '600 !important',
                color: '#129fdd',
                verticalAlign: 'inherit !important'
            }
        },
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important'
        },
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& div': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            }
        },
        podlojkaScroll: {
            overflowY: 'auto !important',
            zIndex: '2000 !important',
            '& > div:first-child > div:first-child': {
                transform: 'translate(0px, 0px) !important'
            }
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '175px',
            padding: '350px 0 180px',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666'
        }
    }),
    reduxForm({
        form: 'RemainderAddProductsForm',
        enableReinitialize: true
    }),
    withState('pdSearch', 'setSearch', ({filter}) => filter.getParam('pdSearch')),
    withHandlers({
        onSubmitSearch: props => () => {
            const {pdSearch, filter} = props
            hashHistory.push(filter.createURL({pdSearch}))
        }
    })
)

const iconStyle = {
    icon: {
        color: '#bac6ce',
        width: 22,
        height: 22
    },
    button: {
        width: 40,
        height: 40,
        padding: 0,
        display: 'flex'
    }
}

const flatButtonStyle = {
    label: {
        color: '#12aaeb',
        fontWeight: '600'
    }
}

const AddProductsDialog = enhance((props) => {
    const {
        open,
        data,
        filter,
        handleSubmit,
        onClose,
        classes,
        loading,
        pdSearch,
        setSearch,
        openAddProductConfirm,
        handleCloseAddProductConfirm,
        handleSubmitAddProductConfirm
    } = props
    const onSubmit = handleSubmit(props.onSubmit)
    const products = _.map(data, (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'title')
        const defect = _.toNumber(_.get(item, 'defects'))
        const available = _.toNumber(_.get(item, 'available'))
        const measurement = _.get(item, ['measurement', 'name'])
        return (
            <Row key={id} className="dottedList">
                <Col xs={5}>{name}</Col>
                <Col xs={3}>
                    <Tooltip text='доступно / брак' position="left">{numberFormat(available)} / {numberFormat(defect, measurement)}</Tooltip>
                </Col>
                <Col xs={2} className={classes.flex}>
                    <Field
                        name={'product[' + id + '][amount]'}
                        component={TextField}
                        className={classes.inputFieldCustom}
                        inputStyle={{textAlign: 'right'}}
                        fullWidth={true}/>
                    <span>{measurement}</span>
                </Col>
                <Col xs={2} className={classes.flex}>
                    <Field
                        name={'product[' + id + '][defect]'}
                        component={TextField}
                        className={classes.inputFieldCustom}
                        inputStyle={{textAlign: 'right'}}
                        fullWidth={true}/>
                    <span>{measurement}</span>
                </Col>
            </Row>
        )
    })
    if (!open) {
        return null
    }
    return (
        <div className={classes.popUp}>
            {openAddProductConfirm &&
            <div className={classes.confirm}>
                <Paper zDepth={2} className={classes.confirmContent}>
                    <header>Сохранить текущие товары?</header>
                    <div>
                        <FlatButton
                            label="Нет"
                            labelStyle={flatButtonStyle.label}
                            onClick={handleCloseAddProductConfirm} />
                        <FlatButton
                            label="Сохранить"
                            labelStyle={flatButtonStyle.label}
                            onClick={handleSubmitAddProductConfirm} />
                    </div>
                </Paper>
            </div>}
            <div className={classes.titleContent}>
                <span>Добавление продуктов</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <div className={classes.form}>
                    <div className={classes.inContent}>
                        {loading && <div className={classes.loader}>
                            <Loader size={0.75}/>
                        </div>}
                        <header>
                            <div style={{width: '250px'}}>
                                <Field
                                    name="productType"
                                    component={ProductTypeSearchField}
                                    label="Фильтр по типу"
                                    fullWidth={true}
                                />
                            </div>
                            <form onSubmit={handleSubmit(props.onSubmitSearch)} className={classes.search}>
                                <TextFieldSearch
                                    fullWidth={true}
                                    hintText="Поиск товаров..."
                                    className={classes.searchField}
                                    value={pdSearch}
                                    onChange={(event) => setSearch(event.target.value)}
                                />
                                <IconButton
                                    iconStyle={iconStyle.icon}
                                    style={iconStyle.button}
                                    className={classes.searchButton}
                                    disableTouchRipple={true}>
                                    <SearchIcon />
                                </IconButton>
                            </form>
                            <Pagination filter={filter}/>
                        </header>
                        <form className={classes.productsList}>
                            {!_.isEmpty(products) &&
                            <Row className="dottedList">
                                <Col xs={5}>Наименование</Col>
                                <Col xs={3}>В наличии</Col>
                                <Col xs={2} className={classes.rightAlign}>ОК</Col>
                                <Col xs={2} className={classes.rightAlign}>Брак</Col>
                            </Row>}
                            {!_.isEmpty(products)
                                ? products
                                : <div className={classes.emptyQuery}>
                                    <div>По вашему запросу ничего не найдено...</div>
                                </div>}
                        </form>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label={'Сохранить'}
                            labelStyle={{fontSize: '13px'}}
                            className={classes.actionButton}
                            primary={true}
                            onTouchTap={onSubmit}/>
                    </div>
                </div>
            </div>
        </div>
    )
})
AddProductsDialog.defaultProps = {
    withoutCustomPrice: false,
    withoutValidations: false
}
AddProductsDialog.propTyeps = {
    products: PropTypes.array,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}
export default AddProductsDialog
