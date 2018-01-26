//Я не буду использовать let по тем причинам, что поддержку относительно старых браузеров хотим сохранить.
//Также можно добавить парсинг строки адреса и её изменение, чтобы можно было передавать друзьям, однако из-за возможности удаления карточек считаю эту затею бессмысленной и делаю текущий простой вариант

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

function loadedJSON(data) {
    //Просто запомним содержимое этого JSONa
    ourJSON = data.filter(function (item) {
        if (localStorage.getItem(item.image)) {return false;}
        return true;
    });
    //И удалим загрузочную штуку
    resort(ourJSON, curSort, !isDescending); //После загрузки пересортируем заного
    
    //И добавим странички
    addPaginator();
}

//Поработаем над отображением числа карт на странице
$("input[name=perPage]").change(function () { //Нам важно только изменение флажка, а не клик по нему
    howMany = $("input[name=perPage]:checked")[0].value;
    hideAll();
    addPaginator();
});


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
    hideAll();
    addPaginator();
});

//А тут сама сортировка
function resort(array, type, isReversed) { //Если ничего не передаём в isReversed, то он равен undefined, что при сравнениях переводится в 0
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

//----------А потом уже не паримся и обрабатываем все эти данные
function makeCard(img) {

    var options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };

    var date = new Date(img.timestamp * 1000);


    var div = document.createElement('div');
    div.classList.add('col-md-4');
    div.classList.add('col-lg-3');
    div.classList.add('col-sm-6');
    div.classList.add('step');
    div.classList.add('closable');
    div.innerHTML = '<span class="close" onclick="hideItem(this.parentNode)">x</span>' +
        '<a href="http://93.91.165.233:8081/frontend_data/' + img.image + '" class="card lightbox box-shadow no-decoration">' +
        '<img  class="card-img-top img-fluid lazyload" src="https://demos.laraget.com/images/loading2.gif" id=' + img.image + ' data-src=http://93.91.165.233:8081/frontend_data/' + img.image + '>' +
        '<div class="card-body card-text">some text in here like LOREM IPSUM' +
        '<p class="card-text"><small class="text-muted">Created: ' + date.toLocaleString("ru", options) + '</small></p></div>' +
        '</a>';
    return div;
}

function makeDeck(json) {
    var result = document.createElement('DIV');
    result.classList.add("row");
    json.forEach(function (img) {
        result.appendChild(makeCard(img));
    });
    return result;
}

//Если мы перезагружали данные, то пагинатор загрузится с последнего места
function addPaginator(curPage) {
    $("#loadingInProgress").remove();
    $("#paginator").pagination({
        dataSource: ourJSON,
        pageSize: howMany,
        pageNumber: curPage || 1,
        showPrevious: true,
        showNext: true,
        afterPaging: function () {
          lightBox();  
        },
        callback: function (data, pagination) {
            // template method of yourself
            var html = makeDeck(data);
            $('#deck').html(html);
            lazyload();
        }
    });
    //Сразу подгрузим галлерею для картинок

}

//На замену удаленной
function addCard(img) {
    var deck = $("#deck").children()[0];
    //Т.к. мы удаляли некоторые карточки, то мы их не отрисовываем
    if (localStorage.getItem(img.image)) { //Если у нас рисунок уже был удален, то говорим, что ничего не делали
        return 0;
    }
    var div = makeCard(img);
    deck.append(div);
    lazyload(); 
    lightBox();
    return 1; //А вот если мы добавили картинки, то нужно таки сообщить, что добавили
}

//Парсим ID изображения. Вынес в отдельную функцию, т.к., может, буду менять стиль карточки, чтобы не переписывать каждый раз
function getImgID(elem) {
    var nodes = elem.childNodes[1].childNodes;
    var result;
    nodes.forEach(function (node) {
        if (node.tagName === "IMG") {
            result = node.id;
        }
    });
    return result;
}

function findPos(imgName) {
    for (var i = 0; i < ourJSON.length; ++i) {
        if (ourJSON[i].image === imgName) {
            return i;
        }
    }
    console.log('WOat? HoW?');
    return -1; //Хоть этого случиться не должно
}

//Прячем элемент и запоминаем имя карточки, чтобы больше не показывать
function hideItem(elem) {
    //Для простоты работы запомним
    var id = getImgID(elem);

    //Если у нас есть хоть какое-то имя, то запоминаем в локальном хранилище
    if (id) {
        localStorage.setItem(id, true);
        ourJSON.splice(findPos(id), 1); //Вырежем этот элемент
    }
    //Сперва спрячем с анимацией, а потом сразу удалим
    $(elem).fadeOut(500, rem);
    //Т.к. jquery работает "параллельно", то сперва дождёмся удаления
    function rem() {
        elem.remove();
    }

    //Чтобы после удаление правильно картинка подгружалась
    var curPage = $("#paginator").pagination('getSelectedPageNum');

    addCard(ourJSON[curPage * howMany]);
    //Логично, что после удаления, нужно добавить другую
}

