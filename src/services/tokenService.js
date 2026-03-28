const TOKEN_KEY = 'clearpay_token'

export const tokenService = {
  get:    ()      => localStorage.getItem(TOKEN_KEY),
  set:    (token) => { if (token) localStorage.setItem(TOKEN_KEY, token) },
  remove: ()      => localStorage.removeItem(TOKEN_KEY),
  has:    ()      => Boolean(localStorage.getItem(TOKEN_KEY)),
}
