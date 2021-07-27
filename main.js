var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template');
var path = require('path');

function templateHTML(title, list, body, controls){
  return `
  <!doctype html>
          <html>
          <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
          <link rel="stylesheet" href="style.css">
          <script src="colors.js"></script>
          </head>
          <body>
            <h1><a href="/"> WEB</a></h1>
            <input id="night_day" type="button" value="night" onclick="nightDayHandler(this)">
          <div id="grid">
          ${list}
          ${controls}
          ${body}
          <div id="article">
          </div>
          </div>
          </body>
          </html>
          `;
}

function templateList(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
          list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
          i = i + 1;
   }
  list = list + '</ul>';
  return list;
}

var app = http.createServer(function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if (pathname === '/') {
    if (queryData.id === undefined){
        fs.readdir('./data', 'utf8', function(error, filelist){
           var title = 'Welcome';
        var description = 'Hello, world';
        var list = template.list(filelist);
        var html = template.HTML(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);
          response.writeHead(200);
          response.end(html);
        });
       
    } else {
      fs.readdir('./data', 'utf8', function(error, filelist){
        var filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`, 'utf8', function(error, description) {
          var title = queryData.id;
          var list = template.list(filelist);
          var html = template.HTML(title, list, `<h2>${title}</h2>${description}`, 
          `<a href="/create">create</a> | 
          <a href="/update?id=${title}">update</a> | 
          <form action="delete_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <input type="submit" value="delete">
          </form>`);
        response.writeHead(200);
        response.end(html);
        });
      });
  }

    }
   else if(pathname === '/create'){
     fs.readdir('./data', 'utf8', function(error, filelist){
       var title = 'WEB - create';
       var list = template.list(filelist);
       var html = template.HTML(title, list, `
        <form action = "create_process" method="post">
          <P>
            <input type="text" name="title" placeholder="title">
          </P>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit" value="create">
          </p>
        </form>
       `, `<a href="/create">create</a>`);
       response.writeHead(200);
       response.end(html);
     });
   } else if(pathname === '/create_process'){
      var body = '';
      request.on('data', function(data){
        body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, function(err){
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end('Not Found');
        })
      });
   } else if(pathname === '/update'){
     fs.readdir('./data', 'utf8', function(error, filelist){
      var filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`, 'utf8', function(error, description) {
          var title = queryData.id;
          var list = template.list(filelist);
          var html = template.HTML(title, list, `
          <form action = "update_process" method="post">
            <input type="hidden" name="id" value="${title}">
          <P>
            <input type="text" name="title" placeholder="title" value="${title}>
          </P>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit" value="update">
          </p>
        </form>
          `, 
          `<a href="/create">create</a> | <a href="/update?id=${title}">update</a>`);
        response.writeHead(200);
        response.end(html);
        });
      });

   } else if(pathname === '/update_process'){
      var body = '';
      request.on('data', function(data){
        body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`, `data/${title}`, function(error1){
          fs.writeFile(`data/${title}`, description, function(error2){
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end('Not Found');
         });
        });   
      });
   } 
      else if(pathname === '/delete_process'){
          var body = '';
          request.on('data', function(data){
            body = body + data;
          });
          request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            var filteredId = path.parse(queryData.id).base;
            fs.unlink(`data/${filteredId}`, function(error){
                response.writeHead(302, 
                  {Location: `/`
                });
              response.end();

            })
          });
      }
      else {
      response.writeHead(404);
      response.end('Not Found');
    }

  });
app.listen(3000);