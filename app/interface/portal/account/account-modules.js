const mongoose = require('mongoose');

class Module {
    constructor(id, name, permissions, icon) {
        this.id = id;
        this.name = name;
        this.permissions = permissions;
        this.icon = icon; // Feather icon name: https://feathericons.com
    }
}

// Define all available user modules.
const modules = [
    // Top-level modules
    new Module('schedule', 'Scheduling', [ 'schedule' ], 'clock'),
    new Module('messages', 'Push Messages', [ 'messaging' ], 'message-square'),
    new Module('lunch', 'Lunch Menus', [ 'lunch' ], 'coffee'),
    new Module('events', 'Events', [ 'event' ], 'calendar'),
    new Module('news', 'News', [ 'news' ], 'globe'),
    new Module('accounts', 'Accounts', [ 'accounts' ], 'users'),

    // Secondary modules
    new Module('colorwars', 'Color Wars', [ 'event.category.colorwars' ], 'zap'),
    new Module('snowdays', 'Snow Days', [ 'news.add', 'schedule' ], 'cloud-snow')
];

module.exports.retrieveUserModules = (account) => {
    const guard = require('./account-permissions');

    return new Promise(async (resolve, reject) => {
        let userModules = [];

        for (const module of modules) {
            try {
                const valid = await guard.hasPermission(account, module.permissions);

                if (valid) {
                    userModules.push(module);
                }
            } catch (err) {
                reject(err);
            }
        }

        resolve(userModules);
    });
}

module.exports.hasModule = (account, moduleName) => {
    const guard = require('./account-permissions');

    return new Promise(async (resolve, reject) => {
        for (const module of modules) {
            if (module.id === moduleName) {
                try { 
                    const valid = await guard.hasPermission(account, module.permissions);
                    resolve(valid);
                    return;
                } catch (err) {
                    reject(err);
                    return;
                }
            }
        }
        resolve(false);
    });
}