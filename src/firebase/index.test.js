import { getAuthUserFromLocalStorage, uiConfig } from './index'

it('returns null from local storage if there is no authenticated user', () => {
  const empty = getAuthUserFromLocalStorage()
  expect(empty).toBeNull()
})

it('returns a user from local storage', () => {
  localStorage['firebase:authUser:'] = '{"user": "test"}'
  const user = getAuthUserFromLocalStorage()
  expect(user.user).toEqual('test')
})

describe('uiConfig', () => {
  it('does not redirect on sign in success', () => {
    expect(uiConfig.callbacks.signInSuccess()).toEqual(false)
  })
})