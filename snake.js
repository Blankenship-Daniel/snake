/**********************************************
 * Array Remove - By John Resig (MIT Licensed)
 *********************************************/
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
}

var c = document.getElementById("snake_canvas");
var canvas = c.getContext("2d");

var DIRECTIION;
var MAX_WIDTH = 700;
var MAX_HEIGHT = 600;
var MIN_WIDTH = 0;
var MIN_HEIGHT = 0;
var FPS = 20;
var CW = 15;
var SCORE = 0;
var PAUSED = false;
var SPLASH = true;

var SNAKE = {
    x: 0,
    y: 0,
    width: CW,
    height: CW
};

var FOOD = {
    x: 0,
    y: 0,
    width: CW,
    height: CW
};

var snake_array = [];
var food_array = [];

/***********************************************
 * INITIALIZE SNAKE POSITION
 * sets the initial location of the snake.
 **********************************************/
function init_snake_pos(x, y)
{
    SNAKE.x = x;
    SNAKE.y = y;
    var snake = $.extend(true, {}, SNAKE); // deep copy of SNAKE object
    snake_array.push(snake);
}

/***********************************************
 * CREATE SNAKE
 * creates the initial snake at a given length.
 **********************************************/
function create_snake(length)
{
    for (var i = 0; i < length; i++)
    {
        add_head();
    }
}

/***********************************************
 * DRAW
 * draws rectangles on the screen at the
 * positions specified by the SNAKE object.
 **********************************************/
function draw(arr)
{
    for (var i = 0; i < arr.length; i++)
    {
        canvas.fillStyle = "#fff";
        canvas.fillRect(arr[i].x * CW, arr[i].y * CW, CW, CW);
        canvas.strokeStyle = "#105b63";
        canvas.strokeRect(arr[i].x * CW, arr[i].y * CW, CW, CW);
    }
}

/***********************************************
 * DEATH
 * handles death event.
 **********************************************/
function death()
{
    $('#high_scores').fadeIn();
    $('#name_entry').fadeIn();
    $('#play_message').fadeOut();
    SPLASH = true;
    reset();
    canvas.clearRect(0, 0, MAX_WIDTH, MAX_HEIGHT);
}

/***********************************************
 * ADD HEAD
 * adds a new rect to the end of the
 * snake_array.
 **********************************************/
function add_head()
{
    switch (DIRECTION)
    {
        case "right":
            SNAKE.x++;
            break;
        case "left":
            SNAKE.x--;
            break;
        case "up":
            SNAKE.y--;
            break;
        case "down":
            SNAKE.y++;
            break;
    }

    var snake = $.extend(true, {}, SNAKE); // deep copy of SNAKE object
    snake_array.push(snake);
}

/**********************************************
 * CHECK SNAKE COLLISION
 * checks to see if snake has collided with
 * boundary or with snake body.
 *********************************************/
function check_snake_collision()
{
    if (collision(SNAKE.x, SNAKE.y, snake_array, snake_array.length - 1) ||
        (SNAKE.x > MAX_WIDTH/CW) || (SNAKE.y > MAX_HEIGHT/CW) ||
        (SNAKE.x < MIN_WIDTH/CW) || (SNAKE.y < MIN_HEIGHT/CW))
    {
        if (SCORE == 0)
        {
            reset();
        }
        else
        {
            death();
        }
    }
}

/**********************************************
 * CHECK FOOD COLLISION
 * checks to see if snake head has collided
 * with food object.
 *********************************************/
function check_food_collision()
{
    if (collision(SNAKE.x, SNAKE.y, food_array, food_array.length))
    {
        $('#score p').text('Score: ' + ++SCORE);
        food_array.length = 0;
        create_food(1);
        FPS += 1;
    }
    else
    {
        delete_tail();
    }
}

/***********************************************
 * CHECK FOR COLLISIONS
 * check for collisions with SNAKE and FOOD.
 **********************************************/
function check_for_collisions()
{
    check_snake_collision();
    check_food_collision();
}

/***********************************************
 * DELETE TAIL
 * deletes the tail from the snake_array.
 **********************************************/
function delete_tail()
{
    snake_array.remove(0);
}

/***********************************************
 * CREATE FOOD
 * creates an array of FOOD objects at a given
 * length.
 **********************************************/
function create_food(length)
{
    for (var i = 0; i < length; i++)
    {
        var loc = get_open_loc();
        var food = $.extend(true, {}, FOOD);
        food.x = loc[0];
        food.y = loc[1];
        food_array.push(food);
    }
}

/***********************************************
 * GET OPEN LOCATION
 * checks for an open location to place food.
 **********************************************/
function get_open_loc()
{
    var x, y, loc;
    do
    {
        x = Math.floor((Math.random() * (MAX_WIDTH - FOOD.width) / FOOD.width));
        y = Math.floor((Math.random() * (MAX_HEIGHT - FOOD.height) / FOOD.height));
    }
    while (collision(x, y, snake_array, snake_array.length));
    loc = [x, y];
    return loc;
}

/***********************************************
 * COLLISION
 * checks for collision with snake body.
 **********************************************/
