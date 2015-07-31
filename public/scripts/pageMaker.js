$(document).ready(function() {
  var $pageMaker = $('#pageMaker');

  if (!navigator.onLine) {
    $pageMaker.prop('disabled', true);
  }

  $pageMaker.on('click', function() {
    $.ajax({
      url: '/',
      type: 'POST',
      success: function(data, textStatus, jqXHR) {
        var li = $('<li>'),
            link = $('<a>').attr('href', '/pages/' + data).text(data);

        li.html(link);
        $('#linkContainer').append(li);
      }
    });
  });
});
