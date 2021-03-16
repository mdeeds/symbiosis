

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
  instruction(body, "Addition and subtraction work just like you learn in school.");
  makePuzzle(body, "1+2", 1 + 2);
  makePuzzle(body, "1 + 2 * 3", 1 + 2 * 3);
  makePuzzle(body, "(1 + 2) * 3", (1 + 2) * 3);

  instruction(body, "Computers think of 'true' as 1, and 'false' as zero.")
  makePuzzle(body, "true", true);
  makePuzzle(body, "false", false);
  makePuzzle(body, "false || true", false || true);
  makePuzzle(body, "false && true", false && true);


  instruction(body, "Bonus puzzle:  The modulus operator (%) is the remainder "
    + "of a division problem.  7 / 2 = 3 R 1, so 7 % 2 = 1")
  makePuzzle(body, "7 % 2", 7 % 2);
  makePuzzle(body, "11 % 4", 11 % 4);
  makePuzzle(body, "8 % 4", 8 % 4);
  makePuzzle(body, "314 % 100", 314 % 100);

}