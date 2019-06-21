<?php
/*
 *  Name: Nicholas Young
 *  Date: 05/17/2019
 *  This is is a web service that allows a user to get random lyrics from the hit song, "Old Town Road"
 */
  header("Content-type: text/plain");
  $lines = array("line0" => "Yeah, I'm gonna take my horse to the old town road",
                  "line1" => "I'm gonna ride 'til I can't no more",
                  "line2" => "I got the horses in the back",
                  "line3" => "Horse tack is attached",
                  "line4" => "Hat is matte black",
                  "line5" => "Got the boots that's black to match",
                  "line6" => "Ridin' on a tractor",
                  "line7" => "My life is a movie",
                  "line8" => "Cowboy hat from Gucci");

  $all = array("Yeah, I'm gonna take my horse to the old town road
I'm gonna ride 'til I can't no more
I'm gonna take my horse to the old town road
I'm gonna ride 'til I can't no more (Kio, Kio)
I got the horses in the back
Horse tack is attached
Hat is matte black
Got the boots that's black to match
Ridin' on a horse, ha
You can whip your Porsche
I been in the valley
You ain't been up off that porch, now
Can't nobody tell me nothin'
You can't tell me nothin'
Can't nobody tell me nothin'
You can't tell me nothin'
Ridin' on a tractor
**** all in my bladder
Cheated on my baby
You can go and ask her
My life is a movie
Bull ridin' and *******
Cowboy hat from Gucci
Wrangler on my booty
Can't nobody tell me nothin'
You can't tell me nothin'
Can't nobody tell me nothin'
You can't tell me nothin'
Yeah, I'm gonna take my horse to the old town road
I'm gonna ride 'til I can't no more
I'm gonna take my horse to the old town road
I'm gonna ride 'til I can't no more
I got the");

  $output = array();

  if (isset($_GET["lyric"])) {
    $lyric = $_GET["lyric"];
    if ($lyric === "all") {
      $output[] = $all[0];
      echo $output[0];
    } else {
      header("Content-type: application/json");
      $output["result"] = $lines[$lyric];
      echo json_encode($output);
    }
  } else {
    header("HTTP/1.1 400 Invalid Request");
    echo "Missing required lyric parameter!";
  }

?>
