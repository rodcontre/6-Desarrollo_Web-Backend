var from = 0;
var to = 100000;

var $slider = $('#rangoPrecio');

//Inicializador del elemento Slider
$slider.ionRangeSlider({
  type: 'double',
  grid: false,
  min: 0,
  max: 100000,
  from: 1000,
  to: 20000,
  prefix: '$',
});

//Obtiene rango de precios
$slider.on('change', function () {
  var $self = $(this);
  from = $self.data('from');
  to = $self.data('to');
});

//Inicializa funciones
(function () {
  getData();
})();

//Extrae el JSON con las propiedades
function getData() {
  return fetch('http://localhost:8080/data.json', {
    method: 'GET',
  }).then(function (data) {
    return data.json();
  }).then(function (data) {
    verTodos(data);
    setSearch(data);
  });
};

function setSearch(data) {
  let $busqueda = $('#checkPersonalizada');
  $busqueda.on('change', (e) => {
    if (this.customSearch == false) {
      this.customSearch = true;
    } else {
      this.customSearch = false;
    }

    let cityList = getCityList(data);
    let typeList = getTypeList(data);
    $('#personalizada').toggleClass('invisible');

    //Agrega ciudades en menú desplegable
    $('#ciudad').css('display', 'block');
    for (var i = 0; i < cityList.length; i++) {
      $('#ciudad').append(
          '<option value' + cityList[i] + '>' + cityList[i] + '</option>'
      );
    }

    //Agrega Tipos en menú desplegable
    $('#tipo').css('display', 'block');
    for (var i = 0; i < typeList.length; i++) {
      $('#tipo').append(
          '<option value' + typeList[i] + '>' + typeList[i] + '</option>'
      );
    }
  });
}

function getCityList(data) {
  let cityList = [];
  for (let i = 0; i < data.length; i++) {
    if (cityList.includes(data[i].Ciudad)) {
      continue;
    }else {
      cityList.push(data[i].Ciudad);
    }
  }

  cityList.sort();
  return cityList;
};

function getTypeList(data) {
  let typeList = [];
  for (let i = 0; i < data.length; i++) {
    if (typeList.includes(data[i].Tipo)) {
      continue;
    }else {
      typeList.push(data[i].Tipo);
    }
  }

  typeList.sort();
  return typeList;
};

function verTodos(data) {
  $('#buscar').on('click', () => {
    var countCity = 0;
    var countType = 0;
    var $selectType = $('#tipo').val();
    var $selectCity = $('#ciudad').val();

    if ($selectCity != '') countCity = 1;
    if ($selectType != '') countType = 2;

    //Elimina búsqueda anterior
    $('#listaPropiedades').empty();

    //Despliega en pantalla la lista de propiedades
    $('.lista').css('display', 'block');

    var j = 0;

    //Recorre el JSON de propiedades
    for (let i = 0; i < data.length; i++) {
      //Elimina el caracter $ del string
      let number = data[i].Precio.substring(1, data[i].Precio.length);

      // Reemplaza la coma por un punto
      number = number.replace(',', '');

      switch (countCity + countType) {
        case 0:
          if (number >= from && number <= to) {
            j++;
            appendData(data, i);
          }

          break;
        case 1:
          if (data[i].Ciudad == $selectCity && number >= from && number <= to) {
            j++;
            appendData(data, i);
          }

          break;
        case 2:
          if (data[i].Tipo == $selectType && number >= from && number <= to) {
            j++;
            appendData(data, i);
          }

          break;
        case 3:
          if (number >= from && number <= to && data[i].Ciudad == $selectCity && data[i].Tipo == $selectType) {
            j++;
            appendData(data, i);
          }

          break;
      }
    }

    console.log(j);
  });
};

function appendData(data, i) {
  $('#listaPropiedades').append(
              '<div class="card horizontal">' +
                '<div class="card-image">' + '<img src="img/home.jpg">' + '</div>' +
                '<div class="card-stacked">' +
                  '<div class="card-content">' +
                    '<div>' + '<b>Direccion: </b> ' + data[i].Direccion + '</div>' +
                    '<div>' + '<b>Ciudad: </b> ' + data[i].Ciudad + '</div>' +
                    '<div>' + '<b>Telefono: </b> ' + data[i].Telefono + '</div>' +
                    '<div>' + '<b>Código postal: </b> ' + data[i].Codigo_Postal + '</div>' +
                    '<div>' + '<b>Precio: </b> ' + data[i].Precio + '</div>' +
                    '<div>' + '<b>Tipo: </b> ' + data[i].Tipo + '</div>' +
                  '</div>' +
                  '<div class="card-action right-align">' + '<a href="#">Ver más</a>' + '</div>' +
                '</div>' +
              '</div>'
  );
}
