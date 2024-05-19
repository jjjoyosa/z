// Define different speeds and dimensions for mobile
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

let move_speed = isMobile ? 8 : 2; // Increased move speed for mobile
let gravity = isMobile ? 1 : 0.2; // Increased gravity for mobile
let bird_flap = isMobile ? -16 : -6; // Increased flap speed for mobile
let pipe_separation_interval = isMobile ? 100 : 170;
let pipe_gap = isMobile ? 25 : 35; // Increased pipe gap for better visibility
let pipe_width = isMobile ? 50 : 80; // Increased pipe width for better interaction

let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');

// getting bird element properties
let bird_props = bird.getBoundingClientRect();

// This method returns DOMRect -> top, right, bottom, left, x, y, width and height
let background = document.querySelector('.background').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
img.style.width = isMobile ? '30px' : '50px'; // Reduce bird image size for mobile
message.classList.add('messageStyle');

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && game_state !== 'Play') {
        startGame();
    }
});

document.addEventListener('touchstart', (e) => {
    if (game_state !== 'Play') {
        startGame();
    }
});

function startGame() {
    document.querySelectorAll('.pipe_sprite').forEach((e) => {
        e.remove();
    });
    img.style.display = 'block';
    bird.style.top = isMobile ? '30vh' : '40vh';
    game_state = 'Play';
    message.innerHTML = '';
    score_title.innerHTML = 'Score : ';
    score_val.innerHTML = '0';
    message.classList.remove('messageStyle');
    play();
}

function play() {
    let bird_dy = 0;

    function move() {
        if (game_state !== 'Play') return;

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            if (pipe_sprite_props.right <= 0) {
                element.remove();
            } else {
                if (
                    bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
                    bird_props.left + bird_props.width > pipe_sprite_props.left &&
                    bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
                    bird_props.top + bird_props.height > pipe_sprite_props.top
                ) {
                    game_state = 'End';
                    message.innerHTML = 'Game Over'.fontcolor('red');
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    sound_die.play();
                    return;
                } else {
                    if (
                        pipe_sprite_props.right < bird_props.left &&
                        pipe_sprite_props.right + move_speed >= bird_props.left &&
                        element.increase_score === '1'
                    ) {
                        score_val.innerHTML = +score_val.innerHTML + 1;
                        sound_point.play();
                    }
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    function apply_gravity() {
        if (game_state !== 'Play') return;
        bird_dy += gravity;

        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();

        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            game_state = 'End';
            message.style.left = '28vw';
            window.location.reload();
            message.classList.remove('messageStyle');
            return;
        }

        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    function flap() {
        img.src = 'images/Bird-2.png';
        bird_dy = bird_flap;
    }

    function resetFlap() {
        img.src = 'images/Bird.png';
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === ' ') {
            flap();
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowUp' || e.key === ' ') {
            resetFlap();
        }
    });

    document.addEventListener('touchstart', (e) => {
        flap();
    });

    document.addEventListener('touchend', (e) => {
        resetFlap();
    });

    let pipe_separation = 0;

    function create_pipe() {
        if (game_state !== 'Play') return;

        if (pipe_separation > pipe_separation_interval) {
            pipe_separation = 0;

            let pipe_posi = Math.floor(Math.random() * 43) + 8;
            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
            pipe_sprite_inv.style.left = '100vw';
            pipe_sprite_inv.style.width = pipe_width + 'px'; // Set pipe width
            document.body.appendChild(pipe_sprite_inv);

            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
            pipe_sprite.style.left = '100vw';
            pipe_sprite.style.width = pipe_width + 'px'; // Set pipe width
            pipe_sprite.increase_score = '1';
            document.body.appendChild(pipe_sprite);
        }
        pipe_separation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}
