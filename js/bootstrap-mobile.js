// Set of dependencies
// This gives us flexibility to change dependencies with a common API e.g. Bonzo --> jQuery
define(['jquery',
        'vendor/eventEmitter',
        'vendor/istats/istats'
], function (
    jquery,
    pubsub,
    istats
) {
    var news = {
        $: jquery,
        pubsub: new EventEmitter(),
        istats: istats
    };

    return news;

});