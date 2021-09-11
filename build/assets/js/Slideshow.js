    
    
export class Slideshow {
        
        data = []; 
        templates = {};
        images = []; //array of ImageElement

        // constructor begin    
        constructor(configSlideshow, start, timer) {

            this.config = configSlideshow;

            this.t = {};
            if (timer) {
                this.t = timer;
            } else {
                this.t.showTime = function () { };
            }

            let that = this;

            that.t.showTime("Slideshow const before")

            // retrieve data and templates
            Promise.all([
                // load data
                fetch(that.config.dataUrl)
                        .then(loadCSV)
                        .then(convertToJSON)
                        .then(loadCategories)
                        .catch(reject),

                // load UI
                fetch(that.config.templateUrl)
                        .then(loadTemplates)
                        .then(saveTemplates)
                        .catch(reject)
            ])
                    //finish building slideshow
                    .then(finish);

            function finish(resolve, reject) {

                let r_array = resolve.filter(
                        function (el, x) {

                            if (el.message) {
                                return true;
                            }
                            return false;
                        });

                // save results on slideshow

                if (r_array.length === 0) {
                    that.data = resolve[0].data;
                    that.templates = resolve[1];
                }

                console.log(resolve);
                that.t.showTime("finish")

                // callback to start script
                start();
            }

            function reject(err) {
                console.log("ERROR: ", err);
                return err;
            }

            //split templates and save
            function saveTemplates(response) {

                that.t.showTime("saveTemplates before")

                // split different templates and add to Slideshow
                var templates = {};
                let re = new RegExp(/\<.*\s+id\s*\=\s*"(.*)"\s*\>/i);

                response.split("<!--###-->")
                        .forEach((item, index) => {
                            templates[re.exec(item)[1]] = item.replace(/(\s*)\</g, "<");
                        });
                that.t.showTime("saveTemplates after")

                return templates;
            }

            function loadTemplates(response) {
                return response.text();
            }
            function loadCSV(result) {
                return result.text();
            }
            function convertToJSON(response) {

                //console.log("convertToJSON before " + ++count + ": " + timer());
                that.t.showTime("convertToJSON before")

                var config = {
                    delimiter: "", // auto-detect
                    newline: "", // auto-detect
                    quoteChar: '"',
                    escapeChar: '"',
                    header: true,
                    trimHeader: true,
                    dynamicTyping: false,
                    preview: 0,
                    encoding: "",
                    worker: false,
                    comments: false,
                    step: undefined,
                    complete: undefined,
                    error: undefined,
                    download: false,
                    skipEmptyLines: false,
                    chunk: undefined,
                    fastMode: undefined,
                    beforeFirstChunk: undefined,
                    withCredentials: undefined
                };

                // parse csv into json
                response = Papa.parse(response, config);

                that.t.showTime("convertToJSON after")

                return response;
            }

            function loadCategories(response) {

                that.t.showTime("loadCategories before")

                var data = response;

                that.t.showTime("loadCategories after")

                return data;
            }
        
        } //constructor end

        // public Slideshow functions

        showImageArray() {
            return this.images;
        }

    loadImages(config) {
            
            this.t.showTime("loadImages before")
            
            function isSelected(el, index) {
            if (!Number.isNaN(parseInt(el.id)) 
                        && el.include.toUpperCase() !== "N"
                        && index < 30) {
                    return true;
                
            } 
                return false;
            }
            
            //var that = this;
            // TODO add load-as-you-scroll logic
            this.data.forEach(function (el, index) {
                
                // selection criteria
                //TODO add filter function and dropbox selection
                if (isSelected(el, index)) {

                    // add include message
                    let iMessage = "&nbsp;",
                        newClass = "";

                    switch (el.include.toUpperCase()) {

                        case "F":
                            iMessage = "FEATURED"
                            newClass = "featured"
                            break;

                        case "J":
                            iMessage = "NEW"
                            newClass = "new"
                            break;
                        
                        case "S":
                            iMessage = "SALE"
                            newClass = "sale"
                            break;
                        
                        default:
                            break;

                    }      
                    
                    // is item is for sale, build link.
                    let sales_status = 
                            (el.sold_where !== "" ? "SOLD" :
                            "<a class='card-link' href='" + el.sales_url + "'"  + " target='_blank'>FOR SALE</a>");
                    
                    //build image url
                    el.src = "./assets/images/galleries/" + el.category + "/" + el.subcategory + "/" + el.file_name; 
                    
                    // load default gif (replaced by actual image later)
                    let img_code = '<img id="img_' + el.id + '" class="thumb_image lazyload" '
                        //+ 'loading="lazy" '
                        + ' src = "./assets/images/resources/loading.gif" alt = "' + el.title + '" > ';
                    var template_name ="item_template2";
                    // build html from 'item_template'
                    var code = this.templates[template_name]
                            .replace(template_name, el.id)
                            .replace("{{title}}", el.title)
                            .replace("{{sales_status}}", sales_status)
                            .replace("{{image}}", img_code)
                            .replace("{{include_text}}", iMessage)
                            .replace("{{include_class}}", newClass);

                    // add item to containing element 
                    var $item_el = $(config.target).append(code);
                    
                    const load = function () {
                        console.log(el.id, $(this), $(this).css("height"), $(this).css("width"));
                        //set correct aspect ratio
                        let asp = this.naturalHeight / this.naturalWidth;
                        if (asp < 1) {
                            //$(this).css("height", $(this).height() * asp); 
                            $(this).css("height", "" + 12 * asp + "em");
                        } else {
                            //$(this).css("width", $(this).height();
                            $(this).css("width", "" + 12 / asp + "em");
                                                                     
                        }
                    };
                    const error = function () {
                                $(this).attr("src", 
                        "./assets/images/resources/no-image-icon.png");
                                console.log("image error", $(this));                              };
                    
                    // find new image and set up event handlers
                    var img = $item_el.find("#img_"+el.id);
                    img.on({load: load,
                            error: error});

                    // change image src 
                    img.src = el.src;
                    img.attr("src", el.src);
                }

                
            }, this);
            this.t.showTime("loadImages after")

            return;
        }
        
    } // class Slideshow end  

   // var ss = new Slideshow({});

   // return ss;

