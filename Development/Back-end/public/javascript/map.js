
var map;
var openedInfoWindow;

function initMap() {
map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 32.0, lng: 34.7},
    zoom: 10
});

map.addListener('bounds_changed', function() {
    getAssetsInViewPort();
});
}

function getAssetsInViewPort() {
    var bounds = map.getBounds().toJSON();

    var url = "assets_public/within/box/" + bounds.north + "," + bounds.east + "/" + bounds.south  + "," + bounds.west;
    $.ajax({
        url: url,
        data : query
    }).success(function(result) {
        console.log(result.length + ' properties found');
        showAssetsOnMap(result);
    });
}

function formatAddress(address) {
    var formattedAddress = "";
    if (address.street)  
        formattedAddress += address.street + ' ';
    if (address.number)  
        formattedAddress += address.number + ', ';
    
    if (address.city)  
        formattedAddress += address.city + ', ';

    if (address.city)  
        formattedAddress += address.country;

    return formattedAddress;
}

function formatHeader(property) {
    return property.numOfRooms + ' Rooms, ' + property.price.formatCurrency(property.priceCurrency, 0);
}

function showAssetsOnMap(assetsArray) {
    
    
    assetsArray.forEach(function(property) {
        var location = convertLocationMongoToGoogle(property.geoLocation);
        var iconPath = getIconPath(property);
        var contentString = 
                '<div class="iw-container">' +
                    '<div class="iw-title">' + formatHeader(property) + '</div>' +
                    '<ul >' + 
                        '<li>Listing Type: ' + property.listingType +  '</li>' +
                        '<li>Property Type: ' + property.type + '</li>' +
                        '<li> ' + property.numOfRooms + ' Rooms </li>' + 
                        '<li>Price: ' + property.price.formatCurrency(property.priceCurrency, 0) + '</li>' +
                        '<li>Address: ' + formatAddress(property.address) + '</li>' +
                    '</ul>' +
                '</div>'; 

        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });

        var marker = new google.maps.Marker({
            position: location,
            map: map,
            icon: iconPath
        });

        marker.addListener('click', function() {
            if (openedInfoWindow)
                openedInfoWindow.close();
            infowindow.open(map, marker);
            openedInfoWindow = infowindow;
        });
    });
}

function getIconPath(item) {
    if (item.type === 'house') {
        return 'images/house-icon.png';
    } else if (item.type === 'apartment') {
        return 'images/apartment-icon.png';
    }
}

function convertLocationMongoToGoogle(location) {
    coords = location.coordinates;
    return { "lat" : coords[0], "lng" : coords[1]};
}

// c - num of decimal digits
// d - decimal delimiter
// t -= thousands delimiter
Number.prototype.formatNumber = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

 Number.prototype.formatCurrency = function(currency, decimalDigits){
    switch (currency) {
        case "ILS":
            return this.formatNumber(decimalDigits) + '&#8362;'
        case "USD":
            return this.formatNumber(decimalDigits) + '&#36;'
        case "EUR":
            return this.formatNumber(decimalDigits) + '&#128;'
    }
    
 };