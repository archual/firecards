import { all, call, put, select, take, takeEvery } from 'redux-saga/effects'
import firebase, { reduxSagaFirebase } from '../firebase'
import { actions, ActionTypes, selectors } from './dux'
import { selectors as authSelectors } from '../auth/dux'

export const channels = {
  currentGame: null,
}

export function* closeCurrentGame() {
  if (channels.currentGame) {
  channels.currentGame.close()
    yield put(actions.syncCurrentGame(null))
  }
}
}
}

export function* createGame(action) {
  let { newGame } = action
  if (!newGame) { return }

  // stop listening to current game changes
  yield call(sagas.closeCurrentGame)

  const authUser = yield select(authSelectors.getAuthUser)
  newGame = {
    ...newGame,
    // default to auth user's name if no game name was provided
    name: newGame.name || `${authUser.displayName}'s Game`,
    host: authUser.uid,
    createdAt: firebase.database.ServerValue.TIMESTAMP,
  }
  try {
    const gameKey = yield call(reduxSagaFirebase.create, 'games', newGame)
    yield put(actions.createGameSuccess({...newGame, gameKey}))
  } catch (error) {
    yield put(actions.createGameError(error))
  }
}

export function* getGame(gameKey) {
  const path = 'games/' + gameKey
  return yield call(reduxSagaFirebase.get, path)
}

export function* loadCurrentGame(action) {
  try {
  let currentGame = yield select(selectors.getCurrentGame)

    if (currentGame) {
      // stop listening to current game changes
      yield call(sagas.closeCurrentGame)
  }

    currentGame = yield call(sagas.getGame, action.gameKey)
    currentGame.gameKey = action.gameKey

    // sync current game to state
    yield put(actions.syncCurrentGame(currentGame))
    yield call(sagas.watchCurrentGame, {currentGame})
  } catch (error) {
    yield put(actions.loadCurrentGameError(error))
  }
}

export function* watchCurrentGame(action) {
  const { currentGame } = action
  const { gameKey } = currentGame
  const path = 'games/' + gameKey
  channels.currentGame = yield call(reduxSagaFirebase.channel, path)

  while (true) {
    const game = yield take(channels.currentGame)
    yield put(actions.syncCurrentGame({...game, gameKey}))
  }
}
  }
}

export const sagas = {
  closeCurrentGame,
  createGame,
  getGame,
  loadCurrentGame,
  watchCurrentGame,
}

export default function* root() {
  yield all([
    takeEvery(ActionTypes.GAME_CREATE_REQUEST, sagas.createGame),
    takeEvery(ActionTypes.GAME_CREATE_SUCCESS, sagas.watchCurrentGame),
    takeEvery(ActionTypes.CURRENT_GAME_LOAD, sagas.watchCurrentGame),
  ])
}