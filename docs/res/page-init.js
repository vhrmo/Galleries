function getWidth() {
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
}

function initCarousel() {
    let count = Math.floor(getWidth() / 200);
    if (count < 3) {
        count = 3;
    }
    let carousel_space_between_tiles = 4;
    let tileSize = Math.floor((getWidth() - 10 - (carousel_space_between_tiles * count)) / count);
    // console.log("width", getWidth(), "tileSize", tileSize, "count", count, "calcTotal", count * tileSize)
    $(".carousel").each(function () {
        $(this).unitegallery({
            carousel_padding: 0, // top and bottom padding
            carousel_space_between_tiles: carousel_space_between_tiles,
            theme_enable_navigation: false,
            theme_carousel_offset: 0,
            lightbox_type: "compact",
            tile_enable_border: false,
            tile_width: tileSize,
            tile_height: 0.7 * tileSize,

            tile_enable_textpanel: true,
            tile_textpanel_title_text_align: "center",
            // textpanel_enable_description: true,
        });
    });
}

function initGallery(selector = ".gallery") {
    $(selector).each(function () {
        $(this).unitegallery({
            gallery_width: "100%",
            theme_gallery_padding:"80",
            // theme_enable_navigation: false,
            lightbox_type: "compact",
            tile_enable_border: false,
            // tiles_type:"nested",
            tiles_type: "justified",

            tile_enable_textpanel: false,
            tile_textpanel_title_text_align: "center",
            // textpanel_enable_description: true,
        })
    });
}

function initVideoGallery() {
    $(".video-gallery").each(function () {
        $(this).unitegallery({
            gallery_theme: "video"
            // //theme_gallery_padding:"80",
            // theme_enable_navigation: false,
            // lightbox_type: "compact",
            // tile_enable_border: false,
            // // tiles_type:"nested",
            // tiles_type: "justified",
            //
            // tile_enable_textpanel: false,
            // tile_textpanel_title_text_align: "center",
            // textpanel_enable_description: true,
        })
    });
}

function initMaterialbox() {
    var elems = document.querySelectorAll('.materialboxed');
    M.Materialbox.init(elems, {});
}

document.addEventListener('DOMContentLoaded', function () {
    initCarousel();
    initGallery();
    initVideoGallery();
    initMaterialbox();
});
