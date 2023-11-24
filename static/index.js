var coCtx = document.getElementById('coChart').getContext('2d');
var no2Ctx = document.getElementById('no2Chart').getContext('2d');
var nh3Ctx = document.getElementById('nh3Chart').getContext('2d');

var coChart = createChart(coCtx, 'CO', 'red');
var no2Chart = createChart(no2Ctx, 'NO2', 'green');
var nh3Chart = createChart(nh3Ctx, 'NH3', 'blue');

function createChart(ctx, label, color) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: label,
                data: [],
                borderColor: color,
                borderWidth: 1,
                fill: false,
                showLine: true,
                pointRadius: 4,
                pointHoverRadius: 6,
                lineTension: 0.1,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            title: {
                display: true,
                text: 'Real-Time ' + label + ' Data'
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Concentration [ppm]'
                    },
                }
            }
        }
    });
}

no2Chart.options.scales.y.min = 0;
no2Chart.options.scales.y.max = 0.2;


var evtSource = new EventSource('/updates');
evtSource.onmessage = function(event) {
    var data = JSON.parse(event.data);
    var timestamp = new Date().toLocaleTimeString();

    // Check if 'CO' value reaches a certain number (example: 0.5)
    if (parseFloat(data["CO:"]) >= 3.55) {
        new Toast({
            message: 'CO: Carbon Monoxide is too high!' + "\nAt:&nbsp" + timestamp,
            type: 'danger'
        });
    }

    // Check if 'NO2' value reaches a certain number (example: 0.15)
    if (parseFloat(data["N02:"]) >= 0.15) {
        new Toast({
            message: 'N02: Nitrogen Oxide is getting too high!' + "\nAt:&nbsp" + timestamp,
            type: 'danger'
        });
    }

    // Check if 'NH3' value reaches a certain number (example: 10)
    if (parseFloat(data["NH3:"]) >= 13) {
        new Toast({
            message: 'NH3: Ammonia levels are too high!' + "\nAt:&nbsp" + timestamp,
            type: 'danger'
        });
    }

    if(coChart.data.datasets[0].data.length > 15) {
        coChart.data.labels.shift(timestamp);
        coChart.data.datasets[0].data.shift();
        coChart.update();

        no2Chart.data.labels.shift(timestamp);
        no2Chart.data.datasets[0].data.shift();
        no2Chart.update();

        nh3Chart.data.labels.shift(timestamp);
        nh3Chart.data.datasets[0].data.shift();
        nh3Chart.update();
    }


    coChart.data.labels.push(timestamp);
    coChart.data.datasets[0].data.push(data["CO:"]);
    coChart.update();

    no2Chart.data.labels.push(timestamp);
    no2Chart.data.datasets[0].data.push(data["N02:"]);
    no2Chart.update();

    nh3Chart.data.labels.push(timestamp);
    nh3Chart.data.datasets[0].data.push(data["NH3:"]);
    nh3Chart.update();
};