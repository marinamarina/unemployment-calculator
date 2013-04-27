define(
['jquery-1',
 'newsspec_4950/js/vendor/event_emitter',
 'istats-1'],
function (jquery, EventEmitter, istats) {
    return {
        $: jquery,
        pubsub: new EventEmitter(),
        istats: istats
    };
});