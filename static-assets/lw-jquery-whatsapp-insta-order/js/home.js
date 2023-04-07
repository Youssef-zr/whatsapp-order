$(() => {

    // go to menu
    $('.btn-go-menu').on('click', function () {
        $('html,body').animate({
            scrollTop: $('.section-menu-category').offset().top-20
        },1000)
    });

})