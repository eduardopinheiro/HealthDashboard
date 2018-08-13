var slideIndex = 1;
var timeout;
// showDivs(slideIndex);
// getDataHomePage();

function getDataHomePage() {
  $.getJSON("/distance_metric.json", data, function(result) {
    sum = 0;
    $.each(result,function(key, value) {
        sum += parseInt(value, 10);
    });
    sum = sum.toLocaleString('pt-BR');
    $("#procedure-data").html(sum);
  });
  $.getJSON("/points", data, function(result) {
    $("#hospital-data").html(result.length);
  });
  $.getJSON("/specialties_procedure_distance_average", data, function(result) {
    distances = Object.values(result);
    nspec = distances.length;
    med = 0;
    for (var i = 0; i < nspec; i++) {
      med += distances[i];
    }
   med = med/nspec;
   med = Math.round(med * 100) / 100;
   med = med.toLocaleString('pt-BR');
   $("#spec-data").html(nspec);
   $("#desloc-data").html(med + " km");
  });
}

function plusDivs(n) {
  slideIndex += n
  showDivs();
}

function showDivs() {
  clearTimeout(timeout);
  var i;
  var x = document.getElementsByClassName("slider-img");
  if (slideIndex > x.length) {
    slideIndex = 1
  }
  if (slideIndex < 1) {
    slideIndex = x.length
  }
  for (i = 0; i < x.length; i++) {
    $(x[i]).removeClass("active");
    $(x[i]).removeClass("right");
    $(x[i]).removeClass("left");
  }
  $(x[slideIndex-1]).addClass("active");
  if (slideIndex == 1) {
    $(x[x.length - 1]).addClass("right");
  }
  else {
    $(x[slideIndex-2]).addClass("right");
  }
  if (slideIndex == x.length) {
    $(x[0]).addClass("left");
  }
  else {
    $(x[slideIndex]).addClass("left");
  }
  timeout = setTimeout(function() { plusDivs(-1) }, 5000);
}
