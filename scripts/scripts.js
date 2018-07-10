$(document).ready(function () {
    // Smooth Scrolling Function
    $('a[href*=#]:not([href=#])').click(function () {
        var $targ = $(this.hash),
            host1 = this.hostname,
            host2 = location.hostname,
            path1 = this.pathname.replace(/^\//, ''),
            path2 = location.pathname.replace(/^\//, '');

        if (!$targ.length) {
            $targ = $('[name=' + this.hash.slice(1) + ']');
        }

        if ($targ.length && (host1 === host2 || path1 === path2)) {
            $('html, body').animate({ scrollTop: $targ.offset().top }, 1000);

            return false;
        }

        return true;
    });

    // Modal Click Behavior
    $('.js-open-modal').click(function () {
        $('.js-target-modal').addClass('js-active');
        $('#overlay').addClass('js-active');
        $('body').addClass('js-body-modal-active');
    });

    $('.js-close-modal').click(function () {
        $('.js-target-modal').removeClass('js-active');
        $('#overlay').removeClass('js-active');
        $('body').removeClass('js-body-modal-active');
    });

    // Sticky Click Behavior
    $('.js-close-sticky').click(function () {
        $('.js-target-sticky').removeClass('js-active');
    });

    // Search Click Behavior
    $('.js-trigger-search').click(function (e) {
        e.preventDefault();
        $(this).parent().addClass('js-active');
        $('#overlay').addClass('js-active');
    });


    // Table Search
    $('.js-open-table-search').click(function (e) {
        e.preventDefault();
        $(this).parent().siblings('.table-sortable__search').toggleClass('table-sortable__search--active');
    });

    // Main Menu Click Behavior
    $('.js-trigger-menu').click(function (e) {
        $(this).next().addClass('js-active-menu');
        $('#overlay').addClass('js-active');
    });

    // General Click Behavior for Overlay
    $('#overlay').click(function () {
        $('.js-active').removeClass('js-active');
        $('.js-active-menu').removeClass('js-active-menu');
    });

    // Slider
    $('.slider').slick({
        arrows: true,
        draggable: false,
        swipeToSlide: true,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 800,
                settings: {
                    draggable: true
                }
            }
        ]
    });

    // Timeline Default
    var timelineItems = $(".timeline-boxes__item");
    var latestTimelineItem = timelineItems[timelineItems.length -1]
    $(latestTimelineItem).addClass("timeline-boxes__item--latest");

    $(".timeline-boxes").on("mouseover", function() {
        $(latestTimelineItem).removeClass("timeline-boxes__item--latest")
    }).on("mouseout", function() {
        $(latestTimelineItem).addClass("timeline-boxes__item--latest")
    });

    // List.js Implementation
    var fuzzyOptions = {
      searchClass: "fuzzy-search",
      location: 0,
      distance: 100,
      threshold: 0.4,
        multiSearch: true
    };
    var options = {
    valueNames: [ {name:'company__name', attr:'data-target'}, 'company__category', 'company__type', 'company__founded', {name:'company__location', attr:'data-target'}, 'company__last-update', { attr: 'data-location', name: 'filter' }, {name: 'company__other-sources', attr: 'data-target'}, {name:'company__data-sectors',attr:'data-target'}, {name:'company__federal-sources', attr: 'data-target'}, {name:'company__provincial-sources', attr: 'data-target'} ],
        plugins: [ ListFuzzySearch() ]
    };

    var companyList = new List('company_data', options);

    function searchReset() {
        $(".fuzzy-search").val("");
        clearTextSearch();
        companyList.search();
    }

    // Filter by name and location
    $(".fuzzy-search").keyup(function() {
        if (this.id=="company__name--input") {
            var searchString = $(this).val();
            companyList.fuzzySearch.search(searchString, ["company__name"]);
        } else if (this.id=="company__location--input") {
            var searchString = $(this).val();
            companyList.fuzzySearch.search(searchString, ["company__location"]);
        }
    });

    $(".js-open-table-search").on("click", function(e) {
       $($(this).attr('data-target')).focus();
    })

    // Xs and ESC TO CLOSE OUT FORM
    var searchButtons = $('.table-sortable__search').find("button[type='submit']")

    searchButtons.on("click", function(e) {
        e.preventDefault();
        if ($(this).parent().hasClass("table-sortable__search--active")) {
            $(this).parent().removeClass("table-sortable__search--active");
            searchReset();
        }
    });

    function clearTextSearch() {
        $('.table-sortable__search--active').each(function(){
            $(this).removeClass('table-sortable__search--active');
        });
    }

    $("body").keyup(function(event) {
        if ( event.keyCode == "27" ) {
            $(this).parent().find('.table-sortable__search').removeClass("table-sortable__search--active");
            searchReset();
        }
    });

    // SORT ICON
    var sortClickButtons = $(".table-sortable__control > i:contains('keyboard_arrow_down')");
    sortClickButtons.on("click", function() {
        $(this).text() == "keyboard_arrow_down" ? $(this).text("keyboard_arrow_up") : $(this).text("keyboard_arrow_down");

    });

    // FILTER WITH MAP

    $("body").on("click", ".circle", function(){
        // Remove active map circle selected by dropdown
        var dropdownSelection = $('#table-dropdown__provinces').children(":selected").attr("id");
        $('.circle#' + dropdownSelection).attr('class','circle')
        //Reset dropdown default if map is clicked
        $('#table-dropdown__provinces').prop('selectedIndex',0);
        var selectedOption = $(".circle.active").attr("data-province");
        var allFilters = $(".table-dropdown select");
        var searchQueries = {};
        if ($(this).attr('class') == 'circle active') {
            $('#table-dropdown__provinces').val(selectedOption);
            searchQueries["filter"] = $(this).attr("id");
        } else {
            $(".circle.active").attr("class","circle");
            $('#table-dropdown__provinces').prop('selectedIndex',0);
            searchQueries["filter"] = 'all';
        }
        filterList();
    });

    // FILTER WITH PROVINCE DROPDOWN
    $('#table-dropdown__provinces').on('change', function() {
        $(".circle.active").attr("class","circle");
        var circleSelect = $(this).children(":selected").attr("id");
        $('.circle#' + circleSelect).attr({class:'circle active'});
        companyList.filter();
    });

    function filterList() {
        allFilters.each(function(idx, selection) {
            $(selection).each(function(idx, option) {
                var filterSelection = $(this).attr("data-filter");
                var option = $(this).children(":selected").attr("id");
                searchQueries[filterSelection] = option;
            });
        });
        companyList.filter(function(item) {
            if ($(".circle.active").length > 0) {
                //filter with map selections
                searchQueries["filter"] = $(".circle.active").attr("id");
                if (item.values()["filter"] !== null 
                && item.values()["company__provincial-sources"] !== null 
                && item.values()["company__other-sources"] !== null 
                && item.values()["company__provinces"] !== null 
                && item.values()["company__data-sectors"] !== null 
                && item.values()["company__federal-sources"] !== null 
                && (item.values()["filter"].indexOf(searchQueries["filter"]) != -1)
                && (item.values()["company__provincial-sources"].indexOf(searchQueries["company__provincial-sources"]) != -1)
                && (item.values()["company__other-sources"].indexOf(searchQueries["company__data-sources"]) != -1 )
                && (item.values()["company__data-sectors"].indexOf(searchQueries["company__data-sectors"]) != -1)
                && (item.values()["company__federal-sources"].indexOf(searchQueries["company__federal-sources"]) != -1 )) {
                    return true;
                } else {
                    return false;
                }
            } else {
                // filter with dropdowns
                if (item.values()["company__provinces"] !== null 
                && item.values()["company__provincial-sources"] !== null 
                && item.values()["company__other-sources"] !== null 
                && item.values()["company__data-sectors"] !== null 
                && item.values()["company__federal-sources"] !== null 
                && (item.values()["company__provincial-sources"].indexOf(searchQueries["company__provincial-sources"]) != -1 )
                && (item.values()["company__other-sources"].indexOf(searchQueries["company__data-sources"]) != -1 )
                && (item.values()["company__data-sectors"].indexOf(searchQueries["company__data-sectors"]) != -1 )
                && (item.values()["company__federal-sources"].indexOf(searchQueries["company__federal-sources"]) != -1 )
                && (item.values()["filter"].indexOf(searchQueries["company__provinces"])   != -1 )) {
                    return true;
                } else {
                    return false;
                }
            }
        });
    }


    // DROPDOWN FILTERS
    var allFilters = $(".table-dropdown select");
    var searchQueries = {};
    allFilters.on("change", function() {
        filterList();
    });

    // CLEAR ALL FILTERS
    $(".clear_filters").on("click", function() {
        allFilters.each(function(idx,filter) {
            $('#'+filter.id).prop('selectedIndex',0);
        });
        $(".circle.active").attr("class","circle");
        companyList.filter();
        searchReset();
        companyList.sort('company__name', { order: "asc" });
    });


    //LOGO FADE
    // var fadeOutLogo = function () {
    //   setTimeout(function(){
    //     $('.od500-logo__bottom')
    //       .animate({opacity: 0}, 2000);
    //     }, 2000);
    // };

    // var fadeInLogo = function() {
    //   setTimeout(function(){
    //     $('.od500-logo__bottom')
    //       .attr('src', '/img/150.png')
    //       .animate({opacity: 1}, 2000);
    //   }, 5000);
    // };

    // $.when($.ajax(fadeOutLogo())).then(function () {
    //   fadeInLogo();
    // });

}); // doc.ready
