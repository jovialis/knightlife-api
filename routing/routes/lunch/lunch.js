module.exports.path = "lunch";
module.exports.method = "get";

module.exports.called = function(req, res) {
    let date = require(`${__basedir}/utils/date-check`)(req.param("dt"))
    
    if (!date) { // No date supplied
        res.json(null)
        console.log("No date supplied!")
        return
    }
    
    console.log(date)
    
    require(`${__basedir}/database/models/lunch`).findOne({
        date: date
    }, function(error, object) {
        if (object) {
            console.log(object)
            res.json(object)
        } else {
            console.log("NO LUNCH OBJECT")
            res.json(null)
        }
    })
}
