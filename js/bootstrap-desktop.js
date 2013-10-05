define(
['jquery-1',
 'vendor/eventEmitter',
 'istats-1'],
function (jquery, EventEmitter, istats) {
    return {
        $: jquery,
        pubsub: new EventEmitter(),
        istats: istats
    };
});