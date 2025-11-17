export default (ctx, inject) => {
  const channel = new BroadcastChannel('app_events');

  inject('broadcast', {
    channel,
    send(event, payload = {}) {
      channel.postMessage({ event, payload });
    },
    on(fn) {
      channel.onmessage = fn;
    }
  });
};
