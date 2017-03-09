import { TournamentPage } from './app.po';

describe('tournament App', function() {
  let page: TournamentPage;

  beforeEach(() => {
    page = new TournamentPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
