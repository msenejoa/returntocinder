import { addMotifsToBiblio } from '../../lib/indexers';

const initialState = {
  doc: null,
  biblio: null,
  entryList: null,
  entriesBySource: null,
  sourceList: null,
  motifList: null,
  query: '',
  status: 'STARTUP',
  showMask: false,
  searchIsVisible: false
};

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case 'RECEIVE_ENTRIES':
    case 'RECEIVE_BIBLIO':
      return {
        ...state,
        ...action.payload
      };

    case 'RECEIVE_DOC':
      return {
        ...state,
        biblio: addMotifsToBiblio(state.biblio, state.entriesBySource),
        ...action.payload
      };

    case 'SET_STATUS': {
      return { ...state, status: action.payload };
    }

    case 'SHOW_MASK': {
      return { ...state, showMask: action.payload };
    }

    case 'TOGGLE_SEARCH_IS_VISIBLE': {
      return { ...state, searchIsVisible: !state.searchIsVisible };
    }

    case 'HIDE_SEARCH': {
      return { ...state, searchIsVisible: false };
    }

    default: {
      return state;
    }
  }
}
