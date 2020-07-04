WDIO IEDriver Service
================================

Note - this service is targeted at WDIO v6.

----

This service helps you to run IEDriver seamlessly when running tests with the
[WDIO testrunner](https://webdriver.io/docs/gettingstarted.html).

Note - this service does not require a Selenium server, but uses IEDriverServer.exe to communicate with the browser
directly. It uses a custom built binary for IE as the one from Selenium expects case-sensitive Content-Length header
and node makes them all lowercase. See here: https://github.com/SeleniumHQ/selenium/issues/7986
The only change made was using `stricmp` instead of `strcmp` when comparing Content-Length header.

Example capabilities:

```js
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
```

## Installation

```bash
npm install wdio-iexplorerdriver-service --save-dev
```

## Configuration

By design, only Internet Explorer is available. In order to use the service you need to add `iexplorerdriver` to your
service array:

```js
// wdio.conf.js
export.config = {
    // MANDATORY: Add iexplorerdriver to service array.
    // Default: empty array
    services: ['iexplorerdriver'],

    // OPTIONAL: Provide custom port for iedriver.
    // ieDriverRandomPort must be set to false to use this port and maxInstances must be set to 1.
    // IEDriverServer starts on 5555 by default, but this service uses random port by default.
    // Default: 4444
    port: 5555,

    // OPTIONAL: Arguments passed to iedriver executable.
    // Note: Do not specify port here, use `port` config option instead.
    // Check IEDriverServer.exe /? for all options.
    // Default: empty array
    ieDriverArgs: ['/log-level=DEBUG'],

    // OPTIONAL: Location of iedriver logs.
    // Must be a directory if using maxInstances > 1.
    // Could be a file name or a directory if maxInstances == 1.
    // Logs are saved as `IEDriver-{portname}.log`
    // Logs are not stored if this option is not set.
    // Default: not set
    ieDriverLogs: './',

    // OPTIONAL: Launch iedriver once for all specs if true.
    // Launch iedriver for each spec separately if false.
    // Default: false
    ieDriverPersistent: false,

    // OPTIONAL: Use a random port for launching iedriver.
    // Must be set to true if maxInstances > 1.
    // Set it to false to use the `port` config option.
    // Default: true
    ieDriverRandomPort: true,
};
```

----

For more information on WebdriverIO see the [homepage](https://webdriver.io).
