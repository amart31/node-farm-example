const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

//read files once
const tempHome = fs.readFileSync(`${__dirname}/html/home.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/html/cards.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/html/product.html`, 'utf-8');
//get the data from data.json
const data = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
    const dataObj = JSON.parse(data);
//create server
const server = http.createServer((req, res) => {
    //parse url 
    const { query, pathname } = url.parse(req.url, true);

//Overview page
    if(pathname === '/' || pathname === '/home') {
        res.writeHead(200, {'Content-type': 'text/html'})

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempHome.replace('{%PRODUCT_CARDS%}', cardsHtml);

        res.end(output);

//Product page        
    } else if (pathname === '/product') {
        res.writeHead(200, {'Content-type': 'text/html'})
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);


        res.end(output);

//API        
    } else if (pathname === '/api') { 
            res.writeHead(200, { 'Content-type': 'application/json'});
            res.end(data);
    
//not found
        } else {
        res.writeHead(404, {
            'Content-type': 'text/html'
        });
        res.end('<h1>Page not found</h1>');
    }
    
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
})