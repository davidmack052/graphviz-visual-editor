describe('Insertion of nodes into the graph', function() {

  function hsvToHex(h, s, v) {
        const x = 1 - Math.abs((h * 360 / 60) % 2 - 1);
        if (h <= 1 / 6) {
          return rgbToHex(1 * 255, x * 255, 0 * 255);
        } else if (1 / 6 <= h && h < 2 / 6) {
          return rgbToHex(x * 255, 1 * 255, 0 * 255);
        } else if (2 / 6 <= h && h < 3 / 6) {
          return rgbToHex(0 * 255, 1 * 255, x * 255);
        } else if (3 / 6 <= h && h < 4 / 6) {
          return rgbToHex(0 * 255, x * 255, 1 * 255);
        } else if (4 / 6 <= h && h < 5 / 6) {
          return rgbToHex(x * 255, 0 * 255, 1 * 255);
        } else {
          return rgbToHex(1 * 255, 0 * 255, x * 255);
        }
  }

  function rgbToHex(r, g, b) {
    return ('00000' + ((Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b)).toString(16)).slice(-6);
  }

  function checkColor(actualHexColor, expectedHexColor, colorTolerance, propertyName='the') {
    const expectedColor = parseInt(expectedHexColor.slice(1), 16);
    const expectedRed = (expectedColor & 0xff0000) >> 16;
    const expectedGreen = (expectedColor & 0x00ff00) >> 8;
    const expectedBlue = (expectedColor & 0x0000ff);

    const actualColor = parseInt(actualHexColor.slice(1), 16);
    const actualRed = (actualColor & 0xff0000) >> 16;
    const actualGreen = (actualColor & 0x00ff00) >> 8;
    const actualBlue = (actualColor & 0x0000ff);

    const absDiffRed = Math.abs(actualRed - expectedRed);
    const absDiffGreen = Math.abs(actualGreen - expectedGreen);
    const absDiffBlue = Math.abs(actualBlue - expectedBlue);

    assert.isAtMost(absDiffRed, colorTolerance, propertyName + ' red component');
    assert.isAtMost(absDiffGreen, colorTolerance, propertyName + ' green component');
    assert.isAtMost(absDiffBlue, colorTolerance, propertyName + ' blue component');
  }

  it('Inserts a node with latest attributes when middle mouse button is clicked', function() {
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

    cy.get('#graph0').trigger('mousedown', 'topLeft', {which: 2});
    cy.get('#graph0').trigger('mouseup', 'topLeft', {which: 2});
    cy.waitForTransition();

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.node(3).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.node(3).shouldHaveName('n2');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 3);
    cy.edges().should('have.length', 1);
  })

  it('Inserts a node with default attributes when middle mouse button is shift-clicked', function() {
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

    cy.toolbarButton('Node format').click();
    cy.styleSwitch().click();
    cy.style('dotted').click();

    cy.get('#graph0').trigger('mousedown', 'topLeft', {which: 2, shiftKey: true});
    cy.get('#graph0').trigger('mouseup', 'topLeft', {which: 2, shiftKey: true});
    cy.waitForTransition();

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.node(3).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.node(3).shouldHaveName('n2');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.node(1).find('ellipse').should('not.have.attr', 'stroke-dasharray');
    cy.node(2).find('ellipse').should('not.have.attr', 'stroke-dasharray');
    cy.node(3).find('ellipse').should('have.attr', 'stroke-dasharray', '1,5');

    cy.nodes().should('have.length', 3);
    cy.edges().should('have.length', 1);
  })

  it('Inserts a node when a node in an insert panel is clicked', function() {
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

    cy.toolbarButton('Insert').click();
    cy.nodeShapeCategory('Basic shapes').click()
    cy.insertPanels().find('#node1').click();

    cy.waitForTransition();

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.node(3).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.node(3).shouldHaveName('n2');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 3);
    cy.edges().should('have.length', 1);
  })

  it('Inserts a node when a node is dragged from an insert panel to the canvas', function() {
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

    cy.toolbarButton('Insert').click();
    cy.nodeShapeCategory('Basic shapes').click()
    cy.insertPanels().find('#node1')
      .trigger('dragstart', {dataTransfer: new DataTransfer});
    cy.get('#canvas #graph0')
      .trigger('dragover', {force: true})
      .trigger('drop', {force: true});
    cy.insertPanels().find('#node1')
      .trigger('dragend', {force: true});

    cy.waitForTransition();

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.node(3).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.node(3).shouldHaveName('n2');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 3);
    cy.edges().should('have.length', 1);
  })

  it('Inserts a node by copy-and-paste another node', function() {
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

    cy.node(1).click();
    cy.get('body').type('{ctrl}c');
    cy.get('body').type('{ctrl}v');
    cy.waitForTransition();

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.node(3).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.node(3).shouldHaveName('n2');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 3);
    cy.edges().should('have.length', 1);
  })

  it('Replaces a node by cut-and-paste it thereby removing its connected edges', function() {
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

    cy.node(1).click();
    cy.get('body').type('{ctrl}x');
    cy.waitForTransition();

    cy.node(1).should('exist');

    cy.node(1).shouldHaveName('Bob');

    cy.nodes().should('have.length', 1);
    cy.edges().should('have.length', 0);

    cy.get('body').type('{ctrl}v');
    cy.waitForTransition();

    cy.node(1).should('exist');
    cy.node(2).should('exist');

    cy.node(1).shouldHaveName('Bob');
    cy.node(2).shouldHaveName('n1');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 0);
  })

  it('Default node style is seleced from one of the styles in the node format drawer', function() {
    cy.startApplication();
    cy.settingsButton().click();
    cy.fitSwitch().click();
    cy.get('body').type('{esc}', { release: false });
    cy.clearAndRenderDotSource('digraph {}');

    cy.nodes().should('have.length', 0);
    cy.edges().should('have.length', 0);

    cy.toolbarButton('Insert').click();
    cy.nodeShapeCategory('Basic shapes').click()

    cy.toolbarButton('Node format').click();

    const styles = [
      'dashed',
      'dotted',
      'solid',
      'invis',
      'bold',
      'filled',
      'striped',
      'wedged',
      'diagonals',
      'rounded',
      'radial',
    ];

    cy.styles().should('have.text', styles.join(''));

    cy.styleSwitch().click();

    let numberOfVisibleNodes = 0;
    styles.forEach((style, i) => {
      const nodeIndex = i + 1;

      cy.style(style).click();

      cy.nodeShape('box').click({force: true});
      cy.waitForTransition();

      if (style != 'invis') {
        numberOfVisibleNodes += 1;

        cy.node(nodeIndex).should('exist');
        cy.node(nodeIndex).shouldHaveName('n' + (nodeIndex - 1));

        switch(style) {
        case 'dashed':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('have.attr', 'stroke-dasharray', '5,2');
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'dotted':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('have.attr', 'stroke-dasharray', '1,5');
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'solid':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'bold':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'stroke-width', '2');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'filled':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', '#d3d3d3');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'striped':
          cy.node(nodeIndex).find('polygon').should('have.length', 2);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'stroke-width', '.5');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'fill', '#d3d3d3');
          cy.node(nodeIndex).find('polygon').eq(1).should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'wedged':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'diagonals':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 4);
          break;
        case 'rounded':
          cy.node(nodeIndex).find('polygon').should('have.length', 0);
          cy.node(nodeIndex).find('path').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('path').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('path').should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'radial':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', '#d3d3d3');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        }
      }
      cy.nodes().should('have.length', numberOfVisibleNodes);

      cy.style(style).click();
    });
  })

  it('Default node style is seleced from multiple styles in the node format drawer', function() {
    cy.startApplication();
    cy.settingsButton().click();
    cy.fitSwitch().click();
    cy.get('body').type('{esc}', { release: false });
    cy.clearAndRenderDotSource('digraph {}');

    cy.nodes().should('have.length', 0);
    cy.edges().should('have.length', 0);

    cy.toolbarButton('Insert').click();
    cy.nodeShapeCategory('Basic shapes').click()

    cy.toolbarButton('Node format').click();

    const styles = [
      'dashed',
      'dotted',
      'solid',
      'invis',
      'bold',
      'filled',
      'striped',
      'wedged',
      'diagonals',
      'rounded',
      'radial',
    ];

    cy.styles().should('have.text', styles.join(''));

    cy.styleSwitch().click();

    let numberOfVisibleNodes = 0;
    styles.forEach((style, i) => {
      const nodeIndex = i + 1;

      cy.style(style).click();

      cy.nodeShape('box').click({force: true});
      cy.waitForTransition();

      if (style != 'invis') {

        numberOfVisibleNodes += 1;

        cy.node(nodeIndex).should('exist');
        cy.node(nodeIndex).shouldHaveName('n' + (nodeIndex - 1));

        switch(style) {
        case 'dashed':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('have.attr', 'stroke-dasharray', '5,2');
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'dotted':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('have.attr', 'stroke-dasharray', '1,5');
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-width', '2');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'solid':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'bold':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'stroke-width', '2');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'filled':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'stroke-width', '2');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', '#d3d3d3');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'striped':
          cy.node(nodeIndex).find('polygon').should('have.length', 2);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'stroke-width', '.5');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'fill', '#d3d3d3');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'stroke-width', '2');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'wedged':
          cy.node(nodeIndex).find('polygon').should('have.length', 2);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'stroke-width', '.5');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'fill', '#d3d3d3');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'stroke-width', '2');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'diagonals':
          cy.node(nodeIndex).find('polygon').should('have.length', 2);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'stroke-width', '.5');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'fill', '#d3d3d3');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'stroke-width', '2');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'rounded':
          cy.node(nodeIndex).find('polygon').should('have.length', 2);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('path').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'stroke-width', '.5');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'fill', '#d3d3d3');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'stroke-width', '2');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'radial':
          cy.node(nodeIndex).find('polygon').should('have.length', 2);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'stroke-width', '.5');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'fill', '#d3d3d3');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'stroke-width', '2');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        }
      } else {
        cy.style('invis').click();
      }

      cy.nodes().should('have.length', numberOfVisibleNodes);

    });
  })

  it('Default node styles are deseleced in the node format drawer', function() {
    cy.startApplication();
    cy.clearAndRenderDotSource('digraph {}');

    cy.nodes().should('have.length', 0);
    cy.edges().should('have.length', 0);

    cy.toolbarButton('Insert').click();
    cy.nodeShapeCategory('Basic shapes').click()

    cy.toolbarButton('Node format').click();

    const styles = [
      'dashed',
      'dotted',
      'solid',
      'invis',
      'bold',
      'filled',
      'striped',
      'wedged',
      'diagonals',
      'rounded',
      'radial',
    ];

    cy.styles().should('have.text', styles.join(''));

    cy.styleSwitch().click();

    styles.filter(style => style != 'invis').forEach((style, i) => {
      cy.style(style).click();
    });

    styles.filter(style => style != 'invis').forEach((style, i) => {
      cy.style(style).should('be.checked');
    });

    let numberOfVisibleNodes = 0;
    styles.forEach((style, i) => {
      const nodeIndex = i + 1;
      cy.style(style).click();

      cy.nodeShape('box').click({force: true});
      cy.waitForTransition();

      if (style != 'invis') {

        numberOfVisibleNodes += 1;

        cy.node(nodeIndex).should('exist');
        cy.node(nodeIndex).shouldHaveName('n' + (nodeIndex - 1));

        switch(style) {
        case 'dashed':
          cy.node(nodeIndex).find('polygon').should('have.length', 2);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'stroke-width', '.5');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'fill', '#d3d3d3');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'stroke-width', '2');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'dotted':
          cy.node(nodeIndex).find('polygon').should('have.length', 2);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'stroke-width', '.5');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'fill', '#d3d3d3');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'stroke-width', '2');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'solid':
          cy.node(nodeIndex).find('polygon').should('have.length', 2);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'stroke-width', '.5');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'fill', '#d3d3d3');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'stroke-width', '2');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'bold':
          cy.node(nodeIndex).find('polygon').should('have.length', 2);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'stroke-width', '.5');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'fill', '#d3d3d3');
          cy.node(nodeIndex).find('polygon').eq(1).should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'filled':
          cy.node(nodeIndex).find('polygon').should('have.length', 2);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'stroke-width', '.5');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'fill', '#d3d3d3');
          cy.node(nodeIndex).find('polygon').eq(1).should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'striped':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', '#d3d3d3');
          cy.node(nodeIndex).find('polyline').should('have.length', 4);
          break;
        case 'wedged':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', '#d3d3d3');
          cy.node(nodeIndex).find('polyline').should('have.length', 4);
          break;
        case 'diagonals':
          cy.node(nodeIndex).find('polygon').should('have.length', 0);
          cy.node(nodeIndex).find('path').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('path').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('path').should('have.attr', 'fill', '#d3d3d3');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'rounded':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', '#d3d3d3');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'radial':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        }
      } else {
        cy.style('invis').click();
      }

      cy.nodes().should('have.length', numberOfVisibleNodes);

    });
  })

  it('Default node color is seleced from the color picker in the node format drawer', function() {
    cy.startApplication();
    cy.settingsButton().click();
    cy.fitSwitch().click();
    cy.get('body').type('{esc}', { release: false });
    cy.clearAndRenderDotSource('digraph {}');

    cy.nodes().should('have.length', 0);
    cy.edges().should('have.length', 0);

    cy.textEditorContent().should('have.text', 'digraph {}');

    cy.toolbarButton('Node format').click();

    let nodeIndex = 0;

    const positions = {
      'topLeft': {x: 0, y: 1},
      'top': {x: 0.5, y: 1},
      'topRight': {x: 1, y: 1},
      'left': {x: 0, y: 0.5},
      'center': {x: 0.5, y: 0.5},
      'right': {x: 1, y: 0.5},
      'bottomLeft': {x: 0, y: 0},
      'bottom': {x: 0.5, y: 0},
      'bottomRight': {x: 1, y: 0},
    };

    const horizontalPositions = {
      'left': {x: 0, y: 0.5},
      'center': {x: 0.5, y: 0.5},
      'right': {x: 1, y: 0.5},
    };

    cy.colorSwitch().click();

    for (let positionName of Object.keys(positions)) {
      const colorTolerance = 8;
      cy.colorPickerSwatch().click();
      cy.colorPickerSaturation().click(positionName);

      cy.toolbarButton('Insert').click();
      cy.nodeShapeCategory('Basic shapes').click()
      cy.nodeShape('ellipse').click({force: true});
      nodeIndex += 1;
      cy.waitForTransition();
      cy.toolbarButton('Insert').click();

      cy.node(nodeIndex).should('exist');
      cy.node(nodeIndex).shouldHaveName('n' + (nodeIndex - 1));

      cy.node(nodeIndex).find('ellipse').then(ellipse => {
        expect(ellipse).to.have.length(1);
        expect(ellipse).to.have.attr('stroke');
        expect(ellipse).to.have.attr('fill', 'none');
        expect(ellipse).to.not.have.attr('stroke-opacity');
        expect(ellipse).to.not.have.attr('fill-opacity');
        const {x, y} = positions[positionName];
        const expectedStrokeColor = rgbToHex(y * 255, (1 - x) * y * 255, (1 - x) * y * 255);
        const actualStrokeColor = ellipse.attr('stroke').replace('#', '');
        checkColor(actualStrokeColor, expectedStrokeColor, colorTolerance, 'stroke');
      });
    }

    cy.colorPickerSwatch().click();
    cy.colorPickerSaturation().click('topRight', {force: true});

    for (let positionName of Object.keys(horizontalPositions)) {
      const colorTolerance = 16;
      cy.colorPickerSwatch().click();
      cy.colorPickerHue().click(positionName, {force: true});

      cy.toolbarButton('Insert').click();
      cy.nodeShapeCategory('Basic shapes').click()
      cy.nodeShape('ellipse').click({force: true});
      nodeIndex += 1;
      cy.waitForTransition();
      cy.toolbarButton('Insert').click();

      cy.node(nodeIndex).should('exist');
      cy.node(nodeIndex).shouldHaveName('n' + (nodeIndex - 1));

      cy.node(nodeIndex).find('ellipse').then(ellipse => {
        expect(ellipse).to.have.length(1);
        expect(ellipse).to.have.attr('stroke');
        expect(ellipse).to.not.have.attr('stroke-opacity');
        expect(ellipse).to.have.attr('fill', 'none');
        const {x, y} = horizontalPositions[positionName];
        const expectedStrokeColor = hsvToHex(x, 1, 1)
        const actualStrokeColor = ellipse.attr('stroke').replace('#', '');
        checkColor(actualStrokeColor, expectedStrokeColor, colorTolerance, 'stroke');
      });
    }

    cy.colorPickerSwatch().click();
    cy.colorPickerHue().click('left', {force: true});

    for (let positionName of Object.keys(horizontalPositions)) {
      const colorTolerance = 4;
      let expectedStrokeColor;
      let expectedStrokeOpacity;
      if (positionName == 'left') {
        expectedStrokeColor = 'transparent';
        expectedStrokeOpacity = null;
      } else {
        const {x, y} = positions['topRight'];
        expectedStrokeColor = rgbToHex(y * 255, (1 - x) * y * 255, (1 - x) * y * 255);
        expectedStrokeOpacity = horizontalPositions[positionName].x;
      }
      cy.colorPickerSwatch().click();
      cy.colorPickerOpacity().click(positionName);

      cy.toolbarButton('Insert').click();
      cy.nodeShapeCategory('Basic shapes').click()
      cy.nodeShape('ellipse').click({force: true});
      nodeIndex += 1;
      cy.waitForTransition();
      cy.toolbarButton('Insert').click();

      cy.node(nodeIndex).should('exist');
      cy.node(nodeIndex).shouldHaveName('n' + (nodeIndex - 1));

      cy.node(nodeIndex).find('ellipse').then(ellipse => {
        expect(ellipse).to.have.length(1);
        const actualStrokeColor = ellipse.attr('stroke').replace('#', '');
        if (expectedStrokeColor == 'transparent') {
          expect(actualStrokeColor).to.eq(expectedStrokeColor);
        } else {
          checkColor(actualStrokeColor, expectedStrokeColor, colorTolerance);
        }
        if (expectedStrokeOpacity != null) {
          const actualStrokeOpacity = ellipse.attr('stroke-opacity');
          const strokeOpacityAbsDiff = Math.abs(actualStrokeOpacity - expectedStrokeOpacity)
          expect(strokeOpacityAbsDiff).to.be.lessThan(0.02);
        } else {
          expect(ellipse).to.not.have.attr('stroke-opacity');
        }
        expect(ellipse).to.have.attr('fill', 'none');
      });
    }

  })

})
