'use strict';
class Game {
    constructor () {
        this.scope = 0;
        this.lives = 3;
        this.level = 1;
        this.timeOfCycle = 3000;
        this.timeOfCycle2 = 1000;
        this.hole = '';
        this.animal = '';
        this.timer = '';
        this.timer2 = '';
        this.stop = document.querySelector('#stop');
        this.start = document.querySelector('#start');
        this.levelCount = document.querySelector('.counter__level');
        this.stop.addEventListener( 'click', this.stopGame.bind(this), {once: false} );
        this.finalModal = document.querySelector('#closeFinalModal'); //Вешаем запуск очистки разметки на кнопку "ОК" финального окна
        this.finalModal.addEventListener( 'click', this.clearData.bind(this), {once: false});
    }

    //Прячем кнопку "Начать", показываем кнопку "Стоп"
    beginGame() {    
        this.start.classList.toggle('invis');
        this.stop.classList.toggle('invis');
        this.goGame()
    }

    //Запуск игры
    goGame() {
        //Получаем случайную нору и случайное животное
        this.hole = this.getRandomHole();
        this.animal = this.getRandomAnimal();

        //Вешаем обработчик клика на животное и вставляем животное в нору
        this.animal.addEventListener( 'mousedown', this.catchedAnimal.bind(this) );
        this.hole.appendChild(this.animal);

        //Убираем животное по таймеру и перезапускаем игру
        this.timer = setTimeout( this.newCycle.bind(this), this.timeOfCycle );
    }

    //Убираем животное и перезапускаем игру
    newCycle() {
        this.hole.removeChild(this.animal);
        this.animal.removeEventListener('mousedown', this.catchedAnimal);
        this.timer2 = setTimeout( this.goGame.bind(this), this.timeOfCycle2 );
    }

    //Обработка клика по животному
    catchedAnimal(event) {

        //Отменяем удаление животного по таймеру
        clearTimeout(this.timer); 

        //Если клик по мыши - добавляем 10 очков
        if (event.target.id === 'mouse') {
            this.scope += 10;
            document.querySelector('.couter__points-success').innerHTML = this.scope;

            //После каждых 50-и очков мы:
            if (this.scope%50 === 0) { 
                //ускоряем игру
                this.timeOfCycle *= 0.8;
                this.timeOfCycle2 *= 0.8;
                //Увеличиваем счетчик уровня
                this.levelCount.innerHTML = this.level + 1;
                this.level += 1;
                //Анимируем звезду
                this.levelCount.classList.toggle('animation-level');
                setTimeout(() => {this.levelCount.classList.toggle('animation-level')}, 0);
            };

            //Запускаем новый цикл
            this.newCycle(); 

        //Иначе - убираем жизнь. Если жизней 0, то заканчиваем игру.
        } else {
        let lifePointsActive = document.querySelectorAll('.heart_active');
        lifePointsActive[0].classList.remove('heart_active');
        lifePointsActive[0].classList.add('heart_deactive');
        this.lives--;
            if (this.lives === 0) {
                this.gameOver();
            } else {
            //Запускаем новый цикл
            this.newCycle(); 
            }
        } 
    }

    stopGame() {
        clearTimeout(this.timer); //Отменяем таймеры игры
        clearTimeout(this.timer2);
        this.gameOver();
    }

    gameOver() {
        //Записываем набранные очки в модальное окно
        let gameOverPoints = document.querySelector('.gameOver__points');
        gameOverPoints.innerHTML = this.scope;

        //Вызываем срабатывание псевдоэлемента #gameOver:target для замены display модального окна с none на flex.
        document.querySelector('#goModalGameOver').click();

        //Меняем кнопки старта/стопа игры
        this.start.classList.toggle('invis');
        this.stop.classList.toggle('invis');
    }

    clearData() {
        //Восстанавливаем сердечки в разметке
        let lifePoints = document.querySelectorAll('.couter__points-life-item');
        for (let i = 0; i < lifePoints.length; i++) {
            lifePoints[i].classList.remove('heart_deactive');
            lifePoints[i].classList.add('heart_active');
        };

        //Восстанавливаем счетчик жизней
        this.lives = 3;

        //Сбрасываем уровни
        this.levelCount.innerHTML = 1;
        this.timeOfCycle *= 0.8;
        this.timeOfCycle2 *= 0.8; this.timeOfCycle *= 0.8;
                this.timeOfCycle2 *= 0.8; this.timeOfCycle *= 0.8;
                this.timeOfCycle2 *= 0.8; this.timeOfCycle *= 0.8;
                this.timeOfCycle2 *= 0.8;
        //Сбрасываем очки
        document.querySelector('.couter__points-success').innerHTML = 0;

        //Сбрасываем счетчик очков
        this.scope = 0;

        //Восстанавливаем уровень скорости
        this.timeOfCycle = 3000;
        this.timeOfCycle2 = 1000;

        //Убираем животное из норы, если оно там есть
        if (this.hole.childNodes.length === 2) {
            this.hole.removeChild(this.animal);
        }
    }

    //Генератор случайных нор и животных
    getRandomHole() {
        let min = 1;
        let max = 5;
        let randNum = Math.random() * (max - min + 1) + min;
        let numHole = Math.floor(randNum);
        let hole = document.getElementById(`${'hole_'}${numHole}`);
        return hole;
    }

    getRandomAnimalName() {
        //Пытаемся вызвать имя мыши
        let chanceMouse = 0.8;//Вероятность вызова имени мыши
        if( Math.random() <= chanceMouse ) {
            return 'mouse';
        };
        //Если имя мыши не вызвано, то вызываем имя случайного животного
        let zoo = ['bear', 'cat', 'cow', 'fox', 'koala', 'lion', 'panda', 'tiger', 'rabbit', 'pig'];
        let min = 0;
        let max = zoo.length;
        let numberAnimal = Math.random() * (max - min);
        let randAnimal = zoo[Math.floor(numberAnimal)];
        return randAnimal;
    }

    getRandomAnimal() {
        let animalName = this.getRandomAnimalName();
        let img = document.createElement('img');
        img.classList.add('animal');
        img.id = `${animalName}`;
        img.src = `${'img/animals/'}${animalName}${'.png'}`;
        img.alt = `${animalName}`;
        return img;    
    }
}

let start = document.querySelector('#start');
let newGame = new Game();
start.addEventListener('click', () => {
    
    newGame.beginGame();  
    
});




