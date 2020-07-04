exports.config = {
    runner: 'local',
    specs: [
        './test/specs/**/*.js'
    ],
    capabilities: [{
        maxInstances: 2,
        browserName: 'internet explorer',
        "se:ieOptions": {
            ignoreZoomSetting: true,
            nativeEvents: false,
            "ie.ensureCleanSession": true,
        },
        timeouts: {}
    }],
    logLevel: 'trace',
    services: ['iexplorerdriver'],
    connectionRetryTimeout: 30000,
    connectionRetryCount: 0,
    ieDriverPersistent: false,
    ieDriverRandomPort: true,
    // port: 5555,
    ieDriverArgs: ['/log-level=TRACE'],
    ieDriverLogs: './logs',

    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
}
