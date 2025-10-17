fetch('http://localhost:3000/secret', {
    headers: { 'x-api-key': '12345' }
})
.then(res => res.json())
.then(console.log);