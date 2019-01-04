const mongoose = require('mongoose');
const redis = require('redis').createClient();

const ical = require('ical-toolkit');
const download = require('download');
const moment = require('moment');

const globalUrl = 'https://www.bbns.org/cf_calendar/feed.cfm?type=ical&feedID=4C21C6845B904089A90AF02BBD2B6290';

module.exports.name = 'sports';

module.exports.fetchByDate = (date, props) => {
    const team = props.team;

    // If team IDS were provided and we haven't checked each team in a while, we fetch from url
    // If team wasn't provided and we haven't checked global in a while, we fetch from url
    
    // If we were supplied team ids, then we go thr    
    return new Promise(async (resolve, reject) => {
        const SportsEvent = mongoose.model('SportsEvent');
            
        
    });
}

async function fetchGlobalSportingEvents() {
    const raw = await download(globalUrl);
    
    const ics = await ical.parseToJSON(raw);
    
    const parsedOutput = cleanICS(ics);
}

async function fetchTeamSportingEvents(teamId) {
    const raw = await download(teamUrl(teamId));
    
    const ics = await ical.parseToJSON(raw);
    
    const parsedOutput = cleanICS(ics);
}

function teamUrl(teamId) {
    return `https://www.bbns.org/calendar/team_${ teamId }.ics`;
}

async function parseRawICal(raw) {
    const ics = await ical.parseToJSON(raw);
    const parsedOutput = cleanICS(ics);
    
    return parsedOutput;
}

function cleanICS(ics) {
    let output = {};

    const root = ics['VCALENDAR'][0];

    output.title = root['X-WR-CALNAME'];

    output.events = root['VEVENT'].map(event => {
        return interpretEvent(event);
    });

    return output;
}

function interpretEvent(event) {
    let output = {};

    output.uid = event['UID'];

    const dateFormat = 'YYYYMMDD HHmmss';

    output.time = {};
    output.time.start = moment.utc(event['DTSTART'], dateFormat).toDate();
    output.time.end = event['DTEND'] ? (moment.utc(event['DTEND'], dateFormat).toDate()) : null;

    output.raw = event['SUMMARY'];

    output.details = {};
    output.details.location = event['LOCATION'];

    let summary = event['SUMMARY'];

    output.details.notifications = {}
    output.details.notifications.changed = summary.includes('CHANGED:');
    output.details.notifications.cancelled = summary.includes('CANCELLED');

    output.team = {};
    output.team.sport = summary.split('-')[0].trim().toLowerCase();

    // Remove sport. We can extract the section later.
    summary = summary.substring(summary.indexOf('-') + 1, summary.length);

    // Remove artifacts
    if (output.details.notifications.changed) {
        summary = summary.split('CHANGED:')[0];
    }

    if (output.details.notifications.cancelled) {
        summary = summary.replace('CANCELLED', '');
    }

    summary = summary.replace('(Home)', '').replace('(Away)', '');

    // ******************* Text processing

    // Contains vs. === game
    if (summary.includes('vs.')) {
        output.type = 'game';

        const home = output.raw.includes('(Home)') || output.details.location === 'BB&N';
        output.details.home = home;

        const splitAroundVs = summary.split('vs.');

        const sections = splitAroundVs[0];
        output.team.sections = sections.split('&').map(section => {
            return section.trim().toLowerCase();
        });

        let opponents = splitAroundVs[1].split(',');
        opponents = opponents.map(opponent => {
            return opponent.replace(/\\/g, '').replace('  ', ' ').trim();
        });

        output.details.opponents = opponents;

        // Multiple hyphens === tournament
    } else if (summary.includes('-')) {
        output.type = 'tournament';

        const home = output.raw.includes('(Home)') || output.details.location === 'BB&N';
        output.details.home = home;

        const sections = summary.substring(0, summary.lastIndexOf('-'));
        output.team.sections = sections.split('&').map(section => {
            return section.trim().toLowerCase();
        });

        let tournamentName = summary.substring(summary.lastIndexOf('-') + 1, summary.length);
        output.details.tournament = tournamentName.replace(/\\/g, '').replace('  ', ' ').trim();

        // No game means practice
    } else {
        output.type = 'practice';

        output.team.sections = summary.split('&').map(section => {
            return section.trim().toLowerCase();
        });
    }

    return output;
}