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
    new Module('events', 'Events', [ 'event' ], 'globe'),
    new Module('news', 'News', [ 'news' ], 'calendar'),
    new Module('accounts', 'Accounts', [ 'accounts' ], 'users'),

    // Secondary modules
    new Module('colorwars', 'Color Wars', [ 'event.category.colorwars' ], 'zap'),
    new Module('snowdays', 'Snow Days', [ 'news.add', 'schedule' ], 'cloud-snow')
];

module.exports.retrieveUserModules = (account) => {
    const guard = require(`${ global.__interface }/permissions/permissions`);

    return new Promise(async (resolve, reject) => {
        let userModules = [];

        for (const module of this.modules) {
            for (const modulePermission of module.permissions) {
                try {
                    const valid = await guard.hasPermission(account, modulePermission);

                    if (!valid) {
                        break;
                    }
                } catch (err) {
                    reject(err);
                }
            }

            // If we get to the end without breaking, add a clone to list.
            userModules.push(module);
        }

        resolve(userModules);
    });
}