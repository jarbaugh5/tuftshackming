'use strict';

/*
 * data is an array of tweets
 *
 * A breakdown of a tweet:
 * http://dev.twitter.com/docs/platform-objects/tweets
 */
/* jshint -W117 */

var drawTimeseries = function (tweets) {
    if (!tweets) {
        return;
    }

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');

    var line = d3.svg.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.count);
        });

    var svg = d3.select('svg.chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    d3.json('mings_tweets.json', function (err, data) {
        if (err) {
            console.error('Could not load ming\'s tweets!');
            return;
        }

        // Group the tweets by day
        var dateTable = {};
        data.forEach(function (d) {
            if (!d.created_at) {
                return;
            }
            var date = new Date(d.created_at);
            date.setHours(0, 0, 0, 0);
            var key = date.getTime();
            if (dateTable[key]) {
                dateTable[key]++;
            } else {
                dateTable[key] = 1;
            }
        });

        var dates = [];
        var keys = Object.keys(dateTable);
        keys.forEach(function (key) {
            dates.push({
                date: key,
                count: dateTable[key]
            });
        });

        x.domain(d3.extent(dates, function (d) { return d.date; }));

        y.domain(d3.extent(dates, function (d) { return d.count; }));

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('# Tweets');

        svg.append('path')
            .datum(dates)
            .attr('class', 'line')
            .attr('d', line);
    });
};

var drawFriends = function (tweets) {
    if (!tweets) {
        return;
    }

    console.log('drawFriends!');
};

var tweets = null;
if (!tweets) {
    d3.json('mings_tweets.json', function(err, data) {
        tweets = data;
        drawTimeseries(tweets);
    });
}

$('.nav.nav-tabs li:eq(0) a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
//    drawTimeseries(tweets);
});

$('.nav.nav-tabs li:eq(1) a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
    drawFriends(tweets);
});
