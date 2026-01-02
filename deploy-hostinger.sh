#!/bin/bash

#################################################
# Hostinger Cloud Deployment Script
# For Next.js QR Code App
#################################################

set -e  # Exit on any error

echo "🚀 Starting Hostinger Cloud Deployment..."
echo ""

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="markedqr"
APP_DIR="/var/www/qr-code-app"
DOMAIN="markedqr.com"
NODE_VERSION="20"

echo -e "${YELLOW}Step 1:${NC} Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "Installing Node.js ${NODE_VERSION}..."
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo -e "${GREEN}✓${NC} Node.js already installed: $(node --version)"
fi

echo ""
echo -e "${YELLOW}Step 2:${NC} Creating application directory..."
sudo mkdir -p ${APP_DIR}
sudo chown -R $USER:$USER ${APP_DIR}

echo ""
echo -e "${YELLOW}Step 3:${NC} Cloning repository..."
if [ -d "${APP_DIR}/.git" ]; then
    echo "Repository already exists, pulling latest changes..."
    cd ${APP_DIR}
    git pull
else
    git clone https://github.com/Jerry2d3d/qr-code-app.git ${APP_DIR}
    cd ${APP_DIR}
fi

echo ""
echo -e "${YELLOW}Step 4:${NC} Creating production environment file..."
cat > .env.production << 'EOF'
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://markedqr.com

MONGODB_URI=mongodb+srv://jhansenportfolio_db_user:l9z2PQG1muSKVR4k@cluster0.zpw6vjm.mongodb.net/qr-code-app?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=fB/w6sMjbIvvvW5ryTUMP5/rVHACm4eH31q9m8VOQP8=
JWT_EXPIRES_IN=7d
EOF
echo -e "${GREEN}✓${NC} Environment file created"

echo ""
echo -e "${YELLOW}Step 5:${NC} Installing dependencies..."
npm install --production=false

echo ""
echo -e "${YELLOW}Step 6:${NC} Building production app..."
npm run build

echo ""
echo -e "${YELLOW}Step 7:${NC} Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
    echo -e "${GREEN}✓${NC} PM2 installed"
else
    echo -e "${GREEN}✓${NC} PM2 already installed"
fi

echo ""
echo -e "${YELLOW}Step 8:${NC} Starting application with PM2..."
# Stop existing instance if running
pm2 delete ${APP_NAME} 2>/dev/null || true

# Start new instance
pm2 start npm --name "${APP_NAME}" -- start

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER
pm2 save

echo ""
echo -e "${YELLOW}Step 9:${NC} Configuring Nginx..."
sudo tee /etc/nginx/sites-available/${DOMAIN} > /dev/null << 'NGINX_EOF'
server {
    listen 80;
    server_name markedqr.com www.markedqr.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX_EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/

# Test nginx config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx

echo ""
echo -e "${YELLOW}Step 10:${NC} Setting up SSL certificate..."
if command -v certbot &> /dev/null; then
    echo "Certbot already installed"
else
    echo "Installing Certbot..."
    sudo apt install -y certbot python3-certbot-nginx
fi

# Get SSL certificate
sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos --email admin@${DOMAIN} || echo "SSL setup skipped - run manually"

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "Your app is now running at: ${GREEN}https://${DOMAIN}${NC}"
echo ""
echo "Useful commands:"
echo "  pm2 status              - Check app status"
echo "  pm2 logs ${APP_NAME}    - View logs"
echo "  pm2 restart ${APP_NAME} - Restart app"
echo "  pm2 stop ${APP_NAME}    - Stop app"
echo ""
echo "To update your app after code changes:"
echo "  cd ${APP_DIR}"
echo "  git pull"
echo "  npm install"
echo "  npm run build"
echo "  pm2 restart ${APP_NAME}"
echo ""
