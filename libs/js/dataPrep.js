//Также можно добавить парсинг строки адреса и её изменение, чтобы можно было передавать друзьям, однако из-за возможности удаления карточек считаю эту затею бессмысленной и делаю текущий простой вариант

//Поехали! :)
$(document).ready(function () {
    var loader = document.createElement("DIV");
    loader.id = "loadingInProgress";
    loader.innerHTML = svgLoading;
    $("#deck").append(loader);
});

//Первым делом парсим JSON и делаем работу с ним
function reloadJSON() { //Функция для простоты повторного вызова
    $.get('http://93.91.165.233:8081/frontend_data/catalog.json', loadedJSON);
}
reloadJSON();

//Будем хранить загруженный файл, т.к. нам с ним ещё много и долго работать :)
var ourJSON;
var curSort = ""; //Эта переменная нужна, чтобы можно было пересортировывать по убыванию или возрастанию без необходимости лишний раз перезапоминать
var isDescending = true; //А эта переменная нужна для текущего порядка сортировки, чтобы его поменять
var howMany = $("input[name=perPage]:checked")[0].value; //Число отображаемых карточек на странице. Честно, проще засунуть в эту одну переменную, чем постоянно вызывать селектор. Да и бесит этот селектор длинный писать :) Мы ж за оптимизацию рабочего процесса?
var curPage;

//ЗЗагружаемся в последнее состояние
function loadLastState(){
    
    //Дерево или список
    var show_like=localStorage.getItem('show_like') || 'grid';
    $('#'+show_like).prop('checked',true);
    
    //Как сортировали и в каком направлении
    var sortType=localStorage.getItem('sortType');
    var sortIsReversed=+localStorage.getItem('sortIsReversed');//Преобразуем к числу
    $('#'+sortType).prop('checked',true);
    resort(ourJSON, sortType, sortIsReversed); //После загрузки пересортируем заного
    curSort=sortType;
    isDescending = !sortIsReversed;
    
    //Сколько на странице плиток
    howMany=localStorage.getItem('howMany') || 30;
    $('#'+howMany+'PP').prop('checked',true);
    
    //Отображали картинки браузером или LightBox
    var treeView=localStorage.getItem('treeView') || "Lightbox";
    $('#'+treeView).prop('checked',true);
    
    //Страница, на которой были в последний раз
    curPage=localStorage.getItem('curPage') || 1;
}

//Как только загрузили json, приступаем к его обработке
function loadedJSON(data) {
    //Просто запомним содержимое этого JSONa
    ourJSON = data.filter(function (item) {
        if (localStorage.getItem(item.image)) {
            return false;
        }
        return true;
    });
    //И удалим загрузочную штуку
    loadLastState();
    
    //Отрисовываем все элементы и включаем все библиотеки
    initView();
}

//Включаем отрисовку и вставку всех элементов на странице
function initView() {
    //В зависимости от режима инициализируем карточки или древо
    if ($('input[name=show_like]:checked')[0].id === "grid") {
        initDeck();
        //И добавим странички
        addPaginator();
    } else {
        var isLightbox = ($("input[name=treeView]:checked")[0].id === "Lightbox");
        initTree(isLightbox);
        //И тут добавить функцию включения дерева
        tree(isLightbox);
    }
}

//Это карточки с его html'кой
function initDeck() {
    //memory state
    localStorage.setItem('show_like',"grid");
    
    $("#list").html('<div class="col-table" id="deck">' +
        '<!--Сюда будут вставлять все карточки -->' +
        '</div>' +
        '<div class="container d-flex justify-content-center" id="paginator">' +
        '<!--А здесь будут странички -->' +
        '</div>');
    $('#cardsSetting').show();
    $('#treeSettings').hide();
}

//А тут дерево. Мы их выбирали в initView
function initTree(isLightbox) {
    //memory state
    localStorage.setItem('show_like',"tree");
    
    $('#cardsSetting').hide();
    $('#treeSettings').show();
    if (!isLightbox) {
        $("#list").html('<div class="treeBrowser border rounded"><div class="row"><div class="col-md-4" id="jstree"></div><div class="col-md-8 border-left d-flex justify-content-center" id="browser"><img  src="http://exiton-analytic.ru/static/img/no_photo.png"></div></div>');
        $('#jstree').css({
            'height': window.innerHeight * 0.7,
            'max-width': $('#jstree').width()
        });
        $('#browser>img').css({
            'height': window.innerHeight * 0.7,
            'max-width': $('#browser').width()
        });
    } else {
        $("#list").html('<div class="treeBrowser"><div id="jstree"></div></div>');
    }
}

//изменяем вид структуры
$('input[name=show_like]').change(function () {
    initView();
});

//Сбрасываем удаленные картинки
function resetCards() {
    hideAll();
    localStorage.clear();
    reloadJSON();
}

//--------ВСё про сортировку
//Сортируем :)
//Тут ивент на клик. если был бы change, то радиобаттон бы не выстреливал. А задание именно на радио
$("input[name=sortBy]").click(function () {
    var newSort = $('input[name=sortBy]:checked')[0].id; //Запомним, какой новый метод сортировки
    if (curSort !== newSort) { //Если у нас раньше была другая сортировка, то сортируем в новой в порядке убывания
        resort(ourJSON, newSort); //Просто пересортируем в порядка возрастания
        isDescending = true; //Отсортировано по убыванию
    } else { //Если у нас уже была та же самая сортировка, то мы просто меняем на противоположную
        if (isDescending) {
            resort(ourJSON, newSort, true);
        } else {
            resort(ourJSON, newSort, false);
        }
        isDescending = !isDescending; //И меняем порядок сортировки в памяти
    }
    curSort = newSort; //Перезапоминаем
    if ($('input[name=show_like]:checked')[0].id === "grid") {
        hideAll();
        addPaginator();
    } else {
        //Сброс и перестройка дерева
        $.jstree.destroy();
        tree();
    }

});


//А тут сама сортировка
function resort(array, type, isReversed) { //Если ничего не передаём в isReversed, то он равен undefined, что при сравнениях переводится в 0
    //memory
    localStorage.setItem('sortType',type);
    localStorage.setItem('sortIsReversed',isReversed||0);//При считке будем делать преобразование к числам, чтобы потом здесь всё работало :)

    
    switch (type) {
        case "name":
            ourJSON.sort(compareName);
            if (isReversed) ourJSON.reverse();
            break;
        case "time":
            ourJSON.sort(compareTime);
            if (isReversed) ourJSON.reverse();
            break;
        case "category":
            ourJSON.sort(compareCategory);
            if (isReversed) ourJSON.reverse();
            break;
        case "size":
            ourJSON.sort(compareSize);
            if (isReversed) ourJSON.reverse();
            break;
        default:
            break;
    }
}

//---------Функции для сравнения, чтобы подать в arr.sort(). Подаём именно так, чтобы по-умолчанию был порядок убывания
function compareTime(a, b) {
    return b.timestamp - a.timestamp;
}

function compareCategory(a, b) {
    return b.category > a.category ? 1 : -1;
}

function compareName(a, b) {
    //Сперва выделим имя
    function getName(filename) {
        var pos = filename.lastIndexOf("/");
        if (pos > -1) {
            filename = filename.slice(pos + 1);
        }
        return filename;
    }
    return getName(b.image) > getName(a.image) ? 1 : -1;
}

function compareSize(a, b) {
    return b.filesize - a.filesize;
}