//Удаляем все элементы с доски
function hideAll() {
    $('#deck').empty();
}

//Сбрасываем удаленные
function resetCards() {
    hideAll();
    localStorage.clear();
    reloadJSON();
}


//Просто прикольная svg, которая отображается, пока json не скачается
var svgLoading = ['<svg version="1.1" id="L1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">',
'   <circle fill="none" stroke="#fff" stroke-width="6" stroke-miterlimit="15" stroke-dasharray="14.2472,14.2472" cx="50" cy="50" r="47" > ',
'      <animateTransform ',
'         attributeName="transform" ',
'         attributeType="XML" ',
'         type="rotate"',
'         dur="5s" ',
'         from="0 50 50"',
'         to="360 50 50" ',
'         repeatCount="indefinite" />',
'  </circle>',
'  <circle fill="none" stroke="#fff" stroke-width="1" stroke-miterlimit="10" stroke-dasharray="10,10" cx="50" cy="50" r="39">',
'      <animateTransform ',
'         attributeName="transform" ',
'         attributeType="XML" ',
'         type="rotate"',
'         dur="5s" ',
'         from="0 50 50"',
'         to="-360 50 50" ',
'         repeatCount="indefinite" />',
'  </circle>',
'  <g fill="#fff">',
'  <rect x="30" y="35" width="5" height="30">',
'    <animateTransform ',
'       attributeName="transform" ',
'       dur="1s" ',
'       type="translate" ',
'       values="0 5 ; 0 -5; 0 5" ',
'       repeatCount="indefinite" ',
'       begin="0.1"/>',
'  </rect>',
'  <rect x="40" y="35" width="5" height="30" >',
'    <animateTransform ',
'       attributeName="transform" ',
'       dur="1s" ',
'       type="translate" ',
'       values="0 5 ; 0 -5; 0 5" ',
'       repeatCount="indefinite" ',
'       begin="0.2"/>',
'  </rect>',
'  <rect x="50" y="35" width="5" height="30" >',
'    <animateTransform ',
'       attributeName="transform" ',
'       dur="1s" ',
'       type="translate" ',
'       values="0 5 ; 0 -5; 0 5" ',
'       repeatCount="indefinite" ',
'       begin="0.3"/>',
'  </rect>',
'  <rect x="60" y="35" width="5" height="30" >',
'    <animateTransform ',
'       attributeName="transform" ',
'       dur="1s" ',
'       type="translate" ',
'       values="0 5 ; 0 -5; 0 5"  ',
'       repeatCount="indefinite" ',
'       begin="0.4"/>',
'  </rect>',
'  <rect x="70" y="35" width="5" height="30" >',
'    <animateTransform ',
'       attributeName="transform" ',
'       dur="1s" ',
'       type="translate" ',
'       values="0 5 ; 0 -5; 0 5" ',
'       repeatCount="indefinite" ',
'       begin="0.5"/>',
'  </rect>',
'  </g>',
'</svg>'].join('');



//Это старый метод :) Теперь мы работаем с пагинатором

////Делаем отзывчивые карточки с картинками
//function loadImgs(imgList, from_, howMany_) {
//    //Это для страничности. Также предусмотрен случай, когда аргументов нет
//    //Смотрим, с какой картинки начинать выдачу
//    var from = from_ || 0;
//    //И до какой
//    var howMany = howMany_ || imgList.length - from;
//
//    var deck = document.getElementById('deck');
//    for (var i = 0; i < howMany; i++) {
//        if (!addCard(imgList[from + i])) {
//            ++howMany; //Если картинка была в списке удаленного, то мы проверяем одну лишнюю
//            ++skipped; //Можно было бы складывать howMany и skipped, но это лишние операции. Зачем тогда?
//            if (howMany >= imgList.length) break; //Однако, если картинки закончились, то мы выходим из цикла :)
//        };
//    }
//
//    function addCard(img) {
//        //Т.к. мы удаляли некоторые карточки, то мы их не отрисовываем
//        if (localStorage.getItem(img.image)) { //Если у нас рисунок уже был отображен, то говорим, что ничего не делали
//            return 0;
//        }
//        var div = document.createElement('div');
//        div.classList.add('col-md-4');
//        div.classList.add('col-lg-3');
//        div.classList.add('col-sm-6');
//        div.classList.add('step');
//        div.classList.add('closable');
//        div.innerHTML = '<a class="card box-shadow no-decoration">' +
//            '<span class="close" onclick="hideItem(this.parentNode.parentNode)">x</span>' +
//            '<img  class="card-img-top img-fluid lazyload" src="https://demos.laraget.com/images/loading2.gif" id=' + img.image + ' data-src=http://93.91.165.233:8081/frontend_data/' + img.image + '>' +
//            '<div class="card-body card-text">some text in here like LOREM IPSUM</div>' +
//            '</a>';
//        deck.appendChild(div);
//        return 1; //А вот если мы добавили картинки, то нужно таки сообщить, что добавили
//    }
//    lazyload();
//}


