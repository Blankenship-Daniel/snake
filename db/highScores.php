<?php
require_once('../storage/DBhighScores.php');
$servername = "localhost";
$username = "theblas4";
$password = '$("#Greenolive5");';
$results = '';

try {
    $conn = new PDO("mysql:host=$servername;dbname=theblas4_snake_high_scores", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $dbHighScores = new HighScores($conn);

    if ($_POST['request'] == 'getScores')
    {
        $results = $dbHighScores->getHighScores();
    }
    else if ($_POST['request'] == 'submit' && !($_POST['name'] == ''))
    {
        $name = $_POST['name'];
        $score = $_POST['score'];
        $results = $dbHighScores->insertScore($name, $score);
    }

    echo json_encode($results);
    $conn = null;
}
catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
    $conn = null;
}
?>
