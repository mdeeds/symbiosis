const inputs = [1, 2, 3, 4];

const desiredF = [2, 4, 6, 8];
function f(x) {
  return /*(*/x + 1/*)*/;
}

const desiredG = ['a', 'a', 'b', 'b'];
function g(x) {
  if (/*(*/x > 3/*)*/) {
    return /*(*/'b'/*)*/
  } else {
    return  /*(*/2/*)*/;
  }
}

const desiredH = [2, 3, 5, 6];
function h(x) {
  /*(*//*)*/
}


function runTest(testF, desired) {
  const body = document.getElementsByTagName('body')[0];
  const dd = document.createElement('div');
  dd.innerText = '-------';
  body.appendChild(dd);

  for (let j = 0; j < inputs.length; ++j) {
    const i = inputs[j];
    const d = desired[j];
    const o = testF(i);
    const div = document.createElement('div');
    div.innerText = `${testF.name}(${i}) = ${o};  wanted: ${d}`;
    if (o === d) {
      div.style.setProperty('color', 'green');
    } else {
      div.style.setProperty('color', 'darkred');
    }
    body.appendChild(div);
  }
}

function main() {
  runTest(f, desiredF);
  runTest(g, desiredG);
  runTest(h, desiredH);
}