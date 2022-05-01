const movementSpeed = 5;
let gameOver =false;
let ignoreHead = false;
let lastRenderTime = 0;
const wormBody = [
    {x:8, y:8}
]


gameBoard = document.getElementById('board');


//get movement


let inputDirection = { y:0, x:0};
let lastInputDirection = { x:0, y:0}
window.addEventListener('keydown', e => {
    console.log(e.key);
    switch(e.key) {
        case 'ArrowUp':
            if (lastInputDirection.y !== 0) break;
            inputDirection = { x:0, y:-1 };
            break;
        case 'ArrowDown':
            if (lastInputDirection.y !== 0) break;
            inputDirection = { x:0, y:1 };
            break;
        case 'ArrowLeft':
            if (lastInputDirection.x !== 0) break;
            inputDirection = { x:-1, y:0 };
            break;
        case 'ArrowRight':
            if (lastInputDirection.x !== 0) break;
            inputDirection = { x:1, y:0 };
            break;
    }
})

function getInputDirection() {
    lastInputDirection = inputDirection;
    return inputDirection;
}


//animate worm


function drawWorm() {
    inputDirection = getInputDirection();
    gameBoard.innerHTML = '';
    wormBody.forEach(segment => {
        const wormElement = document.createElement('div');
        wormElement.style.gridRowStart = segment.y;
        wormElement.style.gridColumnStart = segment.x;
        wormElement.classList.add('worm');
        gameBoard.appendChild(wormElement);
    });
}



function refreshSnake() {
    for(i= wormBody.length -2; i >= 0; i--) {
        wormBody[i + 1] = {...wormBody[i]};
    }
    wormBody[0].x += inputDirection.x;
    wormBody[0].y += inputDirection.y;
}

function expand(amount) {
    newSegments += amount;
}

function onWorm(position, {ignoreHead=false} = {}) {
    return wormBody.some((segment, index) => {
        if (ignoreHead == true && index === 0) return false;
        return equalPositions(segment, position);
    });
}

function equalPositions(pos1, pos2) {
    return (
        pos1.x == pos2.x && pos1.y === pos2.y
    );
}

function addSegments() {
    for (i=0; i < newSegments; i++) {
        wormBody.push({...wormBody[wormBody.length -1]});
        newSegments = 0;
    }
}

function getSnakeHead() {
    return wormBody[0];
}

function snakeIntersection() {
    return onWorm(wormBody[0], {ignoreHead:true})
}

//creating snake food
const expansionRate = 3;
const gridSize = 16;
let food = getRandomFoodPosition();
let newSegments = 0;


function refreshFood() {
    if (onWorm(food)) {
        expand(expansionRate);
        food = getRandomFoodPosition();
    }
}

function randomGridPosition() {
    return {
        x: Math.floor(Math.random() * gridSize +1),
        y: Math.floor(Math.random() * gridSize + 1)
    }
}

function outsideGrid(position) {
    return (
        position.x < 1 || position.x > gridSize ||
        position.y < 1 || position.y > gridSize
    );
    
}

function getRandomFoodPosition() {
    let newFoodPosition;
    while (newFoodPosition == null || onWorm(newFoodPosition)) {
        newFoodPosition = randomGridPosition();
    }
    return newFoodPosition;
}

function drawFood() {
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
}



function checkForDeath() {
    gameOver = outsideGrid(getSnakeHead()) || snakeIntersection();
}


function main(currentTime) {
    if (gameOver) {
         return alert('YOUR WORM HAS DIED');
    }
    window.requestAnimationFrame(main);
    const renderDifference = (currentTime - lastRenderTime) / 1000;
    if (renderDifference < 1 / movementSpeed) {
       return;
    }
    lastRenderTime = currentTime;
    console.log('render');

    drawWorm(gameBoard);
    drawFood(gameBoard);
    addSegments();
    refreshFood();
    refreshSnake();
    checkForDeath();

}

window.requestAnimationFrame(main)



