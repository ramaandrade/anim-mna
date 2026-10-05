#!/usr/bin/env python3
"""
serve.py
Servidor local HTTP para o AnimM&A: O Jogo do Controle Corporativo
Sem dependências externas, com headers no-cache para desenvolvimento fluido.
"""
import http.server
import socketserver
import os
import sys

PORT = 3001

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    port = PORT
    for attempt in range(10):
        try:
            with socketserver.TCPServer(("", port), NoCacheHandler) as httpd:
                print("=" * 60)
                print(f"🚀 AnimM&A Mobile PWA rodando com sucesso!")
                print(f"📱 Acesse no navegador: http://localhost:{port}")
                print(f"💡 Dica Mobile: Pressione F12 no Chrome e ative o 'Device Toolbar' (Ctrl+Shift+M)")
                print("=" * 60)
                try:
                    httpd.serve_forever()
                except KeyboardInterrupt:
                    print("\nServidor encerrado.")
                break
        except OSError:
            port += 1

if __name__ == '__main__':
    main()
