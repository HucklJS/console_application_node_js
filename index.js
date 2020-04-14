// "/script was here/\n\n"
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
// (считаем, что .globignore файл не очень большой и быстро прочитается)
const globIgnoreList = ignore ? parse(fs.readFileSync(ignore)) : null;

// Создаем объект с параметрами для поиска файлов
const options = {
    cwd: p,
    ignore: globIgnoreList,
    absolute: true
}

// Начинаем поиск и дальнейшие действия
glob(search, options, (e, files) => {
    if (e) {
        console.log(e)
    } else {
        console.log(files)

        files.forEach(file => {
            fs.readFile(file, 'utf8', async (err, data) => {
                if (err) {
                    throw err
                } else {
                    const firstLine = data.split('\n')[0]

                    // В случае, если первая строка не содержит фразу, мы записываем ее в файл, иначе...
                    if (!firstLine.includes('/script was here/')) {
                        await new Promise((resolve, reject) => {
                            fs.writeFile(file, "'/script was here/'\n\n", err => {
                                if (err) {
                                    reject(err)
                                } else {
                                    resolve()
                                }
                            })
                        })

                        await new Promise((resolve, reject) => {
                            fs.appendFile(file, data, err => {
                                if (err) {
                                    reject(err)
                                } else {
                                    resolve()
                                }
                            })
                        })
                    // ... делаем это
                    } else {
                        console.log(`['${file}'] already checked`)
                    }
                }
            })
        })

    }
})
