/* Developent mode functions */

window.fcf = function () {
  console.log('Filling campaign form');
  var name = document.getElementById("campaign_name");
  if(name) name.value = "Mister Hello";

  var about = document.getElementById("campaign-about");
  if(about) about.value = "Everything is a lie.";

  var headline = document.getElementById("campaign_headline");
  if(headline) headline.value = "Is it?";

  var video = document.getElementById("campaign_video_url");
  if(video) video.value = "http://f.o4.no/1478432862_skydiving.jpg";

  var goal = document.getElementById("campaign_goal");
  if(goal) goal.value = 777;
};

window.fuf = function(){
  var name = document.getElementById('name');

  name.value = 'Hacky';

  var d = new Date() / 1000;
  var email = document.getElementById('email');
  email.value = 'v' + d + '@email.com';

  var pw = document.getElementById('password');
  var pwc = document.getElementById('password_confirmation');

  pw.value = 'testtest';
  pwc.value = 'testtest';
}
