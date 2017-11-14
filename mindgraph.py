import os
import webapp2

from views import views
import settings

SECS_PER_WEEK = 60 * 60 * 24 * 7
# Enable ctypes -> Jinja2 tracebacks
PRODUCTION_MODE = not os.environ.get(
    'SERVER_SOFTWARE', 'Development').startswith('Development')

ROOT_DIRECTORY = os.path.dirname(__file__)

if not PRODUCTION_MODE:
    # from google.appengine.tools.devappserver2.python import sandbox
    # sandbox._WHITE_LIST_C_MODULES += ['_ctypes', 'gestalt']
    TEMPLATE_DIRECTORY = os.path.join(ROOT_DIRECTORY, 'src')
else:
    TEMPLATE_DIRECTORY = os.path.join(ROOT_DIRECTORY, 'dist')

curr_path = os.path.abspath(os.path.dirname(__file__))

config = {
    'webapp2_extras.sessions': {
        'secret_key': settings.COOKIE_KEY,
        'session_max_age': SECS_PER_WEEK,
        'cookie_args': {'max_age': SECS_PER_WEEK},
        'cookie_name': 'echo_sense_session'
    },
    'webapp2_extras.jinja2': {
        'template_path': TEMPLATE_DIRECTORY
    }
}

app = webapp2.WSGIApplication(
    [

      # Cron jobs (see cron.yaml)
      # webapp2.Route('/cron/monthly', handler=cronActions.Monthly),

      webapp2.Route(r'/<:.*>', handler=views.MindGraphApp, name="App"),


    ],
    debug=True,
    config=config
)