<?php 	

	$i = $_POST['i'];
	$n = $_POST['n'];
	$r = $_POST['r'];

	$file = fopen('../documents/' . $n . '.txt','w+');
	fwrite($file, $i);
	fclose($file);

/*
	$file = fopen('../documents/' . $n . '.html','w+');
	fwrite($file, "<html><head></head><body>" . $i . "</body></html>");
	fclose($file);
	*/
 ?>