from django.urls import path
from channels.routing import ProtocolTypeRouter, URLRouter
from chat.routing import websocket_urlpatterns

# Web socket URL routing

application = ProtocolTypeRouter({
    "websocket": URLRouter(websocket_urlpatterns),
})

