

function makePuzzle(container, message, answer) {
  const div = document.createElement('div');
  div.style.fontSize = '30px';
  div.style.margin = '8px';
  const lhs = document.createElement('span');
  lhs.innerText = `${message} = `;
  const rhs = document.createElement('span');
  rhs.style.setProperty('border', '1px solid black');
  rhs.style.setProperty('padding', '3px');
  rhs.style.setProperty('margin', '3px');
  rhs.contentEditable = "true";
  rhs.spellcheck = false;
  rhs.innerText = " ";

  rhs.addEventListener('keyup', (ke) => {
    if (rhs.innerText == answer) {
      div.style.setProperty('color', 'green');
    } else {
      div.style.setProperty('color', 'darkred');
    }
  });
  container.appendChild(div);
  div.appendChild(lhs);
  div.appendChild(rhs);
}

function instruction(container, message) {
  const div = document.createElement('div');
  div.style.fontSize = '20px';
  div.style.margin = '8px';
  div.innerText = message;
  container.appendChild(div);
}

function main() {
  const body = document.getElementsByTagName('body')[0];

  instruction(body, "A binary operator combines two values.  There are only "
    + "four possible combinations of two binary values.  These together make "
    + "a 'truth table'.");
  instruction(body, "In this first example, & is the 'and' operator.")
  makePuzzle(body, "0 & 0", 0 & 0);
  makePuzzle(body, "0 & 1", 0 & 1);
  makePuzzle(body, "1 & 0", 1 & 0);
  makePuzzle(body, "1 & 1", 1 & 1);

  instruction(body, "In the same way, | is the 'or' operator.")
  makePuzzle(body, "0 | 0", 0 | 0);
  makePuzzle(body, "0 | 1", 0 | 1);
  makePuzzle(body, "1 | 0", 1 | 0);
  makePuzzle(body, "1 | 1", 1 | 1);

  instruction(body, "Can you figure out ^, the exclusive or (xor) operator.")
  makePuzzle(body, "0 ^ 0", 0 ^ 0);
  makePuzzle(body, "0 ^ 1", 0 ^ 1);
  makePuzzle(body, "1 ^ 0", 1 ^ 0);
  makePuzzle(body, "1 ^ 1", 1 ^ 1);

  instruction(body, "Which of these is most like addition?  Which is most "
    + "like multiplication");

}