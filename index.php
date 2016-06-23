<?php require 'header.php' ?>
    <body>
        <div id="site_wrapper">
          <div id="snake_section" class="section light-blue">
              <div class="text-white open-sans" id="snake_wrapper">
                  <div class="oswald unreal text-white blue" id="splash_screen">
                      <div>Click to play</div>
                  </div>
                  <div id="score">
                      <p>Score: 0</p>
                  </div>
                  <div id="high_scores">
                      <div id="high_scores_cell"></div>
                  </div>
                  <div id="close_icon">
                      <i class="large remove icon"></i>
                  </div>
                  <canvas id="snake_canvas" width="700" height="600"></canvas>
              </div>
              <script type="text/javascript" src="snake.js"></script>
          </div>
        </div>
    </body>
</html>
