let LineReader = require('./LineReader');
let reader = new LineReader('./reader.txt', 'utf8');
reader.on('newLine', data => {
    console.log(data);
});
reader.on('end', () => {
    console.log('over');
});