import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import injectSheet from 'react-jss'
import _ from 'lodash'
import {compose} from 'recompose'
import Close from 'material-ui/svg-icons/navigation/close'
import Loader from '../Loader'
import numberFormat from '../../helpers/numberFormat'
import dateFormat from '../../helpers/dateFormat'
import numberToWords from '../../helpers/numberToWords'
import moment from 'moment'

const enhance = compose(
    injectSheet({
        loader: {
            width: '100vw',
            height: '100vh',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        wrapper: {
            background: '#fff',
            fontSize: '14px',
            width: '100%',
            height: '100%',
            zIndex: '999',
            overflowY: 'auto',
            '& header': {
                '& > h3': {
                    margin: '0 !important'
                },
                '& > div': {
                    fontSize: '14px',
                    marginBottom: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: '600',
                    padding: '0 50px'
                }
            },
            '& .printItem': {
                borderBottom: 'none',
                '& h3': {
                    textAlign: 'center',
                    margin: '20px 0',
                    textTransform: 'uppercase'
                }
            }
        },
        closeBtn: {
            position: 'absolute !important',
            top: '5px',
            right: '5px',
            opacity: '0'
        },
        item: {
            width: '100%',
            marginBottom: '30px',
            borderBottom: 'dashed 1px',
            '&:last-child': {
                borderBottom: 'none',
                marginBottom: '0'

            }
        },
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            '& div:last-child': {
                fontSize: '12px',
                color: '#777',
                fontWeight: '600',
                marginRight: '30px'
            }
        },
        products: {
            marginBottom: '10px',
            width: '100%',
            display: 'table',
            borderCollapse: 'collapse',
            position: 'relative',
            '& .row': {
                height: '25px',
                border: '1px #555 solid',
                display: 'table-row',
                pageBreakInside: 'avoid',
                '&:first-child': {
                    fontWeight: 'bold'
                },
                '& > div': {
                    verticalAlign: 'middle',
                    display: 'table-cell',
                    border: '1px #555 solid'
                },
                '& > div:last-child': {
                    textAlign: 'right'
                },
                '&:after': {
                    left: '0.5rem',
                    right: '0.5rem'
                }
            }
        },
        contacts: {
            width: '100%',
            borderCollapse: 'collapse',
            '& thead': {
                display: 'table-row-group'
            },
            '& td, th': {
                border: 'solid 1px',
                padding: '5px 10px'
            }
        }

    })
)
const ONE = 1
const OrderSalesPrint = enhance((props) => {
    const {classes, data, loading, onClose, marketData} = props
    const market = _.get(data, 'market')
    const okad = _.get(marketData, 'okad')
    const bankAddress = _.get(marketData, 'bankAddress')
    const checkAccount = _.get(marketData, 'checkingAccount')
    const inn = _.get(marketData, 'inn')
    const mfo = _.get(marketData, 'mfo')
    let measurementCheck = true
    const primaryCurrency = _.get(data, ['currency', 'name'])
    const firstMeasure = _.get(data, ['products', '0', 'product', 'measurement', 'name'])
    const totalCalPrice = _.sumBy(_.get(data, ['products']), (item) => {
        return _.toNumber(item.totalPrice)
    })
    const totalAmount = _.sumBy(_.get(data, ['products']), (item) => {
        return _.toNumber(item.amount)
    })

    if (loading) {
        return (
            <div className={classes.loader}>
                <Loader size={0.75}/>
            </div>
        )
    }
    return (
        <div className={classes.wrapper}>
            <div className="printItem">
                <header>
                    <h3>СЧЕТ-ДОГОВОР № {_.get(data, 'id')} </h3>
                    <div>
                        <div>г. Ташкент</div>
                        <div>{dateFormat(moment())}</div>
                    </div>
                </header>
                <div>
                    <p> <strong>СП ООО «GETTLE LEADING GROUP»</strong>  именуемый в дальнейшем «ПОСТАВЩИК», в лице Генерального директора
                        Isroilov U.M., действующего на основании Устава, с одной стороны и  ________________________
                        именуемый  в дальнейшем «ЗАКАЗЧИК», в лице директора ____________________, действующего на
                        основании Устава, с другой стороны, заключили настоящий счет договор о нижеследующем:
                    </p>
                    <h3>1. ПРЕДМЕТ СЧЕТ  ДОГОВОРА</h3>
                    <p>1.1 «ПОСТАВЩИК»  обязуется передать товар, являющийся продукцией  собственного производства,
                        далее - товар, а «ЗАКАЗЧИК» обязуется  принять и оплатить за  товар согласно спецификации
                        п.1.2.,  которая является  неотъемлемой частью настоящего счет договора.
                    </p>
                    <p>1.2. Спецификация:</p>
                </div>
                <div className={classes.products}>
                    <Row>
                        <Col xs={1}>№</Col>
                        <Col xs={3}>Наименование</Col>
                        <Col xs={2}>Кол-во</Col>
                        <Col xs={3}>Цена</Col>
                        <Col xs={3}>Сумма</Col>
                    </Row>
                    {_.map(_.get(data, ['products']), (item, index) => {
                        const productId = _.get(item, 'id')
                        const measurment = _.get(item, ['product', 'measurement', 'name'])
                        const name = _.get(item, ['product', 'name'])
                        const price = numberFormat(_.get(item, 'price'), primaryCurrency)
                        const totalPrice = numberFormat(_.get(item, 'totalPrice'), primaryCurrency)
                        const amount = numberFormat(_.get(item, 'amount'), measurment)
                        if (measurementCheck) {
                            measurementCheck = (firstMeasure === measurment)
                        }

                        return (
                            <Row key={productId}>
                                <Col xs={1}>{index + ONE}</Col>
                                <Col xs={3}>{name}</Col>
                                <Col xs={2}>{amount}</Col>
                                <Col xs={3}>{price}</Col>
                                <Col xs={3}>{totalPrice}</Col>
                            </Row>
                        )
                    })}
                    <Row>
                        <Col xs={1}/>
                        <Col xs={3}><strong>Итого :</strong></Col>
                        <Col xs={2}>{measurementCheck ? <strong>{numberFormat(totalAmount, firstMeasure)}</strong> : null}</Col>
                        <Col xs={3}/>
                        <Col xs={2}><strong>{numberFormat(totalCalPrice, primaryCurrency)}</strong></Col>
                    </Row>
                </div>
                <div>
                    <p> «ПОСТАВЩИК» поставляет товар без учета НДС.</p>
                    <p> <strong>
                        <i style={{fontSize: '13px'}}>1.3.Общая сумма счет - договора составляет: </i>
                        <i style={{fontSize: '15px'}}>{numberToWords(totalCalPrice)}</i> </strong>
                    </p>
                    <h3>2.ПОРЯДОК РАСЧЕТОВ, СРОКИ И УСЛОВИЯ ПОСТАВКИ</h3>
                    <p>2.1.Расчет за передачу товара производится путем предоплаты в течение 5-ти банковских дней в размере
                        100% от отпускаемой партии товара согласно спецификации п.1.2., с которая является достигнутой
                        сторонами договоренности в цене.
                    </p>
                    <p>2.2. Передача товара осуществляется в течение 5-ти банковских дней с момента поступления денежных
                        средств на расчетный счет «ПОСТАВЩИКА».
                    </p>
                    <p>2.3 В случае несвоевременной оплаты или несвоевременного вывоза товара после оплаты, ПОСТАВЩИК
                        оставляет за собой право в одностороннем порядке изменить цены на передаваемый товар илиотказаться от
                        исполнения принятых насебе обязательств по передаче товара, путём возврата денежных  средств ЗАКАЗЧИКУ.
                    </p>
                    <p>2.4. Цена товара подлежит изменению по соглашению сторон в течение периода поставки при условии
                        изменения ценообразующих факторов. За согласованный и поставленный «ПОСТАВЩИКОМ» объем поставки,
                        цена изменению не подлежит.
                    </p>
                    <p>2.5. Вывоз товара осуществляется силами и средствами «ЗАКАЗЧИКА» (самовывоз).</p>

                    <h3>3.КАЧЕСТВО  ТОВАРА</h3>

                    <p>3.1.Качество и комплектность товара должны соответствовать установленным  действующим
                        законодательством требованиям Республики Узбекистан.
                    </p>
                    <p>3.2. При получении товара «ЗАКАЗЧИК» обязан проверить качество и комплектность товара в присутствии
                        представителя «ПОСТАВЩИКА» и прием товара осуществляется на основании счет - фактуры.
                    </p>
                    <h3>4. ОТВЕТСТВЕННОСТЬ  СТОРОН</h3>
                    <p>4.1. В случае просрочки передачи, не передачи в полном объеме товара «ПОСТАВЩИК»  уплачивает «ЗАКАЗЧИКУ»
                        пеню в размере 0,5% от суммы не переданного  в срок товара за каждый день просрочки, но не более 10%
                        стоимости не переданного товара.
                    </p>
                    <p>4.2. Покупатель в праве требовать замены, либо отказаться от принятия товара только в том случае,
                        если переданный  товар при получении не соответствуют стандартам, техническим условиям.
                    </p>
                    <p>4.3. За не выборку товара в установленный счет договором срок поставки (10 дней) «ЗАКАЗЧИК» уплачивает
                        «ПОСТАВЩИКУ» пеня в размере 0,5% за каждый день просрочки от стоимости невыбранного в срок
                        товара, но не более 10% от суммы счет договора.
                    </p>
                    <p>4.4. Независимо от уплаты неустойки (штрафа) сторона, нарушившая договорные обязательства, возмещает
                        другой стороне причиненные в результате этого убытки.
                    </p>

                    <h3>5. ФОРС - МАЖОР</h3>

                    <p>5.1. Ни одна из сторон не будет нести ответственности за полное или частичное неисполнение
                        обязательств в случае наступления общепризнанных форс-мажорных обстоятельств. Сторона, у которой
                        возникли такие обстоятельства, должна уведомить другую сторону в 10-ти дневных сток с момента их наступления.
                    </p>

                    <h3>6. ПОРЯДОК РАЗРЕШЕНИЯ СПОРОВ</h3>
                    <p>6.1. Стороны примут все усилия для разрешения спорных вопросов путем переговоров.</p>
                    <p>6.2. В случае невозможности решения споров и разногласий, возникших в ходе исполнения счет договора
                        путем переговоров, они разрешаются  на основании действующего законодательства Республики Узбекистан
                        и подлежат рассмотрению в Экономическом суде г. Ташкента.
                    </p>
                    <p>6.3.Счет договор вступает в силу и становится обязательным для исполнения с момента его заключения.</p>
                    <p>6.4 Изменение и расторжение счет договора производится по согласию сторон и должны быть совершены в письменной форме. </p>
                    <p>6.5. Счет договор действует до 31.12.2017год. </p>
                    <p>6.6.Вопросы, не урегулированные договором, регламентируются действующим законодательством.</p>
                </div>
                <div style={{pageBreakInside: 'avoid'}}>
                    <h3>7.ЮРИДИЧЕСКИЕ АДРЕСА И РЕКВИЗИТЫ СТОРОН </h3>
                    <table className={classes.contacts}>
                        <colgroup>
                            <col style={{width: '50%'}}/>
                            <col style={{width: '50%'}}/>
                        </colgroup>
                        <thead>
                            <tr>
                                <th>«ПОСТАВЩИК»</th>
                                <th>«ЗАКАЗЧИК»</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>СП ООО «GETTLE LEADING GROUP»</td>
                                <td>{_.get(market, ['name'])}</td>
                            </tr>
                            <tr>
                                <td>Адрес: г. Ташкент, Алмазарский р-н, ул. Уста Ширин д.116</td>
                                <td>{_.get(market, 'address')}</td>
                            </tr>
                            <tr>
                                <td>P/c 20 214 000 000 604 470 001</td>
                                <td>{checkAccount}</td>
                            </tr>
                            <tr>
                                <td>в АКБ «Asia Alliance Bank» Мирабадский ф-л г. Ташкент МФО 01124</td>
                                <td>{bankAddress} МФО {mfo}</td>
                            </tr>
                            <tr>
                                <td>ИНН 303875278</td>
                                <td>{inn}</td>
                            </tr>
                            <tr>
                                <td>ОКЭД 20300</td>
                                <td>{okad}</td>
                            </tr>
                            <tr>
                                <td>Тел.: </td>
                                <td>Тел.: </td>
                            </tr>
                            <tr>
                                <td height={'29px'}> </td>
                                <td height={'29px'}> </td>
                            </tr>
                            <tr>
                                <td><div style={{float: 'left'}}>Ген.Директор:</div><div style={{borderBottom: '1px solid'}}/></td>
                                <td><div style={{float: 'left'}}>Директор:</div><div style={{borderBottom: '1px solid'}}/></td>
                            </tr>
                            <tr>
                                <td> М.П.</td>
                                <td> М.П. </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <IconButton onTouchTap={onClose} className="printCloseBtn">
                <Close color="#666"/>
            </IconButton>
        </div>
    )
})

export default OrderSalesPrint
