import http from 'http';

export const startHealthServer = (port: number) => (message: string): void => {
  http.createServer((req, res) => {
    res.statusCode = 200;
  
    return res.end(message);
  }).listen(port, '0.0.0.0');
};
