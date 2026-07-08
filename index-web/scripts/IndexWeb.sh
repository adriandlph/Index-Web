#!/bin/bash

DIR="$(cd "$(dirname "$0")/.." && pwd)"

cat << "EOF"
 ╔══════════════════════════════════╗
 ║        Index Web Vite            ║
 ╚══════════════════════════════════╝
EOF

echo ""
echo "  1) Start web"
echo "  2) Build"
echo "  3) Generate SSL certificate"
echo ""
echo "════════════════════════════════"
read -p "  Select an option (1-3): " option

case $option in
  1)
    echo "Running: npx vite"
    cd "$DIR" && npx vite
    ;;
  2)
    echo "Running: npm run build"
    cd "$DIR" && npm run build
    echo "Build complete. Output in dist/"
    ;;
  3)
    echo "Generating SSL certificate..."
    cd "$DIR"
    if [ -f secrets/cert.pem ] && [ -f secrets/key.pem ]; then
      echo "A certificate already exists in secrets/"
      read -p "Do you want to overwrite it? (y/N): " confirm
      if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo "Aborted"
        exit 0
      fi
    fi
    mkdir -p secrets
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
      -keyout secrets/key.pem \
      -out secrets/cert.pem \
      -subj "/CN=localhost/O=Index-Web/C=NA" \
      -addext "subjectAltName=DNS:localhost,IP:127.0.0.1" 2>/dev/null
    echo "Certificate generated at secrets/cert.pem"
    echo "Key generated at secrets/key.pem"
    ;;
  *)
    echo "Invalid option"
    exit 1
    ;;
esac
