module.exports.path = "device/register";
module.exports.method = "get";

module.exports.called = function(req, res) {
    const token = req.param("dv")
    if (!token) {
        console.log("Recieved a device registration request with no token!");
        res.json(false)
        return;
    }
    
    let schema = require(`${__basedir}/database/models/device`)
    schema.findOne({
        token: token
    }, function(error, object) {
        if (error || !object) {
            schema.create({
                token: token
            }, function(error, object) {
                if (error) {
                    res.json(false);
                    throw error;
                } else {
                    res.json(true);
                }
            })
        } else {
            res.json(true)
        }
    })
}
