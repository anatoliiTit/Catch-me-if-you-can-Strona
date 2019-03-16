// długość i szerokość geograficzna dla Krakowa
let lat = 50.05;
let lng = 19.95;

// funkcja tworząca mapę z markerami (z możliwością ich przesuwania strzałkami na klawiaturze)
function initMap() 
{
    let map = document.getElementById('map');
    let position = {lat: lat, lng: lng};
    let googleMap = new google.maps.Map(map, {zoom: 5, center: position});
    marker = new google.maps.Marker({position: position, map: googleMap});
    marker2 = new google.maps.Marker({position: position, map: googleMap});

    document.addEventListener('keydown', (e) => {
        switch(e.keyCode)
        {
            case 38:
                lat += 0.05;
                break;
            case 40:
                lat -= 0.05;
                break;
            case 37:
                lng -= 0.05;
                break;
            case 39:
                lng += 0.05;
                break;
        }
        
        marker.setPosition({lat: lat, lng: lng});
        let data = { "1" : lat, "2" : lng, "3" : "marker", "7" : user.value};
        let message = JSON.stringify(data);
        websocket.send(message);
        });
}

chat = document.getElementById("chat");
message = document.getElementById("message");
user = document.getElementById("user");
dot = document.getElementById("dot");

// funkcja wysyłająca wiadomości
function addMessage() 
{
    let mdata = { "4" : user.value,"5" : message.value, "6" : "message"};
    let message = JSON.stringify(mdata);
    message.value = "";
    user.value;
    websocket.send(message);
}

// funkcja odbierająca wiadomości
function onMessage(evt) 
{
    user.value;
    let message = evt.data;
    let pozycja = JSON.parse(message);
    if (pozycja['6'] === "message" )
    {
        message = chat.innerHTML = '<li class = "message">' + 
        pozycja['4'] + " : " + pozycja['5'] + "</li>" + chat.innerHTML;
    }
    else if (pozycja['3'] === "marker" && pozycja['7'] !== user.value )
    {
        marker2.setPosition({ lat: 50 + pozycja['1'], lng: 20 + pozycja['2'] });
    }
}

// funkcja wyświetlająca zielony znacznik, gdy chat jest włączony (WebSocket działa)
function onOpen(evt) 
{
    dot.className = "fas fa-circle green";
}

// funkcja wyświetlająca czerwony znacznik gdy chat jest wyłączony (WebSocket nie działa)
function onClose(evt) 
{
    dot.className = "fas fa-circle red";
    window.alert("WebSocket is Offline");
}

// funkcja informująca o błędzie połączenia z WebSocketem
function onError(evt) 
{
    dot.className = "fas fa-circle red";
    window.alert("WebSocket error");
}

function onLoad() {
    let webSocketSrc = "ws://design.net.pl:8010";
    websocket = new WebSocket(webSocketSrc);
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
}

if (window.WebSocket === undefined) 
{
    window.alert("WebSocket is not supported");
    dot.className = "fas fa-circle red";
}
else 
{
    if (typeof String.prototype.startsWith != "function") 
    {
        String.prototype.startsWith = function (str) {
        return this.indexOf(str) == 0}
    }
    window.addEventListener("load", onLoad, false);
}