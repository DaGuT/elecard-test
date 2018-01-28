$('input[name=treeView]').change(function(){
    $.jstree.destroy();
    initView();
});

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
        temp.icon = "http://93.91.165.233:8081/frontend_data/" + img.image;
        if (isLightbox) { //Мы предоставим возможность выбора вида "как браузер" или "просто список с лайтбоксом"
            temp.a_attr = {
                href: "http://93.91.165.233:8081/frontend_data/" + img.image,
                class: 'lightbox'
            };
        }
        result.push(temp);
        temp = {};
    });
    for (category in categories) {
        result.push({
            "id": category,
            "text": category,
            "parent": "#"
        });
    };
    return result;
}

function tree(isLightbox) {

    $('#jstree').jstree({
        'core': {
            "data": prepDataForTree(true),
            "themes": {
                'variant': "large"
            }
        },
        "plugins": ["wholerow"]
    });
    if (isLightbox) {
        $('#jstree').on('after_open.jstree', function () {
            lightBox();
        });
    } else {
        $('#jstree').on('select_node.jstree', function (node, selected) {
            if (selected.node.parent != '#') {
                $('#browser img').attr('src', "http://93.91.165.233:8081/frontend_data/" + selected.node.id);
            }
        });
    }
}
