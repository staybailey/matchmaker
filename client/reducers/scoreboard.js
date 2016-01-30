import { UPDATE_SCOREBOARD } from '../actions/scoreboard';

export default function scoreboard(state = [], action) {
  switch (action.type) {
    case UPDATE_SCOREBOARD:
      return action.updatedScoreboard; // not returning new state?
    default:
      return state;
  }
  return state;
}
