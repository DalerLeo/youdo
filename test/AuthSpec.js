const _ = require('lodash')
const assert = require('chai').assert
const describe = require('mocha').describe
const it = require('mocha').it
const Horseman = require('node-horseman')
const config = require('../package.json')
const hostname = _.get(config, ['testing', 'hostname'])
const userAgent = _.get(config, ['testing', 'useragent'])

describe('Authentication testing', () => {
    it('success', (done) => {
        const horseman = new Horseman()
        horseman
            .userAgent(userAgent)
            .open(`${hostname}/#/sing-in`)
            .wait(2000)
            .waitForSelector('button[type=submit]')
            .then((data) => {
                console.log(data)
                done()
            })
    })

    it('fail', () => {

    })
})
