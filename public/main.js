const canvasWeekly = document.querySelector('#c-weekly');
const canvasMonthly = document.querySelector('#c-monthly');
const canvasYearly = document.querySelector('#c-yearly');
const socket = io();
var chartWeekly = new Chart(canvasWeekly, {
    type: 'scatter',
    data: {
        labels: [],
        datasets: [{
            label: 'temperature',
            data: []
        }],
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    }
});
var chartMonthly = new Chart(canvasMonthly, {
    type: 'scatter',
    data: {
        labels: [],
        datasets: [{
            label: 'temperature',
            data: []
        }],
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    }
});
var chartYearly = new Chart(canvasYearly, {
    type: 'scatter',
    data: {
        labels: [],
        datasets: [{
            label: 'temperature',
            data: []
        }],
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    }
});

let updated = false;

setInterval(() => {
    socket.emit('getData');
}, 5000);
socket.emit('getData');

socket.on('data', data => {
    document.querySelector('#img').src = `/cam.jpg?${Date.now()}`;
    if (!updated) {
        chartWeekly.destroy();
        chartWeekly = new Chart(canvasWeekly, {
            type: 'line',
            data: {
                labels: data.data.slice(-7).map(i => {
                    return i.date;
                }),
                datasets: returnLastData(data.data, 7),
                options: {
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    }
                }
            }
        });
        chartMonthly.destroy();
        chartMonthly = new Chart(canvasMonthly, {
            type: 'line',
            data: {
                labels: data.data.slice(-31).map(i => {
                    return i.date;
                }),
                datasets: returnLastData(data.data, 31),
                options: {
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    }
                }
            }
        });
        chartYearly.destroy();
        chartYearly = new Chart(canvasYearly, {
            type: 'line',
            data: {
                labels: data.data.slice(-365).map(i => {
                    return i.date;
                }),
                datasets: returnLastData(data.data, 365),
                options: {
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    }
                }
            }
        });
        updated = true;
    }
    document.querySelector('#temp').innerHTML = 'temperature: ' + data.currentData.temperature;
    document.querySelector('#light').innerHTML = 'light: ' + data.currentData.light;
    document.querySelector('#humidity').innerHTML = 'humidity : ' + data.currentData.humidity;
    document.querySelector('#winddir').innerHTML = 'winddirection: ' + data.currentData.winddirection;
    document.querySelector('#windspeed').innerHTML = 'windspeed: ' + data.currentData.windspeed;
    document.querySelector('#precipitation').innerHTML = 'precipitation today: ' + data.currentData.precipitation;
});

const swiper = new Swiper('.swiper', {
    direction: 'vertical',
    loop: true,
    pagination: {
        el: '.swiper-pagination',
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    },
    scrollbar: {
        el: '.swiper-scrollbar'
    }
});

function returnLastData(data, days) {
    return [
        {
            label: 'temperature',
            data: data.slice(-days).map(i => {
                return i.temperature;
            })
        },
        {
            label: 'light-level',
            data: data.slice(-days).map(i => {
                return i.light;
            })
        },
        {
            label: 'humidity',
            data: data.slice(-days).map(i => {
                return i.humidity;
            })
        },
        {
            label: 'windspeed',
            data: data.slice(-days).map(i => {
                return i.windspeed;
            })
        },
        {
            label: 'precipitation',
            data: data.slice(-days).map(i => {
                return i.precipitation;
            })
        }
    ];
}