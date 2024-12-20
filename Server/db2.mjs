import { createServer } from 'node:http';
import { createClient } from '@libsql/client';

let token = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE3NjMyMTUyMzMsImlhdCI6MTczMTY3OTIzMywiaWQiOiJlYWQyYjg1NS0zNzFlLTQ4MTMtYjgyYS1kODRmZTFhZDZkYzMifQ.GVYcH-xRbUsMOfD_GEvOTW0qW-IhYy8vJQfgtR2b8pP9zyHSSP26u2TwS1BEdU6vJZKOj78n6AmLHIdT4qyFAw";

const turso = createClient({
    url: "libsql://webtech-s0583272.turso.io",
    authToken: token,
});

function getQueryParams(url) {
    const params = {};
    new URLSearchParams(url.split('?')[1]).forEach((value, key) => {
        params[key] = value;
    });
    return params;
}

async function getProductById(productId) {
    try {
        const response = await turso.execute("SELECT * FROM Produkte WHERE id = ?", [productId]);
        if (response.rows.length > 0) {
            return response.rows[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error("Fehler beim Abrufen des Produkts:", error);
        return null;
    }
}

function requestHandler(request, response) {
    response.statusCode = 200;

    const { id } = getQueryParams(request.url);

    if (id) {
        getProductById(id).then(product => {
            if (product) {
                response.setHeader('Content-Type', 'text/html');
                response.end(`
                    <!DOCTYPE html>
                    <html lang="de">
                    <head>
                        <meta charset="UTF-8">
                        <title>Produktanzeige</title>
                    </head>
                    <body>
                        <h1>Produktdetails</h1>
                        <p>Name: ${product.bezeichnung}</p>
                        <p>Preis: ${product.preis}</p>
                        <p>Menge: ${product.menge}</p>
                        <form action="/" method="GET">
                            <input type="number" name="id" placeholder="Produkt-ID eingeben">
                            <button type="submit">Produkt laden</button>
                        </form>
                    </body>
                    </html>
                `);
            } else {
                response.setHeader('Content-Type', 'text/html');
                response.end(`
                    <!DOCTYPE html>
                    <html lang="de">
                    <head>
                        <meta charset="UTF-8">
                        <title>Produktanzeige</title>
                    </head>
                    <body>
                        <h1>Produkt nicht gefunden</h1>
                        <form action="/" method="GET">
                            <input type="number" name="id" placeholder="Produkt-ID eingeben">
                            <button type="submit">Produkt laden</button>
                        </form>
                    </body>
                    </html>
                `);
            }
        }).catch(error => {
            response.statusCode = 500;
            response.setHeader('Content-Type', 'text/html');
            response.end(`
                <!DOCTYPE html>
                <html lang="de">
                <head>
                    <meta charset="UTF-8">
                    <title>Fehler</title>
                </head>
                <body>
                    <h1>Fehler beim Abrufen des Produkts</h1>
                    <form action="/" method="GET">
                        <input type="number" name="id" placeholder="Produkt-ID eingeben">
                        <button type="submit">Produkt laden</button>
                    </form>
                </body>
                </html>
            `);
        });
    } else {
        response.setHeader('Content-Type', 'text/html');
        response.end(`
            <!DOCTYPE html>
            <html lang="de">
            <head>
                <meta charset="UTF-8">
                <title>Produktanzeige</title>
            </head>
            <body>
                <h1>Bitte geben Sie eine Produkt-ID ein</h1>
                <form action="/" method="GET">
                    <input type="number" name="id" placeholder="Produkt-ID eingeben">
                    <button type="submit">Produkt laden</button>
                </form>
            </body>
            </html>
        `);
    }
}

const server = createServer(requestHandler);

server.listen(3000, '127.0.0.1', () => {
    console.log('Server started');
});