//* MAP *//
var map;

//* Array[id] = Display name *//
var health_centres_array = null;
var cid_array = null;

//** Data input from filters **//
var data = null;

//** Automatic search **//
var auto, cleaning;

//** Health Centres icon on map **//
var health_centre_markers;

//** Region name **//
var regions = ['oeste', 'norte', 'leste', 'sul', 'sudeste', 'centro'];

//** Print vars **//
var filters_text, filters, genders, start_date, end_date, dist_min, dist_max;

//** Open Street view vars **//
var heat, cluster, shape;

//** Display name for printing **//
var filters_print = ["Estabelecimento de ocorrência", "Faixa etária", "Especialidade do leito", "Caráter do atendimento", "Grupo étnico", "Nível de instrução", "Competência",
      "Grupo do procedimento autorizado", "Diagnóstico principal (CID-10)", "Diagnóstico secundário (CID-10)", "Diagnóstico secundário 2 (CID-10)", "Diagnóstico secundário 3 (CID-10)", "Total geral de diárias", 
      "Diárias UTI", "Diárias UI", "Dias de permanência", "Tipo de financiamento", "Valor Total", "Distrito Administrativo", "Subprefeitura", "Supervisão Técnica de Saúde", "Coordenadoria Regional de Saúde", "Complexidade", "Gestão"];

//** Called when loading the page, init vars, hide overlay and draw the map **//
function initProcedureMap() {
    auto = false;
    cleaning = false;
    health_centre_markers = [];
    data = null;
    filters_text = [];
    filters = [];
    genders = [];
    start_date = null;
    end_date = null;
    dist_min = null;
    dist_max = null;
    cluster = null;
    heat = null;
    shape = null;

    $('#loading_overlay').hide();
    var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }),
    latlng = L.latLng(-23.557296000000001, -46.669210999999997);

    //Popup map menu, may remove buttons from filters.
    menu = "<button type='button' id='print_popup' class='btn btn-dark btn-sm' onclick='print_maps()'> Imprimir </button><br>";
    menu += "<button type='button' id='graphs_popup' class='btn btn-dark btn-sm' onclick='graphs()'> Dados Gerais </button><br>";
    menu += "<button type='button' id='clear_popup' class='btn btn-dark btn-sm' onclick='clearMap()'> Limpar Mapa </button><br>";

    var popup = L.popup().setContent(menu);


    map = L.map('procedure_map', { center: latlng, zoom: 11, layers: [tiles] });
    map.on('contextmenu',function(e){
        popup.setLatLng(e.latlng)
        map.openPopup(popup);
    });
}

//** Called when a visualization shape is selected, remove any previous selected shape and draws a new one **//
function setShape(name) {
    var myStyle = {
        "color": "#444444",
        "opacity": 0.55
    };

    if (shape != null)
        map.removeLayer(shape);

    $.ajax({
        dataType: "json",
        url: name,
        success: function(data) {
            shape = new L.geoJson(data, 
                {onEachFeature: function(feature, layer) {
                    if (feature.properties && feature.properties.Name) {
                        layer.bindTooltip(feature.properties.Name, {closeButton: false});
                    }
                }}).addTo(map);
            shape.setStyle(myStyle);
    }});
}

//** Called when automatic search checkbox is changed, update auto var accordingly **//
function automatic_search() {
    var checkbox_search = document.getElementById('automatic_search_checkbox');

    if (checkbox_search.checked)
        auto = true;
    else
        auto = false;
}

//** Called when any filter is altered, if automatic search is on it calls "buscar()" **//
function change() {
    if (cleaning == false && auto == true)
        buscar();
}

