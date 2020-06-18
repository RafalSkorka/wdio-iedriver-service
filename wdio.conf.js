exports.config = {
    runner: 'local',
    specs: [
        './test/specs/**/*.js'
    ],
    capabilities: [{
        maxInstances: 1,
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
    ieDriverPersistent: false,
    ieDriverRandomPort: true,
    ieDriverArgs: ['/log-level=DEBUG'],
    ieDriverLogs: './',

    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
}
