module.exports = {
  HTML:function(title, list, body, controls){
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
    },
    list:function(filelist){
      var list = '<ul>';
      var i = 0;
      while(i < filelist.length){
              list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
              i = i + 1;
      }
      list = list + '</ul>';
      return list;
    }
}