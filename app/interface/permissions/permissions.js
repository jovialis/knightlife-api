const mongoose = require('mongoose');

module.exports.hasPermission = (account, requiredPermissions) => {
    return new Promise((resolve, reject) => {
        const Permission = mongoose.model('Permission');

        Permission.find({
            account: account._id
        }, (err, permissions) => {
            if (err) {
                reject(err);
                return;
            }

            let permissionsToCheck = requiredPermissions;

            // If user didn't provide a list of permissions we put that into a list.
            if (typeof requiredPermissions[Symbol.iterator] !== 'function') {
                permissionsToCheck = [ requiredPermissions ];
            }

            for (const permissionToCheck of permissionsToCheck) {
                let valid = false;
                
                for (const userPermission of permissions) { 
                    if (adequate(userPermission.permission, permissionToCheck)) {                    
                        valid = true;
                        break;
                    }
                }
                
                // If the user doesn't have a valid permission for this item we return.
                if (!valid) {
                    resolve(false);
                    return;
                }
            }

            resolve(true);
        });
    });
}

/**
This method checks a given permission string to see if it matches the one required.

e.g.
Usr: module.action.delete
Req: module.action.remove

The user does not have permission.

e.g.
Usr: module.action.*
Req: module.action.remove

The user DOES have permission.

e.g.
Usr: module.action
Req: module.action.remove

The user DOES have permission.
**/
function adequate(userPermission, requiredPermission) {
    // We compare by getting each segment, separated by periods.
    const splitUserPermission = userPermission.split('.');
    const splitRequiredPermission = requiredPermission.split('.');

    // Go through indexes side by side.
    let i = 0;

    // Only go through until the end of the user, because if the user permission is shallower 
    // than the required one, and they match up until the end, then the user is allowed to perform that action.
    while (i < splitUserPermission.length) {

        // If the user has a permission that's deeper than the one required, we know to return false.
        if (i >= splitRequiredPermission.length) {
            return false;
        }

        const curUserPermission = splitUserPermission[i];
        const curRequiredPermission = splitRequiredPermission[i];

        // If the user has a wildcard at this position, we know that they have permission.
        if (curUserPermission === '*') {
            return true;
        }

        // If the user's permission doesn't match, then they definitely don't have permission.
        if (curUserPermission.toUpperCase() !== curRequiredPermission.toUpperCase()) {
            return false;
        }

        i++;
    }

    return true;
}