// Set of dependencies
// This gives us flexibility to change dependencies with a common API e.g. Bonzo --> jQuery
define(['vendor/ender/bonzo',
        'vendor/ender/qwery-mobile',
        'newsspec_4950/js/vendor/event_emitter',
        'vendor/istats/istats'
], function (
    bonzo,
    qwery,
    pubsub,
    istats
) {
    var news = {
        $: function(selector, context) {
            return bonzo(qwery(selector, context));
        },
        pubsub: new EventEmitter(),
        istats: istats
    };

    return news;

});