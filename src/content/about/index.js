import frontis from './frontis.json';
import menu from './menu.json';
import grammar from './grammar.json';
import epigraphs from './epigraphs.json';
import manifest from './manifest.json';
import contact from './contact.json';

const bibliography = (appState) => {
  const content = {
    title: 'bibliography'
  };
  if (!appState.biblio) {
    return {
      ...content,
      body: ['loading...']
    };
  }
  const biblioList = Object.keys(appState.biblio).reduce((list, sid) =>
    list.concat(appState.biblio[sid]), []
  );
  biblioList.sort((a, b) => a.id < b.id ? -1 : 1);
  return {
    title: 'bibliography',
    body: biblioList.map(b => (
      `${b.id} ${b.citations.join('<br />')}`
    ))
  };
};

export {
  frontis,
  menu,
  grammar,
  epigraphs,
  manifest,
  bibliography,
  contact
};