//** Called when "Buscar" button is clicked, uses the filters to fetch data on procedures **//
function buscar() {
    var sexo_masculino = document.getElementById('sexo_masculino');
    var sexo_feminino = document.getElementById('sexo_feminino');
    var residencia_paciente = document.getElementById('checkbox_residencia_paciente');
    var hc = document.getElementById('checkbox_health_centre');

    genders = [];
    filters = [];
    filters_text = [];
    var health_centres = [];

    for (i = 0; i < 24; i++) {
        var aux = [];
        var aux_name = [];
        var select_name = $('#' + i + ' option:selected');
        var options = $(select_name);
        $.each(options, function(index, value){
            aux.push(value.value);
            aux_name.push([value.text]);
        });
        if (i == 0)
            health_centres.push(aux);

        filters_text.push(aux_name.join(", "));
        filters.push(aux.join(";"));
    }

    start_date = $("#intervalStart").datepicker({ dateFormat: 'dd,MM,yyyy' }).val();
    end_date = $("#intervalEnd").datepicker({ dateFormat: 'dd,MM,yyyy' }).val();

    if(sexo_masculino.checked)
        genders.push("M");

    if(sexo_feminino.checked)
        genders.push("F");

    var distance_max = document.getElementById('slider_distance_max');
    var distance_min = document.getElementById('slider_distance_min');
    dist_min = parseFloat(distance_min.textContent);
    dist_max = parseFloat(distance_max.textContent);

    data = {gender: genders.toString(), start_date: start_date.toString(), end_date: end_date.toString(), 
            dist_min: dist_min.toString(), dist_max: dist_max.toString(), filters: filters};

    clearMap();

    // Show Data
    $('#loading_overlay').show();
    markerList = []
    cluster = L.markerClusterGroup({ chunkedLoading: true });
    var dotIcon = L.icon({
        iconUrl: "https://storage.googleapis.com/support-kms-prod/SNP_2752125_en_v0",
    });
    Num_procedures = 0;
    $.getJSON("procedure/procedures_total", data, function(result) {
        Num_procedures = parseInt(result);
        if (shape != null)
            shape.bindPopup(Num_procedures.toString() + " Internações Hospitalares");
        if (Num_procedures < 50000) {
            $.getJSON("procedure/procedures_latlong", data, function(procedures) {
                var locations = procedures.map(function(procedure) {
                    var location = L.latLng(procedure[0], procedure[1]);
                    return location;
                });

                heat = L.heatLayer(locations, { radius: 35 });
                map.addLayer(heat);

                markerList = procedures.map(function(procedure, i) {
                    var lat = procedure[0];
                    var lng = procedure[1];
                    var id = procedure[2];
                    marker = L.marker(L.latLng(lat, lng), {icon: dotIcon, id: id}).on('click', markerOnClick);
                    return marker;
                });
                cluster.addLayers(markerList);
                map.addLayer(cluster);
                $('#loading_overlay').hide();
            });
        } else {
            $('#loading_overlay').hide();
            // Do Something
        }
    });
}

//** Called when a procedure marker is clicked, fetch the specific proprieties of the selected procedure such as health centre, cid, distance and more. Also draws on map the associated health centre **//
function markerOnClick(e) {
    id = e.target.options.id
    var sexp_var = {};
    sexp_var["M"] = "Masculino";
    sexp_var["F"] = "Feminino";
    var procedure_info_path = ["/procedure/procedure_info", id].join("/");

    setVisible(false);

    //Only get the data the first time its clicked
    if (e.target.getPopup() === undefined) {
        $.getJSON(procedure_info_path, function(result) {
            cnes = result[0].cnes_id;
            text =  "<strong>Estabelecimento: </strong>" + health_centres_array[parseInt(cnes)] + "<br>";
            text += "<strong>Sexo: </strong>" + sexp_var[result[0].gender] + "<br>";
            text +=  "<strong>Idade: </strong>" + result[0].age_number + "<br>";
            text += "<strong>CID: </strong>" + cid_array[result[0].cid_primary] + "<br>";
            text += "<strong>CRS: </strong>" + result[0].CRS + "<br>";
            text += "<strong>Data: </strong>" + result[0].date + "<br>";
            text += "<strong>Distância: </strong>" + parseFloat(result[0].distance).toPrecision(4) + " Km <br>";
            e.target.bindPopup(text, {cnes: cnes});
            e.target.openPopup();
            health_centres_makers(cnes);
        });
    } else {
        cnes = e.target.getPopup().options.cnes;
        if (e.target.getPopup().isOpen() != true)
            health_centres_makers(cnes);
    }
}

//** Called when a procedure marker is clicked. Show health centres markers on map **//
function health_centres_makers(health_centres) {
    var health_centre_icon = '/health_centre_icon.png';
    $.getJSON("procedure/health_centres_procedure", {cnes: health_centres.toString()}, function(result){
        $.each(result, function(index, health_centre){
            create_markers(health_centre, health_centre_icon);
        });
        setVisible(true);
    });
}

//** Creates health centres markers **//
function create_markers(health_centre, icon_path) {
    var hcIcon = L.icon({
        iconUrl: icon_path,
    });
    var marker = L.marker(L.latLng(health_centre.lat, health_centre.long), {icon: hcIcon});
    health_centre_markers.push(marker);
}

//** Changes the visibility of health centres markers **//
function setVisible(visibility) {
    for (var i = 0; i < health_centre_markers.length; i++){
        if (visibility == true)
            health_centre_markers[i].addTo(map);
        else
            health_centre_markers[i].remove()
    }
    if (visibility != true)
        health_centre_markers = []
}

