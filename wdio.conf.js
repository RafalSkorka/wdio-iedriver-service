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
    logLevel: 'warn',
    services: ['iedriver'],
    connectionRetryTimeout: 30000,
    connectionRetryCount: 0,
    // ieDriverPersistent: true,
    // ieDriverRandomPort: false,
    // port: 5555,
    ieDriverArgs: ['/log-level=DEBUG'],
    ieDriverLogs: './logs',

    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
}
