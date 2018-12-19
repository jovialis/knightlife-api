const mongoose = require('mongoose');

module.exports = async function (req, res) {
    let formatter = require(`${__basedir}/utils/response-formatter`);

    const date = new Date(req.param("date"));
    if (!date) {
        console.log("Invalid date requested: " + req.param("date") + ".");

        res.json(formatter.error("Invalid date requested"));
        return;
    }

    try {
        const dateFormatter = require(`${__basedir}/utils/date-formatter`);
        let resultList = [];

        // Check the next 28 days.
        for (let i = 0 ; i < 28 ; i++) {
            let adjustedDate = new Date(req.param("date"));
            adjustedDate.setDate(adjustedDate.getDate() + i);

            const dateString = dateFormatter(date);

            // Check for vacations first
            const vacation = await mongoose.model('Vacation').findOne({
                start: {
                    $lte: adjustedDate
                },
                end: {
                    $gte: adjustedDate
                }
            }).lean().select({ _id: 0 }).exec();

            if (vacation) {
                vacation.date = dateString;
                resultList.push(vacation);

                continue;
            }

            // Check for changed day schedules.
            const changedDay = await require(`${__basedir}/database/models/schedule`).findOne({
                date: adjustedDate,
                changed: true // Only fetch Schedules that have the Changed flag for a changed schedule.
            }).lean().select({ _id: 0 }).exec();

            if (changedDay) {
                changedDay.date = dateString;
                resultList.push(changedDay);

                continue
            }
        }

        res.json(formatter.success(resultList, "notification dates", dateFormatter(date)));
    } catch (err) {
        if (err) {
            console.log(err);

            res.json(formatter.error("Failed to fetch upcoming changed days."));
            return;
        }
    }
};