# -*- coding: utf-8 -*-
"""Gelistirme sunucusu.

python -m http.server, yanitlarina Cache-Control gondermez; tarayici da
Last-Modified'a bakarak sezgisel olarak onbellege alir. Bu yuzden dosya
degistigi halde ekranda eski hali gorunebiliyor. Bu sunucu her yanita
no-store ekleyerek bu davranisi kapatir. Yalnizca gelistirme icindir.
"""
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class OnbelleksizIstek(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def send_head(self):
        # Sartli istekleri yok say: 304 yerine her zaman tam icerik don
        self.headers.replace_header("If-Modified-Since", "") \
            if "If-Modified-Since" in self.headers else None
        if "If-None-Match" in self.headers:
            del self.headers["If-None-Match"]
        return super().send_head()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5510
    print("Gelistirme sunucusu (onbelleksiz): http://localhost:%d" % port)
    ThreadingHTTPServer(("0.0.0.0", port), OnbelleksizIstek).serve_forever()
