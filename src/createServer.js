'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

function createServer() {
  /* Write your code here */
  // Return instance of http.Server class
  return http.createServer((req, res) => {
    const { url } = req;

    if (!url.startsWith('/file')) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Use /file/<filename> to load files');

      return;
    }

    if (!url.startsWith('/file/')) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });

      return res.end('Use /file/<filename> to load files');
    }

    const publicDir = path.resolve(__dirname, '..', 'public');
    let filePath = url.slice(6);

    if (filePath === '' || filePath === '/') {
      filePath = 'index.html';
    }

    if (filePath.includes('..')) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Bad Request');

      return;
    }

    if (filePath.includes('//')) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Bad Request');

      return;
    }

    const fullPath = path.join(publicDir, filePath);

    if (!fullPath.startsWith(publicDir)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Bad Request');

      return;
    }

    fs.readFile(fullPath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');

        return;
      }

      res.writeHead(200);
      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
