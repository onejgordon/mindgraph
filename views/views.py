from datetime import datetime
import handlers


class MindGraphApp(handlers.BaseRequestHandler):
    def get(self, *args, **kwargs):
        d = {}
        d['constants'] = {}
        self.render_template("index.html", **d)
