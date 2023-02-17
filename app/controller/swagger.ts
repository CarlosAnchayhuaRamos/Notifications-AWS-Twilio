import { Service } from 'typedi';
import { readFileSync } from 'fs';
import { MessageUtil } from '../utils/message';

@Service()
export class SwaggerUI {
    constructor() { }

    swagger(event: any) {
        if (process.env.NODE_ENV === 'prod') {
            return MessageUtil.error(404, 'service not found');
        }
        const fileDoc = JSON.parse(readFileSync('swagger/swagger.json', 'utf8'));
        const pathSwagger = process.env.NODE_ENV === 'local' ? '/swagger' : '/swagger';
        if (event.rawPath === '/swagger/swagger.json') {
            return {
                statusCode: 200,
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(fileDoc),
            };
        }
        console.log('Swagger controller -- event', event);
        console.log('pathSwagger ', pathSwagger);
        event.rawPath = pathSwagger;
        const body = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Documentación</title>
            <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.14.0/swagger-ui.css">
        </head>
        <body>
            <div id="swagger"></div>
            <script src="https://unpkg.com/swagger-ui-dist@4.14.0/swagger-ui-standalone-preset.js"></script>
            <script src="https://unpkg.com/swagger-ui-dist@4.14.0/swagger-ui-bundle.js"></script>
            <script>
            const AdvancedFilterPlugin = function (system) {
              return {
                fn: {
                  opsFilter: function (taggedOps, phrase) {
                    phrase = phrase.toLowerCase()
                    var normalTaggedOps = JSON.parse(JSON.stringify(taggedOps));
                    for (tagObj in normalTaggedOps) {
                      var operations = normalTaggedOps[tagObj].operations;
                      var i = operations.length;
                      while (i--) {
                        var operation = operations[i].operation;
                        if ((operations[i].path.toLowerCase().indexOf(phrase) === -1)
                          && (operation.summary.toLowerCase().indexOf(phrase) === -1)
                          && (operation.description.toLowerCase().indexOf(phrase) === -1)
                        ) {
                          operations.splice(i, 1);
                        }
                      }
                      if (operations.length == 0 ) {
                        delete normalTaggedOps[tagObj];
                      }
                      else {
                        normalTaggedOps[tagObj].operations = operations;
                      }
                    }
            
                    return system.Im.fromJS(normalTaggedOps);
                  }
                }
              };
            };
            SwaggerUIBundle({
                dom_id: '#swagger',
                url: '${pathSwagger}/swagger.json',
                presets: [
                  SwaggerUIBundle.presets.apis,
                  SwaggerUIStandalonePreset
                ],
                deepLinking: true,
                plugins: [
                  SwaggerUIBundle.plugins.DownloadUrl,
                  AdvancedFilterPlugin
                ],
                filter: true,
            });
            </script>
        </body>
        </html>`;

        return {
            statusCode: 200,
            headers: {
                ['Content-Type']: 'text/html',
            },
            body,
        };
    }
}