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
    $('.js-open-modal').click(function (e) {
        e.preventDefault();
        var modal = $('#modal-' + $(this).attr('data-modal'));
        modal.addClass('js-active');
        $('#overlay').addClass('js-active');
        $('body').addClass('js-body-modal-active');

        setTimeout(
          function()
          {
            modal.addClass('js-transition');
          }, 100);
    });

    $('.js-close-modal').click(function (e) {
        e.preventDefault();
        $('.js-target-modal').removeClass('js-active js-transition');
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
        $('.js-target-modal').removeClass('js-active js-transition');
        $('#overlay').removeClass('js-active');
        $('body').removeClass('js-body-modal-active');
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
      threshold: 0.0,
      multiSearch: true
    };
    var options = {
    valueNames: [ {name:'name', attr:'data-target'}, {name:'country', attr:'data-target'}, {name:'region', attr:'data-target'}, {name:'level', attr:'data-target'}, {name:'organization', attr:'data-target'}, {name:'engagement', attr:'data-target'}, {name:'prog', attr:'data-target'} ],
        plugins: [ ListFuzzySearch(fuzzyOptions) ]
    };

    var companyList = new List('company_data', options);
    companyList.sort('name', { order: "asc" });

    function searchReset() {
        $(".fuzzy-search").val("");
        clearTextSearch();
        companyList.search();
    }

    // Filter by name
    $(".fuzzy-search").keyup(function() {
        var searchString = $(this).val();
        companyList.fuzzySearch.search(searchString, ["name"]);
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
    var sortClickButtons = $(".sort");
    sortClickButtons.on("click", function() {
        $(this).children('i.material-icons').text() == "keyboard_arrow_down" ? $(this).children('i.material-icons').text("keyboard_arrow_up") : $(this).children('i.material-icons').text("keyboard_arrow_down");
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

    function filterList(filters) {
        filters.each(function(idx, selection) {
            $(selection).each(function(idx, option) {
                var filterSelection = $(this).attr("data-filter");
                var option = $(this).children(":selected").attr("id");
                searchQueries[filterSelection] = option.replace("-mobile", "");
            });
        });
        companyList.filter(function(item) {
            if ($(".circle.active").length > 0) {
                // //filter with map selections
                // searchQueries["filter"] = $(".circle.active").attr("id");
                // if (item.values()["filter"] !== null
                // && item.values()["company__provincial-sources"] !== null
                // && item.values()["company__other-sources"] !== null
                // && item.values()["company__provinces"] !== null
                // && item.values()["company__data-sectors"] !== null
                // && item.values()["company__federal-sources"] !== null
                // && (item.values()["filter"].indexOf(searchQueries["filter"]) != -1)
                // && (item.values()["company__provincial-sources"].indexOf(searchQueries["company__provincial-sources"]) != -1)
                // && (item.values()["company__other-sources"].indexOf(searchQueries["company__data-sources"]) != -1 )
                // && (item.values()["company__data-sectors"].indexOf(searchQueries["company__data-sectors"]) != -1)
                // && (item.values()["company__federal-sources"].indexOf(searchQueries["company__federal-sources"]) != -1 )) {
                //     return true;
                // } else {
                //     return false;
                // }
            } else {
                // filter with dropdowns
                // console.log('item', item.values()["region"], searchQueries["region"], item.values()["region"].toLowerCase().indexOf(searchQueries["region"].toLowerCase()), item);
                if (item.values()["region"] !== null
                && item.values()["level"] !== null
                && item.values()["engagement"] !== null
                && item.values()["prog"] !== null
                && (item.values()["region"].toLowerCase().indexOf(searchQueries["region"].toLowerCase()) != -1 )
                && (item.values()["level"].toLowerCase().indexOf(searchQueries["level"].toLowerCase()) != -1 )
                && (item.values()["engagement"].toLowerCase().indexOf(searchQueries["engagement"].toLowerCase()) != -1 )
                && (item.values()["prog"].toLowerCase().indexOf(searchQueries["prog"].toLowerCase())   != -1 )) {
                    return true;
                } else {
                    return false;
                }
            }
        });
    }


    // DROPDOWN FILTERS
    var allFilters = $(".filters select");
    var searchQueries = {};
    allFilters.on("change", function() {
        if ($(this).hasClass("dropdown-mobile")) {
            filterList($(".mobile-filters select"));
        } else {
            filterList($(".filters select"));
        }
    });

    // CLEAR ALL FILTERS
    $(".clear_filters").on("click", function() {
        allFilters.each(function(idx,filter) {
            $('#'+filter.id).prop('selectedIndex',0);
        });
        // $(".circle.active").attr("class","circle");
        companyList.filter();
        searchReset();
        companyList.sort('name', { order: "asc" });
    });

    // tooltips


    $(".js-tooltip-trigger").on("mouseenter", function(e) {
        console.log($("#"+$(this).attr('data-tooltip')).length);
        $("#"+$(this).attr('data-tooltip')).addClass('js-active');

    });

    $(".js-tooltip-trigger").on("mousemove", function(e) {
        var elem = $("#"+$(this).attr('data-tooltip'));
        elem.css({
            left:  e.pageX-elem.outerWidth()/2.0 + 'px',
            top:   e.pageY-elem.outerHeight()-15 + 'px'
        });
    });

    $(".js-tooltip-trigger").on("mouseout", function(e) {
        $("#"+$(this).attr('data-tooltip')).removeClass('js-active');
        $("#"+$(this).attr('data-tooltip')).css({
            left: '0px',
            top:  '0px'
        });
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
