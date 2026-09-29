import functools, os, sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4321

os.chdir(ROOT)


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))


httpd = ThreadingHTTPServer(("127.0.0.1", PORT), functools.partial(Handler, directory=ROOT))
print("serving %s on http://localhost:%d" % (ROOT, PORT), flush=True)
httpd.serve_forever()
