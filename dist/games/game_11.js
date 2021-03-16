

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
  div.style.fontSize = '12px';
  div.style.margin = '8px';
  div.innerText = message;
}

function main() {
  const body = document.getElementsByTagName('body')[0];

  instruction("Binary means two options.  In computers, these are one and "
    + "zero, or true and false.  In JavaScript, we write a number "
    + "in binary by putting 0b in front of it.");
  makePuzzle(body, "0b0", 0b0);
  makePuzzle(body, "0b1", 0b1);
  makePuzzle(body, "0b10", 0b10);
  makePuzzle(body, "0b11", 0b11);

  instruction("Decimal is the name of the numbers that we are used to. "
    + "Decimal comes from the latin word 'decimus' which means 'tenth'.  "
    + "When counting the numbers start over every tenth number.  From 9 "
    + "we wrap back around to 10.");

  makePuzzle(body, "9 + 1", 9 + 1);
  makePuzzle(body, "99 + 1", 99 + 1);
  makePuzzle(body, "0b1 + 0b1", 0b1 + 0b1);
  makePuzzle(body, "0b11 + 0b1", 0b11 + 0b1);
}