<?php

include_once(_SITE_PATH_."funcs/user.inc");
$user = new KSpringUser();

$op = $_REQUEST["op"];

if ($op == "public_feed") {
    $stories = getPublicFeed();
    echo json_encode($stories);

} elseif ($op == "chall_list") {
    $challs = getMyChallenges();
    echo json_encode($challs);

} elseif ($op == "chall_feed") {
    $stories = getChallengeFeed($_REQUEST["cid"]);
    echo json_encode($stories);

} elseif ($op == "chall_mem") {
    $mems = getChallengeMembers($_REQUEST["cid"]);
    echo json_encode($mems);

} elseif ($op == "chall_ideas") {
    $ideas = getChallengeIdeas($_REQUEST["cid"]);
    echo json_encode($ideas);
 
} elseif ($op == "menu") {
    if (!$user->isLoggedIn()) die("Login first.");
    t_show_rel("index.tpl");

} elseif ($op == "list_stories") {
    showStories($_REQUEST["cid"]);

} elseif ($op == "add_story") {
    echo json_encode(addStory($_REQUEST["cid"], $_REQUEST["title"], $_REQUEST["descr"]));

} elseif ($op == "edit_story") {
    showEditStoryForm($_REQUEST["cid"], $_REQUEST["sid"]);

} elseif ($op == "del_story") {
    include_once(_SHARED_APIS_."ks/story.inc");
    $st = new KSStory($_REQUEST["sid"]);
    $st->deleteStory();
    header("Location: "._SITE_URL_."challenge/mobile/api.php?op=list_stories&cid=$_REQUEST[cid]");

} elseif ($op == "logout") {
    $user->logOut();
    die("User logged out.");

} elseif ($op == "login") {
    echo json_encode(processLogin($_REQUEST["user"], $_REQUEST["pass"]));

} else {
    echo json_encode($op);
}

///////////////////////////////////////////////////
// Helper Functions
///////////////////////////////////////////////////
function getChallengeIdeas($cid) {
    include_once(_SHARED_APIS_."ks/challenge.inc");
    $ch = new KSChallenge($cid);
    $ideas = $ch->getAllIdeas($cid);
    unset($ch);
    return $ideas;
}

function getChallengeMembers($cid) {
    $start = 0; $stop = 20;
    include_once(_SHARED_APIS_."ks/challenge.inc");
    $ch = new KSChallenge($cid);
    $mems = $ch->getKSParticipants("all", $start, $stop);
    unset($ch);
    return $mems;
}

// this will return challenges for whoever is logged in
// for sample data, use 'vishesh' nickname to login
function getMyChallenges() {
    include_once(_SHARED_APIS_."ks/challenge.inc");
    $ch1 = new KSChallenge(0);
    $mychall = $ch1->getMyChallenges("All",0,10);
    foreach ($mychall as $k => $v) {
        $ch = new KSChallenge($v["chall_id"]);
        $status = $ch->getChallStatus($v["start_date"], $v["end_date"]);
        $mychall[$k]["STATUS"] = $status;
        $mychall[$k]["MEM_CT"] = $ch->getChallengerCount();
        $mychall[$k]["STORY_CT"] = $ch->getStoryCount();
        $mychall[$k]["ROLE"] = $ch->getMemberRole();
        unset($ch);
    }
    unset($ch1);
    return $mychall;
}

function getPublicFeed() {
    $start = 0; $stop = 20;
    include_once(_SITE_PATH_."story/funcs/story.inc");
    $st = new KDStory();
    $arr = $st->get_stories("",$start,$stop);
    //$stories = $st->format_stories($arr["RES"]);
    unset($st);
    return $arr["RES"];
}

// to test this pass in "2", to get gratitude challenge stories
function getChallengeFeed($cid) {
    include_once(_SHARED_APIS_."ks/feed.inc");
    $feed = new KSFeed($cid);
    $st = $feed->getFeedStories(0,$type);
    unset($feed);
    return $st["STORIES"];
}

function processLogin($nick, $pass) {
    global $user;
    $err = $user->loginError($nick, $pass, 1);
    if (!$err) {
        return 1;
    } else {
        return $err;
    }
}

function showStories($cid) {
    $mem = $GLOBALS["GMEM"];
    $type = "";

    include_once(_SHARED_APIS_."ks/feed.inc");
    $feed = new KSFeed($cid);
    $st = $feed->getFeedStories(0,$type);
    t_set(array("STORIES"   => $st["STORIES"],
                "NEXTSTART" => 10,
                "OVERQUOTA" => $feed->overAddQuota(),
                "FEED_TITLE"=> $feed->getFeedName(),
                "MY_THUMB"  => $mem->getThumb(),
                "MY_MID"    => $mem->getMemId(),
                "CID"       => $cid,
               ));
    unset($feed);
    t_show_rel("stories.tpl");
}

function addStory($cid, $title, $descr) {
    include_once(_SHARED_APIS_."ks/feed.inc");
    $feed = new KSFeed($cid);
    $status = $feed->addStory($_REQUEST);
    return $status;
}

function showEditStoryForm($cid, $sid) {
    if (!is_numeric($sid)) return;
    $st = get_table_one_row("sg_story", "story_id='$sid'");
    if (!$st) { header("Location: "._SITE_URL_."my/index.php"); exit; }
    $st["story_title"] = htmlentities($st["story_title"]);

    include_once(_SHARED_APIS_."ks/story.inc");
    $myst = new KSStory($sid);

    //$form = get_form($st["story_title"],$st["story_descr"],"edit");
    include_once(_SHARED_APIS_."/lib/zebraform/form.inc");
    $form = new Zebra_Form('myform');
    $form->assets_path("/home/kspring/public_html/inc/zebra/", "http://www.kindspring.org/inc/zebra/");

    $form->add('label', 'label_title', 'title', 'Title:');
    $obj = $form->add('text', 'title', $st["story_title"], array("style"=>"width:350px"));
    $obj->set_rule(array(
        'required'  => array('error', 'Title is required!'),
        //'length' => array(4,80,'error','Subject too long', true),
    ));

    $form->add('label', 'label_descr', 'descr', 'Description:');
    $obj = $form->add('textarea', 'descr', $st["story_descr"], array("style" => "width: 350px; height: 50px"));
    $obj->set_rule(array(
        'required'  => array('error', 'Description is empty!'),
    ));

    $tags = $myst->getStoryTagList();

    $form->add('label', 'label_tags', 'tags', 'Tags:');
    $obj = $form->add('text', 'tags', $tags, array("style"=>"width:350px"));
    $form->add('note', 'note_tags', 'tags', "Comma separated list of keywords to help others find this story more easily.");

    $form->add('hidden', 'op', "edit_story");
    $form->add('hidden', 'cid', "$cid");
    $form->add('submit', 'btnsubmit', 'Submit Changes');

    // validate the form
    if ($form->validate()) {
        $status = $myst->editStory($_REQUEST["title"],$_REQUEST["descr"]);
        if (!is_numeric($status)) {
            $form->add_error('error',$status);
            t_set(array("FORM" => $form->render('*horizontal',true),
                        "OP"   => "showform", ));
        } else {
            $myst->addMultipleTags($_REQUEST["tags"]);
            t_set(array("OP" => "showthanks",));
        }

    } else {
        // auto generate output, labels above form elements
        t_set(array("FORM" => $form->render('*horizontal',true),
                    "OP"   => "showform", ));
    }
    unset($myst);

    t_set(array("STORY" => $st,
                "TITLE" => "Edit Story",
                "CID"   => $cid,
                ));
    t_show_rel("add.tpl");
}

?>