function collision(x, y, arr, length)
{
    for (var i = 0; i < length; i++)
    {
        if (arr[i].x == x && arr[i].y == y)
        {
            return true;
        }
    }
    return false;
}

/***********************************************
 * GAME LOOP
 * contains the game loop.
 **********************************************/
function update()
{
    if (SPLASH || PAUSED)
    {
        return;
    }

    clearInterval(interval);
    canvas.clearRect(0, 0, MAX_WIDTH, MAX_HEIGHT);
    draw(snake_array);
    draw(food_array);
    check_for_collisions();
    add_head();
    interval = setInterval(update, 1000/FPS);
}

/**********************************************
 * RESET
 * reset the game.
 *********************************************/
function reset()
{
    snake_array.length = 0;
    food_array.length = 0;
    FPS = 15;
    main();
}

/**********************************************
 * GET HIGH SCORES
 * gets the current high scores from the
 * database.
 *********************************************/
function get_high_scores()
{
    $.ajax({
        url: 'ajax/highScores.php',
        type: 'POST',
        data: {request: 'getScores'},
        dataType: 'json',
        success: function(data) {
            high_scores(data);
        },
        error: function(xhr, textstatus, error) {
            alert('Error: xhr: ' + xhr +
                  '\ntextstatus: ' + textstatus +
                  '\nerror: ' + error);
        }
    });
}

/**********************************************
 * SUBMIT
 * submit playe score and name.
 *********************************************/
function submit()
{
    var player_name = $('#player_name').val();
    $.ajax({
        url: 'ajax/highScores.php',
        type: 'POST',
        data: {request: 'submit', name: player_name, score: SCORE},
        dataType: 'json',
        error: function(xhr, textstatus, error) {
            alert('Error: ' + error);
        }
    });
}

/**********************************************
 * HIGH SCORES
 * draw the high scores on the screen.
 *********************************************/
function high_scores(data)
{
    var str = '';
    var scores = $('#high_scores #high_scores_cell');
    scores.html('');
    str += '<p class="oswald">HIGH SCORES</p>';
    for (var i = 0; i < data.length; i++)
    {
        str += '<p>' + data[i].player_name + ' ' + data[i].player_score + '</p>';
    }
    str += '<div id="name_entry">' +
                '<p class="oswald">ENTER YOUR NAME TO RECORD YOUR SCORE</p>' +
                '<div class="ui input">' +
                    '<input id="player_name" type="text" maxlength="50">' +
                '</div>' +
                '<div id="button_wrapper">' +
                    '<div id="submit_button" class="ui primary button">Submit</div>' +
                    '<div id="cancel_button" class="ui button">Cancel</div>' +
                '</div>' +
            '</div>' +
            '<div id="play_message"><p>Press any key to play...</p></div>';
    scores.append(str);
}

/**********************************************
 * HANDLE PAUSE
 * handle pause game event.
 *********************************************/
function handle_pause()
{
    canvas.fillStyle = "#fff";
    canvas.font = "24px Arial";
    canvas.textAlign = 'center';
    canvas.fillText("PAUSED : PRESS 'P' TO CONTINUE", MAX_WIDTH/2, MAX_HEIGHT/2);
}

/**********************************************
 * MAIN
 * initializes snake size and location on the
 * canvas.
 *********************************************/
function main()
{
    DIRECTION = "right";
    init_snake_pos(0, 0);
    create_snake(10);
    create_food(1);
}

get_high_scores();
main();
var interval = setInterval(update, 1000/FPS);

var arrow_keys_handler = function(e) {
    switch(e.keyCode)
    {
        case 37: case 39: case 38: case 40: // Arrow keys
        e.preventDefault(); break;
        default: break; // do not block other keys
    }
};

$('body').on('click', '#splash_screen', function() {
    $('#splash_screen').fadeOut();
    window.addEventListener("keydown", arrow_keys_handler, false);
});

$('body').on('click', 'i.large.remove.icon', function() {
    $('#splash_screen').fadeIn();
    window.removeEventListener("keydown", arrow_keys_handler, false);
});

$('body').on('click', '#submit_button', function() {
    $.when($('#name_entry').fadeOut(), submit()).done(function() {
        get_high_scores();
        $('#play_message').fadeIn();
        $('#score p').text('Score: 0');
        SCORE = 0;
    });
});

$('body').on('click', '#cancel_button', function() {
    $.when($('#name_entry').fadeOut()).done(function() {
        get_high_scores();
        $('#play_message').fadeIn();
        $('#score p').text('Score: 0');
        SCORE = 0;
    });
});

$(document).keydown(function(e) {
    if ($('#name_entry').is(':hidden') && $('#splash_screen').is(':hidden'))
    {
        var key = e.which
        SPLASH = false;
        $('#high_scores').fadeOut();

        if (key == "37" && DIRECTION != "right")
        {
            DIRECTION = "left";
        }
        else if (key == "38" && DIRECTION != "down")
        {
            DIRECTION = "up";
        }
        else if (key == "39" && DIRECTION != "left")
        {
            DIRECTION = "right";
        }
        else if (key == "40" && DIRECTION != "up")
        {
            DIRECTION = "down";
        }
        else if (key == "80")
        {
            PAUSED = !PAUSED;
            if (PAUSED) handle_pause();
        }
    }
});
