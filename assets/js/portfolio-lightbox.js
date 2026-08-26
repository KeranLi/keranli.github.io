(function($) {
  $(function() {
    $(".portfolio-gallery--detail").each(function() {
      var $gallery = $(this);
      $gallery.find("img").each(function() {
        var $image = $(this);
        if (!$image.parent().is("a")) {
          $image.wrap($('<a/>', {
            href: $image.attr("src"),
            class: "portfolio-image-popup",
            title: $image.attr("alt") || ""
          }));
        }
      });

      $gallery.find(".portfolio-image-popup").magnificPopup({
        type: "image",
        gallery: { enabled: true },
        image: { titleSrc: "title" },
        closeOnContentClick: true,
        removalDelay: 250,
        mainClass: "mfp-zoom-in"
      });
    });
  });
})(jQuery);