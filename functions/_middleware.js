export function onRequest(context) {
  const ua = context.request.headers.get('user-agent') || '';
  const isTVBox = /okhttp|tvbox|影视仓|fongmi|easybox|catvod/i.test(ua.toLowerCase());
  
  if (isTVBox) {
    return Response.redirect(`${context.request.url}/data.json`, 302);
  }
  
  return context.next();
}