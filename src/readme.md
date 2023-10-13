# Internal

this readme is for developer

there is 3 module

- `client`, client side attribute driven interactivity
- `http`, process http request to response
- `print`, server side jsx based html templating
- `router`, express like router

each module have integration to each other

currently wingman does not have integration for database

## Flow

register will assign global variable for `print` or debugging utility.

initialize new router

at server initialization, router collect all routes and its plugin.

a plugin can be function that run before main handler, decorator will create variable
at request time, transform will transform response from main handler.

at request, `http` event is created and process resulting http response, then the router
send the response back.

to use print, we need to assign to router as plugin, it will handle layout and html specifig
config.

