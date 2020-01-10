describe('Browser save and open', function() {

  it('The current graph is automatically stored in browser local storage', function() {
    cy.startApplication();
    cy.clearAndRenderDotSource('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 1);
    cy.savedGraphName(0).should('have.text', 'Untitled Graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');
  })

  it('The graph is saved to browser local storage when the save as button is clicked', function() {
    cy.startApplication();
    cy.clearAndRenderDotSource('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.saveAsButton().click();

    cy.saveToBrowserDialog().should('exist');

    cy.saveToBrowserNameInput().type('My graph');
    cy.saveToBrowserSaveButton().click()

    cy.saveToBrowserDialog().should('not.exist');

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 2);
    cy.savedGraphName(1).should('have.text', 'My graph');
    cy.savedGraphDotSource(1).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(1).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(1).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');
  })

  it('The graph is loaded from a saved graph in browser local storage when to open button is clicked', function() {
    cy.startApplication();
    cy.clearAndRenderDotSource('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.saveAsButton().click();

    cy.saveToBrowserDialog().should('exist');

    cy.saveToBrowserNameInput().type('My graph');
    cy.saveToBrowserSaveButton().click()

    cy.saveToBrowserDialog().should('not.exist');

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 2);
    cy.savedGraphName(1).should('have.text', 'My graph');
    cy.savedGraphDotSource(1).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(1).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(1).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.openGraphCancelButton().click();

    cy.openFromBrowserDialog().should('not.exist');

    cy.clearAndRenderDotSource('digraph {Charlie -> Daphne -> Ernie}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.node(3).should('exist');
    cy.edge(1).should('exist');
    cy.edge(2).should('exist');

    cy.node(1).shouldHaveName('Charlie');
    cy.node(2).shouldHaveName('Daphne');
    cy.node(3).shouldHaveName('Ernie');
    cy.edge(1).shouldHaveName('Charlie->Daphne');
    cy.edge(2).shouldHaveName('Daphne->Ernie');

    cy.nodes().should('have.length', 3);
    cy.edges().should('have.length', 2);

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 2);

    cy.savedGraphName(0).should('have.text', 'My graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Charlie -> Daphne -> Ernie}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nCharlie\n\nCharlie\n\n\n\nDaphne\n\nDaphne\n\n\n\nCharlie->Daphne\n\n\n\n\n\nErnie\n\nErnie\n\n\n\nDaphne->Ernie\n\n\n\n\n');

    cy.savedGraphName(1).should('have.text', 'Untitled Graph');
    cy.savedGraphDotSource(1).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(1).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(1).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.savedGraphName(1).click();
    cy.openGraphOpenButton().click();

    cy.openFromBrowserDialog().should('not.exist');

    cy.waitForTransition();

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);
  })

  it('A graph saved in browser local storage is deleted when the delete icon is clicked', function() {
    cy.startApplication();
    cy.clearAndRenderDotSource('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.saveAsButton().click();

    cy.saveToBrowserDialog().should('exist');

    cy.saveToBrowserNameInput().type('My graph');
    cy.saveToBrowserSaveButton().click()

    cy.saveToBrowserDialog().should('not.exist');

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 2);
    cy.savedGraphName(1).should('have.text', 'My graph');
    cy.savedGraphDotSource(1).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(1).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(1).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.openGraphCancelButton().click();

    cy.openFromBrowserDialog().should('not.exist');

    cy.clearAndRenderDotSource('digraph {Charlie -> Daphne -> Ernie}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.node(3).should('exist');
    cy.edge(1).should('exist');
    cy.edge(2).should('exist');

    cy.node(1).shouldHaveName('Charlie');
    cy.node(2).shouldHaveName('Daphne');
    cy.node(3).shouldHaveName('Ernie');
    cy.edge(1).shouldHaveName('Charlie->Daphne');
    cy.edge(2).shouldHaveName('Daphne->Ernie');

    cy.nodes().should('have.length', 3);
    cy.edges().should('have.length', 2);

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 2);

    cy.savedGraphName(0).should('have.text', 'My graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Charlie -> Daphne -> Ernie}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nCharlie\n\nCharlie\n\n\n\nDaphne\n\nDaphne\n\n\n\nCharlie->Daphne\n\n\n\n\n\nErnie\n\nErnie\n\n\n\nDaphne->Ernie\n\n\n\n\n');

    cy.savedGraphName(1).should('have.text', 'Untitled Graph');
    cy.savedGraphDotSource(1).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(1).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(1).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.savedGraphDeleteButton(1).click();

    cy.deleteGraphDialog().should('exist');

    cy.deleteGraphDeleteButton().click();

    cy.deleteGraphDialog().should('not.exist');

    cy.savedGraphs().should('have.length', 1);

    cy.savedGraphName(0).should('have.text', 'My graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Charlie -> Daphne -> Ernie}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nCharlie\n\nCharlie\n\n\n\nDaphne\n\nDaphne\n\n\n\nCharlie->Daphne\n\n\n\n\n\nErnie\n\nErnie\n\n\n\nDaphne->Ernie\n\n\n\n\n');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.node(3).should('exist');
    cy.edge(1).should('exist');
    cy.edge(2).should('exist');

    cy.node(1).shouldHaveName('Charlie');
    cy.node(2).shouldHaveName('Daphne');
    cy.node(3).shouldHaveName('Ernie');
    cy.edge(1).shouldHaveName('Charlie->Daphne');
    cy.edge(2).shouldHaveName('Daphne->Ernie');

    cy.nodes().should('have.length', 3);
    cy.edges().should('have.length', 2);

    cy.savedGraphDeleteButton(0).click();

    cy.deleteGraphDialog().should('exist');

    cy.deleteGraphDeleteButton().click();

    cy.deleteGraphDialog().should('not.exist');

    cy.savedGraphs().should('have.length', 0);

    cy.node(1).should('not.exist');
    cy.node(2).should('not.exist');
    cy.node(3).should('not.exist');
    cy.edge(1).should('not.exist');
    cy.edge(2).should('not.exist');

    cy.nodes().should('have.length', 0);
    cy.edges().should('have.length', 0);

  })

  it('The graph is renamed in browser local storage through the menu item Rename', function() {
    cy.startApplication();
    cy.clearAndRenderDotSource('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.saveAsButton().click();

    cy.saveToBrowserDialog().should('exist');

    cy.saveToBrowserNameInput().type('My graph');
    cy.saveToBrowserSaveButton().click()

    cy.saveToBrowserDialog().should('not.exist');

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 2);

    cy.savedGraphName(0).should('have.text', 'Untitled Graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.savedGraphName(1).should('have.text', 'My graph');
    cy.savedGraphDotSource(1).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(1).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(1).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.openGraphCancelButton().click();

    cy.openFromBrowserDialog().should('not.exist');

    cy.menuButton().click();

    cy.menuItemRename().click()

    cy.saveToBrowserDialog().should('exist');

    cy.saveToBrowserNameInput().type('My graph 2');
    cy.saveToBrowserSaveButton().click()

    cy.saveToBrowserDialog().should('not.exist');

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 2);

    cy.savedGraphName(0).should('have.text', 'Untitled Graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.savedGraphName(1).should('have.text', 'My graph 2');
    cy.savedGraphDotSource(1).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(1).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(1).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');
  })

  it('Saving a graph to browser local storge under a name that already exist, opens a dialog asking the user for confirmation and then writes over that graph', function() {
    cy.startApplication();
    cy.clearAndRenderDotSource('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.menuButton().click();

    cy.menuItemRename().click()

    cy.saveToBrowserDialog().should('exist');

    cy.saveToBrowserNameInput().type('My graph');
    cy.saveToBrowserSaveButton().click()

    cy.saveToBrowserDialog().should('not.exist');

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');
    cy.savedGraphs().should('have.length', 1);
    cy.savedGraphName(0).should('have.text', 'My graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.openGraphCancelButton().click();

    cy.openFromBrowserDialog().should('not.exist');

    cy.saveAsButton().click();

    cy.saveToBrowserDialog().should('exist');

    cy.saveToBrowserNameInput().type('My graph 2');
    cy.saveToBrowserSaveButton().click()

    cy.saveToBrowserDialog().should('not.exist');

    cy.menuButton().click();

    cy.menuItemRename().click()

    cy.saveToBrowserDialog().should('exist');

    cy.saveToBrowserNameInput().type('My graph');
    cy.saveToBrowserSaveButton().click()

    cy.replaceGraphDialog().should('exist');

    cy.replaceGraphReplaceButton().click();

    cy.saveToBrowserDialog().should('not.exist');

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 1);
    cy.savedGraphName(0).should('have.text', 'My graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');
  })

  it('A new empty graph is created when the new button is clicked', function() {
    cy.startApplication();
    cy.clearAndRenderDotSource('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 1);
    cy.savedGraphName(0).should('have.text', 'Untitled Graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.openGraphCancelButton().click();

    cy.openFromBrowserDialog().should('not.exist');

    cy.newButton().click();

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 1);

    cy.savedGraphName(0).should('have.text', 'Untitled Graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.openGraphCancelButton().click();

    cy.openFromBrowserDialog().should('not.exist');

    cy.insertDotSource('digraph {Charlie -> Daphne -> Ernie}');
    cy.waitForTransition();

    cy.openFromBrowserDialog().should('not.exist');

    cy.newButton().click();

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 2);

    cy.savedGraphName(0).should('have.text', 'Untitled Graph 1');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Charlie -> Daphne -> Ernie}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nCharlie\n\nCharlie\n\n\n\nDaphne\n\nDaphne\n\n\n\nCharlie->Daphne\n\n\n\n\n\nErnie\n\nErnie\n\n\n\nDaphne->Ernie\n\n\n\n\n');

    cy.savedGraphName(1).should('have.text', 'Untitled Graph');
    cy.savedGraphDotSource(1).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(1).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(1).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');
  })

})
