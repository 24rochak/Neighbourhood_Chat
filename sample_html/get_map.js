// Initialize and add the map
function getAverage(loc1,loc2){
  return {lat:(loc1["lat"]+loc2["lat"])/2, lng:(loc1["lng"]+loc2["lng"])/2};
}

function test(){
  console.log("marker clicked");
}

function initMap() {
// The location of Uluru
var loc1 = {lat: 40.636851, lng: -74.0326267};
var loc2 = {lat: 40.634520, lng: -74.021227};
// The map, centered at Uluru
var map = new google.maps.Map(
    document.getElementById('right_block'),
    { zoom: 14,
      center: getAverage(loc1,loc2),
      disableDefaultUI: true,
      zoomControl: true});
// The marker, positioned at Uluru
var marker = new google.maps.Marker({position: loc1, map: map, label: 'Rochak'});
var marker2 = new google.maps.Marker({position: loc2, map: map, label: 'Ares'});
var content1 = "hello";

var bounds = {
  north: 40.64,//top
  south: 40.63,//bottom
  east: -74.01,//right
  west: -74.03//left
};

var bounds2 = {
  north: 0,//top
  south: 0,//bottom
  east: 0,//right
  west: 0//left
};

var rectangle = new google.maps.Rectangle({
  bounds: bounds,
  fillColor: 'blue',
  strokeOpacity: 0.3,
  strokeWeight: 2,
  strokeColor: 'blue',
  fillOpacity: 0.35,
  editable: false,
  map:map
});

var show = true;

marker.addListener('click', function() {
  infowindow.open(map,marker);
  });

map.addListener('click',function () {
  console.log("Map clicked");
})

var infowindow = new google.maps.InfoWindow({
          content: content1
});

var legend = document.getElementById('legend');

var div = document.createElement('div');
var icon = "https://maps.google.com/mapfiles/kml/shapes/library_maps.png";
//var name = "<h5>icon text 1</h5>";
var name = "icon text 1";
div.innerHTML = '<img src="' + icon + '"> ' + name;
legend.appendChild(div);

var div = document.createElement('div');
var icon = "https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png";
//var name = "<h5>icon text 2</h5>";
var name = "icon text 2";
div.innerHTML = '<img src="' + icon + '"> ' + name;
legend.appendChild(div);

map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);

legend.childNodes[2].addEventListener("click", function(){
  show = !show;
  rectangle.setVisible(show);
});
}//init end
