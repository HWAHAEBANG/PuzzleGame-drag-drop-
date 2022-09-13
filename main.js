const container = document.querySelector('.image-container');
const starButton = document.querySelector('.start-button');
const gameText = document.querySelector('.game-text')
const playTime = document.querySelector('.play-time');

const tileCount = 16;


let tiles = [];
const dragged = {
  el: null,
  class: null,
  index: null
};

let isPlaying = false;
let timeInterval = null;
let time = 0;
// function

function checkStatus() {
  const currentList = [...container.children];
  //console.log(currentList);
  const unMatchedList = currentList.filter((child, index) => Number(child.getAttribute("data-index")) !== index);
  //**중괄호 생략 안할 시 filter가 제대로 작동이 안되는데 원인을 모르겠음. */
  // child에서 data-index속성을 불러오는 것. setAttribute랑 반대
  // 불러왔을 때 문자열로 get될 수 있기때문에 number로 감싸서.
  //console.log(li, index);
  //console.log(unMatchedList);
  if (unMatchedList.length === 0) {
    gameText.style.display = 'block'; // css속성 변경
    isPlaying = false;
    clearInterval(timeInterval)
  }
}


function setGame() {
  isPlaying = true;
  time = 0; // clearInterval은 단순히 setInterval을 멈추는 것뿐. 숫자 초기화는 별도로 선언해야함.
  container.innerHTML = "";
  gameText.style.display = 'none';
  clearInterval(timeInterval)


  tiles = creatImageTiles();
  tiles.forEach(tile => container.appendChild(tile))
  setTimeout(() => {
    container.innerHTML = "";
    shuffle(tiles).forEach(tile => container.appendChild(tile))

    timeInterval = setInterval(() => { // 이 안에서 실행해줘야. 섞인 뒤부터 카운트 다운이 시작됨.
      time++;
      playTime.innerText = time;
    }, 1000)
  }, 2000)
};




function creatImageTiles() {
  const tempArray = [];
  Array(tileCount).fill().forEach((_, i) => {
    const li = document.createElement('li');
    li.setAttribute('data-index', i);
    li.setAttribute('draggable', 'true');
    li.classList.add(`list${i+1}`);
    //li.textContent(`list${i+1}`);
    // container.appendChild(li)
    tempArray.push(li);
  });
  return tempArray;
}


function shuffle(array) {
  let index = array.length - 1;
  while (index > 0) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]]
    index--
  }
  return array;
}


// events
container.addEventListener('dragstart', e => {
  console.log(e);
  if (!isPlaying) return;
  const obj = e.target
  dragged.el = obj;
  dragged.class = obj.className;
  dragged.index = [...obj.parentNode.children].indexOf(obj); // []는 오브젝트를 배열형태로 바꾸어주어야만 indexof가 가능하기 떄문.
  // ES6문법을 활용하여 배열에 집어넣기
})

container.addEventListener('dragover', e => {
  e.preventDefault()
  // console.log(over);
})

container.addEventListener('drop', e => {
  if (!isPlaying) return;
  //console.log('drop');
  console.log(e);
  const obj = e.target;
  //console.log({obj});
  //obj만 쓰면 <li data-index="3" draggable="true" class="list4"></li>가 출력되지만
  //{obj}를 쓰면 오브젝트로 열어서 보여줌

  if (obj.className !== dragged.class) {
    let originPlace;
    let isLast = false;

    if (dragged.el.nextSibling) {
      originPlace = dragged.el.nextSibling; // 해당 li의 바로 뒤 li
    } else {
      originPlace = dragged.el.previousSibling; // 해당 li의 비러 잎 li
      isLast = true;
    }

    const droppedIndex = [...obj.parentNode.children].indexOf(obj);
    dragged.index > droppedIndex ? obj.before(dragged.el) : obj.after(dragged.el)
    isLast ? originPlace.after(obj) : originPlace.before(obj); // 어려움 ...
  }
  checkStatus();
})

starButton.addEventListener('click', () => {
  setGame();
})