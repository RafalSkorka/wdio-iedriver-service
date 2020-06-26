const path = require('path');
const fs = require('fs-extra');
const getPort = require('get-port');
const psList = require('ps-list');

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

    async onComplete() {
        await this._stopIEDriver();
    }

    async beforeSession(config) {
        if (config.ieDriverPersistent) {
            return;
        }
        await this._startIEDriver(config);
    }

    async afterSession() {
        await this._stopIEDriver();
    }

    async _startIEDriver(config) {
        let ieDriverArgs = config.ieDriverArgs || [];
        let ieDriverLogs = config.ieDriverLogs;

        if (!ieDriverArgs.find(arg => arg.startsWith('/log-level')) && config.logLevel) {
            ieDriverArgs.push(`/log-level=${config.logLevel}`);
        }

        if (config.ieDriverRandomPort !== false) {
            config.port = await getPort();
        }

        ieDriverArgs.push(`/port=${config.port}`);

        if (typeof ieDriverLogs === 'string') {
            const DEFAULT_LOG_FILENAME = `IEDriver-${config.port}.txt`;
            const logFile = getFilePath(ieDriverLogs, DEFAULT_LOG_FILENAME);
            fs.ensureFileSync(logFile);
            ieDriverArgs.push(`/log-file="${logFile}"`);
        }
        const serverPath = path.join(__dirname, '../bin/IEDriverServer.exe');
        this.process = require('child_process').execFile(serverPath, ieDriverArgs);
    }

    async _stopIEDriver() {
        if (this.process) {
            this.process.kill();
            this.process = null;
            const processes = await psList();
            processes.filter(p => p.name === 'iexplore.exe').forEach(p => process.kill(p.pid));
        }
    }
}

exports.launcher = exports.default
