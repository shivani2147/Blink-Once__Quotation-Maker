import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function savePdfPlugin() {
  return {
    name: 'save-pdf-plugin',
    configureServer(server) {
      server.middlewares.use('/api/save-pdf', (req, res, next) => {
        if (req.method === 'POST') {
          const category = req.headers['x-category'] || 'default';
          const filename = req.headers['x-filename'] || 'Quotation.pdf';
          
          const decodedCategory = decodeURIComponent(category);
          const decodedFilename = decodeURIComponent(filename);

          const targetDir = path.join(process.cwd(), 'Saved Quotations', decodedCategory);
          
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }

          const targetPath = path.join(targetDir, decodedFilename);
          const writeStream = fs.createWriteStream(targetPath);
          
          req.pipe(writeStream);
          
          req.on('end', () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, path: targetPath }));
          });
          
          req.on('error', (err) => {
            console.error('Error saving PDF:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
          });
        } else {
          next();
        }
      });

      server.middlewares.use('/api/list-pdfs', (req, res, next) => {
        if (req.method === 'GET') {
          try {
            const url = new URL(req.url, `http://${req.headers.host}`);
            const category = url.searchParams.get('category') || 'default';
            const decodedCategory = decodeURIComponent(category);
            const targetDir = path.join(process.cwd(), 'Saved Quotations', decodedCategory);
            
            let files = [];
            if (fs.existsSync(targetDir)) {
              files = fs.readdirSync(targetDir)
                .filter(file => file.endsWith('.pdf'))
                .map(file => ({
                  name: file,
                  path: `/api/serve-pdf?category=${encodeURIComponent(category)}&filename=${encodeURIComponent(file)}`
                }));
            }
            
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, files }));
          } catch (err) {
            console.error('Error listing PDFs:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        } else {
          next();
        }
      });

      server.middlewares.use('/api/serve-pdf', (req, res, next) => {
        if (req.method === 'GET') {
          try {
            const url = new URL(req.url, `http://${req.headers.host}`);
            const category = url.searchParams.get('category');
            const filename = url.searchParams.get('filename');
            
            if (!category || !filename) {
              res.statusCode = 400;
              res.end('Missing category or filename');
              return;
            }

            const decodedCategory = decodeURIComponent(category);
            const decodedFilename = decodeURIComponent(filename);
            const filePath = path.join(process.cwd(), 'Saved Quotations', decodedCategory, decodedFilename);

            if (fs.existsSync(filePath)) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/pdf');
              res.setHeader('Content-Disposition', `inline; filename="${decodedFilename}"`);
              fs.createReadStream(filePath).pipe(res);
            } else {
              res.statusCode = 404;
              res.end('PDF not found');
            }
          } catch (err) {
            console.error('Error serving PDF:', err);
            res.statusCode = 500;
            res.end('Internal server error');
          }
        } else {
          next();
        }
      });

      server.middlewares.use('/api/delete-pdf', (req, res, next) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const { category, filename } = JSON.parse(body);
              const sourceDir = path.join(process.cwd(), 'Saved Quotations', category);
              const sourceFile = path.join(sourceDir, filename);

              if (fs.existsSync(sourceFile)) {
                const targetDir = path.join(sourceDir, 'Deleted Files');
                if (!fs.existsSync(targetDir)) {
                  fs.mkdirSync(targetDir, { recursive: true });
                }
                const targetFile = path.join(targetDir, filename);
                fs.renameSync(sourceFile, targetFile);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, message: 'Moved to Deleted Files' }));
              } else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, message: 'File not found on disk' }));
              }
            } catch (err) {
              console.error('Error moving deleted PDF:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
        } else {
          next();
        }
      });
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), savePdfPlugin()],
})
