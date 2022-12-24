<?php
	//echo $_SERVER['SERVER_ADDR'];

	$host= gethostname();
	$ip = gethostbyname($host);

	echo $_SERVER['REMOTE_ADDR'];