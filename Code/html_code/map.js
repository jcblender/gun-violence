// This code references the example given in tutorial：Vis Exercise 08 & Vis Exercise07, which includes the example of choropleth maps with leaflet.js(https://leafletjs.com/examples/choropleth/)
// set the view of map to US


var mapdataAll, mapdatabyYear, myDataar, menuItem

var geojson

function getColor(d) {
    // console.log(d)
    return d > 15000 ? '#990000' :
        d > 11000 ? '#d7301f' :
            d > 8000 ? '#ef6548' :
                d > 5000 ? '#fc8d59' :
                    d > 2000 ? '#fdbb84' :
                        d > 1000 ? '#fdd49e' :
                            d > 500 ? '#fee8c8' : '#fff7ec';
}

function style(data) {
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '2',
        fillOpacity: 0.9,
        fillColor: getColor(data["properties"]["caseNumber"])
    };
}
function getupdatedColor(data) {
    return data > 3000 ? '#990000' :
        data > 2500 ? '#d7301f' :
            data > 1600 ? '#ef6548' :
                data > 800 ? '#fc8d59' :
                    data > 400 ? '#fdbb84' :
                        data > 200 ? '#fdd49e' :
                            data > 10 ? '#fee8c8' : '#fff7ec';
}
function updateStyle(data) {
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '2',
        fillOpacity: 0.9,
        fillColor: getupdatedColor(data["properties"][menuItem])
    };
}


function highlight(f) {

    f.target.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        f.target.bringToFront();
    }
    if (menuItem !== undefined && menuItem != "all") {
        // console.log(1)
        info.update2(f.target.feature.properties)
    } else {
        info.update(f.target.feature.properties)
    };
}
function resetHighlight(f) {
    geojson.resetStyle(f.target);
    info.update();
}

function onEachFeature(data, layer) {
    layer.on({
        mouseover: highlight,
        mouseout: resetHighlight,
    });
}

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>US Gun Violence number</h4>' + (props ?
        '<b>' + props.name + ':</b><br/>' + props.caseNumber + ' Cases'
        : 'Hover over a state');
};
info.update2 = function (props) {
    if (props[menuItem] == undefined) {
        props[menuItem] = "No"
    }
    this._div.innerHTML = '<h4>US Gun Violence number</h4>' + (props ?
        '<b>' + props.name + ':</b><br/>' + props[menuItem] + ' Cases'
        : 'Hover over a state');
};
info.addTo(map);
var legend = L.control({ position: 'bottomright' });
var text = []
var text2 = []
legend.onAdd = function (map) {

    this._div = L.DomUtil.create('div', 'legend')
    var level = [0, 500, 1000, 2000, 5000, 8000, 11000, 15000]
    var level2 = [0, 10, 200, 400, 800, 1600, 2500, 3000]
    var from, to;

    for (var i = 0; i < level.length; i++) {
        from = level[i];
        to = level[i + 1];

        text.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
    }
    console.log(text)
    for (var i = 0; i < level2.length; i++) {
        from = level2[i];
        to = level2[i + 1];

        text2.push(
            '<i style="background:' + getupdatedColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
    }

    console.log(text2)
    this.update()
    return this._div;
};
legend.update = function (map) {

    console.log(1)
    this._div.innerHTML = text.join('<br>')
}

legend.update2 = function (map) {
    this._div.innerHTML = text2.join('<br>')
    console.log(2)
}
function updateLegend() {
    if (menuItem !== undefined && menuItem != "all") {
        console.log(3)
        legend.update2()
    } else {
        console.log(4)
        legend.update()
    };
}
legend.addTo(map);

function dataProcessing(dataPred) {
    let statesFeature = statesData["features"]
    for (let index = 0; index < statesFeature.length; index++) {
        delete statesData["features"][index]["properties"]["density"];
        for (let i in dataPred) {
            if (dataPred[i].key == statesData["features"][index]["properties"]["name"]) {
                statesData["features"][index]["properties"]["values"] = dataPred[i].values;
                statesData["features"][index]["properties"]["caseNumber"] = dataPred[i].values.length / 2;
            }
        }
    }
}
var geodateData = statesData
console.log(geodateData)
function datedataPro(yearData) {
    let statesFeature = statesData["features"]
    for (let index = 0; index < statesFeature.length; index++) {

        for (let i in yearData) {
            if (yearData[i].key == statesData["features"][index]["properties"]["name"]) {
                yearData[i].values.forEach(element => {
                    let x = element.key
                    let y = element.value
                    // console.log(x)
                    // console.log(y)
                    geodateData["features"][index]["properties"][x] = y
                })
            }
        }
    }
}
console.log(geodateData)