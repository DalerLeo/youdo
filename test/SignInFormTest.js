const assert = require('chai').assert
const describe = require('mocha').describe
const it = require('mocha').it
const Horseman = require('node-horseman')

describe('SignInForm component testing', () => {
    it('component mounting', (done) => {
        const horseman = new Horseman()
        horseman
            .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
            .open('http://besto.uz')
            .type('#search_filed', 'girl')
            .click('#edit-submit')
            .waitForSelector('.brief')
            .screenshot('hello.png')
            .then(() => {
                done()
            })
    })
})
