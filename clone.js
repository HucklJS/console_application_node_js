const glob = require('glob')
const fs = require('fs');
const parse = require('parse-gitignore');

// Получаем аргументы из командной строки
const [
    ,
    ,
    p,
    search,
    ignore
] = process.argv

// Парсим .globignore и узнаем какие файлы нам не интересны
const globIgnoreList = ignore ? parse(fs.readFileSync(ignore)) : null;

// Создем объект с параметрами для поиска файлов
const options = {
    cwd: p,
    ignore: globIgnoreList,
    absolute: true
}

// Начинаем поиск и дальнейшие действия
glob(search, options, (err, files) => {
    if (err) {
        console.log(err)
    } else {
        console.log(files)

        files.forEach(file => {
            fs.readFile(file, 'utf8', (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    const firstLine = data.split('\n')[0]
                    if (!firstLine.includes('/script was here/')) {

                    }
                }
            })
        })
    }
})