const mongoose = require('mongoose');
const redis = require(`${ __redis }`);

const ical = require('ical-toolkit');
const download = require('download');
const moment = require('moment');

// Implement promises for redis
const redisGet = require('util').promisify(redis.get).bind(redis);

// 23 hrs
module.exports.refreshDelay = 82800;

module.exports.name = 'sports';

module.exports.remote = true;

module.exports.fetchUpdates = async () => {
    const Team = mongoose.model('SportsTeam');

    const teams = await Team.find({});

    for (const team of teams) {
        try {
            const id = team.calendarId;

            //            if (await redisGet(`events-sports-refresh-${ id }`)) {
            //                console.log(`Sports team ${ id } has been refreshed recently.`);
            //                return;
            //            }

            // 4 hours
            redis.set(`events-sports-refresh-${ id }`, 'ye', 'EX', 14400);
            //            redis.set(`events-sports-refresh-${ id }`, 'ye', 'EX', 10);

            const url = teamUrl(id);

            const raw = await download(url);
            const ics = await ical.parseToJSON(raw);

            try {
                await handleICS(team, ics);
            } catch (err) {
                console.log(err);
            }

            //            wait(250);
        } catch (err) {
            console.log(err);
        }
    }

    console.log('Finished updating sporting events.');
}

function teamUrl(teamId) {
    return `https://www.bbns.org/calendar/team_${ teamId }.ics`;
}

async function handleICS(team, ics) {
    const Event = mongoose.model('Event');

    if (ics['VCALENDAR'] === undefined || ics['VCALENDAR'][0]['VEVENT'] === undefined) {
        console.log(`Found no events for team ${ team.calendarId }`);
        return;
    }

    for (const event of ics['VCALENDAR'][0]['VEVENT']) {
        event['DTSTAMP'] = undefined;
        const raw = JSON.stringify(event);

        const badge = event['UID'];

        const eventDocument = await Event.findOne({ 
            badge: badge
        });

        try {
            // Event already in system
            if (eventDocument) {
                // Raw data is the same, continue
                if (eventDocument.calendarRaw === raw) {
                    continue;
                    // Need to update event
                } else {
                    const digested = digestEvent(team, event);
                    const model = digested.model;

                    digested.model = undefined;

                    try {
                        for (const key in digested) {
                            eventDocument[key] = digested[key];
                        }

                        eventDocument.calendarRaw = raw;

                        await eventDocument.save();

                        console.log(`Updated sports event (${ model }) ${ badge }`);
                    } catch (err) {
                        console.log(err);
                    }
                }
            } else {
                const digested = digestEvent(team, event);

                if (digested === undefined) {
                    //                    console.log('Recieved an unparsable event.');
                    continue;
                }

                const model = digested.model;

                digested.model = undefined;

                try {
                    await mongoose.model(model).create(digested);

                    console.log(`Created sports event (${ model }) ${ badge }`);
                } catch (err) {
                    console.log(err);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
}

function digestEvent(team, event) {
    let output = {
        schedule: {},
        flags: {}
    };

    output.badge = event['UID'];

    const dateFormat = 'YYYYMMDD HHmmss';

    // Invalid event if it doesn't have a date.
    if (event['DTSTART'] === undefined && event['DTSTART;VALUE=DATE'] === undefined) {
        console.log(`Recieved an invalid event.`);
        return;
    }

    output.schedule.start = event['DTSTART'] ? (moment.utc(event['DTSTART'], dateFormat).toDate()) : null;
    output.schedule.end = event['DTEND'] ? (moment.utc(event['DTEND'], dateFormat).toDate()) : null;

    const start = output.schedule.start;

    if (start === null) {
        output.date = moment.utc(event['DTSTART;VALUE=DATE'], 'YYYYMMDD').toDate();
    } else {
        output.date = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    }

    output.calendarRaw = JSON.stringify(event);

    output.title = event['SUMMARY'];
    output.location = event['LOCATION'];

    let summary = event['SUMMARY'].replace(team.name, '').trim();

    output.flags.postponed = summary.includes('POSTPONED');
    output.flags.changed = summary.includes('CHANGED:');
    output.flags.cancelled = summary.includes('CANCELLED');

    // Remove artifacts
    if (output.flags.changed) {
        summary = summary.split('CHANGED:')[0];
    }

    if (output.flags.cancelled) {
        summary = summary.replace('CANCELLED', '');
    }

    summary = summary.replace('(Home)', '').replace('(Away)', '');

    // ******************* Text processing

    // Contains vs. === game
    if (summary.includes('vs.')) {
        output.model = 'SportsGameEvent';

        output.team = team._id;
        output.teamId = team.calendarId;

        const home = output.calendarRaw.includes('(Home)') || output.location === 'BB&N';
        output.home = home;

        const splitAroundVs = summary.split('vs.');

        let opponents = splitAroundVs[1].split(',');
        opponents = opponents.map(opponent => {
            return opponent.replace(/\\/g, '').replace('  ', ' ').trim();
        });

        output.opponents = opponents;

        // Multiple hyphens === tournament
    } else if (summary.includes('-')) {
        output.model = 'SportsTournamentEvent';

        output.team = team._id;
        output.teamId = team.calendarId;

        const home = output.calendarRaw.includes('(Home)') || output.location === 'BB&N';
        output.home = home;

        let tournamentName = summary.substring(summary.lastIndexOf('-') + 1, summary.length);
        output.tournament = tournamentName.replace(/\\/g, '').replace('  ', ' ').trim();

        // No game means practice
    } else {
        output.model = 'SportsPracticeEvent';

        output.team = team._id;
        output.teamId = team.calendarId;
    }

    return output;
}

function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
        end = new Date().getTime();
    }
}