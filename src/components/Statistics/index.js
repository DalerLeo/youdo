import StatSideMenu from './StatSideMenu'
import StatSalesGridList from './Sales/SalesGridList'
import StatAgentGridList from './Agents/AgentGridList'
import StatProductGridList from './Products/StatProductGridList'
import StatMarketGridList from './Markets/StatMarketGridList'
import StatFinanceGridList from './Finance/StatFinanceGridList'
import StatOutcomeCategoryGridList from './Outcome/StatOutcomeCategoryGridList'
import StatRemainderGridList from './Remainder/StatRemainderGridLIst'
import StatCashboxGridList from './Cashbox/CashboxGridList'
import StatProductMoveGridList from './ProductMove/StatProductMoveGridList'
import StatReportGridList from './StatReportGridLIst'
import StatReturnGridList from './Return/StatReturnGridList'
import StatReturnDialog from './Return/StatReturnDialog'
import ClientIncomeGridList from './ClientIncome/ClientIncomeGridList'
import StatisticsFilterExcel from './StatisticsFilterExcel'
import StatisticsChart from './StatisticsChart'
import StatDebtorsGridList from './Debtors/DebtorsGridList'
import StatProviderGridList from './Providers/ProviderGridList'
import StatExpenditureOnStaffGridList from './ExpenditureOnStaff/StatExpenditureOnStaffGridList'

const STAT_AGENT_DIALOG_OPEN = 'openStatAgentDialog'
const STAT_PROVIDER_DIALOG_OPEN = 'openStatProviderDialog'
const STAT_RETURN_DIALOG_OPEN = 'openStatReturnDialog'
const STAT_REMAINDER_DIALOG_OPEN = 'openStatAgentDialog'
const STAT_SALES_DIALOG_OPEN = 'openStatSalesDialog'
const STAT_MARKET_DIALOG_OPEN = 'openStatMarketDialog'
const STAT_FINANCE_DIALOG_OPEN = 'openStatFinanceDialog'
const STAT_INCOME_DIALOG_OPEN = 'openStatIncomeDialog'
const STAT_DEBTORS_DIALOG_OPEN = 'openStatDebtorsDialog'
const STAT_OUTCOME_DIALOG_OPEN = 'openStatOutcomeDialog'
const STAT_PRODUCT_MOVE_DIALOG_OPEN = 'openStatProductMoveDialog'
const STAT_PROVIDER_INFO_DIALOG_OPEN = 'openInfoDialog'
const BEGIN_DATE = 'begin_date'
const END_DATE = 'end_date'

export {
    StatReturnGridList,
    StatReturnDialog,
    StatSideMenu,
    StatSalesGridList,
    StatAgentGridList,
    StatProductGridList,
    StatMarketGridList,
    StatFinanceGridList,
    StatOutcomeCategoryGridList,
    StatRemainderGridList,
    StatCashboxGridList,
    StatProductMoveGridList,
    StatReportGridList,
    ClientIncomeGridList,
    StatDebtorsGridList,
    StatisticsFilterExcel,
    StatisticsChart,
    StatExpenditureOnStaffGridList,
    StatProviderGridList,
    BEGIN_DATE,
    END_DATE,
    STAT_AGENT_DIALOG_OPEN,
    STAT_MARKET_DIALOG_OPEN,
    STAT_FINANCE_DIALOG_OPEN,
    STAT_INCOME_DIALOG_OPEN,
    STAT_DEBTORS_DIALOG_OPEN,
    STAT_OUTCOME_DIALOG_OPEN,
    STAT_SALES_DIALOG_OPEN,
    STAT_REMAINDER_DIALOG_OPEN,
    STAT_PRODUCT_MOVE_DIALOG_OPEN,
    STAT_RETURN_DIALOG_OPEN,
    STAT_PROVIDER_DIALOG_OPEN,
    STAT_PROVIDER_INFO_DIALOG_OPEN
}
