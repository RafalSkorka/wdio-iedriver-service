const path = require('path');
const fs = require('fs-extra');
const getPort = require('get-port');

/**
 * Resolves the given path into a absolute path and appends the default filename as fallback when the provided path is a directory.
 * @param  {String} logPath         relative file or directory path
 * @param  {String} defaultFilename default file name when filePath is a directory
 * @return {String}                 absolute file path
 */
function getFilePath(filePath, defaultFilename) {
    const FILE_EXTENSION_REGEX = /\.[0-9a-z]+$/i;
    let absolutePath = path.resolve(filePath);
    // test if we already have a file (e.g. selenium.txt, .log, log.txt, etc.)
    // NOTE: path.extname doesn't work to detect a file, cause dotfiles are reported by node to have no extension
    if (!FILE_EXTENSION_REGEX.test(path.basename(absolutePath))) {
        absolutePath = path.join(absolutePath, defaultFilename);
    }
    return absolutePath;
}

exports.default = class IEService {
    constructor() {
        this.path = './bin/IEDriverServer.exe';
        this.ieDriverLogs = null;
        this.ieDriverArgs = null;
        return this;
    }

    async onPrepare(config, capabilities) {
        if (config.ieDriverPersistent) {
            await this._startIEDriver(config);
            capabilities.forEach(c => {
                if (c.browserName.match(/internet explorer/i)) {
                    c.port = config.port;
                }
            });
        }
    }

    onComplete() {
        this._stopIEDriver();
    }

    async beforeSession(config) {
        if (config.ieDriverPersistent) {
            return;
        }
        await this._startIEDriver(config);
    }

    afterSession() {
        this._stopIEDriver();
    }

    async _startIEDriver(config) {
        this.ieDriverArgs = config.ieDriverArgs || [];
        this.ieDriverLogs = config.ieDriverLogs;

        if (!this.ieDriverArgs.find(arg => arg.startsWith('/log-level')) && config.logLevel) {
            this.ieDriverArgs.push(`/log-level=${config.logLevel}`);
        }

        if (config.ieDriverRandomPort !== false) {
            config.port = await getPort();
        }

        this.ieDriverArgs.push(`/port=${config.port}`);

        this.process = require('child_process').execFile(this.path, this.ieDriverArgs);

        if (typeof this.ieDriverLogs === 'string') {
            this._redirectLogStream(config.port);
        }
    }

    _stopIEDriver() {
        if (this.process) {
            this.process.kill();
            this.process = null;
        }
    }

    _redirectLogStream(port) {
        const DEFAULT_LOG_FILENAME = `IEDriver-${port}.txt`;
        const logFile = getFilePath(this.ieDriverLogs, DEFAULT_LOG_FILENAME);

        // ensure file & directory exists
        fs.ensureFileSync(logFile);

        const logStream = fs.createWriteStream(logFile, { flags: 'w' });
        this.process.stdout.pipe(logStream);
        this.process.stderr.pipe(logStream);
    }

}

exports.launcher = exports.default
