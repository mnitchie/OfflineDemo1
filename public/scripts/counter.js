$(document).ready(function() {
  $.ajax({
    url: '/tick',
    type: 'POST',
    success: function(data, textStatus, jqXHR) {
      $('#counter').html("This site has been visited " + data +  " times");
    }
  });
});