//* Called when "limpar" button is clicked, restore the page to its initial state *//
function limpar() {
    cleaning = true;
    $("#slider_distance").slider('refresh');
    $("#slider_distance_min").html('0');
    $("#slider_distance_max").html('30+');

    for (i = 0; i < 24; i++) {
        name = ".select-" + i;
        $(name).val('').trigger('change');
    }
    $("#intervalStart").val('').datepicker('destroy').datepicker();
    $("#intervalEnd").val('').datepicker('destroy').datepicker();
    $("#sexo_masculino").prop("checked", true);
    $("#sexo_feminino").prop("checked", true);
    cleaning = false;
    clearMap();
}

//** Clears features on the map **//
function clearMap() {
    if (cluster != null)
        map.removeLayer(cluster)

    if (heat != null)
        map.removeLayer(heat)

    if (shape != null)
        map.removeLayer(shape)
    heat = null
    cluster = null
    chape = null
}

//** Called when "Dados Gerais" button is clicked, open "Dados Gerais" page and passes filter values to it **//
function graphs() { 
    var w = window.open('dados-gerais');
    w._data_filters = data;
}

//** Called when "Imprimir" butotn is clicked, opens a print dialog **//
function print_maps() {
    const $body = $('body');
    const $mapContainer = $('.map-wrapper');
    const $mapContainerParent = $mapContainer.parent();
    const $printContainer = $('<div style="position:relative;">');
    mapSize = $mapContainer.height();
    const $info = $('<div style="position: relative"><h4>Autorizações de Internação Hospitalar, AIH - tipo 1 (Normal),' +
                    ' mapeadas pelo endereço de residência do paciente deslocadas para o centróide do setor censitário ' + 
                    'correspondente.</h4></div>');
    const $space_map = $('<div style="height: ' + (mapSize + 150) + 'px;"></div>');

    var filters_div_text = '<div style="position: relative">';
    $.each(filters_print, function(index, value){
      if (filters_text[index] != null && filters_text[index] != "")
          filters_div_text = filters_div_text.concat("<br />" + value + ": " + filters_text[index]);
    });

    if (genders[0] != null)
      filters_div_text = filters_div_text.concat("<br />Sexo: " + genders.join(", "));

    if (start_date != null && start_date != "")
      filters_div_text = filters_div_text.concat("<br />Data mínima: " + start_date);

    if (end_date != null && end_date != "")
      filters_div_text = filters_div_text.concat("<br />Data máxima: " + end_date);

    if (dist_min != null)
      filters_div_text = filters_div_text.concat("<br />Distância mínima: " + dist_min);

    if (dist_max != null)
      filters_div_text = filters_div_text.concat("<br />Distância máxima: " + dist_max);

    filters_div_text = filters_div_text.concat("</div>");
    const $filters_div = $(filters_div_text);

    $printContainer
      .height(mapSize + 100)
      .append($mapContainer)
      .append($space_map)
      .append($info)
      .append($filters_div)
      .prependTo($body);

    const $content = $body
      .children()
      .not($printContainer)
      .not('script')
      .detach();

    /**
     * Needed for those who use Bootstrap 3.x, because some of
     * its @media print styles ain't play nicely when printing.
     */
    const $patchedStyle = $('<style media="print">')
      .text('img { max-width: none !important; } a[href]:after { content: ""; }')
      .appendTo('head');

    window.print();

    $body.prepend($content);
    $mapContainerParent.prepend($mapContainer);

    $printContainer.remove();
    $patchedStyle.remove();
}

//** Called when loading the page, init filters **//
function dadosInput() {
    $('#datepicker').datepicker({
        format: "dd/mm/yyyy",
        language: "pt-BR",
        container:'#datepicker',
    });

    $("#slider_distance").slider({
        min: 0,
        max: 30,
        step: 1,
        value: [0,30],
    });

    $("#slider_distance").on("slide", function(slideEvt) {
        $("#slider_distance_min").html(slideEvt.value[0]);
        $("#slider_distance_max").html(slideEvt.value[1] + (slideEvt.value[1] >= 30 ? "+" : ""));
    });

    for (i = 0; i < 24; i++) {
        name = "#" + i;
        $(name).select2({
            placeholder: "Todos",
            allowClear: true,
            tags: true
        });
    }

    if (cid_array == null) {
        $.getJSON('/CID_hash.json', function(cids) {
            cid_array = cids;
        });
    }

    if (health_centres_array == null) {
        health_centres_array = {}
        $.getJSON('/health_centres.json', function(hc) {
            $.each(hc, function(index, value) {
                health_centres_array[value.id] = value.text;
            });
        });
    }
}
