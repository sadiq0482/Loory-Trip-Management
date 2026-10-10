let token = localStorage.getItem('tk');
export const hasToken = () => !!token;
export const setToken = t => { token = t; t ? localStorage.setItem('tk', t) : localStorage.removeItem('tk'); };

export async function api(path, method = 'GET', body) {
  const r = await fetch('/api' + path, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: body && JSON.stringify(body)
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) {
    if (r.status === 401) { setToken(null); location.reload(); }
    throw new Error(d.message || 'Something went wrong');
  }
  return d;
}
