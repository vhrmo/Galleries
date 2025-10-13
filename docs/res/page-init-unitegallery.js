function getWidth() {
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
}

const resources = [
    '../res/unitegallery/css/unite-gallery.css',
    '../res/jquery-3.7.1/jquery.min.js',
    '../res/unitegallery/js/unitegallery.min.js',
    '../res/unitegallery/themes/tiles/ug-theme-tiles.js'
];

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.type = 'text/javascript';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

function loadCSS(href) {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = href;
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
    });
}

/**
 * Load all resources (CSS and JS) sequentially.
 * @returns {Promise<string>}
 */
async function loadResources() {
    for (const resource of resources) {
        if (resource.endsWith('.css')) {
            await loadCSS(resource);
        } else {
            await loadScript(resource);
        }
    }
    return 'All resources loaded';
}

function initUGCarousel(selector = ".ug-carousel") {
    let count = Math.floor(getWidth() / 200);
    if (count < 3) {
        count = 3;
    }
    let carousel_space_between_tiles = 4;
    let tileSize = Math.floor((getWidth() - 10 - (carousel_space_between_tiles * count)) / count);
    // console.log("width", getWidth(), "tileSize", tileSize, "count", count, "calcTotal", count * tileSize)
    $(selector).each(function (idx) {
        // check if the gallery has id, if not, assign one
        if (!this.id) {
            this.id = `${selector}-${idx}`;
        }
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

function initUGGallery(selector = ".ug") {
    $(selector).each(function (idx) {
        // check if the gallery has id, if not, assign one
        if (!this.id) {
            this.id = `${selector.substring(1)}-${idx}`;
        }
        $(this).unitegallery({
            theme_enable_navigation: false,
            // lightbox_type: "compact",
            tile_enable_border: false,
            // tiles_type:"nested",
            tiles_type: "justified",

            tile_enable_textpanel: false,
        })
    });
}

function initUGVideoGallery(selector = ".ug-video") {
    $(selector).each(function (idx) {
        // check if the gallery has id, if not, assign one
        if (!this.id) {
            this.id = `${selector}-${idx}`;
        }
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


function initUniteGallery() {
    loadResources().then((values) => {
        console.log(values);
        // Unite Gallery inits
        // initUGCarousel();
        initUGGallery();
        // initUGVideoGallery();
    });
}

initUniteGallery();


