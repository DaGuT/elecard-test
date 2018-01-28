$('input[name=treeView]').change(function () {
    localStorage.setItem("treeView", $('input[name=treeView]:checked')[0].id);

    $.jstree.destroy();
    initView();
});

//Т.к. у этого модульчика свой тип в подаваемых данных, то мы просто сделаем наш JSON подходящим :). Эта функция это и делает
function prepDataForTree(isLightbox) {
    //Можно, конечно, делать через ul,li, но зачем? Так проще :)
    var result = []; //Массив, который подходит под jstree
    var temp = {}; //Объект, который будем помещать в массив
    var categories = {};
    ourJSON.forEach(function (img) {
        temp.id = img.image;
        temp.parent = img.category;
        categories[temp.parent] = true; //Более быстрого способа отдельно запомнить категории я не знаю пока :)
        temp.text = "";
        //thumbnail. Т.к. у нас нет thumboв в задании, то подаём полное изображение, а так бы подавали тамб
        temp.icon = "http://93.91.165.233:8081/frontend_data/" + img.image;
        //а это подготовка под модуль lightbox :D
        if (isLightbox) { //Мы предоставим возможность выбора вида "как браузер" или "просто список с лайтбоксом"
            temp.a_attr = {
                href: "http://93.91.165.233:8081/frontend_data/" + img.image,
                class: 'lightbox'
            };
        }
        result.push(temp);
        temp = {};
    });
    //Ну и категории, конечно. Увы, из-за непонятной задачи с деревом, понять, как будет 3я глубина невозможно, поэтому делаю только 2 урвоня
    for (category in categories) {
        result.push({
            "id": category,
            "text": category,
            "parent": "#"
        });
    };
    return result;
}


//А тут включаем само дерево
function tree(isLightbox) {
    //Создали дерево
    $('#jstree').jstree({
        'core': {
            "data": prepDataForTree(true),
            "themes": {
                'variant': "large",
                'responsive': true
            }
        },
        "plugins": ["wholerow", "state"]
        //wholerow -- делаем всю строку кликабельной
        //state - запоминаем, каим древо было до и восстанавливаем его
    });

    $('#jstree').on('ready.jstree', function () {
        //браузер загружаем
        var selected=$('#jstree').jstree(true).get_selected()[0];
        //Картинка или нет определим по точке в имени :\
        if (selected.indexOf('.')>-1) $('#browser img').attr('src', "http://93.91.165.233:8081/frontend_data/" + selected);
    });

    //Добавляем функции к ивентам, чтобы правильно работало отображение картинки
    if (isLightbox) {
        $('#jstree').on('after_open.jstree', function () {
            lightBox();
        });
    } else {
        //Это для отображения в стиле браузера. мы подменяем src картинки при выборе ноды :)
        $('#jstree').on('select_node.jstree', function (node, selected) {
            if (selected.node.parent != '#') {
                $('#browser img').attr('src', "http://93.91.165.233:8081/frontend_data/" + selected.node.id);
            }
        });
    }
}
