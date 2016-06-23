<?php
class HighScores 
{
    private $conn;

    function __construct($db_handle_in)
    {
        $this->conn = $db_handle_in;
    }

    public function getHighScores()
    {
        $stmt = $this->conn->prepare('SELECT * FROM high_scores ORDER BY player_score DESC
                                        LIMIT 10');
        $status = $stmt->execute();
        if ($status) return $stmt->fetchAll(PDO::FETCH_ASSOC);
        return false;
    }

    public function insertScore($player_name, $player_score)
    {
        $stmt = $this->conn->prepare('INSERT INTO high_scores (player_name, player_score)
                                        VALUES (:player_name, :player_score)');
        $stmt->bindValue(':player_name', $player_name);
        $stmt->bindValue(':player_score', $player_score);
        $stmt->execute();
        return $stmt->rowCount();
    }
}
?>
