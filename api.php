<?php

include_once(_SITE_PATH_."funcs/user.inc");
$user = new KSpringUser();

$op = $_REQUEST["op"];

if ($op == "public_feed") {
    $stories = getPublicFeed();
    echo json_encode($stories);

} elseif ($op == "chall_list") {
    $challs = getMyChallenges();
    debug_array($challs);

} elseif ($op == "chall_feed") {
    $stories = getChallengeFeed($_REQUEST["cid"]);
    debug_array($stories);

} elseif ($op == "chall_mem") {
    $mems = getChallengeMembers($_REQUEST["cid"]);
    debug_array($mems);

} elseif ($op == "chall_ideas") {
    $ideas = getChallengeIdeas($_REQUEST["cid"]);
    debug_array($ideas);
 
} elseif ($op == "menu") {
    if (!$user->isLoggedIn()) die("Login first.");
    t_show_rel("index.tpl");

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

// this shows the form and when submitted returns back to this function
// it's doing fancy stuff for rendering, but you can ignore that
// key part is what happens when "form->validate()" passes
function showLoginForm() {
    global $user;
    include_once(_SHARED_APIS_."/lib/zebraform/form.inc");
    $form = new Zebra_Form('form','POST','',array("style"=>'width:400px; background-color: #fff'));
    $form->assets_path("/home/sspace/public_html/inc/zebra/", "http://www.servicespace.org/inc/zebra/");

    $form->add('label', 'label_nickname', 'nickname', 'Nickname:');
    $obj = $form->add('text', 'nickname', $nick);
    $obj->set_rule(array(
        'alphanumeric'  =>  array('_-.','error', 'Invalid characters in nickname.'),
        'required'  =>  array('error', 'Nickname is required!'),
        ));

    $form->add('label', 'label_password', 'password', 'Password:');
    //$obj = $form->add('password', 'password', $pwd);
    $obj = $form->add('password', 'password');  
    $obj->set_rule(array(
        'required'  => array('error', 'Please enter password!'),
    ));

    $form->add('submit', 'btnsubmit', 'Login Into KindSpring');

    // in case the error is coming from another login page
    if ($err != "") $form->add_error('error', $err);

    if ($form->validate()) {
        // when the form is submitted, we enter this part
        $err = processLogin($_REQUEST["nickname"],$_REQUEST["password"]);
        if (!$err) {
            $success = "http://kindspring.org/challenge/mobile/index.php?op=menu"; 
            header("Location: $url"); 
            exit;
        } else {
            $form->add_error('error', $err);
            t_set(array("FORM" => $form->render('*horizontal',true)));
        }

    } else {
        // auto generate output, labels above form elements
        t_set(array("FORM" => $form->render('*horizontal',true)));
    }
    t_show_rel("form.tpl");
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


