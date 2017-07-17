import TrackingWrapper from './TrackingWrapper'
const ADD_TRACKING = 'openAddTracking'
const TOGGLE_INFO = 'openInfo'

const TRACKING_FILTER_KEY = {
    PERIOD_FROM_DATE: 'periodFromDate',
    PERIOD_TO_DATE: 'periodToDate',
    ZONE: 'zone',
    AGENT: 'agent',
    SHOW_MARKETS: 'showMarkets',
    SHOW_ZONES: 'showZones',
    AGENT_TRACK: 'agentTrack'
}

export {
    ADD_TRACKING,
    TOGGLE_INFO,
    TRACKING_FILTER_KEY,
    TrackingWrapper
}
