<?php
    echo "<table style='border-collapse: collapse;'>";
    for($i=0; $i<8; $i++) {
        echo "<tr>";
        for($j=0; $j<8; $j++) {
            $colore = $j % 2==0 ?"#FFFFFF":"#000000";
            echo "<td style='width:50px; height:50px; background-color:".$colore."'></td>";
        }
        echo "</tr>";
    }
?>