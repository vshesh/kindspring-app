<?php 
include_once(_SHARED_APIS_."/ks/ksmem.inc");

if ($_REQUEST["op"] == "stories") {
  publicKindSpringStories();
}

function publicKindSpringStories($type="") {
  change_database("helpothers");
  include_once(_SHARED_APIS_."/ks/feed.inc");
  $feed = new KSFeed(0);
  $st = $feed->getFeedStories(0,$type);
  unset($feed);
  print json_encode($st["STORIES"]);
}

